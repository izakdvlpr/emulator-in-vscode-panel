import { homedir } from 'node:os';
import { join } from 'node:path';
import dayjs from 'dayjs';
import * as vscode from 'vscode';
import type { KeyInput, ScreenSize, TabState } from '../../shared/device';
import { type HostToWebview, type WebviewToHost, webviewToHostSchema } from '../../shared/protocol';
import { readConfig } from '../config';
import type { DeviceCatalog, DeviceSession, FrameEvent, RgbaFrame } from '../device/DeviceProvider';
import type { DeviceLogs } from './DeviceLogs';
import {
  appOptions,
  fromPanel,
  fromView,
  placeholderCommands,
  renderAppHtml,
  renderPlaceholderHtml,
  type Surface,
} from './surface';

interface Tab {
  deviceId: string;
  state: TabState;
  session: DeviceSession | undefined;
  startAbort: AbortController | undefined;
  starting: Promise<void> | undefined;
}

export class EmulatorViewProvider implements vscode.WebviewViewProvider {
  static readonly viewId = 'emulatorPanel.screen';
  static readonly editorViewType = 'emulatorPanel.editor';

  private readonly closingSessions = new Set<DeviceSession>();
  private readonly shutdowns = new Set<Promise<void>>();

  // As sessões pertencem ao provider, não à view: esconder ou descartar a view não desliga
  // nenhum emulador, só pausa o stream. Ao reabrir, a webview nova pede o estado e o stream volta.
  // O app fica em um lugar por vez: na aba de editor, se existir, senão na sidebar. Assim há um
  // stream só e o input vem de uma fonte só.
  private sidebar: vscode.WebviewView | undefined;
  private editor: vscode.WebviewPanel | undefined;
  private active: Surface | undefined;
  private surfaceDisposables: vscode.Disposable[] = [];
  private wasVisible = false;
  private viewport: ScreenSize | undefined;

  // A ordem de inserção é a ordem das abas.
  private readonly tabs = new Map<string, Tab>();
  private activeId: string | undefined;
  // Nomes da última listagem, para o título do output channel de logs.
  private readonly deviceNames = new Map<string, string>();

  private frameStream: vscode.Disposable | undefined;
  private streamedDeviceId: string | undefined;
  private pendingFrame: RgbaFrame | undefined;
  private inFlightSeq: number | undefined;
  // Até a webview dizer o contrário, H.264 é assumido indisponível.
  private webviewH264 = false;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly provider: DeviceCatalog,
    private readonly logs: DeviceLogs,
    private readonly output: vscode.OutputChannel,
  ) {}

  resolveWebviewView(view: vscode.WebviewView): void {
    if (this.active?.kind === 'sidebar') this.detachActive();
    this.sidebar = view;
    view.onDidDispose(() => {
      if (this.sidebar !== view) return;
      if (this.active?.kind === 'sidebar') this.detachActive();
      this.sidebar = undefined;
    });
    if (this.editor) this.showPlaceholder(view);
    else this.attach(fromView(view));
  }

  /** Move o app para uma aba de editor; com `newWindow`, para uma janela flutuante. */
  async openInEditor({ newWindow }: { newWindow: boolean }): Promise<void> {
    if (this.editor) {
      this.editor.reveal();
    } else {
      const panel = vscode.window.createWebviewPanel(
        EmulatorViewProvider.editorViewType,
        'Emulator',
        vscode.ViewColumn.Active,
        { ...appOptions(this.extensionUri), retainContextWhenHidden: true },
      );
      panel.iconPath = vscode.Uri.joinPath(this.extensionUri, 'media', 'emulator.svg');
      this.editor = panel;
      this.detachActive();
      if (this.sidebar) this.showPlaceholder(this.sidebar);
      this.attach(fromPanel(panel));
      panel.onDidDispose(() => this.handleEditorClosed(panel));
      void vscode.commands.executeCommand('setContext', 'emulatorPanel.inEditor', true);
    }
    if (!newWindow) return;
    // O comando age sobre o editor ativo, e a aba recém-criada só fica ativa um pouco depois.
    // Se a webview recarregar na janela nova, o `ready` dela refaz estado e stream.
    if (!(await whenActive(this.editor))) return;
    await vscode.commands.executeCommand('workbench.action.moveEditorToNewWindow');
  }

  async moveToSidebar(): Promise<void> {
    this.editor?.dispose();
    await vscode.commands.executeCommand(`${EmulatorViewProvider.viewId}.focus`);
  }

  /** Logs do device da aba ativa, com o filtro de app escolhido na hora. */
  async showLogs(): Promise<void> {
    const tab = this.activeTab();
    const session = tab?.session;
    if (!tab || !session) {
      void vscode.window.showInformationMessage('Start a device to see its logs.');
      return;
    }
    try {
      await this.logs.open(
        tab.deviceId,
        this.deviceNames.get(tab.deviceId) ?? tab.deviceId,
        session,
      );
    } catch (error) {
      void vscode.window.showErrorMessage(`Could not show the device logs: ${errorMessage(error)}`);
    }
  }

  stopLogs(): void {
    if (this.activeId !== undefined) this.logs.stop(this.activeId);
  }

  /** Mostra o app onde ele estiver. */
  async reveal(): Promise<void> {
    if (this.editor) this.editor.reveal();
    else await vscode.commands.executeCommand(`${EmulatorViewProvider.viewId}.focus`);
  }

  // Fechar a aba (ou a janela flutuante) devolve o app para a sidebar; os devices continuam.
  private handleEditorClosed(panel: vscode.WebviewPanel): void {
    if (this.editor !== panel) return;
    this.detachActive();
    this.editor = undefined;
    void vscode.commands.executeCommand('setContext', 'emulatorPanel.inEditor', false);
    if (this.sidebar) this.attach(fromView(this.sidebar));
  }

  private attach(surface: Surface): void {
    this.active = surface;
    this.wasVisible = surface.visible;
    surface.webview.options = appOptions(this.extensionUri);
    surface.webview.html = renderAppHtml(surface.webview, this.extensionUri);
    this.surfaceDisposables = [
      surface.webview.onDidReceiveMessage((message: unknown) => {
        // Uma webview que já perdeu o app não controla mais nada.
        if (this.active === surface) this.handleMessage(message);
      }),
      // Sem superfície visível não há por que gastar CPU mandando frames.
      surface.onDidChangeVisibility(() => {
        if (this.active !== surface || surface.visible === this.wasVisible) return;
        this.wasVisible = surface.visible;
        this.restartFrameStream();
      }),
    ];
  }

  private showPlaceholder(view: vscode.WebviewView): void {
    view.webview.options = { enableScripts: false, enableCommandUris: placeholderCommands };
    view.webview.html = renderPlaceholderHtml();
  }

  /** Usado no `deactivate`: encerra todos os devices com timeouts curtos e espera terminar. */
  async shutdownAll(): Promise<void> {
    for (const tab of this.tabs.values()) void this.shutdownTab(tab, { fast: true });
    for (const session of this.closingSessions) void session.dispose({ fast: true });
    await Promise.all(this.shutdowns);
  }

  private detachActive(): void {
    this.stopFrameStream();
    for (const disposable of this.surfaceDisposables) disposable.dispose();
    this.surfaceDisposables = [];
    this.active = undefined;
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
      case 'biometric':
        void session?.biometric(message.action).catch((error: unknown) => {
          this.output.appendLine(`[biometric failed] ${errorMessage(error)}`);
        });
        return;
      case 'screenshot':
        void this.saveScreenshot();
        return;
      case 'paste':
        void this.paste();
        return;
      case 'logs':
        void this.showLogs();
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
      const devices = await this.provider.listDevices();
      for (const device of devices) this.deviceNames.set(device.id, device.name);
      this.post({ type: 'devices', devices });
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
        this.logs.stop(deviceId);
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
    this.logs.stop(tab.deviceId);
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
    if (!session || !this.viewport || !this.active?.visible) return;
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
    const surface = this.active;
    if (!surface) return;
    void surface.webview.postMessage(message).then(
      (delivered) => {
        if (!delivered && message.type === 'frame' && this.active === surface) {
          this.inFlightSeq = undefined;
        }
      },
      () => {},
    );
  }
}

const activationTimeoutMs = 2000;

function whenActive(panel: vscode.WebviewPanel | undefined): Promise<boolean> {
  if (!panel) return Promise.resolve(false);
  if (panel.active) return Promise.resolve(true);
  return new Promise((resolve) => {
    const done = (active: boolean) => {
      clearTimeout(timer);
      listener.dispose();
      resolve(active);
    };
    const timer = setTimeout(() => done(false), activationTimeoutMs);
    const listener = panel.onDidChangeViewState(() => {
      if (panel.active) done(true);
    });
  });
}

function toKeyInput(message: Extract<WebviewToHost, { type: 'key' }>): KeyInput {
  return message.text === undefined
    ? { key: message.key }
    : { key: message.key, text: message.text };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
