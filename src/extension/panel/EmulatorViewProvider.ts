import { randomBytes } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';
import dayjs from 'dayjs';
import * as vscode from 'vscode';
import type { KeyInput, ScreenSize, TabState } from '../../shared/device';
import { type HostToWebview, type WebviewToHost, webviewToHostSchema } from '../../shared/protocol';
import { readConfig } from '../config';
import type { DeviceCatalog, DeviceSession, FrameEvent, RgbaFrame } from '../device/DeviceProvider';

interface Tab {
  deviceId: string;
  state: TabState;
  session: DeviceSession | undefined;
  startAbort: AbortController | undefined;
  starting: Promise<void> | undefined;
}

export class EmulatorViewProvider implements vscode.WebviewViewProvider {
  static readonly viewId = 'emulatorPanel.screen';

  private readonly closingSessions = new Set<DeviceSession>();
  private readonly shutdowns = new Set<Promise<void>>();

  // As sessões pertencem ao provider, não à view: esconder ou descartar a view não desliga
  // nenhum emulador, só pausa o stream. Ao reabrir, a webview nova pede o estado e o stream volta.
  private view: vscode.WebviewView | undefined;
  private viewDisposables: vscode.Disposable[] = [];
  private wasVisible = false;
  private viewport: ScreenSize | undefined;

  // A ordem de inserção é a ordem das abas.
  private readonly tabs = new Map<string, Tab>();
  private activeId: string | undefined;

  private frameStream: vscode.Disposable | undefined;
  private streamedDeviceId: string | undefined;
  private pendingFrame: RgbaFrame | undefined;
  private inFlightSeq: number | undefined;
  // Até a webview dizer o contrário, H.264 é assumido indisponível.
  private webviewH264 = false;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly provider: DeviceCatalog,
    private readonly output: vscode.OutputChannel,
  ) {}

  resolveWebviewView(view: vscode.WebviewView): void {
    this.detachView();
    this.view = view;
    this.wasVisible = view.visible;
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview')],
    };
    view.webview.html = this.renderHtml(view.webview);
    this.viewDisposables = [
      view.webview.onDidReceiveMessage((message: unknown) => this.handleMessage(message)),
      // Sem view visível não há por que gastar CPU mandando frames.
      view.onDidChangeVisibility(() => {
        if (view.visible === this.wasVisible) return;
        this.wasVisible = view.visible;
        this.restartFrameStream();
      }),
      view.onDidDispose(() => {
        if (this.view === view) this.detachView();
      }),
    ];
  }

  /** Usado no `deactivate`: encerra todos os devices com timeouts curtos e espera terminar. */
  async shutdownAll(): Promise<void> {
    for (const tab of this.tabs.values()) void this.shutdownTab(tab, { fast: true });
    for (const session of this.closingSessions) void session.dispose({ fast: true });
    await Promise.all(this.shutdowns);
  }

  private detachView(): void {
    this.stopFrameStream();
    for (const disposable of this.viewDisposables) disposable.dispose();
    this.viewDisposables = [];
    this.view = undefined;
    this.viewport = undefined;
    this.streamedDeviceId = undefined;
  }

  private handleMessage(raw: unknown): void {
    const parsed = webviewToHostSchema.safeParse(raw);
    if (!parsed.success) {
      this.output.appendLine(`[webview] invalid message: ${parsed.error.message}`);
      return;
    }
    const message: WebviewToHost = parsed.data;
    const session = this.activeSession();
    switch (message.type) {
      case 'ready':
        this.webviewH264 = message.h264;
        this.postState();
        void this.refreshDevices();
        this.restartFrameStream();
        return;
      case 'refreshDevices':
        void this.refreshDevices();
        return;
      case 'start':
        this.start(message.deviceId);
        return;
      case 'stop':
        void this.stop(message.deviceId);
        return;
      case 'selectTab':
        if (this.tabs.has(message.deviceId)) this.activate(message.deviceId);
        return;
      case 'viewport':
        this.viewport = { width: message.width, height: message.height };
        this.restartFrameStream();
        return;
      case 'frameAck':
        if (message.seq === this.inFlightSeq) {
          this.inFlightSeq = undefined;
          this.flushFrame();
        }
        return;
      case 'videoReset':
        this.restartFrameStream();
        return;
      case 'videoUnsupported':
        this.output.appendLine('[video] the webview cannot decode H.264; falling back to RGBA');
        this.webviewH264 = false;
        this.restartFrameStream();
        return;
      case 'touch':
        void session?.touch(message);
        return;
      case 'key':
        void session?.key(toKeyInput(message));
        return;
      case 'button':
        void session?.pressButton(message.button);
        return;
      case 'rotate':
        void session?.rotate(message.direction).catch((error: unknown) => {
          this.output.appendLine(`[rotate failed] ${errorMessage(error)}`);
        });
        return;
      case 'screenshot':
        void this.saveScreenshot();
        return;
      case 'paste':
        void this.paste();
        return;
    }
  }

  private activeTab(): Tab | undefined {
    return this.activeId === undefined ? undefined : this.tabs.get(this.activeId);
  }

  private activeSession(): DeviceSession | undefined {
    return this.activeTab()?.session;
  }

  private activate(deviceId: string | undefined): void {
    if (this.activeId === deviceId) return;
    this.activeId = deviceId;
    this.postState();
    this.restartFrameStream();
  }

  private async refreshDevices(): Promise<void> {
    try {
      this.post({ type: 'devices', devices: await this.provider.listDevices() });
    } catch (error) {
      this.post({ type: 'devices', devices: [], error: errorMessage(error) });
    }
  }

  /** Abre uma aba nova, ou tenta de novo numa aba que falhou. Aba viva só é trazida à frente. */
  private start(deviceId: string): void {
    const existing = this.tabs.get(deviceId);
    if (existing && existing.state.kind !== 'error') {
      this.activate(deviceId);
      return;
    }
    const tab: Tab = existing ?? {
      deviceId,
      state: { kind: 'starting', deviceId, step: 'launching' },
      session: undefined,
      startAbort: undefined,
      starting: undefined,
    };
    this.tabs.set(deviceId, tab);
    this.activeId = deviceId;
    // Para o stream da aba que estava na frente; o estado vai junto no `setTabState`.
    this.restartFrameStream();
    tab.starting = this.startTab(tab).finally(() => {
      tab.starting = undefined;
    });
  }

  private async startTab(tab: Tab): Promise<void> {
    const { deviceId } = tab;
    const abort = new AbortController();
    tab.startAbort = abort;
    this.setTabState(tab, { kind: 'starting', deviceId, step: 'launching' });
    try {
      const session = await this.provider.start(
        deviceId,
        (step) => this.setTabState(tab, { kind: 'starting', deviceId, step }),
        abort.signal,
      );
      if (abort.signal.aborted) {
        await session.dispose({ fast: true });
        return;
      }
      tab.session = session;
      session.onDidExit(({ reason }) => {
        if (tab.session !== session) return;
        tab.session = undefined;
        this.setTabState(tab, { kind: 'error', deviceId, message: `Device exited: ${reason}` });
        if (this.activeId === deviceId) this.restartFrameStream();
        void this.refreshDevices();
      });
      session.onDidChangeClipboard((text) => {
        // O clipboard do host só acompanha o device que está na tela.
        if (tab.session === session && this.activeId === deviceId) {
          void vscode.env.clipboard.writeText(text);
        }
      });
      this.setTabState(tab, {
        kind: 'ready',
        deviceId,
        platform: session.platform,
        screen: session.screen,
        attached: session.attached,
      });
      if (this.activeId === deviceId) this.restartFrameStream();
      void this.refreshDevices();
    } catch (error) {
      if (!abort.signal.aborted) {
        this.setTabState(tab, { kind: 'error', deviceId, message: errorMessage(error) });
      }
    } finally {
      if (tab.startAbort === abort) tab.startAbort = undefined;
    }
  }

  private async stop(deviceId: string): Promise<void> {
    const tab = this.tabs.get(deviceId);
    if (!tab || tab.state.kind === 'stopping') return;
    if (tab.state.kind !== 'error') {
      this.setTabState(tab, {
        kind: 'stopping',
        deviceId,
        platform: tab.session?.platform,
        attached: tab.session?.attached ?? false,
      });
      await this.shutdownTab(tab, { fast: false });
    }
    this.closeTab(tab);
    void this.refreshDevices();
  }

  private closeTab(tab: Tab): void {
    const ids = [...this.tabs.keys()];
    const index = ids.indexOf(tab.deviceId);
    this.tabs.delete(tab.deviceId);
    if (this.activeId !== tab.deviceId) {
      this.postState();
      return;
    }
    // Como no editor: a aba seguinte assume, ou a anterior quando era a última.
    const remaining = ids.filter((id) => id !== tab.deviceId);
    this.activeId = remaining[Math.min(index, remaining.length - 1)];
    this.postState();
    this.restartFrameStream();
  }

  private async saveScreenshot(): Promise<void> {
    const tab = this.activeTab();
    const session = tab?.session;
    if (!tab || !session) return;
    const name = `${tab.deviceId}-${dayjs().format('YYYYMMDD-HHmmss')}.png`;
    try {
      const png = await session.screenshot();
      const target = await vscode.window.showSaveDialog({
        defaultUri: vscode.Uri.file(join(homedir(), 'Desktop', name)),
        filters: { 'PNG image': ['png'] },
        saveLabel: 'Save Screenshot',
      });
      if (!target) return;
      await vscode.workspace.fs.writeFile(target, png);
      const action = await vscode.window.showInformationMessage('Screenshot saved.', 'Open');
      if (action === 'Open') await vscode.commands.executeCommand('vscode.open', target);
    } catch (error) {
      void vscode.window.showErrorMessage(`Could not take the screenshot: ${errorMessage(error)}`);
    }
  }

  private async paste(): Promise<void> {
    const session = this.activeSession();
    if (!session) return;
    const text = await vscode.env.clipboard.readText();
    if (text) await session.paste(text);
  }

  /**
   * Aborta o boot em andamento e/ou encerra o device da aba; resolve quando o processo
   * morreu de fato. Idempotente.
   */
  private shutdownTab(tab: Tab, options: { fast: boolean }): Promise<void> {
    tab.startAbort?.abort();
    tab.startAbort = undefined;
    if (this.activeId === tab.deviceId) this.stopFrameStream();

    const session = tab.session;
    tab.session = undefined;
    const done = Promise.all([tab.starting, session?.dispose(options)]).then(
      () => {},
      (error: unknown) => {
        this.output.appendLine(`[shutdown failed] ${errorMessage(error)}`);
      },
    );
    if (session) this.closingSessions.add(session);
    this.shutdowns.add(done);
    void done.finally(() => {
      if (session) this.closingSessions.delete(session);
      this.shutdowns.delete(done);
    });
    return done;
  }

  private restartFrameStream(): void {
    this.stopFrameStream();
    const session = this.activeSession();
    if (!session || !this.viewport || !this.view?.visible) return;
    // Trocar de aba não deve mostrar, nem por um instante, a tela do device anterior. Vai pelo
    // mesmo canal dos frames, então chega antes do primeiro frame do stream novo.
    if (this.streamedDeviceId !== this.activeId) this.post({ type: 'clearScreen' });
    this.streamedDeviceId = this.activeId;
    const h264 = this.webviewH264 && readConfig().videoCodec === 'h264';
    this.frameStream = session.streamFrames(this.viewport, { h264 }, (event) =>
      this.handleFrameEvent(event),
    );
  }

  // Vídeo vai direto: a webview descarta o que não der conta de decodificar. Frames RGBA
  // são pesados demais para isso e seguem um por vez, com ack.
  private handleFrameEvent(event: FrameEvent): void {
    switch (event.kind) {
      case 'rgba':
        this.pendingFrame = event;
        this.flushFrame();
        return;
      case 'h264-config':
        this.post({
          type: 'videoConfig',
          codec: event.codec,
          width: event.width,
          height: event.height,
          rotation: event.rotation,
        });
        return;
      case 'h264-chunk':
        this.post({
          type: 'videoChunk',
          key: event.key,
          timestamp: event.timestamp,
          data: event.data,
        });
        return;
    }
  }

  private stopFrameStream(): void {
    this.frameStream?.dispose();
    this.frameStream = undefined;
    this.pendingFrame = undefined;
    this.inFlightSeq = undefined;
  }

  // Um frame por vez: o próximo só sai depois do `frameAck`. Frames que chegam nesse
  // meio-tempo substituem o pendente, então a webview sempre recebe o mais recente.
  private flushFrame(): void {
    const frame = this.pendingFrame;
    if (!frame || this.inFlightSeq !== undefined) return;
    this.pendingFrame = undefined;
    this.inFlightSeq = frame.seq;
    const { buffer, byteOffset, byteLength } = frame.data;
    this.post({
      type: 'frame',
      seq: frame.seq,
      width: frame.width,
      height: frame.height,
      rotation: frame.rotation,
      data: new Uint8Array(buffer, byteOffset, byteLength),
    });
  }

  private setTabState(tab: Tab, state: TabState): void {
    tab.state = state;
    // Uma aba já fechada (Stop durante o Start) não volta por causa de um evento atrasado.
    if (this.tabs.get(tab.deviceId) === tab) this.postState();
  }

  private postState(): void {
    this.post({
      type: 'state',
      state: {
        tabs: [...this.tabs.values()].map((tab) => tab.state),
        activeId: this.activeId,
      },
    });
  }

  private post(message: HostToWebview): void {
    const view = this.view;
    if (!view) return;
    void view.webview.postMessage(message).then(
      (delivered) => {
        if (!delivered && message.type === 'frame' && this.view === view) {
          this.inFlightSeq = undefined;
        }
      },
      () => {},
    );
  }

  private renderHtml(webview: vscode.Webview): string {
    const root = vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview');
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(root, 'index.js'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(root, 'index.css'));
    const nonce = randomBytes(16).toString('base64');
    const csp = [
      "default-src 'none'",
      `style-src ${webview.cspSource}`,
      `script-src 'nonce-${nonce}'`,
    ].join('; ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="${styleUri}" />
  <title>Emulator</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function toKeyInput(message: Extract<WebviewToHost, { type: 'key' }>): KeyInput {
  return message.text === undefined
    ? { key: message.key }
    : { key: message.key, text: message.text };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
