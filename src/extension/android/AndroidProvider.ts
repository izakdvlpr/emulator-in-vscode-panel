import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { connect } from 'node:net';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { promisify } from 'node:util';
import type * as vscode from 'vscode';
import type { DeviceDescriptor, Rotation, ScreenSize, StartingStep } from '../../shared/device';
import { readConfig } from '../config';
import type { DeviceProvider, DeviceSession } from '../device/DeviceProvider';
import { AndroidSession } from './AndroidSession';
import { type Adb, adbFor, adbShell } from './adb';
import { type EmulatorDiscovery, findRunningEmulators } from './discovery';
import { EmulatorProcess } from './emulatorProcess';
import type { DisplayConfigurations__Output } from './generated/android/emulation/control/DisplayConfigurations';
import type { EmulatorStatus__Output } from './generated/android/emulation/control/EmulatorStatus';
import type { PhysicalModelValue__Output } from './generated/android/emulation/control/PhysicalModelValue';
import { call, createEmulatorClient, deadline, type EmulatorControllerClient } from './grpcClient';
import { AttachedLifecycle, LaunchedLifecycle, type SessionLifecycle } from './lifecycle';

const execFileAsync = promisify(execFile);

const discoveryTimeoutMs = 60_000;
const bootTimeoutMs = 180_000;
const pollIntervalMs = 1000;
const adbTimeoutMs = 30_000;

// Derruba o emulador se o extension host morrer sem conseguir limpar (ex.: SIGKILL).
const idleGrpcTimeoutSeconds = 120;

// Quantas portas depois da base procurar antes de desistir: sobra para vários emuladores e
// para portas ocupadas por outros programas no caminho.
const grpcPortRange = 32;

export class AndroidProvider implements DeviceProvider {
  readonly platform = 'android';

  // Porta escolhida mas ainda não aberta pelo emulador: sem isso, dois Starts seguidos
  // veriam a mesma porta livre.
  private readonly reservedPorts = new Set<number>();

  constructor(private readonly output: vscode.OutputChannel) {}

  async listDevices(): Promise<DeviceDescriptor[]> {
    const { sdkPath } = readConfig();
    const [{ stdout }, running] = await Promise.all([
      execFileAsync(emulatorBinary(sdkPath), ['-list-avds'], { timeout: 15_000 }),
      findRunningEmulators(),
    ]);
    const runningIds = new Set(running.map((emulator) => emulator.avdId));
    // Versões recentes misturam linhas de log (`INFO | ...`) na saída.
    return stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^[\w.-]+$/.test(line))
      .map((id) => ({
        id,
        name: id.replaceAll('_', ' '),
        platform: 'android',
        running: runningIds.has(id),
      }));
  }

  async start(
    avdId: string,
    onProgress: (step: StartingStep) => void,
    signal: AbortSignal,
  ): Promise<DeviceSession> {
    const { sdkPath, grpcPort: basePort } = readConfig();

    const running = (await findRunningEmulators()).find((emulator) => emulator.avdId === avdId);
    if (running) return this.attach(sdkPath, running, onProgress, signal);

    const grpcPort = await this.reservePort(basePort);
    onProgress('launching');
    const emulator = new EmulatorProcess(
      emulatorBinary(sdkPath),
      [
        '-avd',
        avdId,
        '-no-window',
        '-no-audio',
        '-no-boot-anim',
        '-grpc',
        String(grpcPort),
        // `-grpc <porta>` desliga o JWT padrão; sem isso a porta fica aberta sem autenticação.
        '-grpc-use-token',
        '-idle-grpc-timeout',
        String(idleGrpcTimeoutSeconds),
      ],
      this.output,
    );
    // A porta volta para o pool só quando o processo sai; até lá o emulador pode estar nela.
    void emulator.exited.then(() => this.reservedPorts.delete(grpcPort));

    let client: EmulatorControllerClient | undefined;
    try {
      onProgress('connecting');
      const discovery = await waitFor(
        async () =>
          (await findRunningEmulators()).find(
            (entry) => entry.grpcPort === grpcPort && entry.avdId === avdId,
          ),
        {
          exited: () => emulator.hasExited,
          reason: () => emulator.describeExit(),
          exitedPromise: emulator.exited,
          signal,
          timeoutMs: discoveryTimeoutMs,
          what: 'the emulator to start',
        },
      );
      const lifecycle = new LaunchedLifecycle(emulator, discovery.pid);
      const grpcClient = createEmulatorClient(
        grpcPort,
        discovery.grpcToken ?? (await readConsoleToken()),
      );
      client = grpcClient;

      onProgress('booting');
      await waitForBoot(grpcClient, lifecycle, signal);

      const adb =
        discovery.consolePort === undefined ? undefined : adbFor(sdkPath, discovery.consolePort);
      if (adb) await this.hideScreenDecorations(adb, signal);

      const screen = await readScreenSize(grpcClient);
      const rotation = await readRotation(grpcClient);
      return new AndroidSession(lifecycle, grpcClient, screen, rotation, adb, this.output);
    } catch (error) {
      client?.close();
      await emulator.terminate({ graceMs: 0, termMs: 2000 });
      throw error;
    }
  }

  private async reservePort(basePort: number): Promise<number> {
    for (let port = basePort; port < basePort + grpcPortRange; port++) {
      if (this.reservedPorts.has(port)) continue;
      // Reserva antes do `await`: um Start concorrente precisa ver a porta tomada já agora.
      this.reservedPorts.add(port);
      if (!(await isPortInUse(port))) return port;
      this.reservedPorts.delete(port);
    }
    throw new Error(
      `No free gRPC port between ${basePort} and ${basePort + grpcPortRange - 1}. Change the "emulatorPanel.grpcPort" setting.`,
    );
  }

  // Emulador aberto fora da extensão (Android Studio, terminal). O token do discovery vale
  // mesmo quando ele sobe com `-grpc-use-jwt`, então não é preciso assinar JWT.
  private async attach(
    sdkPath: string,
    discovery: EmulatorDiscovery,
    onProgress: (step: StartingStep) => void,
    signal: AbortSignal,
  ): Promise<DeviceSession> {
    onProgress('connecting');
    const lifecycle = new AttachedLifecycle(discovery.pid);
    const client = createEmulatorClient(
      discovery.grpcPort,
      discovery.grpcToken ?? (await readConsoleToken()),
    );
    try {
      onProgress('booting');
      await waitForBoot(client, lifecycle, signal);
      const screen = await readScreenSize(client);
      const rotation = await readRotation(client);
      const adb =
        discovery.consolePort === undefined ? undefined : adbFor(sdkPath, discovery.consolePort);
      // Sem `hideScreenDecorations`: reiniciar o SystemUI de um emulador alheio seria invasivo.
      return new AndroidSession(lifecycle, client, screen, rotation, adb, this.output);
    } catch (error) {
      client.close();
      await lifecycle.abandon();
      throw error;
    }
  }

  // O stream do gRPC inclui a camada ScreenDecorOverlay do SystemUI (cantos arredondados e
  // furo da câmera), que o `adb screencap` não mostra. A flag só é lida quando o SystemUI
  // sobe, então ele é reiniciado. `debug.*` não persiste: some no cold boot e o AVD não muda.
  private async hideScreenDecorations(adb: Adb, signal: AbortSignal): Promise<void> {
    const script = [
      'old=$(pidof com.android.systemui)',
      'setprop debug.disable_screen_decorations true',
      'am crash com.android.systemui',
      'while [ -z "$(pidof com.android.systemui)" ] || [ "$(pidof com.android.systemui)" = "$old" ]; do sleep 0.2; done',
    ].join('; ');
    try {
      await adbShell(adb, script, { timeoutMs: adbTimeoutMs, signal });
    } catch (error) {
      signal.throwIfAborted();
      // Best-effort: sem adb ou numa imagem diferente, o device só fica com a moldura.
      this.output.appendLine(`[emulator] could not hide screen decorations: ${String(error)}`);
    }
  }
}

function emulatorBinary(sdkPath: string): string {
  return join(sdkPath, 'emulator', process.platform === 'win32' ? 'emulator.exe' : 'emulator');
}

interface WaitOptions {
  exited: () => boolean;
  reason: () => string;
  exitedPromise: Promise<unknown>;
  signal: AbortSignal;
  timeoutMs: number;
  what: string;
}

async function waitFor<T>(
  probe: () => Promise<T | undefined>,
  { exited, reason, exitedPromise, signal, timeoutMs, what }: WaitOptions,
): Promise<T> {
  const startedAt = Date.now();
  for (;;) {
    signal.throwIfAborted();
    if (exited()) throw new Error(`Emulator exited: ${reason()}`);
    const value = await probe();
    if (value !== undefined) return value;
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error(`Timed out after ${timeoutMs / 1000}s waiting for ${what}.`);
    }
    await Promise.race([sleep(pollIntervalMs, undefined, { signal }), exitedPromise]);
  }
}

async function waitForBoot(
  client: EmulatorControllerClient,
  lifecycle: SessionLifecycle,
  signal: AbortSignal,
): Promise<void> {
  let exitReason = 'unknown';
  const exitedPromise = lifecycle.exited.then((exit) => {
    exitReason = exit.reason;
  });
  await waitFor(
    async () => {
      const status = await call<EmulatorStatus__Output>((callback) =>
        client.getStatus({}, deadline(), callback),
      ).catch(() => undefined);
      return status?.booted || undefined;
    },
    {
      exited: () => lifecycle.hasExited,
      reason: () => exitReason,
      exitedPromise,
      signal,
      timeoutMs: bootTimeoutMs,
      what: 'Android to boot',
    },
  );
}

async function readConsoleToken(): Promise<string | undefined> {
  const token = await readFile(join(homedir(), '.emulator_console_auth_token'), 'utf8').catch(
    () => undefined,
  );
  return token?.trim() || undefined;
}

async function readScreenSize(client: EmulatorControllerClient): Promise<ScreenSize> {
  const { displays } = await call<DisplayConfigurations__Output>((callback) =>
    client.getDisplayConfigurations({}, deadline(), callback),
  );
  const primary = displays.find((display) => display.display === 0) ?? displays[0];
  if (!primary || primary.width === 0 || primary.height === 0) {
    throw new Error('Could not read the emulator display size.');
  }
  return { width: primary.width, height: primary.height };
}

// Um emulador anexado (ou restaurado de snapshot) pode já estar girado.
async function readRotation(client: EmulatorControllerClient): Promise<Rotation> {
  const model = await call<PhysicalModelValue__Output>((callback) =>
    client.getPhysicalModel({ target: 'ROTATION' }, deadline(), callback),
  ).catch(() => undefined);
  const z = model?.value?.data[2] ?? 0;
  return (((Math.round(z / 90) % 4) + 4) % 4) as Rotation;
}

// O emulador escuta em `localhost`, que pode ser só IPv6; testar os dois.
async function isPortInUse(port: number): Promise<boolean> {
  const results = await Promise.all(['127.0.0.1', '::1'].map((host) => canConnect(host, port)));
  return results.some(Boolean);
}

function canConnect(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connect({ host, port });
    const done = (connected: boolean) => {
      socket.destroy();
      resolve(connected);
    };
    socket.setTimeout(1000, () => done(false));
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
  });
}
