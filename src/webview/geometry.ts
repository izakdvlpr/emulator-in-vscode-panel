import type { Rotation } from '../shared/device';

export interface Point {
  x: number;
  y: number;
}

/**
 * Converte a posição do ponteiro em coordenadas normalizadas da imagem, descontando o
 * letterbox que o `object-fit: contain` cria dentro do canvas. Fora da imagem, os valores
 * saem de 0..1.
 */
function imagePoint(canvas: HTMLCanvasElement, clientX: number, clientY: number): Point | null {
  const rect = canvas.getBoundingClientRect();
  if (canvas.width === 0 || canvas.height === 0 || rect.width === 0 || rect.height === 0) {
    return null;
  }
  const scale = Math.min(rect.width / canvas.width, rect.height / canvas.height);
  const imageWidth = canvas.width * scale;
  const imageHeight = canvas.height * scale;
  return {
    x: (clientX - rect.left - (rect.width - imageWidth) / 2) / imageWidth,
    y: (clientY - rect.top - (rect.height - imageHeight) / 2) / imageHeight,
  };
}

/** `null` quando o ponto cai fora da imagem (ex.: no letterbox). */
export function toNormalizedPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
): Point | null {
  const point = imagePoint(canvas, clientX, clientY);
  if (!point || point.x < 0 || point.x > 1 || point.y < 0 || point.y > 1) return null;
  return point;
}

/** Para arrastes que saem da imagem: prende o ponto na borda mais próxima. */
export function toClampedPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
): Point | null {
  const point = imagePoint(canvas, clientX, clientY);
  if (!point) return null;
  return { x: clamp01(point.x), y: clamp01(point.y) };
}

/**
 * A imagem chega girada; o toque vai em coordenadas da orientação natural do device.
 * `rotation` é a quantidade de giros anti-horários da imagem.
 */
export function toNaturalPoint({ x, y }: Point, rotation: Rotation): Point {
  switch (rotation) {
    case 0:
      return { x, y };
    case 1:
      return { x: 1 - y, y: x };
    case 2:
      return { x: 1 - x, y: 1 - y };
    case 3:
      return { x: y, y: 1 - x };
  }
}

function clamp01(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}
