import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { z } from 'zod';
import type { DeviceDescriptor } from '../../shared/device';
import { env } from '../env';

const execFileAsync = promisify(execFile);

const commandTimeoutMs = 30_000;

let developerDirPromise: Promise<string> | undefined;
let simctlPromise: Promise<string> | undefined;

/** Pasta `Developer` do Xcode em uso. As Command Line Tools sozinhas não têm simulador. */
export function developerDir(): Promise<string> {
  developerDirPromise ??= resolveDeveloperDir().catch((error: unknown) => {
    // Sem cache do erro: o usuário pode instalar/selecionar o Xcode e tentar de novo.
    developerDirPromise = undefined;
    throw error;
  });
  return developerDirPromise;
}

async function resolveDeveloperDir(): Promise<string> {
  const dir =
    env.DEVELOPER_DIR ??
    (await execFileAsync('xcode-select', ['-p'], { timeout: commandTimeoutMs })).stdout.trim();
  if (!dir || dir.includes('CommandLineTools')) {
    throw new Error(
      'Xcode is required for iOS simulators. Install it and run "sudo xcode-select -s /Applications/Xcode.app".',
    );
  }
  return dir;
}

// O binário direto, e não `xcrun simctl`: matar o `xcrun` deixaria o `simctl` filho vivo.
export function simctlPath(): Promise<string> {
  simctlPromise ??= developerDir()
    .then(async (dir) => {
      const { stdout } = await execFileAsync('xcrun', ['--find', 'simctl'], {
        timeout: commandTimeoutMs,
        env: { ...process.env, DEVELOPER_DIR: dir },
      });
      return stdout.trim();
    })
    .catch((error: unknown) => {
      simctlPromise = undefined;
      throw error;
    });
  return simctlPromise;
}

export async function simctl(
  args: string[],
  { timeoutMs = commandTimeoutMs, signal }: { timeoutMs?: number; signal?: AbortSignal } = {},
): Promise<string> {
  const binary = await simctlPath();
  const { stdout } = await execFileAsync(binary, args, {
    timeout: timeoutMs,
    maxBuffer: 16 * 1024 * 1024,
    ...(signal ? { signal } : {}),
  });
  return stdout;
}

const deviceListSchema = z.object({
  devices: z.record(
    z.string(),
    z.array(
      z.object({
        udid: z.string(),
        name: z.string(),
        state: z.string(),
        isAvailable: z.boolean().optional(),
      }),
    ),
  ),
});

const iosRuntimePrefix = 'com.apple.CoreSimulator.SimRuntime.iOS-';

export async function listSimulators(): Promise<DeviceDescriptor[]> {
  const list = deviceListSchema.parse(
    JSON.parse(await simctl(['list', 'devices', 'available', '-j'])),
  );
  // Runtimes mais novos primeiro; dentro de cada um, a ordem do `simctl`.
  const runtimes = Object.keys(list.devices)
    .filter((runtime) => runtime.startsWith(iosRuntimePrefix))
    .sort((a, b) => runtimeVersion(b).localeCompare(runtimeVersion(a), 'en', { numeric: true }));
  return runtimes.flatMap((runtime) => {
    const version = runtimeVersion(runtime).replaceAll('-', '.');
    return (list.devices[runtime] ?? [])
      .filter((device) => device.isAvailable !== false)
      .map((device) => ({
        id: device.udid,
        name: `${device.name} (iOS ${version})`,
        platform: 'ios' as const,
        running: device.state === 'Booted',
      }));
  });
}

function runtimeVersion(runtime: string): string {
  return runtime.slice(iosRuntimePrefix.length);
}

export async function isBooted(udid: string): Promise<boolean> {
  const simulators = await listSimulators();
  return simulators.some((simulator) => simulator.id === udid && simulator.running);
}

export async function shutdown(udid: string): Promise<void> {
  await simctl(['shutdown', udid], { timeoutMs: 60_000 });
}

export async function pbcopy(udid: string, text: string): Promise<void> {
  const binary = await simctlPath();
  await new Promise<void>((resolve, reject) => {
    const child = execFile(binary, ['pbcopy', udid], { timeout: commandTimeoutMs }, (error) =>
      error ? reject(error) : resolve(),
    );
    child.stdin?.end(text);
  });
}

export async function pbpaste(udid: string): Promise<string> {
  return simctl(['pbpaste', udid]);
}
