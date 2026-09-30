import * as vscode from 'vscode';
import { AndroidProvider } from './android/AndroidProvider';
import { CompositeProvider } from './device/CompositeProvider';
import type { DeviceProvider } from './device/DeviceProvider';
import { IosProvider } from './ios/IosProvider';
import { EmulatorViewProvider } from './panel/EmulatorViewProvider';

let viewProvider: EmulatorViewProvider | undefined;

export function activate(context: vscode.ExtensionContext): void {
  const output = vscode.window.createOutputChannel('Emulator');
  const providers: DeviceProvider[] = [new AndroidProvider(output)];
  // O simulador de iOS só existe no macOS, com Xcode.
  if (process.platform === 'darwin') providers.push(new IosProvider(context.extensionUri, output));
  viewProvider = new EmulatorViewProvider(
    context.extensionUri,
    new CompositeProvider(providers, output),
    output,
  );

  context.subscriptions.push(
    output,
    vscode.window.registerWebviewViewProvider(EmulatorViewProvider.viewId, viewProvider, {
      webviewOptions: { retainContextWhenHidden: true },
    }),
    vscode.commands.registerCommand('emulatorPanel.open', () =>
      vscode.commands.executeCommand(`${EmulatorViewProvider.viewId}.focus`),
    ),
  );
}

export function deactivate(): Promise<void> {
  return viewProvider?.shutdownAll() ?? Promise.resolve();
}
