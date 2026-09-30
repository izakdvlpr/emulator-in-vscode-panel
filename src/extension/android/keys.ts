import type { HardwareButton, KeyInput } from '../../shared/device';
import type { KeyboardEvent } from './generated/android/emulation/control/KeyboardEvent';

const printableAscii = /^[\x20-\x7e]$/;

// O emulador entende os nomes de `KeyboardEvent.key` do DOM (W3C UI Events), inclusive ASCII
// imprimível (com Shift quando precisa). O campo `text` é processado por outro caminho e pode
// ser reordenado em relação a `key` (ex.: Backspace chegando antes da letra anterior), então só
// usamos `text` para o que `key` não cobre — caracteres fora do ASCII, em regime best-effort.
export function toEmulatorKeyEvent(input: KeyInput): KeyboardEvent {
  if (input.text !== undefined && !printableAscii.test(input.text)) return { text: input.text };
  return { eventType: 'keypress', key: input.key };
}

const hardwareButtonKeys: Record<HardwareButton, string> = {
  back: 'GoBack',
  home: 'GoHome',
  recents: 'AppSwitch',
  volumeUp: 'AudioVolumeUp',
  volumeDown: 'AudioVolumeDown',
  power: 'Power',
};

export function toEmulatorButtonEvent(button: HardwareButton): KeyboardEvent {
  return { eventType: 'keypress', key: hardwareButtonKeys[button] };
}

// Tecla dedicada de colar do Android (KEYCODE_PASTE): funciona em qualquer campo de texto, sem
// depender de o app tratar Ctrl+V.
export const pasteKeyEvent: KeyboardEvent = { eventType: 'keypress', key: 'Paste' };
