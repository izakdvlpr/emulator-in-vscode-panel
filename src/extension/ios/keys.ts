import type { KeyInput } from '../../shared/device';

/** Tecla na página Keyboard (0x07) do HID, com os modificadores a segurar junto. */
export interface HidKey {
  usage: number;
  modifiers: number[];
}

export const leftShift = 0xe1;
export const leftGui = 0xe3;

// O simulador recebe teclas físicas, não texto: cada caractere vira a tecla do layout US que o
// produz. Por isso só ASCII imprimível tem mapeamento; o resto chega colando.
const unshifted = new Map<string, number>([
  [' ', 0x2c],
  ['-', 0x2d],
  ['=', 0x2e],
  ['[', 0x2f],
  [']', 0x30],
  ['\\', 0x31],
  [';', 0x33],
  ["'", 0x34],
  ['`', 0x35],
  [',', 0x36],
  ['.', 0x37],
  ['/', 0x38],
]);

const shifted = new Map<string, number>([
  ['!', 0x1e],
  ['@', 0x1f],
  ['#', 0x20],
  ['$', 0x21],
  ['%', 0x22],
  ['^', 0x23],
  ['&', 0x24],
  ['*', 0x25],
  ['(', 0x26],
  [')', 0x27],
  ['_', 0x2d],
  ['+', 0x2e],
  ['{', 0x2f],
  ['}', 0x30],
  ['|', 0x31],
  [':', 0x33],
  ['"', 0x34],
  ['~', 0x35],
  ['<', 0x36],
  ['>', 0x37],
  ['?', 0x38],
]);

const special = new Map<string, number>([
  ['Enter', 0x28],
  ['Escape', 0x29],
  ['Backspace', 0x2a],
  ['Tab', 0x2b],
  ['Home', 0x4a],
  ['PageUp', 0x4b],
  ['Delete', 0x4c],
  ['End', 0x4d],
  ['PageDown', 0x4e],
  ['ArrowRight', 0x4f],
  ['ArrowLeft', 0x50],
  ['ArrowDown', 0x51],
  ['ArrowUp', 0x52],
]);

export function toHidKey({ key }: KeyInput): HidKey | undefined {
  const specialUsage = special.get(key);
  if (specialUsage !== undefined) return { usage: specialUsage, modifiers: [] };
  if (key.length !== 1) return undefined;

  const code = key.charCodeAt(0);
  if (key >= 'a' && key <= 'z') return { usage: 0x04 + code - 0x61, modifiers: [] };
  if (key >= 'A' && key <= 'Z') return { usage: 0x04 + code - 0x41, modifiers: [leftShift] };
  // No HID o 0 vem depois do 9.
  if (key >= '1' && key <= '9') return { usage: 0x1e + code - 0x31, modifiers: [] };
  if (key === '0') return { usage: 0x27, modifiers: [] };

  const plain = unshifted.get(key);
  if (plain !== undefined) return { usage: plain, modifiers: [] };
  const withShift = shifted.get(key);
  if (withShift !== undefined) return { usage: withShift, modifiers: [leftShift] };
  return undefined;
}

/** Cmd+V: cola o que o `simctl pbcopy` acabou de gravar. */
export const pasteKey: HidKey = { usage: 0x19, modifiers: [leftGui] };
