import * as grpc from '@grpc/grpc-js';
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
import type { DeviceExit, DeviceSession, FrameEvent } from '../device/DeviceProvider';
import type { Adb } from './adb';
import type { ClipData__Output } from './generated/android/emulation/control/ClipData';
import type { Image__Output } from './generated/android/emulation/control/Image';
import type { KeyboardEvent } from './generated/android/emulation/control/KeyboardEvent';
import type { _android_emulation_control_Rotation_SkinRotation__Output as SkinRotation } from './generated/android/emulation/control/Rotation';
import type { Touch } from './generated/android/emulation/control/Touch';
import { call, deadline, type EmulatorControllerClient } from './grpcClient';
import { pasteKeyEvent, toEmulatorButtonEvent, toEmulatorKeyEvent } from './keys';
import type { SessionLifecycle } from './lifecycle';
import { VideoStream } from './videoStream';

// Mantém o `-idle-grpc-timeout` satisfeito mesmo com a tela parada (o stream só
// emite quando algo muda) e detecta emulador travado.
const heartbeatIntervalMs = 30_000;

// Teclas em rajada (auto-repeat, rollover) chegam reordenadas no Android: um Backspace logo após
// letras é aplicado depois da letra seguinte. Com esse intervalo mínimo a ordem se mantém, e
// digitação humana normal já é mais lenta que isso, então não adiciona latência perceptível.
const minKeyIntervalMs = 40;

// O "dedo" que o usuário cadastra pelo Settings tocando em Match; qualquer outro id não bate.
const enrolledFingerId = 1;
const unknownFingerId = 2;

const skinRotations: Record<SkinRotation, Rotation> = {
  PORTRAIT: 0,
  LANDSCAPE: 1,
  REVERSE_PORTRAIT: 2,
  REVERSE_LANDSCAPE: 3,
};

// Ângulo no eixo Z do `setPhysicalModel(ROTATION)` para cada quadrante. Positivo gira no
// sentido anti-horário; 270 não é aceito, só -90.
const rotationDegrees: Record<Rotation, number> = { 0: 0, 1: 90, 2: 180, 3: -90 };

interface ActiveStream {
  maxSize: ScreenSize;
  onFrame: (event: FrameEvent) => void;
  video: VideoStream | undefined;
  rgba: vscode.Disposable | undefined;
}

export class AndroidSession implements DeviceSession {
  readonly platform = 'android';
  private readonly exitEmitter = new vscode.EventEmitter<DeviceExit>();
  readonly onDidExit = this.exitEmitter.event;
  private readonly clipboardEmitter = new vscode.EventEmitter<string>();
  readonly onDidChangeClipboard = this.clipboardEmitter.event;

  private readonly activeStreams = new Set<ActiveStream>();
  private readonly heartbeat: NodeJS.Timeout;
  private clipboardStream: grpc.ClientReadableStream<ClipData__Output> | undefined;
  private lastClipboard = '';
  private h264Failed = false;
  private inputChain: Promise<void> = Promise.resolve();
  private pendingMove: Touch[] | undefined;
  private lastKeyAt = 0;
  private disposed = false;
  private disposing: Promise<void> | undefined;
  private released = false;

  constructor(
    private readonly lifecycle: SessionLifecycle,
    private readonly client: EmulatorControllerClient,
    readonly screen: ScreenSize,
    private rotation: Rotation,
    /** Sem adb não há vídeo H.264; tudo o mais funciona só com gRPC. */
    private readonly adb: Adb | undefined,
    private readonly output: vscode.OutputChannel,
  ) {
    this.heartbeat = setInterval(() => {
      call((callback) => client.getStatus({}, deadline(), callback)).catch((error: unknown) => {
        output.appendLine(`[heartbeat failed] ${String(error)}`);
      });
    }, heartbeatIntervalMs);

    void lifecycle.exited.then((exit) => {
      if (this.disposed) return;
      this.exitEmitter.fire(exit);
      this.release();
    });

    void this.watchClipboard();
  }

  get attached(): boolean {
    return this.lifecycle.attached;
  }

  streamFrames(
    maxSize: ScreenSize,
    { h264 }: { h264: boolean },
    onFrame: (event: FrameEvent) => void,
  ): vscode.Disposable {
    const stream: ActiveStream = { maxSize, onFrame, video: undefined, rgba: undefined };
    this.activeStreams.add(stream);
    if (h264 && this.adb && !this.h264Failed) this.startVideo(stream, this.adb);
    else this.startRgba(stream, this.rotation);
    return new vscode.Disposable(() => {
      this.activeStreams.delete(stream);
      stopStream(stream);
    });
  }

  touch(input: TouchInput): Promise<void> {
    const touches = this.toTouches(input);

    // Moves são coalescidos: se já há um na fila, só atualiza a posição.
    if (input.phase === 'move') {
      const alreadyQueued = this.pendingMove !== undefined;
      this.pendingMove = touches;
      if (alreadyQueued) return this.inputChain;
      return this.enqueue(() => {
        const move = this.pendingMove;
        this.pendingMove = undefined;
        return move ? this.sendTouches(move) : Promise.resolve();
      });
    }
    return this.enqueue(() => this.sendTouches(touches));
  }

  key(input: KeyInput): Promise<void> {
    const event = toEmulatorKeyEvent(input);
    return this.enqueue(() => this.sendKey(event));
  }

  pressButton(button: HardwareButton): Promise<void> {
    const event = toEmulatorButtonEvent(button);
    return this.enqueue(() => this.sendKey(event));
  }

  // O stream RGBA percebe a nova orientação sozinho (vem em cada imagem) e o H.264 segue a
  // rotação do display, então aqui basta mover o sensor.
  async rotate(direction: RotateDirection): Promise<void> {
    const rotation = ((this.rotation + (direction === 'left' ? 1 : 3)) % 4) as Rotation;
    this.rotation = rotation;
    await call((callback) =>
      this.client.setPhysicalModel(
        { target: 'ROTATION', value: { data: [0, 0, rotationDegrees[rotation]] } },
        deadline(),
        callback,
      ),
    );
  }

  async biometric(action: BiometricAction): Promise<void> {
    if (action === 'enroll') return;
    const touchId = action === 'match' ? enrolledFingerId : unknownFingerId;
    await call((callback) =>
      this.client.sendFingerprint({ isTouching: true, touchId }, deadline(), callback),
    );
    await call((callback) =>
      this.client.sendFingerprint({ isTouching: false, touchId }, deadline(), callback),
    );
  }

  async screenshot(): Promise<Uint8Array> {
    const image = await call<Image__Output>((callback) =>
      this.client.getScreenshot({ format: 'PNG' }, deadline(15_000), callback),
    );
    return image.image;
  }

  paste(text: string): Promise<void> {
    this.lastClipboard = text;
    return this.enqueue(async () => {
      await call((callback) => this.client.setClipboard({ text }, deadline(), callback));
      await this.sendKey(pasteKeyEvent);
    });
  }

  dispose({ fast = false }: { fast?: boolean } = {}): Promise<void> {
    if (this.disposing) {
      // Já está encerrando no modo lento e agora não há mais tempo (ex.: deactivate).
      if (fast) this.lifecycle.killNow();
      return this.disposing;
    }
    this.disposed = true;
    this.disposing = this.shutdown(fast);
    return this.disposing;
  }

  private async shutdown(fast: boolean): Promise<void> {
    this.stopActivity();
    try {
      await this.lifecycle.shutdown(this.client, fast);
    } finally {
      this.release();
    }
  }

  private stopActivity(): void {
    clearInterval(this.heartbeat);
    for (const stream of this.activeStreams) stopStream(stream);
    this.activeStreams.clear();
    this.clipboardStream?.cancel();
    this.clipboardStream = undefined;
  }

  private release(): void {
    if (this.released) return;
    this.released = true;
    this.stopActivity();
    this.client.close();
    this.exitEmitter.dispose();
    this.clipboardEmitter.dispose();
  }

  private startVideo(stream: ActiveStream, adb: Adb): void {
    stream.video = new VideoStream(
      adb,
      this.screen,
      stream.maxSize,
      this.output,
      stream.onFrame,
      (reason) => {
        this.output.appendLine(`[video] H.264 unavailable, falling back to RGBA: ${reason}`);
        this.h264Failed = true;
        stream.video = undefined;
        if (this.activeStreams.has(stream)) this.startRgba(stream, this.rotation);
      },
    );
  }

  /**
   * O emulador encaixa a imagem já girada na caixa pedida, então a caixa segue a orientação.
   * Se a imagem chega numa orientação diferente da caixa, o stream recomeça com a caixa certa.
   */
  private startRgba(stream: ActiveStream, boxRotation: Rotation): void {
    const sideways = boxRotation % 2 === 1;
    const grpcStream = this.client.streamScreenshot({
      format: 'RGBA8888',
      width: Math.min(stream.maxSize.width, sideways ? this.screen.height : this.screen.width),
      height: Math.min(stream.maxSize.height, sideways ? this.screen.width : this.screen.height),
    });
    const disposable = new vscode.Disposable(() => grpcStream.cancel());
    stream.rgba = disposable;

    grpcStream.on('data', (image: Image__Output) => {
      const format = image.format;
      if (!format || image.image.length !== format.width * format.height * 4) return;
      const rotation = skinRotations[format.rotation?.rotation ?? 'PORTRAIT'];
      stream.onFrame({
        kind: 'rgba',
        seq: image.seq,
        width: format.width,
        height: format.height,
        rotation,
        data: image.image,
      });
      if (rotation % 2 !== boxRotation % 2 && stream.rgba === disposable) {
        disposable.dispose();
        this.startRgba(stream, rotation);
      }
    });
    grpcStream.on('error', (error: grpc.ServiceError) => {
      if (error.code !== grpc.status.CANCELLED) {
        this.output.appendLine(`[screenshot stream] ${error.code} ${error.details}`);
      }
    });
  }

  // O stream manda o conteúdo atual ao conectar (quando não está vazio) e não ecoa o que este
  // mesmo client grava, então só repassamos o que difere do último texto conhecido.
  private async watchClipboard(): Promise<void> {
    const current = await call<ClipData__Output>((callback) =>
      this.client.getClipboard({}, deadline(), callback),
    ).catch(() => undefined);
    if (this.released || this.disposed) return;
    this.lastClipboard = current?.text ?? '';

    const stream = this.client.streamClipboard({});
    this.clipboardStream = stream;
    stream.on('data', (clip: ClipData__Output) => {
      // Texto vazio não sobrescreve o clipboard do host.
      if (!clip.text || clip.text === this.lastClipboard) return;
      this.lastClipboard = clip.text;
      this.clipboardEmitter.fire(clip.text);
    });
    stream.on('error', (error: grpc.ServiceError) => {
      if (error.code !== grpc.status.CANCELLED) {
        this.output.appendLine(`[clipboard stream] ${error.code} ${error.details}`);
      }
    });
  }

  private toTouches({ phase, x, y, mirror }: TouchInput): Touch[] {
    const pressure = phase === 'up' ? 0 : 1;
    const touch = (nx: number, ny: number, identifier: number): Touch => ({
      x: Math.round(nx * (this.screen.width - 1)),
      y: Math.round(ny * (this.screen.height - 1)),
      identifier,
      pressure,
      // Sem isso o emulador solta o toque sozinho e long press/arraste lento quebram.
      expiration: 'NEVER_EXPIRE',
    });
    // Pinch como no Android Studio: o segundo dedo é o reflexo do primeiro pelo centro.
    return mirror ? [touch(x, y, 0), touch(1 - x, 1 - y, 1)] : [touch(x, y, 0)];
  }

  private sendTouches(touches: Touch[]): Promise<void> {
    return call((callback) => this.client.sendTouch({ touches }, deadline(), callback)).then(
      () => {},
    );
  }

  private async sendKey(event: KeyboardEvent): Promise<void> {
    const wait = this.lastKeyAt + minKeyIntervalMs - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    try {
      await call((callback) => this.client.sendKey(event, deadline(), callback));
    } finally {
      this.lastKeyAt = Date.now();
    }
  }

  // Serializa o input: chamadas unárias concorrentes podem chegar fora de ordem no emulador.
  private enqueue(send: () => Promise<void>): Promise<void> {
    this.inputChain = this.inputChain.then(send).catch((error: unknown) => {
      this.output.appendLine(`[input failed] ${String(error)}`);
    });
    return this.inputChain;
  }
}

function stopStream(stream: ActiveStream): void {
  stream.video?.dispose();
  stream.video = undefined;
  stream.rgba?.dispose();
  stream.rgba = undefined;
}
