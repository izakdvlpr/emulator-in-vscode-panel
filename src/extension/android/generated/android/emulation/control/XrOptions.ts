// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_XrOptions_Environment = {
  LIVING_ROOM_DAY: 'LIVING_ROOM_DAY',
  LIVING_ROOM_NIGHT: 'LIVING_ROOM_NIGHT',
} as const;

export type _android_emulation_control_XrOptions_Environment =
  | 'LIVING_ROOM_DAY'
  | 0
  | 'LIVING_ROOM_NIGHT'
  | 1

export type _android_emulation_control_XrOptions_Environment__Output = typeof _android_emulation_control_XrOptions_Environment[keyof typeof _android_emulation_control_XrOptions_Environment]

export interface XrOptions {
  'environment'?: (_android_emulation_control_XrOptions_Environment);
  'passthroughCoefficient'?: (number | string);
  'dimmingValue'?: (number | string);
}

export interface XrOptions__Output {
  'environment': (_android_emulation_control_XrOptions_Environment__Output);
  'passthroughCoefficient': (number);
  'dimmingValue': (number);
}
