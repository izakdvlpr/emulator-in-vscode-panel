// Original file: proto/emulator_controller.proto

import type { DisplayConfiguration as _android_emulation_control_DisplayConfiguration, DisplayConfiguration__Output as _android_emulation_control_DisplayConfiguration__Output } from '../../../android/emulation/control/DisplayConfiguration';

export interface DisplayConfigurations {
  'displays'?: (_android_emulation_control_DisplayConfiguration)[];
  'userConfigurable'?: (number);
  'maxDisplays'?: (number);
}

export interface DisplayConfigurations__Output {
  'displays': (_android_emulation_control_DisplayConfiguration__Output)[];
  'userConfigurable': (number);
  'maxDisplays': (number);
}
