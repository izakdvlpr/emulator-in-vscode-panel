import { type ChildProcess, execFile, spawn } from 'node:child_process';
import { join } from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface Adb {
  binary: string;
  serial: string;
}

export function adbFor(sdkPath: string, consolePort: number): Adb {
  return {
    binary: join(sdkPath, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb'),
    serial: `emulator-${consolePort}`,
  };
}

/**
 * Roda um script no shell do device. O `wait-for-device` cobre a janela em que o gRPC já diz
 * que bootou, mas o adb ainda vê o device como offline.
 */
export async function adbShell(
  adb: Adb,
  script: string,
  options: { timeoutMs: number; signal?: AbortSignal },
): Promise<string> {
  const { stdout } = await execFileAsync(
    adb.binary,
    ['-s', adb.serial, 'wait-for-device', 'shell', script],
    { timeout: options.timeoutMs, ...(options.signal ? { signal: options.signal } : {}) },
  );
  return stdout;
}

/** Processo de longa duração. Com `exec-out` o stdout é binário cru, sem conversão de `\n`. */
export function spawnAdb(adb: Adb, mode: 'shell' | 'exec-out', script: string): ChildProcess {
  return spawn(adb.binary, ['-s', adb.serial, mode, script], {
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

// Matar o adb no host não mata o processo no device na hora (o screenrecord segue uns
// segundos gravando para lugar nenhum), então o pid remoto é morto explicitamente.
export function killRemote(adb: Adb, pids: number[]): void {
  const safe = pids.filter((pid) => Number.isInteger(pid) && pid > 1);
  if (safe.length === 0) return;
  execFile(adb.binary, ['-s', adb.serial, 'shell', `kill ${safe.join(' ')}`], () => {});
}
