// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_VmRunState_RunState = {
  UNKNOWN: 'UNKNOWN',
  RUNNING: 'RUNNING',
  RESTORE_VM: 'RESTORE_VM',
  PAUSED: 'PAUSED',
  SAVE_VM: 'SAVE_VM',
  SHUTDOWN: 'SHUTDOWN',
  TERMINATE: 'TERMINATE',
  RESET: 'RESET',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RESTART: 'RESTART',
  START: 'START',
  STOP: 'STOP',
} as const;

export type _android_emulation_control_VmRunState_RunState =
  | 'UNKNOWN'
  | 0
  | 'RUNNING'
  | 1
  | 'RESTORE_VM'
  | 2
  | 'PAUSED'
  | 3
  | 'SAVE_VM'
  | 4
  | 'SHUTDOWN'
  | 5
  | 'TERMINATE'
  | 7
  | 'RESET'
  | 9
  | 'INTERNAL_ERROR'
  | 10
  | 'RESTART'
  | 11
  | 'START'
  | 12
  | 'STOP'
  | 13

export type _android_emulation_control_VmRunState_RunState__Output = typeof _android_emulation_control_VmRunState_RunState[keyof typeof _android_emulation_control_VmRunState_RunState]

export interface VmRunState {
  'state'?: (_android_emulation_control_VmRunState_RunState);
}

export interface VmRunState__Output {
  'state': (_android_emulation_control_VmRunState_RunState__Output);
}
