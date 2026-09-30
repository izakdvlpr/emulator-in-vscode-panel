// Original file: proto/emulator_controller.proto

import type { LogcatEntry as _android_emulation_control_LogcatEntry, LogcatEntry__Output as _android_emulation_control_LogcatEntry__Output } from '../../../android/emulation/control/LogcatEntry';
import type { Long } from '@grpc/proto-loader';

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_LogMessage_LogType = {
  Text: 'Text',
  Parsed: 'Parsed',
} as const;

export type _android_emulation_control_LogMessage_LogType =
  | 'Text'
  | 0
  | 'Parsed'
  | 1

export type _android_emulation_control_LogMessage_LogType__Output = typeof _android_emulation_control_LogMessage_LogType[keyof typeof _android_emulation_control_LogMessage_LogType]

export interface LogMessage {
  'contents'?: (string);
  'start'?: (number | string | Long);
  'next'?: (number | string | Long);
  'sort'?: (_android_emulation_control_LogMessage_LogType);
  'entries'?: (_android_emulation_control_LogcatEntry)[];
}

export interface LogMessage__Output {
  'contents': (string);
  'start': (number);
  'next': (number);
  'sort': (_android_emulation_control_LogMessage_LogType__Output);
  'entries': (_android_emulation_control_LogcatEntry__Output)[];
}
