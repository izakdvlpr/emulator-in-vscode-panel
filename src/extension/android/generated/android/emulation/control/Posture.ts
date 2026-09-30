// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_Posture_PostureValue = {
  POSTURE_UNKNOWN: 'POSTURE_UNKNOWN',
  POSTURE_CLOSED: 'POSTURE_CLOSED',
  POSTURE_HALF_OPENED: 'POSTURE_HALF_OPENED',
  POSTURE_OPENED: 'POSTURE_OPENED',
  POSTURE_FLIPPED: 'POSTURE_FLIPPED',
  POSTURE_TENT: 'POSTURE_TENT',
  POSTURE_MAX: 'POSTURE_MAX',
} as const;

export type _android_emulation_control_Posture_PostureValue =
  | 'POSTURE_UNKNOWN'
  | 0
  | 'POSTURE_CLOSED'
  | 1
  | 'POSTURE_HALF_OPENED'
  | 2
  | 'POSTURE_OPENED'
  | 3
  | 'POSTURE_FLIPPED'
  | 4
  | 'POSTURE_TENT'
  | 5
  | 'POSTURE_MAX'
  | 6

export type _android_emulation_control_Posture_PostureValue__Output = typeof _android_emulation_control_Posture_PostureValue[keyof typeof _android_emulation_control_Posture_PostureValue]

export interface Posture {
  'value'?: (_android_emulation_control_Posture_PostureValue);
}

export interface Posture__Output {
  'value': (_android_emulation_control_Posture_PostureValue__Output);
}
