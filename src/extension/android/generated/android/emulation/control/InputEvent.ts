// Original file: proto/emulator_controller.proto

import type { KeyboardEvent as _android_emulation_control_KeyboardEvent, KeyboardEvent__Output as _android_emulation_control_KeyboardEvent__Output } from '../../../android/emulation/control/KeyboardEvent';
import type { TouchEvent as _android_emulation_control_TouchEvent, TouchEvent__Output as _android_emulation_control_TouchEvent__Output } from '../../../android/emulation/control/TouchEvent';
import type { MouseEvent as _android_emulation_control_MouseEvent, MouseEvent__Output as _android_emulation_control_MouseEvent__Output } from '../../../android/emulation/control/MouseEvent';
import type { AndroidEvent as _android_emulation_control_AndroidEvent, AndroidEvent__Output as _android_emulation_control_AndroidEvent__Output } from '../../../android/emulation/control/AndroidEvent';
import type { PenEvent as _android_emulation_control_PenEvent, PenEvent__Output as _android_emulation_control_PenEvent__Output } from '../../../android/emulation/control/PenEvent';
import type { WheelEvent as _android_emulation_control_WheelEvent, WheelEvent__Output as _android_emulation_control_WheelEvent__Output } from '../../../android/emulation/control/WheelEvent';
import type { XrCommand as _android_emulation_control_XrCommand, XrCommand__Output as _android_emulation_control_XrCommand__Output } from '../../../android/emulation/control/XrCommand';
import type { RotationRadian as _android_emulation_control_RotationRadian, RotationRadian__Output as _android_emulation_control_RotationRadian__Output } from '../../../android/emulation/control/RotationRadian';
import type { Translation as _android_emulation_control_Translation, Translation__Output as _android_emulation_control_Translation__Output } from '../../../android/emulation/control/Translation';
import type { AngularVelocity as _android_emulation_control_AngularVelocity, AngularVelocity__Output as _android_emulation_control_AngularVelocity__Output } from '../../../android/emulation/control/AngularVelocity';
import type { Velocity as _android_emulation_control_Velocity, Velocity__Output as _android_emulation_control_Velocity__Output } from '../../../android/emulation/control/Velocity';
import type { TouchpadEvent as _android_emulation_control_TouchpadEvent, TouchpadEvent__Output as _android_emulation_control_TouchpadEvent__Output } from '../../../android/emulation/control/TouchpadEvent';

export interface InputEvent {
  'keyEvent'?: (_android_emulation_control_KeyboardEvent | null);
  'touchEvent'?: (_android_emulation_control_TouchEvent | null);
  'mouseEvent'?: (_android_emulation_control_MouseEvent | null);
  'androidEvent'?: (_android_emulation_control_AndroidEvent | null);
  'penEvent'?: (_android_emulation_control_PenEvent | null);
  'wheelEvent'?: (_android_emulation_control_WheelEvent | null);
  'xrHandEvent'?: (_android_emulation_control_MouseEvent | null);
  'xrEyeEvent'?: (_android_emulation_control_MouseEvent | null);
  'xrCommand'?: (_android_emulation_control_XrCommand | null);
  'xrHeadRotationEvent'?: (_android_emulation_control_RotationRadian | null);
  'xrHeadMovementEvent'?: (_android_emulation_control_Translation | null);
  'xrHeadAngularVelocityEvent'?: (_android_emulation_control_AngularVelocity | null);
  'xrHeadVelocityEvent'?: (_android_emulation_control_Velocity | null);
  'touchpadEvent'?: (_android_emulation_control_TouchpadEvent | null);
  'type'?: "keyEvent"|"touchEvent"|"mouseEvent"|"androidEvent"|"penEvent"|"wheelEvent"|"xrHandEvent"|"xrEyeEvent"|"xrCommand"|"xrHeadRotationEvent"|"xrHeadMovementEvent"|"xrHeadAngularVelocityEvent"|"xrHeadVelocityEvent"|"touchpadEvent";
}

export interface InputEvent__Output {
  'keyEvent'?: (_android_emulation_control_KeyboardEvent__Output | null);
  'touchEvent'?: (_android_emulation_control_TouchEvent__Output | null);
  'mouseEvent'?: (_android_emulation_control_MouseEvent__Output | null);
  'androidEvent'?: (_android_emulation_control_AndroidEvent__Output | null);
  'penEvent'?: (_android_emulation_control_PenEvent__Output | null);
  'wheelEvent'?: (_android_emulation_control_WheelEvent__Output | null);
  'xrHandEvent'?: (_android_emulation_control_MouseEvent__Output | null);
  'xrEyeEvent'?: (_android_emulation_control_MouseEvent__Output | null);
  'xrCommand'?: (_android_emulation_control_XrCommand__Output | null);
  'xrHeadRotationEvent'?: (_android_emulation_control_RotationRadian__Output | null);
  'xrHeadMovementEvent'?: (_android_emulation_control_Translation__Output | null);
  'xrHeadAngularVelocityEvent'?: (_android_emulation_control_AngularVelocity__Output | null);
  'xrHeadVelocityEvent'?: (_android_emulation_control_Velocity__Output | null);
  'touchpadEvent'?: (_android_emulation_control_TouchpadEvent__Output | null);
  'type'?: "keyEvent"|"touchEvent"|"mouseEvent"|"androidEvent"|"penEvent"|"wheelEvent"|"xrHandEvent"|"xrEyeEvent"|"xrCommand"|"xrHeadRotationEvent"|"xrHeadMovementEvent"|"xrHeadAngularVelocityEvent"|"xrHeadVelocityEvent"|"touchpadEvent";
}
