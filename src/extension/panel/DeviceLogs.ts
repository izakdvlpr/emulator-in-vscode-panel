import * as vscode from 'vscode';
import type { DeviceSession, LogEntry, LogLevel } from '../device/DeviceProvider';

// Mandar linha por linha para o output channel trava o extension host com o logcat a todo vapor.
const flushIntervalMs = 100;
// Acima disso, entre um flush e outro, as linhas são descartadas e o descarte é avisado.
const maxBufferedLines = 5000;

const levelLetters: Record<LogLevel, string> = {
  verbose: 'V',
  debug: 'D',
  info: 'I',
  warn: 'W',
  error: 'E',
  fatal: 'F',
};

interface DeviceLog {
  channel: vscode.OutputChannel;
  stream: vscode.Disposable | undefined;
  appId: string | undefined;
  buffer: string[];
  dropped: number;
  flushTimer: NodeJS.Timeout | undefined;
}

type AppChoice = vscode.QuickPickItem & {
  choice: 'all' | 'app' | 'other' | 'stop';
  appId?: string;
};

/** Um output channel por device, com os logs dele no formato do `logcat -v threadtime`. */
export class DeviceLogs implements vscode.Disposable {
  private readonly logs = new Map<string, DeviceLog>();

  /** Pergunta de qual app mostrar os logs e começa, ou recomeça com o filtro novo. */
  async open(deviceId: string, deviceName: string, session: DeviceSession): Promise<void> {
    const current = this.logs.get(deviceId);
    const picked = await pickApp(session, current);
    if (!picked) return;
    if (picked.choice === 'stop') {
      this.stop(deviceId);
      return;
    }

    const log = current ?? this.create(deviceId, deviceName);
    log.stream?.dispose();
    log.appId = picked.appId;
    this.push(log, [`--- ${picked.appId ? `Logs of ${picked.appId}` : 'All logs'} ---`]);
    log.stream = session.streamLogs(
      picked.appId,
      (entries) => this.push(log, entries.flatMap(formatEntry)),
      (message) => this.push(log, [`--- ${message}`]),
    );
    log.channel.show(true);
  }

  /** Para o stream do device; o channel fica com o que já foi recebido. */
  stop(deviceId: string): void {
    const log = this.logs.get(deviceId);
    if (!log?.stream) return;
    log.stream.dispose();
    log.stream = undefined;
    this.push(log, ['--- Logs stopped ---']);
  }

  dispose(): void {
    for (const log of this.logs.values()) {
      log.stream?.dispose();
      clearTimeout(log.flushTimer);
      log.channel.dispose();
    }
    this.logs.clear();
  }

  private create(deviceId: string, deviceName: string): DeviceLog {
    const log: DeviceLog = {
      // `log` dá o realce de nível e horário do próprio VS Code.
      channel: vscode.window.createOutputChannel(`Emulator Logs: ${deviceName}`, 'log'),
      stream: undefined,
      appId: undefined,
      buffer: [],
      dropped: 0,
      flushTimer: undefined,
    };
    this.logs.set(deviceId, log);
    return log;
  }

  private push(log: DeviceLog, lines: string[]): void {
    const room = maxBufferedLines - log.buffer.length;
    log.buffer.push(...lines.slice(0, room));
    log.dropped += Math.max(lines.length - room, 0);
    log.flushTimer ??= setTimeout(() => this.flush(log), flushIntervalMs);
  }

  private flush(log: DeviceLog): void {
    log.flushTimer = undefined;
    if (log.dropped > 0) {
      log.buffer.push(`--- ${log.dropped} lines dropped: too many logs, filter by app ---`);
      log.dropped = 0;
    }
    if (log.buffer.length === 0) return;
    log.channel.append(`${log.buffer.join('\n')}\n`);
    log.buffer = [];
  }
}

async function pickApp(
  session: DeviceSession,
  current: DeviceLog | undefined,
): Promise<AppChoice | undefined> {
  const streaming = current?.stream !== undefined;
  const activeApp = streaming ? current?.appId : undefined;
  const items = session.listApps().then(
    (apps): AppChoice[] => [
      ...(streaming ? [{ label: '$(debug-stop) Stop logs', choice: 'stop' as const }] : []),
      {
        label: '$(list-flat) All processes',
        description: streaming && !activeApp ? 'current' : '',
        choice: 'all',
      },
      { label: 'Installed apps', kind: vscode.QuickPickItemKind.Separator, choice: 'app' },
      ...apps.map(
        (app): AppChoice => ({
          label: app.name,
          description: [
            app.name === app.id ? undefined : app.id,
            app.id === activeApp ? 'current' : undefined,
          ]
            .filter(Boolean)
            .join(' · '),
          choice: 'app',
          appId: app.id,
        }),
      ),
      { label: '$(edit) Other app…', choice: 'other' },
    ],
    // Sem a lista de apps ainda dá para digitar o id.
    (): AppChoice[] => [
      { label: '$(list-flat) All processes', choice: 'all' },
      { label: '$(edit) Other app…', choice: 'other' },
    ],
  );
  const picked = await vscode.window.showQuickPick(items, {
    title: 'Device Logs',
    placeHolder: 'Show the logs of which app?',
    matchOnDescription: true,
  });
  if (picked?.choice !== 'other') return picked;

  const appId = await vscode.window.showInputBox({
    title: 'Device Logs',
    prompt: session.platform === 'android' ? 'Package name' : 'Bundle identifier',
    placeHolder: 'com.example.app',
    value: activeApp ?? '',
    validateInput: (value) =>
      /^[\w.:-]+$/.test(value.trim()) ? undefined : 'Enter a package name or bundle identifier.',
  });
  return appId ? { ...picked, choice: 'app', appId: appId.trim() } : undefined;
}

// Cada linha da mensagem leva o cabeçalho, como no logcat.
function formatEntry(entry: LogEntry): string[] {
  const header = `${entry.time} ${String(entry.pid).padStart(5)} ${String(entry.tid).padStart(5)} ${levelLetters[entry.level]} ${entry.tag}: `;
  return entry.message.split(/\r?\n/).map((line) => header + line);
}
