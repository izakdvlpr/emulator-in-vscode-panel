import { type ChildProcess, spawn } from 'node:child_process';
import * as vscode from 'vscode';
import type {
  BiometricAction,
  HardwareButton,
  KeyInput,
  RotateDirection,
  Rotation,
  ScreenSize,
  TouchInput,
} from '../../shared/device';
import { AnnexBParser } from '../android/h264';
import type {
  DeviceExit,
  DeviceSession,
  FrameEvent,
  InstalledApp,
  LogEntry,
} from '../device/DeviceProvider';
import type { HelperCommand, HelperProcess } from './helper';
import { pasteKey, toHidKey } from './keys';
import { IosLogStream } from './logStream';
import { isBooted, listApps, notifyDarwin, pbcopy, pbpaste, shutdown, simctlPath } from './simctl';

// O shutdown de um simulador leva poucos segundos; o limite só cobre um CoreSimulator travado.
const shutdownGraceMs = 30_000;
const fastShutdownGraceMs = 3000;
const clipboardRestartMs = 2000;

// Notificação Darwin que o iOS publica a cada mudança no pasteboard geral.
const pasteboardNotification = 'com.apple.pasteboard.notify.changed';

// Notificações do BiometricKit do simulador, as mesmas do menu Features do Simulator.app.
// `fingerTouch` é Touch ID e `pearl` é Face ID; o device ignora a do sensor que não tem.
const biometricEnrollment = 'com.apple.BiometricKit.enrollmentChanged';
const biometricSensors = ['fingerTouch', 'pearl'] as const;

type ButtonCommand = Extract<HelperCommand, { cmd: 'button' }>['name'];

// iPhone sem botão Home físico: não há Back, e Recents vira o app switcher.
const buttonCommands: Record<HardwareButton, ButtonCommand | undefined> = {
  back: undefined,
  home: 'home',
  recents: 'appSwitcher',
  volumeUp: 'volumeUp',
  volumeDown: 'volumeDown',
  power: 'lock',
};

interface ActiveStream {
  onFrame: (event: FrameEvent) => void;
  config: { width: number; height: number; rotation: Rotation } | undefined;
  configSent: boolean;
}

export class IosSession implements DeviceSession {
  readonly platform = 'ios';
  private readonly exitEmitter = new vscode.EventEmitter<DeviceExit>();
  readonly onDidExit = this.exitEmitter.event;
  private readonly clipboardEmitter = new vscode.EventEmitter<string>();
  readonly onDidChangeClipboard = this.clipboardEmitter.event;

  private readonly subscriptions: vscode.Disposable[];
  // O helper tem um encoder só: um stream novo substitui o anterior.
  private stream: ActiveStream | undefined;
  private readonly logStreams = new Set<IosLogStream>();
  private rotation: Rotation = 0;
  private clipboardWatcher: ChildProcess | undefined;
  private clipboardRestart: NodeJS.Timeout | undefined;
  private lastClipboard = '';
  private inputChain: Promise<void> = Promise.resolve();
  private disposed = false;
  private disposing: Promise<void> | undefined;
  private released = false;

  constructor(
    private readonly udid: string,
    private readonly helper: HelperProcess,
    readonly screen: ScreenSize,
    /** Anexada a um simulador que já estava ligado: encerrar só desconecta. */
    readonly attached: boolean,
    private readonly output: vscode.OutputChannel,
  ) {
    this.subscriptions = [
      helper.onEvent((event) => {
        switch (event.event) {
          case 'video':
            if (this.stream) {
              this.stream.config = {
                width: event.width,
                height: event.height,
                rotation: event.rotation,
              };
              this.stream.configSent = false;
            }
            return;
          case 'error':
            output.appendLine(`[ios-helper] ${event.message}`);
            return;
          case 'exited':
            this.handleExit('The simulator was shut down.');
            return;
          default:
            return;
        }
      }),
      helper.onVideo((unit) => this.handleVideo(unit)),
    ];
    void helper.exited.then(() => this.handleExit(helper.describeExit()));
    void this.watchClipboard();
  }

  streamFrames(
    maxSize: ScreenSize,
    { h264 }: { h264: boolean },
    onFrame: (event: FrameEvent) => void,
  ): vscode.Disposable {
    if (!h264) {
      // O VideoToolbox só entrega vídeo comprimido; não existe caminho RGBA para o iOS.
      this.output.appendLine(
        '[ios] the screen needs H.264 (WebCodecs) in the webview and the "emulatorPanel.videoCodec" setting set to "h264".',
      );
      return new vscode.Disposable(() => {});
    }
    const stream: ActiveStream = { onFrame, config: undefined, configSent: false };
    this.stream = stream;
    this.helper.send({
      cmd: 'stream',
      maxWidth: Math.round(maxSize.width),
      maxHeight: Math.round(maxSize.height),
    });
    return new vscode.Disposable(() => {
      if (this.stream !== stream) return;
      this.stream = undefined;
      this.helper.send({ cmd: 'stopStream' });
    });
  }

  touch({ phase, x, y, mirror }: TouchInput): Promise<void> {
    // O helper já coalesce moves que chegam mais rápido do que o SimulatorKit aceita (16ms).
    return this.enqueue(() => this.helper.send({ cmd: 'touch', phase, x, y, mirror }));
  }

  key(input: KeyInput): Promise<void> {
    const key = toHidKey(input);
    if (!key) return Promise.resolve();
    return this.enqueue(() => this.helper.send({ cmd: 'key', ...key }));
  }

  pressButton(button: HardwareButton): Promise<void> {
    const name = buttonCommands[button];
    if (!name) return Promise.resolve();
    return this.enqueue(() => this.helper.send({ cmd: 'button', name }));
  }

  // O helper avisa o iOS e reinicia o vídeo já girado; a config nova chega pelo evento `video`.
  async rotate(direction: RotateDirection): Promise<void> {
    this.rotation = ((this.rotation + (direction === 'left' ? 1 : 3)) % 4) as Rotation;
    const rotation = this.rotation;
    await this.enqueue(() => this.helper.send({ cmd: 'rotate', rotation }));
  }

  async biometric(action: BiometricAction): Promise<void> {
    if (action === 'enroll') {
      await notifyDarwin(this.udid, biometricEnrollment, 1);
      return;
    }
    const result = action === 'match' ? 'match' : 'nomatch';
    await Promise.all(
      biometricSensors.map((sensor) =>
        notifyDarwin(this.udid, `com.apple.BiometricKit_Sim.${sensor}.${result}`),
      ),
    );
  }

  screenshot(): Promise<Uint8Array> {
    return this.helper.screenshot();
  }

  paste(text: string): Promise<void> {
    // O `pbcopy` também dispara a notificação do pasteboard; sem isso o texto voltaria ao host.
    this.lastClipboard = text;
    return this.enqueue(async () => {
      await pbcopy(this.udid, text);
      this.helper.send({ cmd: 'key', ...pasteKey });
    });
  }

  async listApps(): Promise<InstalledApp[]> {
    const apps = await listApps(this.udid);
    return apps.map(({ id, name }) => ({ id, name }));
  }

  streamLogs(
    appId: string | undefined,
    onEntries: (entries: LogEntry[]) => void,
    onError: (message: string) => void,
  ): vscode.Disposable {
    // O seletor de app pode ter ficado aberto enquanto o device saía.
    if (this.disposed || this.released) return new vscode.Disposable(() => {});
    const stream = new IosLogStream(this.udid, appId, onEntries, onError);
    this.logStreams.add(stream);
    return new vscode.Disposable(() => {
      this.logStreams.delete(stream);
      stream.dispose();
    });
  }

  dispose({ fast = false }: { fast?: boolean } = {}): Promise<void> {
    if (this.disposing) return this.disposing;
    this.disposed = true;
    this.disposing = this.shutdown(fast);
    return this.disposing;
  }

  private async shutdown(fast: boolean): Promise<void> {
    this.stopActivity();
    try {
      // Com `--owned`, fechar o stdin já faz o helper desligar o simulador. No deactivate o
      // helper não é morto: ele termina o shutdown sozinho mesmo sem o extension host.
      await this.helper.terminate({
        graceMs: fast ? fastShutdownGraceMs : shutdownGraceMs,
        kill: !fast,
      });
      if (!this.attached && !fast && (await isBooted(this.udid).catch(() => false))) {
        await shutdown(this.udid);
      }
    } finally {
      this.release();
    }
  }

  private handleExit(reason: string): void {
    if (this.disposed || this.released) return;
    this.exitEmitter.fire({ code: null, reason });
    this.release();
    // Normalmente o helper já está saindo sozinho; isso só garante que ele não fique órfão.
    void this.helper.terminate({ graceMs: fastShutdownGraceMs });
  }

  private stopActivity(): void {
    if (this.stream) this.helper.send({ cmd: 'stopStream' });
    this.stream = undefined;
    for (const stream of this.logStreams) stream.dispose();
    this.logStreams.clear();
    clearTimeout(this.clipboardRestart);
    this.clipboardWatcher?.kill();
    this.clipboardWatcher = undefined;
  }

  private release(): void {
    if (this.released) return;
    this.released = true;
    this.stopActivity();
    for (const subscription of this.subscriptions) subscription.dispose();
    this.helper.dispose();
    this.exitEmitter.dispose();
    this.clipboardEmitter.dispose();
  }

  private handleVideo(unit: { key: boolean; timestamp: number; data: Uint8Array }): void {
    const stream = this.stream;
    const config = stream?.config;
    if (!stream || !config) return;
    // Cada unidade do helper é um access unit completo; o parser só serve para ler o codec
    // (perfil/nível) do SPS que o encoder escolheu.
    let codec: string | undefined;
    let data: Uint8Array | undefined;
    const parser = new AnnexBParser(
      (accessUnit) => {
        codec = accessUnit.codec;
        data = accessUnit.data;
      },
      () => {},
    );
    parser.push(unit.data);
    parser.flush();
    if (!data) return;

    if (!stream.configSent) {
      // O decoder só pode começar num keyframe com SPS.
      if (!unit.key || !codec) return;
      stream.onFrame({ kind: 'h264-config', codec, ...config });
      stream.configSent = true;
    }
    stream.onFrame({ kind: 'h264-chunk', key: unit.key, timestamp: unit.timestamp, data });
  }

  // `notifyutil -w` fica rodando dentro do simulador e imprime uma linha a cada mudança. Matar o
  // `simctl` (e não um `xcrun` na frente dele) derruba o `notifyutil` junto.
  private async watchClipboard(): Promise<void> {
    try {
      this.lastClipboard = await pbpaste(this.udid);
      const binary = await simctlPath();
      if (this.disposed || this.released) return;
      const watcher = spawn(
        binary,
        ['spawn', this.udid, 'notifyutil', '-w', pasteboardNotification],
        {
          stdio: ['ignore', 'pipe', 'ignore'],
        },
      );
      this.clipboardWatcher = watcher;
      watcher.stdout?.setEncoding('utf8');
      watcher.stdout?.on('data', () => void this.readClipboard());
      watcher.once('error', (error) => {
        this.output.appendLine(`[ios] clipboard watcher failed: ${error.message}`);
      });
      watcher.once('exit', () => {
        if (this.clipboardWatcher !== watcher) return;
        this.clipboardWatcher = undefined;
        // Sai sozinho se o `launchd_sim` reiniciar; enquanto a sessão viver, volta a observar.
        this.clipboardRestart = setTimeout(() => void this.watchClipboard(), clipboardRestartMs);
      });
    } catch (error) {
      if (this.disposed || this.released) return;
      this.output.appendLine(`[ios] could not watch the clipboard: ${String(error)}`);
    }
  }

  private async readClipboard(): Promise<void> {
    const text = await pbpaste(this.udid).catch(() => '');
    // Texto vazio não sobrescreve o clipboard do host.
    if (this.released || !text || text === this.lastClipboard) return;
    this.lastClipboard = text;
    this.clipboardEmitter.fire(text);
  }

  // Serializa o input: o `paste` espera o `pbcopy` antes do Cmd+V, e o que vier depois não
  // pode passar na frente.
  private enqueue(send: () => void | Promise<void>): Promise<void> {
    this.inputChain = this.inputChain.then(send).catch((error: unknown) => {
      this.output.appendLine(`[input failed] ${String(error)}`);
    });
    return this.inputChain;
  }
}
