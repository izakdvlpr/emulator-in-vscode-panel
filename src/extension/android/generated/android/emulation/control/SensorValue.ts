// Original file: proto/emulator_controller.proto

import type { ParameterValue as _android_emulation_control_ParameterValue, ParameterValue__Output as _android_emulation_control_ParameterValue__Output } from '../../../android/emulation/control/ParameterValue';

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_SensorValue_SensorType = {
  ACCELERATION: 'ACCELERATION',
  GYROSCOPE: 'GYROSCOPE',
  MAGNETIC_FIELD: 'MAGNETIC_FIELD',
  ORIENTATION: 'ORIENTATION',
  TEMPERATURE: 'TEMPERATURE',
  PROXIMITY: 'PROXIMITY',
  LIGHT: 'LIGHT',
  PRESSURE: 'PRESSURE',
  HUMIDITY: 'HUMIDITY',
  MAGNETIC_FIELD_UNCALIBRATED: 'MAGNETIC_FIELD_UNCALIBRATED',
  GYROSCOPE_UNCALIBRATED: 'GYROSCOPE_UNCALIBRATED',
  HEART_RATE: 'HEART_RATE',
  RGBC_LIGHT: 'RGBC_LIGHT',
  ACCELERATION_UNCALIBRATED: 'ACCELERATION_UNCALIBRATED',
  HEADING: 'HEADING',
} as const;

export type _android_emulation_control_SensorValue_SensorType =
  | 'ACCELERATION'
  | 0
  | 'GYROSCOPE'
  | 1
  | 'MAGNETIC_FIELD'
  | 2
  | 'ORIENTATION'
  | 3
  | 'TEMPERATURE'
  | 4
  | 'PROXIMITY'
  | 5
  | 'LIGHT'
  | 6
  | 'PRESSURE'
  | 7
  | 'HUMIDITY'
  | 8
  | 'MAGNETIC_FIELD_UNCALIBRATED'
  | 9
  | 'GYROSCOPE_UNCALIBRATED'
  | 10
  | 'HEART_RATE'
  | 14
  | 'RGBC_LIGHT'
  | 15
  | 'ACCELERATION_UNCALIBRATED'
  | 17
  | 'HEADING'
  | 18

export type _android_emulation_control_SensorValue_SensorType__Output = typeof _android_emulation_control_SensorValue_SensorType[keyof typeof _android_emulation_control_SensorValue_SensorType]

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_SensorValue_State = {
  OK: 'OK',
  NO_SERVICE: 'NO_SERVICE',
  DISABLED: 'DISABLED',
  UNKNOWN: 'UNKNOWN',
} as const;

export type _android_emulation_control_SensorValue_State =
  | 'OK'
  | 0
  | 'NO_SERVICE'
  | -3
  | 'DISABLED'
  | -2
  | 'UNKNOWN'
  | -1

export type _android_emulation_control_SensorValue_State__Output = typeof _android_emulation_control_SensorValue_State[keyof typeof _android_emulation_control_SensorValue_State]

export interface SensorValue {
  'target'?: (_android_emulation_control_SensorValue_SensorType);
  'status'?: (_android_emulation_control_SensorValue_State);
  'value'?: (_android_emulation_control_ParameterValue | null);
}

export interface SensorValue__Output {
  'target': (_android_emulation_control_SensorValue_SensorType__Output);
  'status': (_android_emulation_control_SensorValue_State__Output);
  'value': (_android_emulation_control_ParameterValue__Output | null);
}
