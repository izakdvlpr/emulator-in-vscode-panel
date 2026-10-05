import { type ChildProcess, spawn } from 'node:child_process';
import { basename } from 'node:path';
import { createInterface } from 'node:readline';
import type * as vscode from 'vscode';
import { z } from 'zod';
import type { LogEntry, LogLevel } from '../device/DeviceProvider';
import { listApps, simctlPath } from './simctl';

const restartDelayMs = 2000;
// Falhas seguidas sem nenhuma linha no meio: o `log` não vai funcionar, então desiste.
const maxFailures = 5;
const maxStderrLength = 2000;

// Uma linha do `log stream --style ndjson`; os outros campos não interessam.
const logEventSchema = z.object({
  timestamp: z.string().regex(/^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d\.\d{3}/),
  messageType: z.string(),
  processImagePath: z.string(),
  processID: z.number().int(),
  threadID: z.number().int(),
  subsystem: z.string(),
  category: z.string(),
  eventMessage: z.string(),
});

const levels: Record<string, LogLevel> = {
  Debug: 'debug',
  Info: 'info',
  Default: 'info',
  Error: 'error',
  Fault: 'fatal',
};

/** `log stream` do unified logging do simulador, filtrado pelo processo do app quando houver. */
export class IosLogStream implements vscode.Disposable {
  private child: ChildProcess | undefined;
  private restart: NodeJS.Timeout | undefined;
  private failures = 0;
  private disposed = false;

  constructor(
    private readonly udid: string,
    private readonly appId: string | undefined,
    private readonly onEntries: (entries: LogEntry[]) => void,
    private readonly onError: (message: string) => void,
  ) {
    void this.connect();
  }

  dispose(): void {
    this.disposed = true;
    clearTimeout(this.restart);
    this.child?.kill();
    this.child = undefined;
  }

  private async connect(): Promise<void> {
    let binary: string;
    let args: string[];
    try {
      [binary, args] = await Promise.all([simctlPath(), this.streamArgs()]);
    } catch (error) {
      this.onError(errorMessage(error));
      return;
    }
    if (this.disposed) return;

    // Matar o `simctl` derruba o `log` que ele abriu dentro do simulador.
    const child = spawn(binary, ['spawn', this.udid, 'log', 'stream', ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    this.child = child;
    let stderr = '';
    child.stderr?.setEncoding('utf8');
    child.stderr?.on('data', (chunk: string) => {
      stderr = (stderr + chunk).slice(-maxStderrLength);
    });
    if (child.stdout) {
      createInterface({ input: child.stdout }).on('line', (line) => {
        const entry = parseLine(line);
        if (!entry || this.disposed) return;
        this.failures = 0;
        this.onEntries([entry]);
      });
    }
    child.once('error', (error) => this.onError(`log stream failed: ${error.message}`));
    child.once('exit', (code) => {
      if (this.child !== child || this.disposed) return;
      this.child = undefined;
      if (code !== 0) {
        this.failures += 1;
        this.onError(`log stream exited with code ${code}: ${stderr.trim()}`);
        if (this.failures >= maxFailures) return;
      }
      // Sai sozinho se o `launchd_sim` reiniciar; enquanto a sessão viver, volta a ouvir.
      this.restart = setTimeout(() => void this.connect(), restartDelayMs);
    });
  }

  // Sem filtro, o nível `debug` do sistema inteiro é rápido demais para um output channel.
  private async streamArgs(): Promise<string[]> {
    const base = ['--style', 'ndjson', '--type', 'log'];
    if (!this.appId) return base;
    const app = (await listApps(this.udid)).find((candidate) => candidate.id === this.appId);
    if (!app) throw new Error(`${this.appId} is not installed on this simulator.`);
    return [
      ...base,
      '--level',
      'debug',
      '--predicate',
      `process == ${JSON.stringify(app.executable)}`,
    ];
  }
}

function parseLine(line: string): LogEntry | undefined {
  // A primeira linha ("Filtering the log data using ...") não é JSON.
  if (!line.startsWith('{')) return undefined;
  let json: unknown;
  try {
    json = JSON.parse(line);
  } catch {
    return undefined;
  }
  const parsed = logEventSchema.safeParse(json);
  if (!parsed.success) return undefined;
  const event = parsed.data;
  const process = basename(event.processImagePath);
  const source = [event.subsystem, event.category].filter(Boolean).join(':');
  return {
    // `2026-10-05 16:01:42.585767-0300` → `10-05 16:01:42.585`, no mesmo formato do logcat.
    time: event.timestamp.slice(5, 23),
    level: levels[event.messageType] ?? 'info',
    pid: event.processID,
    tid: event.threadID,
    tag: source ? `${process} (${source})` : process,
    message: event.eventMessage,
  };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
