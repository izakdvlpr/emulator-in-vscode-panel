import type { DeviceDescriptor, TabState } from '../../shared/device';
import { DevicePicker } from './DevicePicker';
import { Icon } from './Icon';

interface DeviceToolbarProps {
  devices: DeviceDescriptor[];
  selectedId: string;
  /** Aba do device selecionado no dropdown, se houver. */
  selectedTab: TabState | undefined;
  refreshing: boolean;
  onSelect: (deviceId: string) => void;
  onRefresh: () => void;
  onStart: () => void;
  onStop: () => void;
}

function ActionButton({
  selected,
  selectedId,
  selectedTab,
  onStart,
  onStop,
}: Pick<DeviceToolbarProps, 'selectedId' | 'selectedTab' | 'onStart' | 'onStop'> & {
  selected: DeviceDescriptor | undefined;
}) {
  if (selectedTab && selectedTab.kind !== 'error') {
    // Durante o Start o descriptor ainda diz "não rodando"; a aba é quem sabe.
    const detach = selectedTab.kind !== 'starting' && selectedTab.attached;
    return (
      <button
        type="button"
        className="action action--stop"
        disabled={selectedTab.kind === 'stopping'}
        onClick={onStop}
      >
        {detach ? <Icon name="unlink" /> : <Icon name="stop" className="icon--fill" />}
        {detach ? 'Detach' : 'Stop'}
      </button>
    );
  }
  return (
    <button
      type="button"
      className="action"
      disabled={selectedId === ''}
      title={selected?.running ? 'Connect to the device that is already running' : undefined}
      onClick={onStart}
    >
      {selected?.running ? <Icon name="link" /> : <Icon name="play" className="icon--fill" />}
      {selected?.running ? 'Attach' : 'Start'}
    </button>
  );
}

export function DeviceToolbar({
  devices,
  selectedId,
  selectedTab,
  refreshing,
  onSelect,
  onRefresh,
  onStart,
  onStop,
}: DeviceToolbarProps) {
  const selected = devices.find((device) => device.id === selectedId);

  return (
    <div className="toolbar">
      <DevicePicker devices={devices} selectedId={selectedId} onSelect={onSelect} />
      <button
        type="button"
        className={refreshing ? 'ghost ghost--spinning' : 'ghost'}
        title="Refresh devices"
        aria-label="Refresh devices"
        onClick={onRefresh}
      >
        <Icon name="refresh" />
      </button>
      <ActionButton
        selected={selected}
        selectedId={selectedId}
        selectedTab={selectedTab}
        onStart={onStart}
        onStop={onStop}
      />
    </div>
  );
}
