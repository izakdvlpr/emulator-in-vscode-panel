import { z } from 'zod';

export type Platform = 'android' | 'ios';

export interface DeviceDescriptor {
  id: string;
  name: string;
  platform: Platform;
  /** Já está rodando fora da extensão: o Start anexa em vez de iniciar outro. */
  running: boolean;
}

export interface ScreenSize {
  width: number;
  height: number;
}

/**
 * Quantos giros de 90° no sentido anti-horário a imagem tem em relação à orientação natural
 * do device: 0 retrato, 1 paisagem, 2 retrato invertido, 3 paisagem invertida.
 */
export type Rotation = 0 | 1 | 2 | 3;

export type StartingStep = 'launching' | 'connecting' | 'booting';

/** Uma aba do painel = um device iniciado, anexado ou que falhou. */
export type TabState =
  | { kind: 'starting'; deviceId: string; step: StartingStep }
  | { kind: 'ready'; deviceId: string; platform: Platform; screen: ScreenSize; attached: boolean }
  // `platform` fica indefinido quando o Stop chega antes de o device ficar pronto.
  | { kind: 'stopping'; deviceId: string; platform: Platform | undefined; attached: boolean }
  | { kind: 'error'; deviceId: string; message: string };

export interface PanelState {
  tabs: TabState[];
  /** Só a aba ativa recebe stream e input. */
  activeId: string | undefined;
}

export const hardwareButtonSchema = z.enum([
  'back',
  'home',
  'recents',
  'volumeUp',
  'volumeDown',
  'power',
]);
export type HardwareButton = z.infer<typeof hardwareButtonSchema>;

export const rotateDirectionSchema = z.enum(['left', 'right']);
export type RotateDirection = z.infer<typeof rotateDirectionSchema>;

// `enroll` só existe no iOS: no Android o cadastro é feito pelo Settings, tocando o sensor com
// `match`.
export const biometricActionSchema = z.enum(['enroll', 'match', 'noMatch']);
export type BiometricAction = z.infer<typeof biometricActionSchema>;

export const touchPhaseSchema = z.enum(['down', 'move', 'up']);
export type TouchPhase = z.infer<typeof touchPhaseSchema>;

/** Coordenadas normalizadas (0..1) na orientação natural do device. */
export interface TouchInput {
  phase: TouchPhase;
  x: number;
  y: number;
  /** Pinch: um segundo dedo espelhado em relação ao centro da tela. */
  mirror: boolean;
}

/**
 * `key` segue os valores de `KeyboardEvent.key` do DOM. Quando `text` vem preenchido,
 * o device deve digitar o texto em vez de simular a tecla.
 */
export interface KeyInput {
  key: string;
  text?: string;
}
