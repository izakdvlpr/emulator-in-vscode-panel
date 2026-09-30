import { randomBytes } from 'node:crypto';
import * as vscode from 'vscode';

/** Onde o app do emulador está desenhado: a view da sidebar ou uma aba de editor. */
export interface Surface {
  readonly kind: 'sidebar' | 'editor';
  readonly webview: vscode.Webview;
  readonly visible: boolean;
  readonly onDidChangeVisibility: vscode.Event<void>;
}

export function fromView(view: vscode.WebviewView): Surface {
  return {
    kind: 'sidebar',
    webview: view.webview,
    get visible() {
      return view.visible;
    },
    onDidChangeVisibility: view.onDidChangeVisibility,
  };
}

export function fromPanel(panel: vscode.WebviewPanel): Surface {
  return {
    kind: 'editor',
    webview: panel.webview,
    get visible() {
      return panel.visible;
    },
    onDidChangeVisibility: (listener, thisArgs, disposables) =>
      panel.onDidChangeViewState(() => listener.call(thisArgs), undefined, disposables),
  };
}

export const placeholderCommands = ['emulatorPanel.open', 'emulatorPanel.moveToSidebar'];

export function appOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return {
    enableScripts: true,
    localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist', 'webview')],
  };
}

export function renderAppHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const root = vscode.Uri.joinPath(extensionUri, 'dist', 'webview');
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(root, 'index.js'));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(root, 'index.css'));
  const nonce = randomBytes(16).toString('base64');
  const csp = [
    "default-src 'none'",
    `style-src ${webview.cspSource}`,
    `script-src 'nonce-${nonce}'`,
  ].join('; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="${styleUri}" />
  <title>Emulator</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

// Sem script: os links são command URIs, liberados só para os comandos em `placeholderCommands`.
export function renderPlaceholderHtml(): string {
  const nonce = randomBytes(16).toString('base64');
  const csp = ["default-src 'none'", `style-src 'nonce-${nonce}'`].join('; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="${csp}" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style nonce="${nonce}">
    body {
      margin: 0;
      padding: 16px;
      color: var(--vscode-descriptionForeground);
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
    }
    p { margin: 0 0 8px; }
    a { color: var(--vscode-textLink-foreground); }
    a:hover { color: var(--vscode-textLink-activeForeground); }
  </style>
  <title>Emulator</title>
</head>
<body>
  <p>The device is open in an editor tab.</p>
  <p>
    <a href="command:emulatorPanel.open">Show</a> ·
    <a href="command:emulatorPanel.moveToSidebar">Move back here</a>
  </p>
</body>
</html>`;
}
