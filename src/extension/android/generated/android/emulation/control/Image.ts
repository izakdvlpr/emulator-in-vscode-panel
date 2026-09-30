// Original file: proto/emulator_controller.proto

import type { ImageFormat as _android_emulation_control_ImageFormat, ImageFormat__Output as _android_emulation_control_ImageFormat__Output } from '../../../android/emulation/control/ImageFormat';
import type { Long } from '@grpc/proto-loader';

export interface Image {
  'format'?: (_android_emulation_control_ImageFormat | null);
  'width'?: (number);
  'height'?: (number);
  'image'?: (Buffer | Uint8Array | string);
  'seq'?: (number);
  'timestampUs'?: (number | string | Long);
}

export interface Image__Output {
  'format': (_android_emulation_control_ImageFormat__Output | null);
  'width': (number);
  'height': (number);
  'image': (Buffer);
  'seq': (number);
  'timestampUs': (number);
}
