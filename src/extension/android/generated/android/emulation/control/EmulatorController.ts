// Original file: proto/emulator_controller.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { AudioFormat as _android_emulation_control_AudioFormat, AudioFormat__Output as _android_emulation_control_AudioFormat__Output } from '../../../android/emulation/control/AudioFormat';
import type { AudioPacket as _android_emulation_control_AudioPacket, AudioPacket__Output as _android_emulation_control_AudioPacket__Output } from '../../../android/emulation/control/AudioPacket';
import type { BatteryState as _android_emulation_control_BatteryState, BatteryState__Output as _android_emulation_control_BatteryState__Output } from '../../../android/emulation/control/BatteryState';
import type { BrightnessValue as _android_emulation_control_BrightnessValue, BrightnessValue__Output as _android_emulation_control_BrightnessValue__Output } from '../../../android/emulation/control/BrightnessValue';
import type { ClipData as _android_emulation_control_ClipData, ClipData__Output as _android_emulation_control_ClipData__Output } from '../../../android/emulation/control/ClipData';
import type { DisplayConfigurations as _android_emulation_control_DisplayConfigurations, DisplayConfigurations__Output as _android_emulation_control_DisplayConfigurations__Output } from '../../../android/emulation/control/DisplayConfigurations';
import type { DisplayMode as _android_emulation_control_DisplayMode, DisplayMode__Output as _android_emulation_control_DisplayMode__Output } from '../../../android/emulation/control/DisplayMode';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../../../google/protobuf/Empty';
import type { EmulatorStatus as _android_emulation_control_EmulatorStatus, EmulatorStatus__Output as _android_emulation_control_EmulatorStatus__Output } from '../../../android/emulation/control/EmulatorStatus';
import type { Environment as _android_emulation_control_Environment, Environment__Output as _android_emulation_control_Environment__Output } from '../../../android/emulation/control/Environment';
import type { Fingerprint as _android_emulation_control_Fingerprint, Fingerprint__Output as _android_emulation_control_Fingerprint__Output } from '../../../android/emulation/control/Fingerprint';
import type { GpsState as _android_emulation_control_GpsState, GpsState__Output as _android_emulation_control_GpsState__Output } from '../../../android/emulation/control/GpsState';
import type { Image as _android_emulation_control_Image, Image__Output as _android_emulation_control_Image__Output } from '../../../android/emulation/control/Image';
import type { ImageFormat as _android_emulation_control_ImageFormat, ImageFormat__Output as _android_emulation_control_ImageFormat__Output } from '../../../android/emulation/control/ImageFormat';
import type { InputEvent as _android_emulation_control_InputEvent, InputEvent__Output as _android_emulation_control_InputEvent__Output } from '../../../android/emulation/control/InputEvent';
import type { KeyboardEvent as _android_emulation_control_KeyboardEvent, KeyboardEvent__Output as _android_emulation_control_KeyboardEvent__Output } from '../../../android/emulation/control/KeyboardEvent';
import type { LogMessage as _android_emulation_control_LogMessage, LogMessage__Output as _android_emulation_control_LogMessage__Output } from '../../../android/emulation/control/LogMessage';
import type { MicrophoneState as _android_emulation_control_MicrophoneState, MicrophoneState__Output as _android_emulation_control_MicrophoneState__Output } from '../../../android/emulation/control/MicrophoneState';
import type { MouseEvent as _android_emulation_control_MouseEvent, MouseEvent__Output as _android_emulation_control_MouseEvent__Output } from '../../../android/emulation/control/MouseEvent';
import type { Notification as _android_emulation_control_Notification, Notification__Output as _android_emulation_control_Notification__Output } from '../../../android/emulation/control/Notification';
import type { PhoneCall as _android_emulation_control_PhoneCall, PhoneCall__Output as _android_emulation_control_PhoneCall__Output } from '../../../android/emulation/control/PhoneCall';
import type { PhoneNumber as _android_emulation_control_PhoneNumber, PhoneNumber__Output as _android_emulation_control_PhoneNumber__Output } from '../../../android/emulation/control/PhoneNumber';
import type { PhoneResponse as _android_emulation_control_PhoneResponse, PhoneResponse__Output as _android_emulation_control_PhoneResponse__Output } from '../../../android/emulation/control/PhoneResponse';
import type { PhysicalModelValue as _android_emulation_control_PhysicalModelValue, PhysicalModelValue__Output as _android_emulation_control_PhysicalModelValue__Output } from '../../../android/emulation/control/PhysicalModelValue';
import type { Posture as _android_emulation_control_Posture, Posture__Output as _android_emulation_control_Posture__Output } from '../../../android/emulation/control/Posture';
import type { RotationRadian as _android_emulation_control_RotationRadian, RotationRadian__Output as _android_emulation_control_RotationRadian__Output } from '../../../android/emulation/control/RotationRadian';
import type { SensorValue as _android_emulation_control_SensorValue, SensorValue__Output as _android_emulation_control_SensorValue__Output } from '../../../android/emulation/control/SensorValue';
import type { SmsMessage as _android_emulation_control_SmsMessage, SmsMessage__Output as _android_emulation_control_SmsMessage__Output } from '../../../android/emulation/control/SmsMessage';
import type { TouchEvent as _android_emulation_control_TouchEvent, TouchEvent__Output as _android_emulation_control_TouchEvent__Output } from '../../../android/emulation/control/TouchEvent';
import type { Velocity as _android_emulation_control_Velocity, Velocity__Output as _android_emulation_control_Velocity__Output } from '../../../android/emulation/control/Velocity';
import type { VmRunState as _android_emulation_control_VmRunState, VmRunState__Output as _android_emulation_control_VmRunState__Output } from '../../../android/emulation/control/VmRunState';
import type { WheelEvent as _android_emulation_control_WheelEvent, WheelEvent__Output as _android_emulation_control_WheelEvent__Output } from '../../../android/emulation/control/WheelEvent';
import type { XrOptions as _android_emulation_control_XrOptions, XrOptions__Output as _android_emulation_control_XrOptions__Output } from '../../../android/emulation/control/XrOptions';

export interface EmulatorControllerClient extends grpc.Client {
  getBattery(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_BatteryState__Output>): grpc.ClientUnaryCall;
  getBattery(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_BatteryState__Output>): grpc.ClientUnaryCall;
  getBattery(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_BatteryState__Output>): grpc.ClientUnaryCall;
  getBattery(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_android_emulation_control_BatteryState__Output>): grpc.ClientUnaryCall;
  
  getBrightness(argument: _android_emulation_control_BrightnessValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_BrightnessValue__Output>): grpc.ClientUnaryCall;
  getBrightness(argument: _android_emulation_control_BrightnessValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_BrightnessValue__Output>): grpc.ClientUnaryCall;
  getBrightness(argument: _android_emulation_control_BrightnessValue, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_BrightnessValue__Output>): grpc.ClientUnaryCall;
  getBrightness(argument: _android_emulation_control_BrightnessValue, callback: grpc.requestCallback<_android_emulation_control_BrightnessValue__Output>): grpc.ClientUnaryCall;
  
  getClipboard(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_ClipData__Output>): grpc.ClientUnaryCall;
  getClipboard(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_ClipData__Output>): grpc.ClientUnaryCall;
  getClipboard(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_ClipData__Output>): grpc.ClientUnaryCall;
  getClipboard(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_android_emulation_control_ClipData__Output>): grpc.ClientUnaryCall;
  
  getDisplayConfigurations(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_DisplayConfigurations__Output>): grpc.ClientUnaryCall;
  getDisplayConfigurations(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_DisplayConfigurations__Output>): grpc.ClientUnaryCall;
  getDisplayConfigurations(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_DisplayConfigurations__Output>): grpc.ClientUnaryCall;
  getDisplayConfigurations(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_android_emulation_control_DisplayConfigurations__Output>): grpc.ClientUnaryCall;
  
  getDisplayMode(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_DisplayMode__Output>): grpc.ClientUnaryCall;
  getDisplayMode(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_DisplayMode__Output>): grpc.ClientUnaryCall;
  getDisplayMode(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_DisplayMode__Output>): grpc.ClientUnaryCall;
  getDisplayMode(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_android_emulation_control_DisplayMode__Output>): grpc.ClientUnaryCall;
  
  getGps(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_GpsState__Output>): grpc.ClientUnaryCall;
  getGps(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_GpsState__Output>): grpc.ClientUnaryCall;
  getGps(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_GpsState__Output>): grpc.ClientUnaryCall;
  getGps(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_android_emulation_control_GpsState__Output>): grpc.ClientUnaryCall;
  
  getLogcat(argument: _android_emulation_control_LogMessage, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_LogMessage__Output>): grpc.ClientUnaryCall;
  getLogcat(argument: _android_emulation_control_LogMessage, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_LogMessage__Output>): grpc.ClientUnaryCall;
  getLogcat(argument: _android_emulation_control_LogMessage, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_LogMessage__Output>): grpc.ClientUnaryCall;
  getLogcat(argument: _android_emulation_control_LogMessage, callback: grpc.requestCallback<_android_emulation_control_LogMessage__Output>): grpc.ClientUnaryCall;
  
  getMicrophoneState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_MicrophoneState__Output>): grpc.ClientUnaryCall;
  getMicrophoneState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_MicrophoneState__Output>): grpc.ClientUnaryCall;
  getMicrophoneState(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_MicrophoneState__Output>): grpc.ClientUnaryCall;
  getMicrophoneState(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_android_emulation_control_MicrophoneState__Output>): grpc.ClientUnaryCall;
  
  getPhysicalModel(argument: _android_emulation_control_PhysicalModelValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_PhysicalModelValue__Output>): grpc.ClientUnaryCall;
  getPhysicalModel(argument: _android_emulation_control_PhysicalModelValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_PhysicalModelValue__Output>): grpc.ClientUnaryCall;
  getPhysicalModel(argument: _android_emulation_control_PhysicalModelValue, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_PhysicalModelValue__Output>): grpc.ClientUnaryCall;
  getPhysicalModel(argument: _android_emulation_control_PhysicalModelValue, callback: grpc.requestCallback<_android_emulation_control_PhysicalModelValue__Output>): grpc.ClientUnaryCall;
  
  getScreenshot(argument: _android_emulation_control_ImageFormat, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_Image__Output>): grpc.ClientUnaryCall;
  getScreenshot(argument: _android_emulation_control_ImageFormat, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_Image__Output>): grpc.ClientUnaryCall;
  getScreenshot(argument: _android_emulation_control_ImageFormat, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_Image__Output>): grpc.ClientUnaryCall;
  getScreenshot(argument: _android_emulation_control_ImageFormat, callback: grpc.requestCallback<_android_emulation_control_Image__Output>): grpc.ClientUnaryCall;
  
  getSensor(argument: _android_emulation_control_SensorValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_SensorValue__Output>): grpc.ClientUnaryCall;
  getSensor(argument: _android_emulation_control_SensorValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_SensorValue__Output>): grpc.ClientUnaryCall;
  getSensor(argument: _android_emulation_control_SensorValue, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_SensorValue__Output>): grpc.ClientUnaryCall;
  getSensor(argument: _android_emulation_control_SensorValue, callback: grpc.requestCallback<_android_emulation_control_SensorValue__Output>): grpc.ClientUnaryCall;
  
  getStatus(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_EmulatorStatus__Output>): grpc.ClientUnaryCall;
  getStatus(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_EmulatorStatus__Output>): grpc.ClientUnaryCall;
  getStatus(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_EmulatorStatus__Output>): grpc.ClientUnaryCall;
  getStatus(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_android_emulation_control_EmulatorStatus__Output>): grpc.ClientUnaryCall;
  
  getVmState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_VmRunState__Output>): grpc.ClientUnaryCall;
  getVmState(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_VmRunState__Output>): grpc.ClientUnaryCall;
  getVmState(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_VmRunState__Output>): grpc.ClientUnaryCall;
  getVmState(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_android_emulation_control_VmRunState__Output>): grpc.ClientUnaryCall;
  
  getXrOptions(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_XrOptions__Output>): grpc.ClientUnaryCall;
  getXrOptions(argument: _google_protobuf_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_XrOptions__Output>): grpc.ClientUnaryCall;
  getXrOptions(argument: _google_protobuf_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_XrOptions__Output>): grpc.ClientUnaryCall;
  getXrOptions(argument: _google_protobuf_Empty, callback: grpc.requestCallback<_android_emulation_control_XrOptions__Output>): grpc.ClientUnaryCall;
  
  injectAudio(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_android_emulation_control_AudioPacket>;
  injectAudio(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_android_emulation_control_AudioPacket>;
  injectAudio(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_android_emulation_control_AudioPacket>;
  injectAudio(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_android_emulation_control_AudioPacket>;
  
  injectWheel(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_android_emulation_control_WheelEvent>;
  injectWheel(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_android_emulation_control_WheelEvent>;
  injectWheel(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_android_emulation_control_WheelEvent>;
  injectWheel(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_android_emulation_control_WheelEvent>;
  
  rotateVirtualSceneCamera(argument: _android_emulation_control_RotationRadian, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  rotateVirtualSceneCamera(argument: _android_emulation_control_RotationRadian, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  rotateVirtualSceneCamera(argument: _android_emulation_control_RotationRadian, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  rotateVirtualSceneCamera(argument: _android_emulation_control_RotationRadian, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  sendFingerprint(argument: _android_emulation_control_Fingerprint, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  sendFingerprint(argument: _android_emulation_control_Fingerprint, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  sendFingerprint(argument: _android_emulation_control_Fingerprint, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  sendFingerprint(argument: _android_emulation_control_Fingerprint, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  sendKey(argument: _android_emulation_control_KeyboardEvent, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  sendKey(argument: _android_emulation_control_KeyboardEvent, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  sendKey(argument: _android_emulation_control_KeyboardEvent, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  sendKey(argument: _android_emulation_control_KeyboardEvent, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  sendMouse(argument: _android_emulation_control_MouseEvent, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  sendMouse(argument: _android_emulation_control_MouseEvent, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  sendMouse(argument: _android_emulation_control_MouseEvent, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  sendMouse(argument: _android_emulation_control_MouseEvent, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  sendPhone(argument: _android_emulation_control_PhoneCall, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_PhoneResponse__Output>): grpc.ClientUnaryCall;
  sendPhone(argument: _android_emulation_control_PhoneCall, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_PhoneResponse__Output>): grpc.ClientUnaryCall;
  sendPhone(argument: _android_emulation_control_PhoneCall, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_PhoneResponse__Output>): grpc.ClientUnaryCall;
  sendPhone(argument: _android_emulation_control_PhoneCall, callback: grpc.requestCallback<_android_emulation_control_PhoneResponse__Output>): grpc.ClientUnaryCall;
  
  sendSms(argument: _android_emulation_control_SmsMessage, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_PhoneResponse__Output>): grpc.ClientUnaryCall;
  sendSms(argument: _android_emulation_control_SmsMessage, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_PhoneResponse__Output>): grpc.ClientUnaryCall;
  sendSms(argument: _android_emulation_control_SmsMessage, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_PhoneResponse__Output>): grpc.ClientUnaryCall;
  sendSms(argument: _android_emulation_control_SmsMessage, callback: grpc.requestCallback<_android_emulation_control_PhoneResponse__Output>): grpc.ClientUnaryCall;
  
  sendTouch(argument: _android_emulation_control_TouchEvent, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  sendTouch(argument: _android_emulation_control_TouchEvent, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  sendTouch(argument: _android_emulation_control_TouchEvent, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  sendTouch(argument: _android_emulation_control_TouchEvent, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setBattery(argument: _android_emulation_control_BatteryState, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setBattery(argument: _android_emulation_control_BatteryState, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setBattery(argument: _android_emulation_control_BatteryState, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setBattery(argument: _android_emulation_control_BatteryState, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setBrightness(argument: _android_emulation_control_BrightnessValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setBrightness(argument: _android_emulation_control_BrightnessValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setBrightness(argument: _android_emulation_control_BrightnessValue, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setBrightness(argument: _android_emulation_control_BrightnessValue, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setClipboard(argument: _android_emulation_control_ClipData, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setClipboard(argument: _android_emulation_control_ClipData, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setClipboard(argument: _android_emulation_control_ClipData, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setClipboard(argument: _android_emulation_control_ClipData, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setDisplayConfigurations(argument: _android_emulation_control_DisplayConfigurations, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_DisplayConfigurations__Output>): grpc.ClientUnaryCall;
  setDisplayConfigurations(argument: _android_emulation_control_DisplayConfigurations, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_DisplayConfigurations__Output>): grpc.ClientUnaryCall;
  setDisplayConfigurations(argument: _android_emulation_control_DisplayConfigurations, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_DisplayConfigurations__Output>): grpc.ClientUnaryCall;
  setDisplayConfigurations(argument: _android_emulation_control_DisplayConfigurations, callback: grpc.requestCallback<_android_emulation_control_DisplayConfigurations__Output>): grpc.ClientUnaryCall;
  
  setDisplayMode(argument: _android_emulation_control_DisplayMode, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setDisplayMode(argument: _android_emulation_control_DisplayMode, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setDisplayMode(argument: _android_emulation_control_DisplayMode, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setDisplayMode(argument: _android_emulation_control_DisplayMode, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setEnvironment(argument: _android_emulation_control_Environment, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setEnvironment(argument: _android_emulation_control_Environment, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setEnvironment(argument: _android_emulation_control_Environment, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setEnvironment(argument: _android_emulation_control_Environment, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setGps(argument: _android_emulation_control_GpsState, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setGps(argument: _android_emulation_control_GpsState, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setGps(argument: _android_emulation_control_GpsState, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setGps(argument: _android_emulation_control_GpsState, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setMicrophoneState(argument: _android_emulation_control_MicrophoneState, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setMicrophoneState(argument: _android_emulation_control_MicrophoneState, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setMicrophoneState(argument: _android_emulation_control_MicrophoneState, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setMicrophoneState(argument: _android_emulation_control_MicrophoneState, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setPhoneNumber(argument: _android_emulation_control_PhoneNumber, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_PhoneResponse__Output>): grpc.ClientUnaryCall;
  setPhoneNumber(argument: _android_emulation_control_PhoneNumber, metadata: grpc.Metadata, callback: grpc.requestCallback<_android_emulation_control_PhoneResponse__Output>): grpc.ClientUnaryCall;
  setPhoneNumber(argument: _android_emulation_control_PhoneNumber, options: grpc.CallOptions, callback: grpc.requestCallback<_android_emulation_control_PhoneResponse__Output>): grpc.ClientUnaryCall;
  setPhoneNumber(argument: _android_emulation_control_PhoneNumber, callback: grpc.requestCallback<_android_emulation_control_PhoneResponse__Output>): grpc.ClientUnaryCall;
  
  setPhysicalModel(argument: _android_emulation_control_PhysicalModelValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setPhysicalModel(argument: _android_emulation_control_PhysicalModelValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setPhysicalModel(argument: _android_emulation_control_PhysicalModelValue, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setPhysicalModel(argument: _android_emulation_control_PhysicalModelValue, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setPosture(argument: _android_emulation_control_Posture, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setPosture(argument: _android_emulation_control_Posture, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setPosture(argument: _android_emulation_control_Posture, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setPosture(argument: _android_emulation_control_Posture, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setSensor(argument: _android_emulation_control_SensorValue, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setSensor(argument: _android_emulation_control_SensorValue, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setSensor(argument: _android_emulation_control_SensorValue, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setSensor(argument: _android_emulation_control_SensorValue, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setVirtualSceneCameraVelocity(argument: _android_emulation_control_Velocity, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setVirtualSceneCameraVelocity(argument: _android_emulation_control_Velocity, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setVirtualSceneCameraVelocity(argument: _android_emulation_control_Velocity, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setVirtualSceneCameraVelocity(argument: _android_emulation_control_Velocity, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setVmState(argument: _android_emulation_control_VmRunState, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setVmState(argument: _android_emulation_control_VmRunState, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setVmState(argument: _android_emulation_control_VmRunState, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setVmState(argument: _android_emulation_control_VmRunState, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  setXrOptions(argument: _android_emulation_control_XrOptions, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setXrOptions(argument: _android_emulation_control_XrOptions, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setXrOptions(argument: _android_emulation_control_XrOptions, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  setXrOptions(argument: _android_emulation_control_XrOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientUnaryCall;
  
  streamAudio(argument: _android_emulation_control_AudioFormat, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_AudioPacket__Output>;
  streamAudio(argument: _android_emulation_control_AudioFormat, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_AudioPacket__Output>;
  
  streamClipboard(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_ClipData__Output>;
  streamClipboard(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_ClipData__Output>;
  
  streamInputEvent(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_android_emulation_control_InputEvent>;
  streamInputEvent(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_android_emulation_control_InputEvent>;
  streamInputEvent(options: grpc.CallOptions, callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_android_emulation_control_InputEvent>;
  streamInputEvent(callback: grpc.requestCallback<_google_protobuf_Empty__Output>): grpc.ClientWritableStream<_android_emulation_control_InputEvent>;
  
  streamLogcat(argument: _android_emulation_control_LogMessage, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_LogMessage__Output>;
  streamLogcat(argument: _android_emulation_control_LogMessage, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_LogMessage__Output>;
  
  streamNotification(argument: _google_protobuf_Empty, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_Notification__Output>;
  streamNotification(argument: _google_protobuf_Empty, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_Notification__Output>;
  
  streamPhysicalModel(argument: _android_emulation_control_PhysicalModelValue, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_PhysicalModelValue__Output>;
  streamPhysicalModel(argument: _android_emulation_control_PhysicalModelValue, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_PhysicalModelValue__Output>;
  
  streamScreenshot(argument: _android_emulation_control_ImageFormat, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_Image__Output>;
  streamScreenshot(argument: _android_emulation_control_ImageFormat, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_Image__Output>;
  
  streamSensor(argument: _android_emulation_control_SensorValue, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_SensorValue__Output>;
  streamSensor(argument: _android_emulation_control_SensorValue, options?: grpc.CallOptions): grpc.ClientReadableStream<_android_emulation_control_SensorValue__Output>;
  
}

export interface EmulatorControllerHandlers extends grpc.UntypedServiceImplementation {
  getBattery: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _android_emulation_control_BatteryState>;
  
  getBrightness: grpc.handleUnaryCall<_android_emulation_control_BrightnessValue__Output, _android_emulation_control_BrightnessValue>;
  
  getClipboard: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _android_emulation_control_ClipData>;
  
  getDisplayConfigurations: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _android_emulation_control_DisplayConfigurations>;
  
  getDisplayMode: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _android_emulation_control_DisplayMode>;
  
  getGps: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _android_emulation_control_GpsState>;
  
  getLogcat: grpc.handleUnaryCall<_android_emulation_control_LogMessage__Output, _android_emulation_control_LogMessage>;
  
  getMicrophoneState: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _android_emulation_control_MicrophoneState>;
  
  getPhysicalModel: grpc.handleUnaryCall<_android_emulation_control_PhysicalModelValue__Output, _android_emulation_control_PhysicalModelValue>;
  
  getScreenshot: grpc.handleUnaryCall<_android_emulation_control_ImageFormat__Output, _android_emulation_control_Image>;
  
  getSensor: grpc.handleUnaryCall<_android_emulation_control_SensorValue__Output, _android_emulation_control_SensorValue>;
  
  getStatus: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _android_emulation_control_EmulatorStatus>;
  
  getVmState: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _android_emulation_control_VmRunState>;
  
  getXrOptions: grpc.handleUnaryCall<_google_protobuf_Empty__Output, _android_emulation_control_XrOptions>;
  
  injectAudio: grpc.handleClientStreamingCall<_android_emulation_control_AudioPacket__Output, _google_protobuf_Empty>;
  
  injectWheel: grpc.handleClientStreamingCall<_android_emulation_control_WheelEvent__Output, _google_protobuf_Empty>;
  
  rotateVirtualSceneCamera: grpc.handleUnaryCall<_android_emulation_control_RotationRadian__Output, _google_protobuf_Empty>;
  
  sendFingerprint: grpc.handleUnaryCall<_android_emulation_control_Fingerprint__Output, _google_protobuf_Empty>;
  
  sendKey: grpc.handleUnaryCall<_android_emulation_control_KeyboardEvent__Output, _google_protobuf_Empty>;
  
  sendMouse: grpc.handleUnaryCall<_android_emulation_control_MouseEvent__Output, _google_protobuf_Empty>;
  
  sendPhone: grpc.handleUnaryCall<_android_emulation_control_PhoneCall__Output, _android_emulation_control_PhoneResponse>;
  
  sendSms: grpc.handleUnaryCall<_android_emulation_control_SmsMessage__Output, _android_emulation_control_PhoneResponse>;
  
  sendTouch: grpc.handleUnaryCall<_android_emulation_control_TouchEvent__Output, _google_protobuf_Empty>;
  
  setBattery: grpc.handleUnaryCall<_android_emulation_control_BatteryState__Output, _google_protobuf_Empty>;
  
  setBrightness: grpc.handleUnaryCall<_android_emulation_control_BrightnessValue__Output, _google_protobuf_Empty>;
  
  setClipboard: grpc.handleUnaryCall<_android_emulation_control_ClipData__Output, _google_protobuf_Empty>;
  
  setDisplayConfigurations: grpc.handleUnaryCall<_android_emulation_control_DisplayConfigurations__Output, _android_emulation_control_DisplayConfigurations>;
  
  setDisplayMode: grpc.handleUnaryCall<_android_emulation_control_DisplayMode__Output, _google_protobuf_Empty>;
  
  setEnvironment: grpc.handleUnaryCall<_android_emulation_control_Environment__Output, _google_protobuf_Empty>;
  
  setGps: grpc.handleUnaryCall<_android_emulation_control_GpsState__Output, _google_protobuf_Empty>;
  
  setMicrophoneState: grpc.handleUnaryCall<_android_emulation_control_MicrophoneState__Output, _google_protobuf_Empty>;
  
  setPhoneNumber: grpc.handleUnaryCall<_android_emulation_control_PhoneNumber__Output, _android_emulation_control_PhoneResponse>;
  
  setPhysicalModel: grpc.handleUnaryCall<_android_emulation_control_PhysicalModelValue__Output, _google_protobuf_Empty>;
  
  setPosture: grpc.handleUnaryCall<_android_emulation_control_Posture__Output, _google_protobuf_Empty>;
  
  setSensor: grpc.handleUnaryCall<_android_emulation_control_SensorValue__Output, _google_protobuf_Empty>;
  
  setVirtualSceneCameraVelocity: grpc.handleUnaryCall<_android_emulation_control_Velocity__Output, _google_protobuf_Empty>;
  
  setVmState: grpc.handleUnaryCall<_android_emulation_control_VmRunState__Output, _google_protobuf_Empty>;
  
  setXrOptions: grpc.handleUnaryCall<_android_emulation_control_XrOptions__Output, _google_protobuf_Empty>;
  
  streamAudio: grpc.handleServerStreamingCall<_android_emulation_control_AudioFormat__Output, _android_emulation_control_AudioPacket>;
  
  streamClipboard: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _android_emulation_control_ClipData>;
  
  streamInputEvent: grpc.handleClientStreamingCall<_android_emulation_control_InputEvent__Output, _google_protobuf_Empty>;
  
  streamLogcat: grpc.handleServerStreamingCall<_android_emulation_control_LogMessage__Output, _android_emulation_control_LogMessage>;
  
  streamNotification: grpc.handleServerStreamingCall<_google_protobuf_Empty__Output, _android_emulation_control_Notification>;
  
  streamPhysicalModel: grpc.handleServerStreamingCall<_android_emulation_control_PhysicalModelValue__Output, _android_emulation_control_PhysicalModelValue>;
  
  streamScreenshot: grpc.handleServerStreamingCall<_android_emulation_control_ImageFormat__Output, _android_emulation_control_Image>;
  
  streamSensor: grpc.handleServerStreamingCall<_android_emulation_control_SensorValue__Output, _android_emulation_control_SensorValue>;
  
}

export interface EmulatorControllerDefinition extends grpc.ServiceDefinition {
  getBattery: MethodDefinition<_google_protobuf_Empty, _android_emulation_control_BatteryState, _google_protobuf_Empty__Output, _android_emulation_control_BatteryState__Output>
  getBrightness: MethodDefinition<_android_emulation_control_BrightnessValue, _android_emulation_control_BrightnessValue, _android_emulation_control_BrightnessValue__Output, _android_emulation_control_BrightnessValue__Output>
  getClipboard: MethodDefinition<_google_protobuf_Empty, _android_emulation_control_ClipData, _google_protobuf_Empty__Output, _android_emulation_control_ClipData__Output>
  getDisplayConfigurations: MethodDefinition<_google_protobuf_Empty, _android_emulation_control_DisplayConfigurations, _google_protobuf_Empty__Output, _android_emulation_control_DisplayConfigurations__Output>
  getDisplayMode: MethodDefinition<_google_protobuf_Empty, _android_emulation_control_DisplayMode, _google_protobuf_Empty__Output, _android_emulation_control_DisplayMode__Output>
  getGps: MethodDefinition<_google_protobuf_Empty, _android_emulation_control_GpsState, _google_protobuf_Empty__Output, _android_emulation_control_GpsState__Output>
  getLogcat: MethodDefinition<_android_emulation_control_LogMessage, _android_emulation_control_LogMessage, _android_emulation_control_LogMessage__Output, _android_emulation_control_LogMessage__Output>
  getMicrophoneState: MethodDefinition<_google_protobuf_Empty, _android_emulation_control_MicrophoneState, _google_protobuf_Empty__Output, _android_emulation_control_MicrophoneState__Output>
  getPhysicalModel: MethodDefinition<_android_emulation_control_PhysicalModelValue, _android_emulation_control_PhysicalModelValue, _android_emulation_control_PhysicalModelValue__Output, _android_emulation_control_PhysicalModelValue__Output>
  getScreenshot: MethodDefinition<_android_emulation_control_ImageFormat, _android_emulation_control_Image, _android_emulation_control_ImageFormat__Output, _android_emulation_control_Image__Output>
  getSensor: MethodDefinition<_android_emulation_control_SensorValue, _android_emulation_control_SensorValue, _android_emulation_control_SensorValue__Output, _android_emulation_control_SensorValue__Output>
  getStatus: MethodDefinition<_google_protobuf_Empty, _android_emulation_control_EmulatorStatus, _google_protobuf_Empty__Output, _android_emulation_control_EmulatorStatus__Output>
  getVmState: MethodDefinition<_google_protobuf_Empty, _android_emulation_control_VmRunState, _google_protobuf_Empty__Output, _android_emulation_control_VmRunState__Output>
  getXrOptions: MethodDefinition<_google_protobuf_Empty, _android_emulation_control_XrOptions, _google_protobuf_Empty__Output, _android_emulation_control_XrOptions__Output>
  injectAudio: MethodDefinition<_android_emulation_control_AudioPacket, _google_protobuf_Empty, _android_emulation_control_AudioPacket__Output, _google_protobuf_Empty__Output>
  injectWheel: MethodDefinition<_android_emulation_control_WheelEvent, _google_protobuf_Empty, _android_emulation_control_WheelEvent__Output, _google_protobuf_Empty__Output>
  rotateVirtualSceneCamera: MethodDefinition<_android_emulation_control_RotationRadian, _google_protobuf_Empty, _android_emulation_control_RotationRadian__Output, _google_protobuf_Empty__Output>
  sendFingerprint: MethodDefinition<_android_emulation_control_Fingerprint, _google_protobuf_Empty, _android_emulation_control_Fingerprint__Output, _google_protobuf_Empty__Output>
  sendKey: MethodDefinition<_android_emulation_control_KeyboardEvent, _google_protobuf_Empty, _android_emulation_control_KeyboardEvent__Output, _google_protobuf_Empty__Output>
  sendMouse: MethodDefinition<_android_emulation_control_MouseEvent, _google_protobuf_Empty, _android_emulation_control_MouseEvent__Output, _google_protobuf_Empty__Output>
  sendPhone: MethodDefinition<_android_emulation_control_PhoneCall, _android_emulation_control_PhoneResponse, _android_emulation_control_PhoneCall__Output, _android_emulation_control_PhoneResponse__Output>
  sendSms: MethodDefinition<_android_emulation_control_SmsMessage, _android_emulation_control_PhoneResponse, _android_emulation_control_SmsMessage__Output, _android_emulation_control_PhoneResponse__Output>
  sendTouch: MethodDefinition<_android_emulation_control_TouchEvent, _google_protobuf_Empty, _android_emulation_control_TouchEvent__Output, _google_protobuf_Empty__Output>
  setBattery: MethodDefinition<_android_emulation_control_BatteryState, _google_protobuf_Empty, _android_emulation_control_BatteryState__Output, _google_protobuf_Empty__Output>
  setBrightness: MethodDefinition<_android_emulation_control_BrightnessValue, _google_protobuf_Empty, _android_emulation_control_BrightnessValue__Output, _google_protobuf_Empty__Output>
  setClipboard: MethodDefinition<_android_emulation_control_ClipData, _google_protobuf_Empty, _android_emulation_control_ClipData__Output, _google_protobuf_Empty__Output>
  setDisplayConfigurations: MethodDefinition<_android_emulation_control_DisplayConfigurations, _android_emulation_control_DisplayConfigurations, _android_emulation_control_DisplayConfigurations__Output, _android_emulation_control_DisplayConfigurations__Output>
  setDisplayMode: MethodDefinition<_android_emulation_control_DisplayMode, _google_protobuf_Empty, _android_emulation_control_DisplayMode__Output, _google_protobuf_Empty__Output>
  setEnvironment: MethodDefinition<_android_emulation_control_Environment, _google_protobuf_Empty, _android_emulation_control_Environment__Output, _google_protobuf_Empty__Output>
  setGps: MethodDefinition<_android_emulation_control_GpsState, _google_protobuf_Empty, _android_emulation_control_GpsState__Output, _google_protobuf_Empty__Output>
  setMicrophoneState: MethodDefinition<_android_emulation_control_MicrophoneState, _google_protobuf_Empty, _android_emulation_control_MicrophoneState__Output, _google_protobuf_Empty__Output>
  setPhoneNumber: MethodDefinition<_android_emulation_control_PhoneNumber, _android_emulation_control_PhoneResponse, _android_emulation_control_PhoneNumber__Output, _android_emulation_control_PhoneResponse__Output>
  setPhysicalModel: MethodDefinition<_android_emulation_control_PhysicalModelValue, _google_protobuf_Empty, _android_emulation_control_PhysicalModelValue__Output, _google_protobuf_Empty__Output>
  setPosture: MethodDefinition<_android_emulation_control_Posture, _google_protobuf_Empty, _android_emulation_control_Posture__Output, _google_protobuf_Empty__Output>
  setSensor: MethodDefinition<_android_emulation_control_SensorValue, _google_protobuf_Empty, _android_emulation_control_SensorValue__Output, _google_protobuf_Empty__Output>
  setVirtualSceneCameraVelocity: MethodDefinition<_android_emulation_control_Velocity, _google_protobuf_Empty, _android_emulation_control_Velocity__Output, _google_protobuf_Empty__Output>
  setVmState: MethodDefinition<_android_emulation_control_VmRunState, _google_protobuf_Empty, _android_emulation_control_VmRunState__Output, _google_protobuf_Empty__Output>
  setXrOptions: MethodDefinition<_android_emulation_control_XrOptions, _google_protobuf_Empty, _android_emulation_control_XrOptions__Output, _google_protobuf_Empty__Output>
  streamAudio: MethodDefinition<_android_emulation_control_AudioFormat, _android_emulation_control_AudioPacket, _android_emulation_control_AudioFormat__Output, _android_emulation_control_AudioPacket__Output>
  streamClipboard: MethodDefinition<_google_protobuf_Empty, _android_emulation_control_ClipData, _google_protobuf_Empty__Output, _android_emulation_control_ClipData__Output>
  streamInputEvent: MethodDefinition<_android_emulation_control_InputEvent, _google_protobuf_Empty, _android_emulation_control_InputEvent__Output, _google_protobuf_Empty__Output>
  streamLogcat: MethodDefinition<_android_emulation_control_LogMessage, _android_emulation_control_LogMessage, _android_emulation_control_LogMessage__Output, _android_emulation_control_LogMessage__Output>
  streamNotification: MethodDefinition<_google_protobuf_Empty, _android_emulation_control_Notification, _google_protobuf_Empty__Output, _android_emulation_control_Notification__Output>
  streamPhysicalModel: MethodDefinition<_android_emulation_control_PhysicalModelValue, _android_emulation_control_PhysicalModelValue, _android_emulation_control_PhysicalModelValue__Output, _android_emulation_control_PhysicalModelValue__Output>
  streamScreenshot: MethodDefinition<_android_emulation_control_ImageFormat, _android_emulation_control_Image, _android_emulation_control_ImageFormat__Output, _android_emulation_control_Image__Output>
  streamSensor: MethodDefinition<_android_emulation_control_SensorValue, _android_emulation_control_SensorValue, _android_emulation_control_SensorValue__Output, _android_emulation_control_SensorValue__Output>
}
