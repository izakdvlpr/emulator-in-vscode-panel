import { createInterface } from 'node:readline';
import * as grpc from '@grpc/grpc-js';
import type * as vscode from 'vscode';
import type { LogEntry, LogLevel } from '../device/DeviceProvider';
import { type Adb, adbShell, spawnAdb } from './adb';
import type { LogMessage__Output } from './generated/android/emulation/control/LogMessage';
import type { EmulatorControllerClient } from './grpcClient';

const restartDelayMs = 2000;
const adbTimeoutMs = 15_000;
const maxStderrLength = 2000;
// Falhas seguidas sem nenhuma linha no meio: o `logcat` não vai funcionar, então desiste.
const maxFailures = 5;

// `threadtime`, o formato do `adb logcat` e do `streamLogcat` em modo Text:
// `10-05 16:01:31.448   631  1476 W tag: mensagem`.
const threadtimeLine =
  /^(\d\d-\d\d \d\d:\d\d:\d\d\.\d{3})\s+(\d+)\s+(\d+)\s+([VDIWEFAS])\s(.*?)\s*:(?: (.*))?$/;

// O ActivityManager anuncia cada processo novo; é assim que o filtro acompanha o app reiniciando.
const startProcMessage = /^Start proc (\d+):([^/\s]+)/;

const levels: Record<string, LogLevel> = {
  V: 'verbose',
  D: 'debug',
  I: 'info',
  W: 'warn',
  E: 'error',
  F: 'fatal',
  A: 'fatal',
  S: 'verbose',
};

/** Logcat do emulador, filtrado pelos processos do app quando houver `appId`. */
export class LogcatStream implements vscode.Disposable {
  private stopSource: (() => void) | undefined;
  private restart: NodeJS.Timeout | undefined;
  private failures = 0;
  private readonly pids = new Set<number>();
  // Enquanto o `ps` não responde, as linhas esperam aqui em vez de serem descartadas.
  private pending: LogEntry[] | undefined;
  private disposed = false;

  constructor(
    private readonly client: EmulatorControllerClient,
    /** Sem adb, o logcat vem pelo gRPC e o filtro só pega processos abertos depois do início. */
    private readonly adb: Adb | undefined,
    private readonly appId: string | undefined,
    private readonly onEntries: (entries: LogEntry[]) => void,
    private readonly onError: (message: string) => void,
  ) {
    this.connect();
  }

  dispose(): void {
    this.disposed = true;
    clearTimeout(this.restart);
    this.stopSource?.();
    this.stopSource = undefined;
  }

  // O stream começa antes da busca de pids para não perder um processo aberto nesse meio-tempo.
  private connect(): void {
    if (this.adb) this.connectAdb(this.adb);
    else this.connectGrpc();
    if (this.appId && this.adb) void this.findPids(this.appId, this.adb);
  }

  // `-T 1`: segue a partir da última linha, sem despejar o buffer inteiro.
  private connectAdb(adb: Adb): void {
    const child = spawnAdb(adb, 'shell', 'logcat -v threadtime -T 1');
    const stop = () => child.kill();
    this.stopSource = stop;
    let stderr = '';
    child.stderr?.setEncoding('utf8');
    child.stderr?.on('data', (chunk: string) => {
      stderr = (stderr + chunk).slice(-maxStderrLength);
    });
    if (child.stdout) {
      createInterface({ input: child.stdout }).on('line', (line) => {
        const entry = parseLine(line);
        if (!entry) return;
        this.failures = 0;
        this.handle([entry]);
      });
    }
    child.once('error', (error) => this.onError(`adb logcat failed: ${error.message}`));
    child.once('exit', (code) => {
      if (code !== 0) {
        this.failures += 1;
        this.onError(`adb logcat exited with code ${code}: ${stderr.trim()}`);
      }
      this.reconnect(stop);
    });
  }

  // O `streamLogcat` do emulador 36.x para de entregar linhas, sem erro nem fim, quando chega uma
  // rajada de linhas longas (ex.: ao abrir um app). Por isso só é usado quando não há adb. O modo
  // `Parsed` chega com `entries` vazio, então vai em Text.
  private connectGrpc(): void {
    const stream = this.client.streamLogcat({ sort: 'Text' });
    const stop = () => stream.cancel();
    this.stopSource = stop;
    stream.on('data', (message: LogMessage__Output) => {
      const entries = message.contents.split(/\r?\n/).flatMap((line) => {
        const entry = parseLine(line);
        return entry ? [entry] : [];
      });
      if (entries.length > 0) this.failures = 0;
      this.handle(entries);
    });
    stream.on('error', (error: grpc.ServiceError) => {
      if (error.code === grpc.status.CANCELLED) return;
      this.failures += 1;
      if (error.code === grpc.status.UNIMPLEMENTED) this.failures = maxFailures;
      this.onError(`logcat stream failed: ${error.code} ${error.details}`);
    });
    stream.on('close', () => this.reconnect(stop));
  }

  // O logcat termina sozinho se o adbd reiniciar; enquanto a sessão viver, volta a ouvir.
  private reconnect(stop: () => void): void {
    if (this.stopSource !== stop || this.disposed) return;
    this.stopSource = undefined;
    if (this.failures >= maxFailures) return;
    this.restart = setTimeout(() => this.connect(), restartDelayMs);
  }

  private async findPids(appId: string, adb: Adb): Promise<void> {
    this.pending = [];
    try {
      const output = await adbShell(adb, 'ps -A -o PID=,NAME=', { timeoutMs: adbTimeoutMs });
      for (const line of output.split(/\r?\n/)) {
        const [pid, name] = line.trim().split(/\s+/);
        if (name && belongsTo(name, appId)) this.pids.add(Number(pid));
      }
    } catch (error) {
      this.onError(`could not list the processes of ${appId}: ${errorMessage(error)}`);
    }
    const pending = this.pending;
    this.pending = undefined;
    if (!this.disposed && pending.length > 0) this.emit(pending);
  }

  private handle(entries: LogEntry[]): void {
    if (this.disposed || entries.length === 0) return;
    if (this.appId) {
      for (const entry of entries) this.trackProcess(entry, this.appId);
    }
    if (this.pending) this.pending.push(...entries);
    else this.emit(entries);
  }

  private trackProcess(entry: LogEntry, appId: string): void {
    if (entry.tag !== 'ActivityManager') return;
    const match = startProcMessage.exec(entry.message);
    if (match?.[1] && match[2] && belongsTo(match[2], appId)) this.pids.add(Number(match[1]));
  }

  private emit(entries: LogEntry[]): void {
    const visible = this.appId ? entries.filter((entry) => this.pids.has(entry.pid)) : entries;
    if (visible.length > 0) this.onEntries(visible);
  }
}

// Processos extras do app se chamam `pacote:nome`.
function belongsTo(processName: string, appId: string): boolean {
  return processName === appId || processName.startsWith(`${appId}:`);
}

function parseLine(line: string): LogEntry | undefined {
  const match = threadtimeLine.exec(line);
  if (!match) return undefined;
  const [, time = '', pid = '', tid = '', level = '', tag = '', message = ''] = match;
  return {
    time,
    level: levels[level] ?? 'info',
    pid: Number(pid),
    tid: Number(tid),
    tag,
    message,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
