// Original file: proto/emulator_controller.proto

import type { ParameterValue as _android_emulation_control_ParameterValue, ParameterValue__Output as _android_emulation_control_ParameterValue__Output } from '../../../android/emulation/control/ParameterValue';

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_PhysicalModelValue_Interpolation = {
  SMOOTH: 'SMOOTH',
  STEP: 'STEP',
} as const;

export type _android_emulation_control_PhysicalModelValue_Interpolation =
  | 'SMOOTH'
  | 0
  | 'STEP'
  | 1

export type _android_emulation_control_PhysicalModelValue_Interpolation__Output = typeof _android_emulation_control_PhysicalModelValue_Interpolation[keyof typeof _android_emulation_control_PhysicalModelValue_Interpolation]

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_PhysicalModelValue_PhysicalType = {
  POSITION: 'POSITION',
  ROTATION: 'ROTATION',
  MAGNETIC_FIELD: 'MAGNETIC_FIELD',
  TEMPERATURE: 'TEMPERATURE',
  PROXIMITY: 'PROXIMITY',
  LIGHT: 'LIGHT',
  PRESSURE: 'PRESSURE',
  HUMIDITY: 'HUMIDITY',
  VELOCITY: 'VELOCITY',
  AMBIENT_MOTION: 'AMBIENT_MOTION',
  HINGE_ANGLE0: 'HINGE_ANGLE0',
  HINGE_ANGLE1: 'HINGE_ANGLE1',
  HINGE_ANGLE2: 'HINGE_ANGLE2',
  ROLLABLE0: 'ROLLABLE0',
  ROLLABLE1: 'ROLLABLE1',
  ROLLABLE2: 'ROLLABLE2',
  POSTURE: 'POSTURE',
  HEART_RATE: 'HEART_RATE',
  RGBC_LIGHT: 'RGBC_LIGHT',
  WRIST_TILT: 'WRIST_TILT',
} as const;

export type _android_emulation_control_PhysicalModelValue_PhysicalType =
  | 'POSITION'
  | 0
  | 'ROTATION'
  | 1
  | 'MAGNETIC_FIELD'
  | 2
  | 'TEMPERATURE'
  | 3
  | 'PROXIMITY'
  | 4
  | 'LIGHT'
  | 5
  | 'PRESSURE'
  | 6
  | 'HUMIDITY'
  | 7
  | 'VELOCITY'
  | 8
  | 'AMBIENT_MOTION'
  | 9
  | 'HINGE_ANGLE0'
  | 10
  | 'HINGE_ANGLE1'
  | 11
  | 'HINGE_ANGLE2'
  | 12
  | 'ROLLABLE0'
  | 13
  | 'ROLLABLE1'
  | 14
  | 'ROLLABLE2'
  | 15
  | 'POSTURE'
  | 16
  | 'HEART_RATE'
  | 17
  | 'RGBC_LIGHT'
  | 18
  | 'WRIST_TILT'
  | 19

export type _android_emulation_control_PhysicalModelValue_PhysicalType__Output = typeof _android_emulation_control_PhysicalModelValue_PhysicalType[keyof typeof _android_emulation_control_PhysicalModelValue_PhysicalType]

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_PhysicalModelValue_State = {
  OK: 'OK',
  NO_SERVICE: 'NO_SERVICE',
  DISABLED: 'DISABLED',
  UNKNOWN: 'UNKNOWN',
} as const;

export type _android_emulation_control_PhysicalModelValue_State =
  | 'OK'
  | 0
  | 'NO_SERVICE'
  | -3
  | 'DISABLED'
  | -2
  | 'UNKNOWN'
  | -1

export type _android_emulation_control_PhysicalModelValue_State__Output = typeof _android_emulation_control_PhysicalModelValue_State[keyof typeof _android_emulation_control_PhysicalModelValue_State]

export interface PhysicalModelValue {
  'target'?: (_android_emulation_control_PhysicalModelValue_PhysicalType);
  'status'?: (_android_emulation_control_PhysicalModelValue_State);
  'value'?: (_android_emulation_control_ParameterValue | null);
  'interpolation'?: (_android_emulation_control_PhysicalModelValue_Interpolation);
}

export interface PhysicalModelValue__Output {
  'target': (_android_emulation_control_PhysicalModelValue_PhysicalType__Output);
  'status': (_android_emulation_control_PhysicalModelValue_State__Output);
  'value': (_android_emulation_control_ParameterValue__Output | null);
  'interpolation': (_android_emulation_control_PhysicalModelValue_Interpolation__Output);
}
