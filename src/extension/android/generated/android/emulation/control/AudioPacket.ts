// Original file: proto/emulator_controller.proto

import type { AudioFormat as _android_emulation_control_AudioFormat, AudioFormat__Output as _android_emulation_control_AudioFormat__Output } from '../../../android/emulation/control/AudioFormat';
import type { Long } from '@grpc/proto-loader';

export interface AudioPacket {
  'format'?: (_android_emulation_control_AudioFormat | null);
  'timestamp'?: (number | string | Long);
  'audio'?: (Buffer | Uint8Array | string);
}

export interface AudioPacket__Output {
  'format': (_android_emulation_control_AudioFormat__Output | null);
  'timestamp': (number);
  'audio': (Buffer);
}
