// Original file: proto/emulator_controller.proto

import type { CameraNotification as _android_emulation_control_CameraNotification, CameraNotification__Output as _android_emulation_control_CameraNotification__Output } from '../../../android/emulation/control/CameraNotification';
import type { DisplayConfigurationsChangedNotification as _android_emulation_control_DisplayConfigurationsChangedNotification, DisplayConfigurationsChangedNotification__Output as _android_emulation_control_DisplayConfigurationsChangedNotification__Output } from '../../../android/emulation/control/DisplayConfigurationsChangedNotification';
import type { Posture as _android_emulation_control_Posture, Posture__Output as _android_emulation_control_Posture__Output } from '../../../android/emulation/control/Posture';
import type { BootCompletedNotification as _android_emulation_control_BootCompletedNotification, BootCompletedNotification__Output as _android_emulation_control_BootCompletedNotification__Output } from '../../../android/emulation/control/BootCompletedNotification';
import type { BrightnessValue as _android_emulation_control_BrightnessValue, BrightnessValue__Output as _android_emulation_control_BrightnessValue__Output } from '../../../android/emulation/control/BrightnessValue';
import type { TextViewFocus as _android_emulation_control_TextViewFocus, TextViewFocus__Output as _android_emulation_control_TextViewFocus__Output } from '../../../android/emulation/control/TextViewFocus';
import type { XrOptions as _android_emulation_control_XrOptions, XrOptions__Output as _android_emulation_control_XrOptions__Output } from '../../../android/emulation/control/XrOptions';
import type { MicrophoneState as _android_emulation_control_MicrophoneState, MicrophoneState__Output as _android_emulation_control_MicrophoneState__Output } from '../../../android/emulation/control/MicrophoneState';

export interface Notification {
  'cameraNotification'?: (_android_emulation_control_CameraNotification | null);
  'displayConfigurationsChangedNotification'?: (_android_emulation_control_DisplayConfigurationsChangedNotification | null);
  'posture'?: (_android_emulation_control_Posture | null);
  'booted'?: (_android_emulation_control_BootCompletedNotification | null);
  'brightness'?: (_android_emulation_control_BrightnessValue | null);
  'textViewFocus'?: (_android_emulation_control_TextViewFocus | null);
  'xrOptions'?: (_android_emulation_control_XrOptions | null);
  'microphoneState'?: (_android_emulation_control_MicrophoneState | null);
  'type'?: "cameraNotification"|"displayConfigurationsChangedNotification"|"posture"|"booted"|"brightness"|"textViewFocus"|"xrOptions"|"microphoneState";
}

export interface Notification__Output {
  'cameraNotification'?: (_android_emulation_control_CameraNotification__Output | null);
  'displayConfigurationsChangedNotification'?: (_android_emulation_control_DisplayConfigurationsChangedNotification__Output | null);
  'posture'?: (_android_emulation_control_Posture__Output | null);
  'booted'?: (_android_emulation_control_BootCompletedNotification__Output | null);
  'brightness'?: (_android_emulation_control_BrightnessValue__Output | null);
  'textViewFocus'?: (_android_emulation_control_TextViewFocus__Output | null);
  'xrOptions'?: (_android_emulation_control_XrOptions__Output | null);
  'microphoneState'?: (_android_emulation_control_MicrophoneState__Output | null);
  'type'?: "cameraNotification"|"displayConfigurationsChangedNotification"|"posture"|"booted"|"brightness"|"textViewFocus"|"xrOptions"|"microphoneState";
}
