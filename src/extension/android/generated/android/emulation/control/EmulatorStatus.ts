// Original file: proto/emulator_controller.proto

import type { VmConfiguration as _android_emulation_control_VmConfiguration, VmConfiguration__Output as _android_emulation_control_VmConfiguration__Output } from '../../../android/emulation/control/VmConfiguration';
import type { EntryList as _android_emulation_control_EntryList, EntryList__Output as _android_emulation_control_EntryList__Output } from '../../../android/emulation/control/EntryList';
import type { Long } from '@grpc/proto-loader';

export interface EmulatorStatus {
  'version'?: (string);
  'uptime'?: (number | string | Long);
  'booted'?: (boolean);
  'vmConfig'?: (_android_emulation_control_VmConfiguration | null);
  'hardwareConfig'?: (_android_emulation_control_EntryList | null);
  'heartbeat'?: (number | string | Long);
  'guestConfig'?: ({[key: string]: string});
  'platformConfig'?: ({[key: string]: string});
}

export interface EmulatorStatus__Output {
  'version': (string);
  'uptime': (number);
  'booted': (boolean);
  'vmConfig': (_android_emulation_control_VmConfiguration__Output | null);
  'hardwareConfig': (_android_emulation_control_EntryList__Output | null);
  'heartbeat': (number);
  'guestConfig': ({[key: string]: string});
  'platformConfig': ({[key: string]: string});
}
