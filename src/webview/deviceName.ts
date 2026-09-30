import type { DeviceDescriptor } from '../shared/device';

// A lista de devices pode ainda não ter chegado (ou ter falhado) quando a aba já existe.
export function deviceName(devices: DeviceDescriptor[], deviceId: string): string {
  return devices.find((device) => device.id === deviceId)?.name ?? deviceId.replaceAll('_', ' ');
}
