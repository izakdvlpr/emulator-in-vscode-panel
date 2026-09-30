import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { AndroidEvent as _android_emulation_control_AndroidEvent, AndroidEvent__Output as _android_emulation_control_AndroidEvent__Output } from './android/emulation/control/AndroidEvent';
import type { AngularVelocity as _android_emulation_control_AngularVelocity, AngularVelocity__Output as _android_emulation_control_AngularVelocity__Output } from './android/emulation/control/AngularVelocity';
import type { AudioFormat as _android_emulation_control_AudioFormat, AudioFormat__Output as _android_emulation_control_AudioFormat__Output } from './android/emulation/control/AudioFormat';
import type { AudioPacket as _android_emulation_control_AudioPacket, AudioPacket__Output as _android_emulation_control_AudioPacket__Output } from './android/emulation/control/AudioPacket';
import type { BatteryState as _android_emulation_control_BatteryState, BatteryState__Output as _android_emulation_control_BatteryState__Output } from './android/emulation/control/BatteryState';
import type { BootCompletedNotification as _android_emulation_control_BootCompletedNotification, BootCompletedNotification__Output as _android_emulation_control_BootCompletedNotification__Output } from './android/emulation/control/BootCompletedNotification';
import type { BrightnessValue as _android_emulation_control_BrightnessValue, BrightnessValue__Output as _android_emulation_control_BrightnessValue__Output } from './android/emulation/control/BrightnessValue';
import type { CameraNotification as _android_emulation_control_CameraNotification, CameraNotification__Output as _android_emulation_control_CameraNotification__Output } from './android/emulation/control/CameraNotification';
import type { ClipData as _android_emulation_control_ClipData, ClipData__Output as _android_emulation_control_ClipData__Output } from './android/emulation/control/ClipData';
import type { DisplayConfiguration as _android_emulation_control_DisplayConfiguration, DisplayConfiguration__Output as _android_emulation_control_DisplayConfiguration__Output } from './android/emulation/control/DisplayConfiguration';
import type { DisplayConfigurations as _android_emulation_control_DisplayConfigurations, DisplayConfigurations__Output as _android_emulation_control_DisplayConfigurations__Output } from './android/emulation/control/DisplayConfigurations';
import type { DisplayConfigurationsChangedNotification as _android_emulation_control_DisplayConfigurationsChangedNotification, DisplayConfigurationsChangedNotification__Output as _android_emulation_control_DisplayConfigurationsChangedNotification__Output } from './android/emulation/control/DisplayConfigurationsChangedNotification';
import type { DisplayMode as _android_emulation_control_DisplayMode, DisplayMode__Output as _android_emulation_control_DisplayMode__Output } from './android/emulation/control/DisplayMode';
import type { EmulatorControllerClient as _android_emulation_control_EmulatorControllerClient, EmulatorControllerDefinition as _android_emulation_control_EmulatorControllerDefinition } from './android/emulation/control/EmulatorController';
import type { EmulatorStatus as _android_emulation_control_EmulatorStatus, EmulatorStatus__Output as _android_emulation_control_EmulatorStatus__Output } from './android/emulation/control/EmulatorStatus';
import type { Entry as _android_emulation_control_Entry, Entry__Output as _android_emulation_control_Entry__Output } from './android/emulation/control/Entry';
import type { EntryList as _android_emulation_control_EntryList, EntryList__Output as _android_emulation_control_EntryList__Output } from './android/emulation/control/EntryList';
import type { Environment as _android_emulation_control_Environment, Environment__Output as _android_emulation_control_Environment__Output } from './android/emulation/control/Environment';
import type { Fingerprint as _android_emulation_control_Fingerprint, Fingerprint__Output as _android_emulation_control_Fingerprint__Output } from './android/emulation/control/Fingerprint';
import type { FoldedDisplay as _android_emulation_control_FoldedDisplay, FoldedDisplay__Output as _android_emulation_control_FoldedDisplay__Output } from './android/emulation/control/FoldedDisplay';
import type { GpsState as _android_emulation_control_GpsState, GpsState__Output as _android_emulation_control_GpsState__Output } from './android/emulation/control/GpsState';
import type { Image as _android_emulation_control_Image, Image__Output as _android_emulation_control_Image__Output } from './android/emulation/control/Image';
import type { ImageFormat as _android_emulation_control_ImageFormat, ImageFormat__Output as _android_emulation_control_ImageFormat__Output } from './android/emulation/control/ImageFormat';
import type { ImageTransport as _android_emulation_control_ImageTransport, ImageTransport__Output as _android_emulation_control_ImageTransport__Output } from './android/emulation/control/ImageTransport';
import type { InputEvent as _android_emulation_control_InputEvent, InputEvent__Output as _android_emulation_control_InputEvent__Output } from './android/emulation/control/InputEvent';
import type { KeyboardEvent as _android_emulation_control_KeyboardEvent, KeyboardEvent__Output as _android_emulation_control_KeyboardEvent__Output } from './android/emulation/control/KeyboardEvent';
import type { LogMessage as _android_emulation_control_LogMessage, LogMessage__Output as _android_emulation_control_LogMessage__Output } from './android/emulation/control/LogMessage';
import type { LogcatEntry as _android_emulation_control_LogcatEntry, LogcatEntry__Output as _android_emulation_control_LogcatEntry__Output } from './android/emulation/control/LogcatEntry';
import type { MicrophoneState as _android_emulation_control_MicrophoneState, MicrophoneState__Output as _android_emulation_control_MicrophoneState__Output } from './android/emulation/control/MicrophoneState';
import type { MouseEvent as _android_emulation_control_MouseEvent, MouseEvent__Output as _android_emulation_control_MouseEvent__Output } from './android/emulation/control/MouseEvent';
import type { Notification as _android_emulation_control_Notification, Notification__Output as _android_emulation_control_Notification__Output } from './android/emulation/control/Notification';
import type { ParameterValue as _android_emulation_control_ParameterValue, ParameterValue__Output as _android_emulation_control_ParameterValue__Output } from './android/emulation/control/ParameterValue';
import type { Pen as _android_emulation_control_Pen, Pen__Output as _android_emulation_control_Pen__Output } from './android/emulation/control/Pen';
import type { PenEvent as _android_emulation_control_PenEvent, PenEvent__Output as _android_emulation_control_PenEvent__Output } from './android/emulation/control/PenEvent';
import type { PhoneCall as _android_emulation_control_PhoneCall, PhoneCall__Output as _android_emulation_control_PhoneCall__Output } from './android/emulation/control/PhoneCall';
import type { PhoneNumber as _android_emulation_control_PhoneNumber, PhoneNumber__Output as _android_emulation_control_PhoneNumber__Output } from './android/emulation/control/PhoneNumber';
import type { PhoneResponse as _android_emulation_control_PhoneResponse, PhoneResponse__Output as _android_emulation_control_PhoneResponse__Output } from './android/emulation/control/PhoneResponse';
import type { PhysicalModelValue as _android_emulation_control_PhysicalModelValue, PhysicalModelValue__Output as _android_emulation_control_PhysicalModelValue__Output } from './android/emulation/control/PhysicalModelValue';
import type { Posture as _android_emulation_control_Posture, Posture__Output as _android_emulation_control_Posture__Output } from './android/emulation/control/Posture';
import type { Rotation as _android_emulation_control_Rotation, Rotation__Output as _android_emulation_control_Rotation__Output } from './android/emulation/control/Rotation';
import type { RotationRadian as _android_emulation_control_RotationRadian, RotationRadian__Output as _android_emulation_control_RotationRadian__Output } from './android/emulation/control/RotationRadian';
import type { SensorValue as _android_emulation_control_SensorValue, SensorValue__Output as _android_emulation_control_SensorValue__Output } from './android/emulation/control/SensorValue';
import type { SmsMessage as _android_emulation_control_SmsMessage, SmsMessage__Output as _android_emulation_control_SmsMessage__Output } from './android/emulation/control/SmsMessage';
import type { TextViewFocus as _android_emulation_control_TextViewFocus, TextViewFocus__Output as _android_emulation_control_TextViewFocus__Output } from './android/emulation/control/TextViewFocus';
import type { Touch as _android_emulation_control_Touch, Touch__Output as _android_emulation_control_Touch__Output } from './android/emulation/control/Touch';
import type { TouchEvent as _android_emulation_control_TouchEvent, TouchEvent__Output as _android_emulation_control_TouchEvent__Output } from './android/emulation/control/TouchEvent';
import type { TouchpadEvent as _android_emulation_control_TouchpadEvent, TouchpadEvent__Output as _android_emulation_control_TouchpadEvent__Output } from './android/emulation/control/TouchpadEvent';
import type { Translation as _android_emulation_control_Translation, Translation__Output as _android_emulation_control_Translation__Output } from './android/emulation/control/Translation';
import type { Velocity as _android_emulation_control_Velocity, Velocity__Output as _android_emulation_control_Velocity__Output } from './android/emulation/control/Velocity';
import type { VmConfiguration as _android_emulation_control_VmConfiguration, VmConfiguration__Output as _android_emulation_control_VmConfiguration__Output } from './android/emulation/control/VmConfiguration';
import type { VmRunState as _android_emulation_control_VmRunState, VmRunState__Output as _android_emulation_control_VmRunState__Output } from './android/emulation/control/VmRunState';
import type { WheelEvent as _android_emulation_control_WheelEvent, WheelEvent__Output as _android_emulation_control_WheelEvent__Output } from './android/emulation/control/WheelEvent';
import type { XrCommand as _android_emulation_control_XrCommand, XrCommand__Output as _android_emulation_control_XrCommand__Output } from './android/emulation/control/XrCommand';
import type { XrOptions as _android_emulation_control_XrOptions, XrOptions__Output as _android_emulation_control_XrOptions__Output } from './android/emulation/control/XrOptions';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  android: {
    emulation: {
      control: {
        AndroidEvent: MessageTypeDefinition<_android_emulation_control_AndroidEvent, _android_emulation_control_AndroidEvent__Output>
        AngularVelocity: MessageTypeDefinition<_android_emulation_control_AngularVelocity, _android_emulation_control_AngularVelocity__Output>
        AudioFormat: MessageTypeDefinition<_android_emulation_control_AudioFormat, _android_emulation_control_AudioFormat__Output>
        AudioPacket: MessageTypeDefinition<_android_emulation_control_AudioPacket, _android_emulation_control_AudioPacket__Output>
        BatteryState: MessageTypeDefinition<_android_emulation_control_BatteryState, _android_emulation_control_BatteryState__Output>
        BootCompletedNotification: MessageTypeDefinition<_android_emulation_control_BootCompletedNotification, _android_emulation_control_BootCompletedNotification__Output>
        BrightnessValue: MessageTypeDefinition<_android_emulation_control_BrightnessValue, _android_emulation_control_BrightnessValue__Output>
        CameraNotification: MessageTypeDefinition<_android_emulation_control_CameraNotification, _android_emulation_control_CameraNotification__Output>
        ClipData: MessageTypeDefinition<_android_emulation_control_ClipData, _android_emulation_control_ClipData__Output>
        DisplayConfiguration: MessageTypeDefinition<_android_emulation_control_DisplayConfiguration, _android_emulation_control_DisplayConfiguration__Output>
        DisplayConfigurations: MessageTypeDefinition<_android_emulation_control_DisplayConfigurations, _android_emulation_control_DisplayConfigurations__Output>
        DisplayConfigurationsChangedNotification: MessageTypeDefinition<_android_emulation_control_DisplayConfigurationsChangedNotification, _android_emulation_control_DisplayConfigurationsChangedNotification__Output>
        DisplayMode: MessageTypeDefinition<_android_emulation_control_DisplayMode, _android_emulation_control_DisplayMode__Output>
        DisplayModeValue: EnumTypeDefinition
        EmulatorController: SubtypeConstructor<typeof grpc.Client, _android_emulation_control_EmulatorControllerClient> & { service: _android_emulation_control_EmulatorControllerDefinition }
        EmulatorStatus: MessageTypeDefinition<_android_emulation_control_EmulatorStatus, _android_emulation_control_EmulatorStatus__Output>
        Entry: MessageTypeDefinition<_android_emulation_control_Entry, _android_emulation_control_Entry__Output>
        EntryList: MessageTypeDefinition<_android_emulation_control_EntryList, _android_emulation_control_EntryList__Output>
        Environment: MessageTypeDefinition<_android_emulation_control_Environment, _android_emulation_control_Environment__Output>
        Fingerprint: MessageTypeDefinition<_android_emulation_control_Fingerprint, _android_emulation_control_Fingerprint__Output>
        FoldedDisplay: MessageTypeDefinition<_android_emulation_control_FoldedDisplay, _android_emulation_control_FoldedDisplay__Output>
        GpsState: MessageTypeDefinition<_android_emulation_control_GpsState, _android_emulation_control_GpsState__Output>
        Image: MessageTypeDefinition<_android_emulation_control_Image, _android_emulation_control_Image__Output>
        ImageFormat: MessageTypeDefinition<_android_emulation_control_ImageFormat, _android_emulation_control_ImageFormat__Output>
        ImageTransport: MessageTypeDefinition<_android_emulation_control_ImageTransport, _android_emulation_control_ImageTransport__Output>
        InputEvent: MessageTypeDefinition<_android_emulation_control_InputEvent, _android_emulation_control_InputEvent__Output>
        KeyboardEvent: MessageTypeDefinition<_android_emulation_control_KeyboardEvent, _android_emulation_control_KeyboardEvent__Output>
        LogMessage: MessageTypeDefinition<_android_emulation_control_LogMessage, _android_emulation_control_LogMessage__Output>
        LogcatEntry: MessageTypeDefinition<_android_emulation_control_LogcatEntry, _android_emulation_control_LogcatEntry__Output>
        MicrophoneState: MessageTypeDefinition<_android_emulation_control_MicrophoneState, _android_emulation_control_MicrophoneState__Output>
        MouseEvent: MessageTypeDefinition<_android_emulation_control_MouseEvent, _android_emulation_control_MouseEvent__Output>
        Notification: MessageTypeDefinition<_android_emulation_control_Notification, _android_emulation_control_Notification__Output>
        ParameterValue: MessageTypeDefinition<_android_emulation_control_ParameterValue, _android_emulation_control_ParameterValue__Output>
        Pen: MessageTypeDefinition<_android_emulation_control_Pen, _android_emulation_control_Pen__Output>
        PenEvent: MessageTypeDefinition<_android_emulation_control_PenEvent, _android_emulation_control_PenEvent__Output>
        PhoneCall: MessageTypeDefinition<_android_emulation_control_PhoneCall, _android_emulation_control_PhoneCall__Output>
        PhoneNumber: MessageTypeDefinition<_android_emulation_control_PhoneNumber, _android_emulation_control_PhoneNumber__Output>
        PhoneResponse: MessageTypeDefinition<_android_emulation_control_PhoneResponse, _android_emulation_control_PhoneResponse__Output>
        PhysicalModelValue: MessageTypeDefinition<_android_emulation_control_PhysicalModelValue, _android_emulation_control_PhysicalModelValue__Output>
        Posture: MessageTypeDefinition<_android_emulation_control_Posture, _android_emulation_control_Posture__Output>
        Rotation: MessageTypeDefinition<_android_emulation_control_Rotation, _android_emulation_control_Rotation__Output>
        RotationRadian: MessageTypeDefinition<_android_emulation_control_RotationRadian, _android_emulation_control_RotationRadian__Output>
        SensorValue: MessageTypeDefinition<_android_emulation_control_SensorValue, _android_emulation_control_SensorValue__Output>
        SmsMessage: MessageTypeDefinition<_android_emulation_control_SmsMessage, _android_emulation_control_SmsMessage__Output>
        TextViewFocus: MessageTypeDefinition<_android_emulation_control_TextViewFocus, _android_emulation_control_TextViewFocus__Output>
        Touch: MessageTypeDefinition<_android_emulation_control_Touch, _android_emulation_control_Touch__Output>
        TouchEvent: MessageTypeDefinition<_android_emulation_control_TouchEvent, _android_emulation_control_TouchEvent__Output>
        TouchpadEvent: MessageTypeDefinition<_android_emulation_control_TouchpadEvent, _android_emulation_control_TouchpadEvent__Output>
        Translation: MessageTypeDefinition<_android_emulation_control_Translation, _android_emulation_control_Translation__Output>
        Velocity: MessageTypeDefinition<_android_emulation_control_Velocity, _android_emulation_control_Velocity__Output>
        VmConfiguration: MessageTypeDefinition<_android_emulation_control_VmConfiguration, _android_emulation_control_VmConfiguration__Output>
        VmRunState: MessageTypeDefinition<_android_emulation_control_VmRunState, _android_emulation_control_VmRunState__Output>
        WheelEvent: MessageTypeDefinition<_android_emulation_control_WheelEvent, _android_emulation_control_WheelEvent__Output>
        XrCommand: MessageTypeDefinition<_android_emulation_control_XrCommand, _android_emulation_control_XrCommand__Output>
        XrOptions: MessageTypeDefinition<_android_emulation_control_XrOptions, _android_emulation_control_XrOptions__Output>
      }
    }
  }
  google: {
    protobuf: {
      Empty: MessageTypeDefinition<_google_protobuf_Empty, _google_protobuf_Empty__Output>
    }
  }
}

