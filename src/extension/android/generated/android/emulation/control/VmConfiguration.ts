// Original file: proto/emulator_controller.proto

import type { Long } from '@grpc/proto-loader';

// Original file: proto/emulator_controller.proto

export const _android_emulation_control_VmConfiguration_VmHypervisorType = {
  UNKNOWN: 'UNKNOWN',
  NONE: 'NONE',
  KVM: 'KVM',
  HAXM: 'HAXM',
  HVF: 'HVF',
  WHPX: 'WHPX',
  AEHD: 'AEHD',
} as const;

export type _android_emulation_control_VmConfiguration_VmHypervisorType =
  | 'UNKNOWN'
  | 0
  | 'NONE'
  | 1
  | 'KVM'
  | 2
  | 'HAXM'
  | 3
  | 'HVF'
  | 4
  | 'WHPX'
  | 5
  | 'AEHD'
  | 6

export type _android_emulation_control_VmConfiguration_VmHypervisorType__Output = typeof _android_emulation_control_VmConfiguration_VmHypervisorType[keyof typeof _android_emulation_control_VmConfiguration_VmHypervisorType]

export interface VmConfiguration {
  'hypervisorType'?: (_android_emulation_control_VmConfiguration_VmHypervisorType);
  'numberOfCpuCores'?: (number);
  'ramSizeBytes'?: (number | string | Long);
}

export interface VmConfiguration__Output {
  'hypervisorType': (_android_emulation_control_VmConfiguration_VmHypervisorType__Output);
  'numberOfCpuCores': (number);
  'ramSizeBytes': (number);
}
