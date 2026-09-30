// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_XrCommand_Action = {
  RECENTER: 'RECENTER',
} as const;

export type _android_emulation_control_XrCommand_Action =
  | 'RECENTER'
  | 0

export type _android_emulation_control_XrCommand_Action__Output = typeof _android_emulation_control_XrCommand_Action[keyof typeof _android_emulation_control_XrCommand_Action]

export interface XrCommand {
  'action'?: (_android_emulation_control_XrCommand_Action);
}

export interface XrCommand__Output {
  'action': (_android_emulation_control_XrCommand_Action__Output);
}
