// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_Rotation_SkinRotation = {
  PORTRAIT: 'PORTRAIT',
  LANDSCAPE: 'LANDSCAPE',
  REVERSE_PORTRAIT: 'REVERSE_PORTRAIT',
  REVERSE_LANDSCAPE: 'REVERSE_LANDSCAPE',
} as const;

export type _android_emulation_control_Rotation_SkinRotation =
  | 'PORTRAIT'
  | 0
  | 'LANDSCAPE'
  | 1
  | 'REVERSE_PORTRAIT'
  | 2
  | 'REVERSE_LANDSCAPE'
  | 3

export type _android_emulation_control_Rotation_SkinRotation__Output = typeof _android_emulation_control_Rotation_SkinRotation[keyof typeof _android_emulation_control_Rotation_SkinRotation]

export interface Rotation {
  'rotation'?: (_android_emulation_control_Rotation_SkinRotation);
  'xAxis'?: (number | string);
  'yAxis'?: (number | string);
  'zAxis'?: (number | string);
}

export interface Rotation__Output {
  'rotation': (_android_emulation_control_Rotation_SkinRotation__Output);
  'xAxis': (number);
  'yAxis': (number);
  'zAxis': (number);
}
