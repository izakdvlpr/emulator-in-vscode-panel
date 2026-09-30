// Original file: proto/emulator_controller.proto

import type { Rotation as _android_emulation_control_Rotation, Rotation__Output as _android_emulation_control_Rotation__Output } from '../../../android/emulation/control/Rotation';
import type { ImageTransport as _android_emulation_control_ImageTransport, ImageTransport__Output as _android_emulation_control_ImageTransport__Output } from '../../../android/emulation/control/ImageTransport';
import type { FoldedDisplay as _android_emulation_control_FoldedDisplay, FoldedDisplay__Output as _android_emulation_control_FoldedDisplay__Output } from '../../../android/emulation/control/FoldedDisplay';
import type { DisplayModeValue as _android_emulation_control_DisplayModeValue, DisplayModeValue__Output as _android_emulation_control_DisplayModeValue__Output } from '../../../android/emulation/control/DisplayModeValue';

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_ImageFormat_ImgFormat = {
  PNG: 'PNG',
  RGBA8888: 'RGBA8888',
  RGB888: 'RGB888',
} as const;

export type _android_emulation_control_ImageFormat_ImgFormat =
  | 'PNG'
  | 0
  | 'RGBA8888'
  | 1
  | 'RGB888'
  | 2

export type _android_emulation_control_ImageFormat_ImgFormat__Output = typeof _android_emulation_control_ImageFormat_ImgFormat[keyof typeof _android_emulation_control_ImageFormat_ImgFormat]

export interface ImageFormat {
  'format'?: (_android_emulation_control_ImageFormat_ImgFormat);
  'rotation'?: (_android_emulation_control_Rotation | null);
  'width'?: (number);
  'height'?: (number);
  'display'?: (number);
  'transport'?: (_android_emulation_control_ImageTransport | null);
  'foldedDisplay'?: (_android_emulation_control_FoldedDisplay | null);
  'displayMode'?: (_android_emulation_control_DisplayModeValue);
}

export interface ImageFormat__Output {
  'format': (_android_emulation_control_ImageFormat_ImgFormat__Output);
  'rotation': (_android_emulation_control_Rotation__Output | null);
  'width': (number);
  'height': (number);
  'display': (number);
  'transport': (_android_emulation_control_ImageTransport__Output | null);
  'foldedDisplay': (_android_emulation_control_FoldedDisplay__Output | null);
  'displayMode': (_android_emulation_control_DisplayModeValue__Output);
}
