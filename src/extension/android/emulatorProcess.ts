import { type ChildProcess, execFile, spawn } from 'node:child_process';
import type * as vscode from 'vscode';

export interface ProcessExit {
  code: number | null;
  signal: NodeJS.Signals | null;
  error?: Error;
}

export interface TerminateOptions {
  /** Quanto esperar o processo sair sozinho (ex.: após o shutdown via gRPC). */
  graceMs: number;
  /** Quanto esperar depois do SIGTERM antes do SIGKILL. */
  termMs: number;
  /** PIDs fora do process group que também precisam morrer (ex.: o qemu do discovery). */
  extraPids?: number[];
}

const recentLineLimit = 50;

/**
 * Processo do emulador. No POSIX roda num process group próprio (`detached`) para que
 * o kill alcance filhos que o launcher venha a criar.
 */
export class EmulatorProcess {
  readonly exited: Promise<ProcessExit>;
  private readonly child: ChildProcess;
  private readonly recentLines: string[] = [];
  private exit: ProcessExit | undefined;
  private signalled = false;

  constructor(binary: string, args: string[], output: vscode.OutputChannel) {
    output.appendLine(`$ ${binary} ${args.join(' ')}`);
    this.child = spawn(binary, args, {
      detached: process.platform !== 'win32',
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const collect = (chunk: Buffer) => {
      const text = chunk.toString('utf8');
      output.append(text);
      for (const line of text.split(/\r?\n/)) {
        if (line.trim()) this.recentLines.push(line.trim());
      }
      this.recentLines.splice(0, Math.max(0, this.recentLines.length - recentLineLimit));
    };
    this.child.stdout?.on('data', collect);
    this.child.stderr?.on('data', collect);

    this.exited = new Promise((resolve) => {
      const finish = (exit: ProcessExit) => {
        if (this.exit) return;
        this.exit = exit;
        output.appendLine(`[emulator exited: ${this.describeExit()}]`);
        resolve(exit);
      };
      this.child.once('exit', (code, signal) => finish({ code, signal }));
      this.child.once('error', (error) => finish({ code: null, signal: null, error }));
    });
  }

  get hasExited(): boolean {
    return this.exit !== undefined;
  }

  /** Mensagem legível para a UI; prioriza a última linha FATAL/ERROR do emulador. */
  describeExit(): string {
    if (this.exit?.error) return this.exit.error.message;
    const reported = this.recentLines.findLast((line) => /\b(FATAL|ERROR)\b/.test(line));
    if (reported) return reported.replace(/^(FATAL|ERROR)\s*\|\s*/, '');
    // Ao terminar o shutdown (inclusive depois de salvar o snapshot), o emulador se mata com
    // SIGKILL para pular a limpeza. Isso é uma saída normal, não um kill nosso.
    if (this.exit?.signal === 'SIGKILL' && !this.signalled) return 'shut down';
    if (this.exit?.signal) return `killed by ${this.exit.signal}`;
    return `exit code ${this.exit?.code ?? 'unknown'}`;
  }

  async terminate({ graceMs, termMs, extraPids = [] }: TerminateOptions): Promise<void> {
    if (await this.waitForExit(graceMs)) return;
    this.signal('SIGTERM', extraPids);
    if (await this.waitForExit(termMs)) return;
    this.signal('SIGKILL', extraPids);
    await this.waitForExit(2000);
  }

  /** SIGKILL imediato, para quando não dá mais para esperar o shutdown gracioso. */
  kill(extraPids: number[] = []): void {
    if (!this.hasExited) this.signal('SIGKILL', extraPids);
  }

  private waitForExit(timeoutMs: number): Promise<boolean> {
    if (this.hasExited) return Promise.resolve(true);
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(false), timeoutMs);
      void this.exited.then(() => {
        clearTimeout(timer);
        resolve(true);
      });
    });
  }

  private signal(signal: 'SIGTERM' | 'SIGKILL', extraPids: number[]): void {
    const pid = this.child.pid;
    if (pid === undefined) return;
    this.signalled = true;
    if (process.platform === 'win32') {
      const args = ['/pid', String(pid), '/T', ...(signal === 'SIGKILL' ? ['/F'] : [])];
      execFile('taskkill', args, () => {});
    } else {
      killQuietly(-pid, signal);
    }
    for (const extra of extraPids) killQuietly(extra, signal);
  }
}

function killQuietly(pid: number, signal: NodeJS.Signals): void {
  try {
    process.kill(pid, signal);
  } catch {
    // ESRCH: já morreu.
  }
}
