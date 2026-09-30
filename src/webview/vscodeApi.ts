import type { HostToWebview, WebviewToHost } from '../shared/protocol';

interface VsCodeApi {
  postMessage(message: WebviewToHost): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

const api = acquireVsCodeApi();

export function postToHost(message: WebviewToHost): void {
  api.postMessage(message);
}

const hostMessageTypes = new Set<string>([
  'devices',
  'state',
  'frame',
  'videoConfig',
  'videoChunk',
  'clearScreen',
] satisfies Array<HostToWebview['type']>);

function isHostMessage(data: unknown): data is HostToWebview {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    typeof data.type === 'string' &&
    hostMessageTypes.has(data.type)
  );
}

export function onHostMessage(handler: (message: HostToWebview) => void): () => void {
  const listener = (event: MessageEvent<unknown>) => {
    if (isHostMessage(event.data)) handler(event.data);
  };
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}
