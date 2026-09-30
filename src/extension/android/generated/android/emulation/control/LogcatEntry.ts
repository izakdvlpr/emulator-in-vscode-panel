// Original file: proto/emulator_controller.proto

import type { Long } from '@grpc/proto-loader';

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_LogcatEntry_LogLevel = {
  UNKNOWN: 'UNKNOWN',
  DEFAULT: 'DEFAULT',
  VERBOSE: 'VERBOSE',
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERR: 'ERR',
  FATAL: 'FATAL',
  SILENT: 'SILENT',
} as const;

export type _android_emulation_control_LogcatEntry_LogLevel =
  | 'UNKNOWN'
  | 0
  | 'DEFAULT'
  | 1
  | 'VERBOSE'
  | 2
  | 'DEBUG'
  | 3
  | 'INFO'
  | 4
  | 'WARN'
  | 5
  | 'ERR'
  | 6
  | 'FATAL'
  | 7
  | 'SILENT'
  | 8

export type _android_emulation_control_LogcatEntry_LogLevel__Output = typeof _android_emulation_control_LogcatEntry_LogLevel[keyof typeof _android_emulation_control_LogcatEntry_LogLevel]

export interface LogcatEntry {
  'timestamp'?: (number | string | Long);
  'pid'?: (number);
  'tid'?: (number);
  'level'?: (_android_emulation_control_LogcatEntry_LogLevel);
  'tag'?: (string);
  'msg'?: (string);
}

export interface LogcatEntry__Output {
  'timestamp': (number);
  'pid': (number);
  'tid': (number);
  'level': (_android_emulation_control_LogcatEntry_LogLevel__Output);
  'tag': (string);
  'msg': (string);
}
