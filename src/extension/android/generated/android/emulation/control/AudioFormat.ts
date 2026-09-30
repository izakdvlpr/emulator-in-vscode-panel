// Original file: proto/emulator_controller.proto

import type { Long } from '@grpc/proto-loader';

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_AudioFormat_Channels = {
  Mono: 'Mono',
  Stereo: 'Stereo',
} as const;

export type _android_emulation_control_AudioFormat_Channels =
  | 'Mono'
  | 0
  | 'Stereo'
  | 1

export type _android_emulation_control_AudioFormat_Channels__Output = typeof _android_emulation_control_AudioFormat_Channels[keyof typeof _android_emulation_control_AudioFormat_Channels]

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_AudioFormat_DeliveryMode = {
  MODE_UNSPECIFIED: 'MODE_UNSPECIFIED',
  MODE_REAL_TIME: 'MODE_REAL_TIME',
} as const;

export type _android_emulation_control_AudioFormat_DeliveryMode =
  | 'MODE_UNSPECIFIED'
  | 0
  | 'MODE_REAL_TIME'
  | 1

export type _android_emulation_control_AudioFormat_DeliveryMode__Output = typeof _android_emulation_control_AudioFormat_DeliveryMode[keyof typeof _android_emulation_control_AudioFormat_DeliveryMode]

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_AudioFormat_SampleFormat = {
  AUD_FMT_U8: 'AUD_FMT_U8',
  AUD_FMT_S16: 'AUD_FMT_S16',
} as const;

export type _android_emulation_control_AudioFormat_SampleFormat =
  | 'AUD_FMT_U8'
  | 0
  | 'AUD_FMT_S16'
  | 1

export type _android_emulation_control_AudioFormat_SampleFormat__Output = typeof _android_emulation_control_AudioFormat_SampleFormat[keyof typeof _android_emulation_control_AudioFormat_SampleFormat]

export interface AudioFormat {
  'samplingRate'?: (number | string | Long);
  'channels'?: (_android_emulation_control_AudioFormat_Channels);
  'format'?: (_android_emulation_control_AudioFormat_SampleFormat);
  'mode'?: (_android_emulation_control_AudioFormat_DeliveryMode);
}

export interface AudioFormat__Output {
  'samplingRate': (number);
  'channels': (_android_emulation_control_AudioFormat_Channels__Output);
  'format': (_android_emulation_control_AudioFormat_SampleFormat__Output);
  'mode': (_android_emulation_control_AudioFormat_DeliveryMode__Output);
}
