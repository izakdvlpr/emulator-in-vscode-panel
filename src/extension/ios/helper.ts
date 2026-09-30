import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import * as vscode from 'vscode';
import { z } from 'zod';

// Espelha os eventos JSON emitidos pelo `ios-helper` (ver `ios-helper/main.swift`).
const rotationSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]);
const helperEventSchema = z.discriminatedUnion('event', [
  z.object({ event: z.literal('ready'), width: z.number().int(), height: z.number().int() }),
  z.object({
    event: z.literal('video'),
    width: z.number().int(),
    height: z.number().int(),
    rotation: rotationSchema,
  }),
  z.object({ event: z.literal('exited') }),
  z.object({ event: z.literal('error'), message: z.string() }),
  z.object({ event: z.literal('screenshotFailed'), id: z.number().int(), message: z.string() }),
]);
export type HelperEvent = z.infer<typeof helperEventSchema>;

export interface HelperVideoUnit {
  key: boolean;
  timestamp: number;
  data: Uint8Array;
}

export type HelperCommand =
  | { cmd: 'stream'; maxWidth: number; maxHeight: number }
  | { cmd: 'stopStream' }
  | { cmd: 'touch'; phase: 'down' | 'move' | 'up'; x: number; y: number; mirror: boolean }
  | { cmd: 'button'; name: 'home' | 'lock' | 'volumeUp' | 'volumeDown' | 'appSwitcher' }
  | { cmd: 'key'; usage: number; modifiers: number[] }
  | { cmd: 'rotate'; rotation: number }
  | { cmd: 'screenshot'; id: number };

export interface HelperExit {
  code: number | null;
  signal: NodeJS.Signals | null;
}

const kind = { event: 0x4a, video: 0x56, png: 0x50 } as const;
const headerSize = 5;
const screenshotTimeoutMs = 15_000;

/** Processo `ios-helper` de uma sessão. Fala JSON por linha no stdin e frames binários no stdout. */
export class HelperProcess {
  private readonly child: ChildProcessWithoutNullStreams;
  private readonly eventEmitter = new vscode.EventEmitter<HelperEvent>();
  readonly onEvent = this.eventEmitter.event;
  private readonly videoEmitter = new vscode.EventEmitter<HelperVideoUnit>();
  readonly onVideo = this.videoEmitter.event;
  readonly exited: Promise<HelperExit>;
  private exitInfo: HelperExit | undefined;
  private buffer: Buffer = Buffer.alloc(0);
  private nextScreenshotId = 1;
  private readonly screenshots = new Map<
    number,
    { resolve: (png: Uint8Array) => void; reject: (error: Error) => void }
  >();
  private lastError: string | undefined;

  constructor(binary: string, args: string[], output: vscode.OutputChannel) {
    this.child = spawn(binary, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    this.child.stdout.on('data', (chunk: Buffer) => this.read(chunk));
    this.child.stderr.setEncoding('utf8');
    this.child.stderr.on('data', (text: string) => {
      for (const line of text.split('\n')) {
        if (line.trim()) output.appendLine(`[ios-helper] ${line}`);
      }
    });
    // Sem isso, escrever depois que o helper saiu derruba o extension host com EPIPE.
    this.child.stdin.on('error', () => {});
    this.exited = new Promise((resolve) => {
      this.child.once('error', (error) => {
        this.lastError = error.message;
        this.exitInfo = { code: null, signal: null };
        resolve(this.exitInfo);
      });
      this.child.once('exit', (code, signal) => {
        this.exitInfo = { code, signal };
        resolve(this.exitInfo);
      });
    });
    void this.exited.then(() => {
      for (const { reject } of this.screenshots.values()) reject(new Error('ios-helper exited'));
      this.screenshots.clear();
    });
  }

  get hasExited(): boolean {
    return this.exitInfo !== undefined;
  }

  describeExit(): string {
    if (this.lastError) return this.lastError;
    const exit = this.exitInfo;
    if (!exit) return 'running';
    return exit.signal
      ? `ios-helper killed by ${exit.signal}`
      : `ios-helper exited with code ${exit.code}`;
  }

  /** Resolve com a resolução do framebuffer quando o helper se conectou ao simulador. */
  ready(signal: AbortSignal): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        listener.dispose();
        signal.removeEventListener('abort', onAbort);
      };
      const onAbort = () => {
        cleanup();
        reject(signal.reason);
      };
      const listener = this.onEvent((event) => {
        if (event.event === 'ready') {
          cleanup();
          resolve({ width: event.width, height: event.height });
        } else if (event.event === 'error') {
          this.lastError = event.message;
        }
      });
      signal.addEventListener('abort', onAbort, { once: true });
      void this.exited.then(() => {
        cleanup();
        reject(new Error(`Could not connect to the simulator: ${this.describeExit()}`));
      });
    });
  }

  send(command: HelperCommand): void {
    if (this.hasExited || this.child.stdin.writableEnded) return;
    this.child.stdin.write(`${JSON.stringify(command)}\n`);
  }

  screenshot(): Promise<Uint8Array> {
    const id = this.nextScreenshotId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.screenshots.delete(id);
        reject(new Error('Timed out waiting for the screenshot.'));
      }, screenshotTimeoutMs);
      this.screenshots.set(id, {
        resolve: (png) => {
          clearTimeout(timer);
          resolve(png);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      this.send({ cmd: 'screenshot', id });
    });
  }

  /**
   * Fechar o stdin é o pedido de encerramento: com `--owned`, o helper desliga o simulador antes
   * de sair. Passado `graceMs`, o helper é morto, a não ser que `kill` seja `false` (no
   * deactivate ele termina o shutdown sozinho, depois que o extension host já saiu).
   */
  async terminate({ graceMs, kill = true }: { graceMs: number; kill?: boolean }): Promise<void> {
    this.child.stdin.end();
    const timeout = new AbortController();
    const exited = await Promise.race([
      this.exited.then(() => true),
      sleep(graceMs, false, { signal: timeout.signal }).catch(() => false),
    ]);
    timeout.abort();
    if (exited || !kill) return;
    this.child.kill('SIGKILL');
    await this.exited;
  }

  dispose(): void {
    this.eventEmitter.dispose();
    this.videoEmitter.dispose();
  }

  private read(chunk: Buffer): void {
    this.buffer = this.buffer.length === 0 ? chunk : Buffer.concat([this.buffer, chunk]);
    while (this.buffer.length >= headerSize) {
      const length = this.buffer.readUInt32BE(1);
      if (this.buffer.length < headerSize + length) break;
      const type = this.buffer[0];
      const payload = this.buffer.subarray(headerSize, headerSize + length);
      this.buffer = this.buffer.subarray(headerSize + length);
      this.handleFrame(type, payload);
    }
  }

  private handleFrame(type: number | undefined, payload: Buffer): void {
    switch (type) {
      case kind.event: {
        const parsed = helperEventSchema.safeParse(JSON.parse(payload.toString('utf8')));
        if (!parsed.success) return;
        const event = parsed.data;
        if (event.event === 'screenshotFailed') {
          this.screenshots.get(event.id)?.reject(new Error(event.message));
          this.screenshots.delete(event.id);
        }
        this.eventEmitter.fire(event);
        return;
      }
      case kind.video: {
        // `[flags u8][timestamp µs u64 BE][Annex B]`
        if (payload.length < 9) return;
        this.videoEmitter.fire({
          key: ((payload[0] ?? 0) & 1) === 1,
          timestamp: Number(payload.readBigUInt64BE(1)),
          data: payload.subarray(9),
        });
        return;
      }
      case kind.png: {
        if (payload.length < 4) return;
        const id = payload.readUInt32BE(0);
        // Cópia: o `payload` é uma fatia do buffer de leitura, que pode conter o frame seguinte.
        this.screenshots.get(id)?.resolve(new Uint8Array(payload.subarray(4)));
        this.screenshots.delete(id);
        return;
      }
    }
  }
}
