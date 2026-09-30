// Original file: proto/emulator_controller.proto

import type { Touch as _android_emulation_control_Touch, Touch__Output as _android_emulation_control_Touch__Output } from '../../../android/emulation/control/Touch';

export interface TouchEvent {
  'touches'?: (_android_emulation_control_Touch)[];
  'display'?: (number);
}

export interface TouchEvent__Output {
  'touches': (_android_emulation_control_Touch__Output)[];
  'display': (number);
}
