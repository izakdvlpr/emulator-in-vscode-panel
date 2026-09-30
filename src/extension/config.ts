import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import * as vscode from 'vscode';
import { z } from 'zod';
import { env } from './env';

export interface ExtensionConfig {
  sdkPath: string;
  grpcPort: number;
  videoCodec: VideoCodec;
}

// Valor inválido no settings.json cai no padrão em vez de quebrar o painel.
const videoCodecSchema = z.enum(['h264', 'rgba']).catch('h264');
export type VideoCodec = z.infer<typeof videoCodecSchema>;

export function readConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration('emulatorPanel');
  return {
    sdkPath: resolveSdkPath(config.get<string>('androidSdkPath', '')),
    grpcPort: config.get<number>('grpcPort', 8654),
    videoCodec: videoCodecSchema.parse(config.get<unknown>('videoCodec')),
  };
}

function resolveSdkPath(configured: string): string {
  const candidates = [
    expandHome(configured.trim()),
    env.ANDROID_HOME,
    env.ANDROID_SDK_ROOT,
    platformDefaultSdkPath(),
  ].filter((path): path is string => Boolean(path));

  const found = candidates.find((path) => existsSync(join(path, 'emulator')));
  if (!found) {
    throw new Error(
      'Android SDK not found. Set "emulatorPanel.androidSdkPath" or the ANDROID_HOME environment variable.',
    );
  }
  return found;
}

function platformDefaultSdkPath(): string | undefined {
  switch (process.platform) {
    case 'darwin':
      return join(homedir(), 'Library', 'Android', 'sdk');
    case 'win32':
      return env.LOCALAPPDATA && join(env.LOCALAPPDATA, 'Android', 'Sdk');
    default:
      return join(homedir(), 'Android', 'Sdk');
  }
}

function expandHome(path: string): string {
  return path.startsWith('~') ? join(homedir(), path.slice(1)) : path;
}
