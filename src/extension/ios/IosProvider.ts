import { access, chmod, constants } from 'node:fs/promises';
import * as vscode from 'vscode';
import type { DeviceDescriptor, StartingStep } from '../../shared/device';
import type { DeviceProvider, DeviceSession } from '../device/DeviceProvider';
import { HelperProcess } from './helper';
import { IosSession } from './IosSession';
import { developerDir, listSimulators, shutdown, simctl } from './simctl';

const bootTimeoutMs = 180_000;

export class IosProvider implements DeviceProvider {
  readonly platform = 'ios';

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly output: vscode.OutputChannel,
  ) {}

  listDevices(): Promise<DeviceDescriptor[]> {
    return listSimulators();
  }

  async start(
    udid: string,
    onProgress: (step: StartingStep) => void,
    signal: AbortSignal,
  ): Promise<DeviceSession> {
    const [dir, binary, simulators] = await Promise.all([
      developerDir(),
      this.helperBinary(),
      listSimulators(),
    ]);
    const simulator = simulators.find((entry) => entry.id === udid);
    if (!simulator) throw new Error(`Simulator ${udid} not found.`);
    // Um simulador já ligado (Simulator.app, outro processo) é anexado e nunca desligado.
    const attached = simulator.running;

    let helper: HelperProcess | undefined;
    try {
      if (!attached) {
        onProgress('launching');
        // Sem abrir o Simulator.app: o `simctl boot` sobe o device headless.
        await simctl(['boot', udid], { timeoutMs: 60_000, signal });
        onProgress('booting');
        await simctl(['bootstatus', udid], { timeoutMs: bootTimeoutMs, signal });
      }

      onProgress('connecting');
      const args = ['--udid', udid, '--developer-dir', dir];
      if (!attached) args.push('--owned');
      helper = new HelperProcess(binary, args, this.output);
      const screen = await helper.ready(signal);
      return new IosSession(udid, helper, screen, attached, this.output);
    } catch (error) {
      if (helper) await helper.terminate({ graceMs: 2000 });
      if (!attached) {
        await shutdown(udid).catch(() => {});
      }
      if (signal.aborted) throw signal.reason;
      throw error;
    }
  }

  // O `.vsix` é um zip e pode não preservar o bit de execução.
  private async helperBinary(): Promise<string> {
    const binary = vscode.Uri.joinPath(this.extensionUri, 'dist', 'bin', 'ios-helper').fsPath;
    try {
      await access(binary, constants.X_OK);
    } catch {
      try {
        await chmod(binary, 0o755);
      } catch {
        throw new Error('The iOS helper is missing from this build. Run "bun run build" on macOS.');
      }
    }
    return binary;
  }
}
