// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_KeyboardEvent_KeyCodeType = {
  Usb: 'Usb',
  Evdev: 'Evdev',
  XKB: 'XKB',
  Win: 'Win',
  Mac: 'Mac',
} as const;

export type _android_emulation_control_KeyboardEvent_KeyCodeType =
  | 'Usb'
  | 0
  | 'Evdev'
  | 1
  | 'XKB'
  | 2
  | 'Win'
  | 3
  | 'Mac'
  | 4

export type _android_emulation_control_KeyboardEvent_KeyCodeType__Output = typeof _android_emulation_control_KeyboardEvent_KeyCodeType[keyof typeof _android_emulation_control_KeyboardEvent_KeyCodeType]

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_KeyboardEvent_KeyEventType = {
  keydown: 'keydown',
  keyup: 'keyup',
  keypress: 'keypress',
} as const;

export type _android_emulation_control_KeyboardEvent_KeyEventType =
  | 'keydown'
  | 0
  | 'keyup'
  | 1
  | 'keypress'
  | 2

export type _android_emulation_control_KeyboardEvent_KeyEventType__Output = typeof _android_emulation_control_KeyboardEvent_KeyEventType[keyof typeof _android_emulation_control_KeyboardEvent_KeyEventType]

export interface KeyboardEvent {
  'codeType'?: (_android_emulation_control_KeyboardEvent_KeyCodeType);
  'eventType'?: (_android_emulation_control_KeyboardEvent_KeyEventType);
  'keyCode'?: (number);
  'key'?: (string);
  'text'?: (string);
}

export interface KeyboardEvent__Output {
  'codeType': (_android_emulation_control_KeyboardEvent_KeyCodeType__Output);
  'eventType': (_android_emulation_control_KeyboardEvent_KeyEventType__Output);
  'keyCode': (number);
  'key': (string);
  'text': (string);
}
