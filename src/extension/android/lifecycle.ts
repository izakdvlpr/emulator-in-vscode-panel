import type { DeviceExit } from '../device/DeviceProvider';
import { isProcessAlive } from './discovery';
import type { EmulatorProcess } from './emulatorProcess';
import { call, deadline, type EmulatorControllerClient } from './grpcClient';

const attachedPollIntervalMs = 2000;

/** De quem é o processo do emulador, e portanto o que "encerrar" significa. */
export interface SessionLifecycle {
  readonly attached: boolean;
  readonly hasExited: boolean;
  /** Resolve quando o emulador deixa de existir. */
  readonly exited: Promise<DeviceExit>;
  /** Encerramento normal: desliga o emulador que iniciamos, ou só solta o anexado. */
  shutdown(client: EmulatorControllerClient, fast: boolean): Promise<void>;
  /** Sem tempo para shutdown gracioso (ex.: deactivate chegou no meio do Stop). */
  killNow(): void;
  /** Start que falhou no meio do caminho. */
  abandon(): Promise<void>;
}

/** Emulador iniciado pela extensão: o Stop desliga de fato. */
export class LaunchedLifecycle implements SessionLifecycle {
  readonly attached = false;
  readonly exited: Promise<DeviceExit>;

  constructor(
    private readonly process: EmulatorProcess,
    private readonly emulatorPid: number,
  ) {
    this.exited = process.exited.then((exit) => ({
      code: exit.code,
      reason: process.describeExit(),
    }));
  }

  get hasExited(): boolean {
    return this.process.hasExited;
  }

  async shutdown(client: EmulatorControllerClient, fast: boolean): Promise<void> {
    if (!this.process.hasExited) {
      await call((callback) =>
        client.setVmState({ state: 'SHUTDOWN' }, deadline(2000), callback),
      ).catch(() => {});
    }
    // Salvar o snapshot de Quick Boot leva ~20s num AVD de 4 GB, e um SIGTERM no meio
    // deixa o snapshot inválido (o próximo boot vira cold boot). O emulador sai sozinho ao
    // terminar, então a espera longa só pesa quando ele está realmente travado.
    await this.process.terminate({
      graceMs: fast ? 2000 : 90_000,
      termMs: fast ? 1000 : 3000,
      extraPids: [this.emulatorPid],
    });
  }

  killNow(): void {
    this.process.kill([this.emulatorPid]);
  }

  abandon(): Promise<void> {
    return this.process.terminate({ graceMs: 0, termMs: 2000 });
  }
}

/**
 * Emulador que já estava rodando (Android Studio, terminal). Nunca é morto pela extensão; a
 * saída é detectada consultando o pid, já que não somos o processo pai.
 */
export class AttachedLifecycle implements SessionLifecycle {
  readonly attached = true;
  readonly exited: Promise<DeviceExit>;
  private exitedFlag = false;
  private readonly poll: NodeJS.Timeout;

  constructor(pid: number) {
    let resolveExit: (exit: DeviceExit) => void = () => {};
    this.exited = new Promise((resolve) => {
      resolveExit = resolve;
    });
    this.poll = setInterval(() => {
      if (isProcessAlive(pid)) return;
      this.exitedFlag = true;
      clearInterval(this.poll);
      resolveExit({ code: null, reason: 'the emulator was closed' });
    }, attachedPollIntervalMs);
  }

  get hasExited(): boolean {
    return this.exitedFlag;
  }

  shutdown(): Promise<void> {
    clearInterval(this.poll);
    return Promise.resolve();
  }

  killNow(): void {}

  abandon(): Promise<void> {
    clearInterval(this.poll);
    return Promise.resolve();
  }
}
