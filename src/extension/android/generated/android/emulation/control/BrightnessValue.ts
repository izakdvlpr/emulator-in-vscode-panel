// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_BrightnessValue_LightType = {
  LCD: 'LCD',
  KEYBOARD: 'KEYBOARD',
  BUTTON: 'BUTTON',
} as const;

export type _android_emulation_control_BrightnessValue_LightType =
  | 'LCD'
  | 0
  | 'KEYBOARD'
  | 1
  | 'BUTTON'
  | 2

export type _android_emulation_control_BrightnessValue_LightType__Output = typeof _android_emulation_control_BrightnessValue_LightType[keyof typeof _android_emulation_control_BrightnessValue_LightType]

export interface BrightnessValue {
  'target'?: (_android_emulation_control_BrightnessValue_LightType);
  'value'?: (number);
}

export interface BrightnessValue__Output {
  'target': (_android_emulation_control_BrightnessValue_LightType__Output);
  'value': (number);
}
