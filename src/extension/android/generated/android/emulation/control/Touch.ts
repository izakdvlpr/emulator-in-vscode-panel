// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_Touch_EventExpiration = {
  EVENT_EXPIRATION_UNSPECIFIED: 'EVENT_EXPIRATION_UNSPECIFIED',
  NEVER_EXPIRE: 'NEVER_EXPIRE',
} as const;

export type _android_emulation_control_Touch_EventExpiration =
  | 'EVENT_EXPIRATION_UNSPECIFIED'
  | 0
  | 'NEVER_EXPIRE'
  | 1

export type _android_emulation_control_Touch_EventExpiration__Output = typeof _android_emulation_control_Touch_EventExpiration[keyof typeof _android_emulation_control_Touch_EventExpiration]

export interface Touch {
  'x'?: (number);
  'y'?: (number);
  'identifier'?: (number);
  'pressure'?: (number);
  'touchMajor'?: (number);
  'touchMinor'?: (number);
  'expiration'?: (_android_emulation_control_Touch_EventExpiration);
  'orientation'?: (number);
}

export interface Touch__Output {
  'x': (number);
  'y': (number);
  'identifier': (number);
  'pressure': (number);
  'touchMajor': (number);
  'touchMinor': (number);
  'expiration': (_android_emulation_control_Touch_EventExpiration__Output);
  'orientation': (number);
}
