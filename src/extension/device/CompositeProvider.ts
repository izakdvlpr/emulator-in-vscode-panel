import type * as vscode from 'vscode';
import type { DeviceDescriptor, StartingStep } from '../../shared/device';
import type { DeviceCatalog, DeviceProvider, DeviceSession } from './DeviceProvider';

/** Junta os providers de cada plataforma numa lista só e encaminha o Start para o dono do device. */
export class CompositeProvider implements DeviceCatalog {
  private owners = new Map<string, DeviceProvider>();

  constructor(
    private readonly providers: DeviceProvider[],
    private readonly output: vscode.OutputChannel,
  ) {}

  async listDevices(): Promise<DeviceDescriptor[]> {
    const results = await Promise.allSettled(
      this.providers.map((provider) => provider.listDevices()),
    );
    const owners = new Map<string, DeviceProvider>();
    const devices: DeviceDescriptor[] = [];
    const errors: string[] = [];
    results.forEach((result, index) => {
      const provider = this.providers[index];
      if (!provider) return;
      if (result.status === 'fulfilled') {
        for (const device of result.value) owners.set(device.id, provider);
        devices.push(...result.value);
      } else {
        const message = errorMessage(result.reason);
        errors.push(message);
        // Uma plataforma sem SDK/Xcode não deve esconder os devices da outra.
        this.output.appendLine(`[${provider.platform}] could not list devices: ${message}`);
      }
    });
    this.owners = owners;
    if (devices.length === 0 && errors.length === this.providers.length) {
      throw new Error(errors.join(' '));
    }
    return devices;
  }

  async start(
    deviceId: string,
    onProgress: (step: StartingStep) => void,
    signal: AbortSignal,
  ): Promise<DeviceSession> {
    if (!this.owners.has(deviceId)) await this.listDevices();
    const provider = this.owners.get(deviceId);
    if (!provider) throw new Error(`Device ${deviceId} not found.`);
    return provider.start(deviceId, onProgress, signal);
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
