// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_BatteryState_BatteryCharger = {
  NONE: 'NONE',
  AC: 'AC',
  USB: 'USB',
  WIRELESS: 'WIRELESS',
} as const;

export type _android_emulation_control_BatteryState_BatteryCharger =
  | 'NONE'
  | 0
  | 'AC'
  | 1
  | 'USB'
  | 2
  | 'WIRELESS'
  | 3

export type _android_emulation_control_BatteryState_BatteryCharger__Output = typeof _android_emulation_control_BatteryState_BatteryCharger[keyof typeof _android_emulation_control_BatteryState_BatteryCharger]

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_BatteryState_BatteryHealth = {
  GOOD: 'GOOD',
  FAILED: 'FAILED',
  DEAD: 'DEAD',
  OVERVOLTAGE: 'OVERVOLTAGE',
  OVERHEATED: 'OVERHEATED',
} as const;

export type _android_emulation_control_BatteryState_BatteryHealth =
  | 'GOOD'
  | 0
  | 'FAILED'
  | 1
  | 'DEAD'
  | 2
  | 'OVERVOLTAGE'
  | 3
  | 'OVERHEATED'
  | 4

export type _android_emulation_control_BatteryState_BatteryHealth__Output = typeof _android_emulation_control_BatteryState_BatteryHealth[keyof typeof _android_emulation_control_BatteryState_BatteryHealth]

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_BatteryState_BatteryStatus = {
  UNKNOWN: 'UNKNOWN',
  CHARGING: 'CHARGING',
  DISCHARGING: 'DISCHARGING',
  NOT_CHARGING: 'NOT_CHARGING',
  FULL: 'FULL',
} as const;

export type _android_emulation_control_BatteryState_BatteryStatus =
  | 'UNKNOWN'
  | 0
  | 'CHARGING'
  | 1
  | 'DISCHARGING'
  | 2
  | 'NOT_CHARGING'
  | 3
  | 'FULL'
  | 4

export type _android_emulation_control_BatteryState_BatteryStatus__Output = typeof _android_emulation_control_BatteryState_BatteryStatus[keyof typeof _android_emulation_control_BatteryState_BatteryStatus]

export interface BatteryState {
  'hasBattery'?: (boolean);
  'isPresent'?: (boolean);
  'charger'?: (_android_emulation_control_BatteryState_BatteryCharger);
  'chargeLevel'?: (number);
  'health'?: (_android_emulation_control_BatteryState_BatteryHealth);
  'status'?: (_android_emulation_control_BatteryState_BatteryStatus);
}

export interface BatteryState__Output {
  'hasBattery': (boolean);
  'isPresent': (boolean);
  'charger': (_android_emulation_control_BatteryState_BatteryCharger__Output);
  'chargeLevel': (number);
  'health': (_android_emulation_control_BatteryState_BatteryHealth__Output);
  'status': (_android_emulation_control_BatteryState_BatteryStatus__Output);
}
