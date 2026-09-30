import { readdir, readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { env } from '../env';

/** Conteúdo relevante de `pid_<pid>.ini`, escrito pelo emulador quando o gRPC sobe. */
export interface EmulatorDiscovery {
  pid: number;
  avdId: string;
  grpcPort: number;
  // Porta do console; o serial do adb é `emulator-<porta>`.
  consolePort: number | undefined;
  grpcToken: string | undefined;
}

// O diretório mudou entre versões do emulador; procuramos em todos os conhecidos.
function discoveryDirs(): string[] {
  const dirs: string[] = [];
  if (process.platform === 'darwin') {
    dirs.push(join(homedir(), 'Library', 'Caches', 'TemporaryItems', 'avd', 'running'));
  } else if (process.platform === 'win32') {
    if (env.LOCALAPPDATA) dirs.push(join(env.LOCALAPPDATA, 'Temp', 'avd', 'running'));
  } else if (env.XDG_RUNTIME_DIR) {
    dirs.push(join(env.XDG_RUNTIME_DIR, 'avd', 'running'));
  }
  dirs.push(join(homedir(), '.android', 'avd', 'running'));
  return dirs;
}

export async function findRunningEmulators(): Promise<EmulatorDiscovery[]> {
  const found: EmulatorDiscovery[] = [];
  for (const dir of discoveryDirs()) {
    const files = await readdir(dir).catch(() => []);
    for (const file of files) {
      if (!/^pid_\d+\.ini$/.test(file)) continue;
      const text = await readFile(join(dir, file), 'utf8').catch(() => undefined);
      const discovery = text && parseDiscovery(text, file);
      if (discovery && isProcessAlive(discovery.pid)) found.push(discovery);
    }
  }
  return found;
}

function parseDiscovery(text: string, fileName: string): EmulatorDiscovery | undefined {
  const values = new Map<string, string>();
  for (const line of text.split(/\r?\n/)) {
    const separator = line.indexOf('=');
    if (separator > 0)
      values.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
  }
  const pid = Number(fileName.match(/\d+/)?.[0]);
  const grpcPort = Number(values.get('grpc.port'));
  const avdId = values.get('avd.id');
  if (!Number.isInteger(pid) || !Number.isInteger(grpcPort) || !avdId) return undefined;
  const consolePort = Number(values.get('port.serial'));
  return {
    pid,
    avdId,
    grpcPort,
    consolePort: Number.isInteger(consolePort) ? consolePort : undefined,
    grpcToken: values.get('grpc.token'),
  };
}

// Arquivos de emuladores que morreram sem limpar ficam para trás.
export function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM';
  }
}
