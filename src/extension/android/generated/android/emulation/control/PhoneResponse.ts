// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_PhoneResponse_Response = {
  OK: 'OK',
  BadOperation: 'BadOperation',
  BadNumber: 'BadNumber',
  InvalidAction: 'InvalidAction',
  ActionFailed: 'ActionFailed',
  RadioOff: 'RadioOff',
} as const;

export type _android_emulation_control_PhoneResponse_Response =
  | 'OK'
  | 0
  | 'BadOperation'
  | 1
  | 'BadNumber'
  | 2
  | 'InvalidAction'
  | 3
  | 'ActionFailed'
  | 4
  | 'RadioOff'
  | 5

export type _android_emulation_control_PhoneResponse_Response__Output = typeof _android_emulation_control_PhoneResponse_Response[keyof typeof _android_emulation_control_PhoneResponse_Response]

export interface PhoneResponse {
  'response'?: (_android_emulation_control_PhoneResponse_Response);
}

export interface PhoneResponse__Output {
  'response': (_android_emulation_control_PhoneResponse_Response__Output);
}
