// Original file: proto/emulator_controller.proto

import type { Touch as _android_emulation_control_Touch, Touch__Output as _android_emulation_control_Touch__Output } from '../../../android/emulation/control/Touch';

export interface TouchpadEvent {
  'touches'?: (_android_emulation_control_Touch)[];
  'touchpad'?: (number);
}

export interface TouchpadEvent__Output {
  'touches': (_android_emulation_control_Touch__Output)[];
  'touchpad': (number);
}
