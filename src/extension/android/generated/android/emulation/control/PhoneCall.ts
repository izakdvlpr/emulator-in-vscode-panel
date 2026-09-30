// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_PhoneCall_Operation = {
  InitCall: 'InitCall',
  AcceptCall: 'AcceptCall',
  RejectCallExplicit: 'RejectCallExplicit',
  RejectCallBusy: 'RejectCallBusy',
  DisconnectCall: 'DisconnectCall',
  PlaceCallOnHold: 'PlaceCallOnHold',
  TakeCallOffHold: 'TakeCallOffHold',
} as const;

export type _android_emulation_control_PhoneCall_Operation =
  | 'InitCall'
  | 0
  | 'AcceptCall'
  | 1
  | 'RejectCallExplicit'
  | 2
  | 'RejectCallBusy'
  | 3
  | 'DisconnectCall'
  | 4
  | 'PlaceCallOnHold'
  | 5
  | 'TakeCallOffHold'
  | 6

export type _android_emulation_control_PhoneCall_Operation__Output = typeof _android_emulation_control_PhoneCall_Operation[keyof typeof _android_emulation_control_PhoneCall_Operation]

export interface PhoneCall {
  'operation'?: (_android_emulation_control_PhoneCall_Operation);
  'number'?: (string);
}

export interface PhoneCall__Output {
  'operation': (_android_emulation_control_PhoneCall_Operation__Output);
  'number': (string);
}
