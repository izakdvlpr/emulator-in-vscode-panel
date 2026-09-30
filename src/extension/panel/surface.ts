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
    html, body { height: 100%; }
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin: 0;
      padding: 24px;
      box-sizing: border-box;
      color: var(--vscode-descriptionForeground);
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      text-align: center;
    }
    svg {
      width: 40px;
      height: 40px;
      padding: 12px;
      color: var(--vscode-focusBorder);
      background: color-mix(in srgb, var(--vscode-focusBorder) 14%, transparent);
      border-radius: 14px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    p { margin: 0; }
    .title { color: var(--vscode-foreground); font-weight: 600; }
    .actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 6px; }
    a {
      padding: 4px 12px;
      border-radius: 6px;
      text-decoration: none;
      color: var(--vscode-button-secondaryForeground);
      background: var(--vscode-button-secondaryBackground);
    }
    a:hover { background: var(--vscode-button-secondaryHoverBackground); }
    a.primary { color: var(--vscode-button-foreground); background: var(--vscode-button-background); }
    a.primary:hover { background: var(--vscode-button-hoverBackground); }
    a:focus-visible { outline: 1px solid var(--vscode-focusBorder); outline-offset: 1px; }
  </style>
  <title>Emulator</title>
</head>
<body>
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="14" rx="2" />
    <path d="M3 8h18M8 21h8" />
  </svg>
  <p class="title">Device is open in an editor tab</p>
  <p>Drag the tab anywhere, or pop it out into its own window.</p>
  <div class="actions">
    <a class="primary" href="command:emulatorPanel.open">Show</a>
    <a href="command:emulatorPanel.moveToSidebar">Move back here</a>
  </div>
</body>
</html>`;
}
