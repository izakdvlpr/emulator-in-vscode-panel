// Original file: proto/emulator_controller.proto


// Original file: proto/emulator_controller.proto

export const _android_emulation_control_ImageTransport_TransportChannel = {
  TRANSPORT_CHANNEL_UNSPECIFIED: 'TRANSPORT_CHANNEL_UNSPECIFIED',
  MMAP: 'MMAP',
} as const;

export type _android_emulation_control_ImageTransport_TransportChannel =
  | 'TRANSPORT_CHANNEL_UNSPECIFIED'
  | 0
  | 'MMAP'
  | 1

export type _android_emulation_control_ImageTransport_TransportChannel__Output = typeof _android_emulation_control_ImageTransport_TransportChannel[keyof typeof _android_emulation_control_ImageTransport_TransportChannel]

export interface ImageTransport {
  'channel'?: (_android_emulation_control_ImageTransport_TransportChannel);
  'handle'?: (string);
}

export interface ImageTransport__Output {
  'channel': (_android_emulation_control_ImageTransport_TransportChannel__Output);
  'handle': (string);
}
