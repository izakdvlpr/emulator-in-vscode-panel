// Original file: proto/emulator_controller.proto

import type { Touch as _android_emulation_control_Touch, Touch__Output as _android_emulation_control_Touch__Output } from '../../../android/emulation/control/Touch';

export interface Pen {
  'location'?: (_android_emulation_control_Touch | null);
  'buttonPressed'?: (boolean);
  'rubberPointer'?: (boolean);
}

export interface Pen__Output {
  'location': (_android_emulation_control_Touch__Output | null);
  'buttonPressed': (boolean);
  'rubberPointer': (boolean);
}
