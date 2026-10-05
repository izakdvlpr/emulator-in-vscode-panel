import type * as vscode from 'vscode';
import type {
  BiometricAction,
  DeviceDescriptor,
  HardwareButton,
  KeyInput,
  Platform,
  RotateDirection,
  Rotation,
  ScreenSize,
  StartingStep,
  TouchInput,
} from '../../shared/device';

/** Frame RGBA8888 sem padding entre linhas (`data.length === width * height * 4`). */
export interface RgbaFrame {
  kind: 'rgba';
  seq: number;
  width: number;
  height: number;
  rotation: Rotation;
  data: Uint8Array;
}

/** Início de um stream H.264; os chunks seguintes só decodificam com essa config. */
export interface VideoConfig {
  kind: 'h264-config';
  /** String de codec do WebCodecs (`avc1.PPCCLL`). */
  codec: string;
  width: number;
  height: number;
  rotation: Rotation;
}

/** Um access unit em Annex B (com start codes); o primeiro depois da config é keyframe. */
export interface VideoChunk {
  kind: 'h264-chunk';
  key: boolean;
  /** Microssegundos, crescente dentro do stream. */
  timestamp: number;
  data: Uint8Array;
}

export type FrameEvent = RgbaFrame | VideoConfig | VideoChunk;

export interface DeviceExit {
  code: number | null;
  reason: string;
}

/** O que o painel precisa: listar e iniciar, sem saber de qual plataforma é cada device. */
export interface DeviceCatalog {
  listDevices(): Promise<DeviceDescriptor[]>;
  /** Inicia o device, ou anexa a ele se já estiver rodando. */
  start(
    deviceId: string,
    onProgress: (step: StartingStep) => void,
    signal: AbortSignal,
  ): Promise<DeviceSession>;
}

export interface DeviceProvider extends DeviceCatalog {
  readonly platform: Platform;
}

export interface DeviceSession {
  readonly platform: Platform;
  /** Resolução real do device, na orientação natural. */
  readonly screen: ScreenSize;
  /** Anexada a um device que a extensão não iniciou: encerrar só desconecta. */
  readonly attached: boolean;
  readonly onDidExit: vscode.Event<DeviceExit>;
  /** Texto copiado dentro do device. */
  readonly onDidChangeClipboard: vscode.Event<string>;
  /**
   * O device escala o frame para caber em `maxSize`, mantendo o aspect ratio. Com `h264`, tenta
   * vídeo comprimido e cai para RGBA sozinho se não conseguir.
   */
  streamFrames(
    maxSize: ScreenSize,
    options: { h264: boolean },
    onFrame: (event: FrameEvent) => void,
  ): vscode.Disposable;
  touch(input: TouchInput): Promise<void>;
  key(input: KeyInput): Promise<void>;
  pressButton(button: HardwareButton): Promise<void>;
  rotate(direction: RotateDirection): Promise<void>;
  /** Simula digital/Face ID: cadastrar, reconhecer ou rejeitar. */
  biometric(action: BiometricAction): Promise<void>;
  /** PNG na resolução real, na orientação atual. */
  screenshot(): Promise<Uint8Array>;
  /** Coloca o texto no clipboard do device e cola no campo focado. */
  paste(text: string): Promise<void>;
  /** Encerra (ou desconecta) o device. `fast` encurta os timeouts (usado no deactivate). */
  dispose(options?: { fast?: boolean }): Promise<void>;
}
