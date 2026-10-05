import { z } from 'zod';
import {
  biometricActionSchema,
  type DeviceDescriptor,
  hardwareButtonSchema,
  type PanelState,
  type Rotation,
  rotateDirectionSchema,
  touchPhaseSchema,
} from './device';

const unit = z.number().min(0).max(1);

export const webviewToHostSchema = z.discriminatedUnion('type', [
  // `h264`: a webview consegue decodificar H.264 com WebCodecs.
  z.object({ type: z.literal('ready'), h264: z.boolean() }),
  z.object({ type: z.literal('refreshDevices') }),
  z.object({ type: z.literal('start'), deviceId: z.string().min(1) }),
  // Na aba com erro, fecha a aba.
  z.object({ type: z.literal('stop'), deviceId: z.string().min(1) }),
  z.object({ type: z.literal('selectTab'), deviceId: z.string().min(1) }),
  z.object({
    type: z.literal('viewport'),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  z.object({ type: z.literal('frameAck'), seq: z.number().int().nonnegative() }),
  // O decoder perdeu o fio (erro ou fila cheia) e precisa de um keyframe novo.
  z.object({ type: z.literal('videoReset') }),
  // O decoder não aceitou o stream; o host passa a mandar RGBA.
  z.object({ type: z.literal('videoUnsupported') }),
  z.object({
    type: z.literal('touch'),
    phase: touchPhaseSchema,
    x: unit,
    y: unit,
    mirror: z.boolean(),
  }),
  z.object({ type: z.literal('key'), key: z.string().min(1), text: z.string().min(1).optional() }),
  z.object({ type: z.literal('button'), button: hardwareButtonSchema }),
  z.object({ type: z.literal('rotate'), direction: rotateDirectionSchema }),
  z.object({ type: z.literal('biometric'), action: biometricActionSchema }),
  z.object({ type: z.literal('screenshot') }),
  z.object({ type: z.literal('paste') }),
  z.object({ type: z.literal('logs') }),
]);

export type WebviewToHost = z.infer<typeof webviewToHostSchema>;

export type HostToWebview =
  | { type: 'devices'; devices: DeviceDescriptor[]; error?: string }
  | { type: 'state'; state: PanelState }
  // A aba ativa mudou: a imagem do device anterior não pode ficar na tela.
  | { type: 'clearScreen' }
  | {
      type: 'frame';
      seq: number;
      width: number;
      height: number;
      rotation: Rotation;
      data: Uint8Array;
    }
  | { type: 'videoConfig'; codec: string; width: number; height: number; rotation: Rotation }
  | { type: 'videoChunk'; key: boolean; timestamp: number; data: Uint8Array };
