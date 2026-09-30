import { useEffect, useReducer } from 'react';
import type { DeviceDescriptor, PanelState } from '../shared/device';
import type { HostToWebview } from '../shared/protocol';
import { DeviceControls } from './components/DeviceControls';
import { DeviceScreen } from './components/DeviceScreen';
import { DeviceTabs } from './components/DeviceTabs';
import { DeviceToolbar } from './components/DeviceToolbar';
import { NavBar } from './components/NavBar';
import { StatusBanner } from './components/StatusBanner';
import { onHostMessage, postToHost } from './vscodeApi';

interface AppState {
  devices: DeviceDescriptor[];
  devicesError: string | undefined;
  selectedId: string;
  panel: PanelState;
}

type ScreenMessage = Extract<
  HostToWebview,
  { type: 'frame' | 'videoConfig' | 'videoChunk' | 'clearScreen' }
>;
type AppAction = Exclude<HostToWebview, ScreenMessage> | { type: 'select'; deviceId: string };

const screenMessageTypes = new Set<string>([
  'frame',
  'videoConfig',
  'videoChunk',
  'clearScreen',
] satisfies Array<ScreenMessage['type']>);

// Mensagens de tela vão direto para o `DeviceScreen`; passar pelo reducer re-renderizaria o
// app a cada frame.
function isScreenMessage(message: HostToWebview): message is ScreenMessage {
  return screenMessageTypes.has(message.type);
}

// Webviews fora do Electron (ex.: VS Code no navegador) podem não ter H.264 no WebCodecs.
async function canDecodeH264(): Promise<boolean> {
  if (typeof VideoDecoder === 'undefined') return false;
  try {
    const { supported } = await VideoDecoder.isConfigSupported({ codec: 'avc1.42E01F' });
    return supported === true;
  } catch {
    return false;
  }
}

const initialState: AppState = {
  devices: [],
  devicesError: undefined,
  selectedId: '',
  panel: { tabs: [], activeId: undefined },
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'devices': {
      const stillExists = action.devices.some((device) => device.id === state.selectedId);
      return {
        ...state,
        devices: action.devices,
        devicesError: action.error,
        selectedId: stillExists ? state.selectedId : (action.devices[0]?.id ?? ''),
      };
    }
    case 'state': {
      const panel = action.state;
      // O dropdown acompanha a troca de aba, mas não é sobrescrito a cada atualização de estado
      // (o usuário pode estar escolhendo o próximo device enquanto outro inicia).
      const activeChanged = panel.activeId !== state.panel.activeId;
      const selectedId =
        activeChanged && panel.activeId !== undefined ? panel.activeId : state.selectedId;
      return { ...state, panel, selectedId };
    }
    case 'select':
      return { ...state, selectedId: action.deviceId };
  }
}

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsubscribe = onHostMessage((message) => {
      if (!isScreenMessage(message)) dispatch(message);
    });
    void canDecodeH264().then((h264) => postToHost({ type: 'ready', h264 }));
    return unsubscribe;
  }, []);

  const { tabs, activeId } = state.panel;
  const activeTab = tabs.find((tab) => tab.deviceId === activeId);
  const selectedTab = tabs.find((tab) => tab.deviceId === state.selectedId);
  const ready = activeTab?.kind === 'ready';
  const platform = activeTab?.kind === 'ready' ? activeTab.platform : 'android';

  return (
    <main className="app">
      <DeviceToolbar
        devices={state.devices}
        selectedId={state.selectedId}
        selectedTab={selectedTab}
        onSelect={(deviceId) => dispatch({ type: 'select', deviceId })}
        onRefresh={() => postToHost({ type: 'refreshDevices' })}
        onStart={() => postToHost({ type: 'start', deviceId: state.selectedId })}
        onStop={() => postToHost({ type: 'stop', deviceId: state.selectedId })}
      />
      {state.devicesError && (
        <p className="status status--error" role="alert">
          {state.devicesError}
        </p>
      )}
      <DeviceTabs
        tabs={tabs}
        activeId={activeId}
        devices={state.devices}
        onSelect={(deviceId) => postToHost({ type: 'selectTab', deviceId })}
        onClose={(deviceId) => postToHost({ type: 'stop', deviceId })}
      />
      <StatusBanner tab={activeTab} />
      <DeviceScreen active={ready} />
      <NavBar
        enabled={ready}
        platform={platform}
        onButton={(button) => postToHost({ type: 'button', button })}
      />
      <DeviceControls
        enabled={ready}
        platform={platform}
        onButton={(button) => postToHost({ type: 'button', button })}
        onRotate={(direction) => postToHost({ type: 'rotate', direction })}
        onScreenshot={() => postToHost({ type: 'screenshot' })}
      />
    </main>
  );
}
