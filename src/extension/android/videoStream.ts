import type { ChildProcess } from 'node:child_process';
import type * as vscode from 'vscode';
import type { Rotation, ScreenSize } from '../../shared/device';
import type { FrameEvent } from '../device/DeviceProvider';
import { type Adb, killRemote, spawnAdb } from './adb';
import { type AccessUnit, AnnexBParser } from './h264';

// O `screenrecord` escreve um frame inteiro por vez; se nada chega nesse intervalo, o último
// frame está completo e pode ir para o decoder mesmo sem o start code do próximo.
const idleFlushMs = 10;
const firstFrameTimeoutMs = 8000;
const rotationPollSeconds = 0.5;
const rotationFallbackMs = 2000;
const maxConsecutiveFailures = 2;
const minVideoSide = 128;

// O `screenrecord` grava o display lógico: um app travado em retrato (ex.: o launcher) fica
// em retrato mesmo com o device fisicamente deitado. Por isso o tamanho do vídeo segue a
// rotação do display, lida do WindowManager (~10ms por consulta). A linha é repetida a cada
// ciclo para o loop morrer de SIGPIPE assim que o adb do host fechar.
const rotationWatcherScript = [
  'echo pid:$$',
  `while :; do r=$(dumpsys window displays 2>/dev/null | grep -m1 -oE 'mCurrentRotation=ROTATION_[0-9]+'); echo "rot:\${r##*_}"; sleep ${rotationPollSeconds}; done`,
].join('; ');

interface Recorder {
  child: ChildProcess;
  parser: AnnexBParser;
  header: string;
  headerDone: boolean;
  remotePid: number | undefined;
  configured: boolean;
  producedVideo: boolean;
  /** Primeiros bytes que não eram vídeo, para explicar a falha no log. */
  noise: string;
  flushTimer: NodeJS.Timeout | undefined;
  firstFrameTimer: NodeJS.Timeout;
}

/**
 * Vídeo H.264 via `adb exec-out screenrecord`. Reinicia sozinho quando o `screenrecord` sai
 * (limite de tempo, troca de rotação) e chama `onFailure` se não conseguir produzir vídeo.
 */
export class VideoStream implements vscode.Disposable {
  private readonly startedAt = performance.now();
  private readonly watcher: ChildProcess;
  private watcherPid: number | undefined;
  private watcherBuffer = '';
  private rotation: Rotation | undefined;
  private readonly rotationFallback: NodeJS.Timeout;
  private recorder: Recorder | undefined;
  private failures = 0;
  // Versões antigas do `screenrecord` limitam a gravação a 180s e recusam `--time-limit 0`.
  private unlimited = true;
  private disposed = false;

  constructor(
    private readonly adb: Adb,
    private readonly screen: ScreenSize,
    private readonly maxSize: ScreenSize,
    private readonly output: vscode.OutputChannel,
    private readonly onEvent: (event: FrameEvent) => void,
    private readonly onFailure: (reason: string) => void,
  ) {
    this.watcher = spawnAdb(adb, 'shell', rotationWatcherScript);
    this.watcher.stdout?.setEncoding('utf8');
    this.watcher.stdout?.on('data', (text: string) => this.handleWatcherOutput(text));
    this.watcher.once('error', (error) => this.fail(`adb failed: ${error.message}`));
    this.watcher.once('exit', () => {
      if (!this.disposed && this.rotation === undefined) this.fail('adb exited early');
    });

    this.rotationFallback = setTimeout(() => {
      if (this.rotation !== undefined || this.disposed) return;
      this.output.appendLine('[video] could not read the display rotation; assuming portrait');
      this.setRotation(0);
    }, rotationFallbackMs);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    clearTimeout(this.rotationFallback);
    this.stopRecorder();
    this.watcher.kill();
    if (this.watcherPid !== undefined) killRemote(this.adb, [this.watcherPid]);
  }

  private handleWatcherOutput(text: string): void {
    this.watcherBuffer += text;
    const lines = this.watcherBuffer.split(/\r?\n/);
    this.watcherBuffer = lines.pop() ?? '';
    for (const line of lines) {
      const [key, value] = line.split(':');
      const number = Number(value);
      if (key === 'pid' && Number.isInteger(number) && number > 1) this.watcherPid = number;
      if (key === 'rot' && value !== '' && Number.isInteger(number)) {
        this.setRotation(toRotation(number / 90));
      }
    }
  }

  private setRotation(rotation: Rotation): void {
    if (this.disposed || rotation === this.rotation) return;
    this.rotation = rotation;
    this.startRecorder();
  }

  private startRecorder(): void {
    this.stopRecorder();
    const rotation = this.rotation ?? 0;
    const size = videoSize(this.screen, this.maxSize, rotation);
    const bitRate = Math.min(Math.max(size.width * size.height * 8, 2_000_000), 20_000_000);
    const script = [
      'echo $$',
      [
        'exec screenrecord --output-format=h264',
        `--size ${size.width}x${size.height}`,
        `--bit-rate ${bitRate}`,
        `--time-limit ${this.unlimited ? 0 : 180}`,
        '-',
      ].join(' '),
    ].join('; ');

    const child = spawnAdb(this.adb, 'exec-out', script);
    const recorder: Recorder = {
      child,
      parser: new AnnexBParser(
        (unit) => this.handleAccessUnit(recorder, unit, size, rotation),
        (skipped) => this.handleDesync(recorder, skipped),
      ),
      header: '',
      headerDone: false,
      remotePid: undefined,
      configured: false,
      producedVideo: false,
      noise: '',
      flushTimer: undefined,
      firstFrameTimer: setTimeout(() => {
        if (this.recorder !== recorder || recorder.producedVideo) return;
        recorder.noise ||= 'no video after 8s';
        child.kill();
      }, firstFrameTimeoutMs),
    };
    this.recorder = recorder;

    child.stdout?.on('data', (chunk: Buffer) => this.handleRecorderOutput(recorder, chunk));
    child.stderr?.on('data', (chunk: Buffer) => {
      recorder.noise += chunk.toString('utf8');
    });
    child.once('error', (error) => {
      recorder.noise += error.message;
    });
    child.once('close', (code) => this.handleRecorderExit(recorder, code));
  }

  private stopRecorder(): void {
    const recorder = this.recorder;
    if (!recorder) return;
    this.recorder = undefined;
    clearTimeout(recorder.firstFrameTimer);
    clearTimeout(recorder.flushTimer);
    recorder.child.kill();
    if (recorder.remotePid !== undefined) killRemote(this.adb, [recorder.remotePid]);
  }

  private handleRecorderOutput(recorder: Recorder, chunk: Buffer): void {
    if (this.recorder !== recorder) return;
    let data: Uint8Array = chunk;
    // A primeira linha é o pid do shell, que o `exec` transforma no pid do `screenrecord`.
    if (!recorder.headerDone) {
      const newline = chunk.indexOf(0x0a);
      if (newline < 0) {
        recorder.header += chunk.toString('latin1');
        if (recorder.header.length < 32) return;
        data = new Uint8Array(0);
      } else {
        recorder.header += chunk.subarray(0, newline).toString('latin1');
        data = chunk.subarray(newline + 1);
      }
      recorder.headerDone = true;
      // Só um pid válido: `kill -1` no device mataria todos os processos do usuário shell.
      const header = recorder.header.trim();
      if (/^\d+$/.test(header) && Number(header) > 1) recorder.remotePid = Number(header);
      else recorder.noise += header;
    }
    recorder.parser.push(data);
    clearTimeout(recorder.flushTimer);
    recorder.flushTimer = setTimeout(() => {
      if (this.recorder === recorder) recorder.parser.flush();
    }, idleFlushMs);
  }

  private handleAccessUnit(
    recorder: Recorder,
    unit: AccessUnit,
    size: ScreenSize,
    rotation: Rotation,
  ): void {
    if (this.recorder !== recorder) return;
    if (!recorder.configured) {
      if (!unit.key || !unit.codec) return;
      recorder.configured = true;
      this.onEvent({ kind: 'h264-config', codec: unit.codec, ...size, rotation });
    }
    if (!recorder.producedVideo) {
      recorder.producedVideo = true;
      this.failures = 0;
      clearTimeout(recorder.firstFrameTimer);
    }
    this.onEvent({
      kind: 'h264-chunk',
      key: unit.key,
      timestamp: Math.round((performance.now() - this.startedAt) * 1000),
      data: unit.data,
    });
  }

  private handleDesync(recorder: Recorder, skipped: Uint8Array): void {
    if (this.recorder !== recorder) return;
    if (!recorder.producedVideo) {
      // Antes do primeiro frame, bytes soltos são mensagens de erro do `screenrecord`.
      recorder.noise += Buffer.from(skipped).toString('utf8');
      return;
    }
    // Um frame foi liberado pelo timer antes de chegar inteiro: o decoder ficaria com
    // referência corrompida até o próximo keyframe, então é mais rápido recomeçar.
    this.output.appendLine('[video] H.264 stream lost sync; restarting');
    this.startRecorder();
  }

  private handleRecorderExit(recorder: Recorder, code: number | null): void {
    if (this.recorder !== recorder || this.disposed) return;
    clearTimeout(recorder.firstFrameTimer);
    clearTimeout(recorder.flushTimer);
    if (recorder.producedVideo) {
      this.output.appendLine(`[video] screenrecord exited (code ${code}); restarting`);
      this.startRecorder();
      return;
    }
    const reason = recorder.noise.trim() || `screenrecord exited with code ${code}`;
    this.output.appendLine(`[video] screenrecord failed: ${reason}`);
    this.failures++;
    if (this.unlimited && /time.?limit/i.test(reason)) {
      this.unlimited = false;
    }
    if (this.failures >= maxConsecutiveFailures) this.fail(reason);
    else this.startRecorder();
  }

  private fail(reason: string): void {
    if (this.disposed) return;
    this.dispose();
    this.onFailure(reason);
  }
}

function toRotation(quarterTurns: number): Rotation {
  return (((Math.round(quarterTurns) % 4) + 4) % 4) as Rotation;
}

/**
 * Cabe na área disponível mantendo o aspect ratio, sem passar da resolução real. O encoder
 * recusa dimensões ímpares.
 */
export function videoSize(screen: ScreenSize, maxSize: ScreenSize, rotation: Rotation): ScreenSize {
  const sideways = rotation % 2 === 1;
  const width = sideways ? screen.height : screen.width;
  const height = sideways ? screen.width : screen.height;
  const fit = Math.min(maxSize.width / width, maxSize.height / height, 1);
  const scale = Math.max(fit, Math.min(minVideoSide / Math.min(width, height), 1));
  const even = (value: number) => Math.max(2, Math.round((value * scale) / 2) * 2);
  return { width: even(width), height: even(height) };
}
