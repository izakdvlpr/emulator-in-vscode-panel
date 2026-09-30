import type { DeviceDescriptor, Platform, TabState } from '../../shared/device';

interface DeviceToolbarProps {
  devices: DeviceDescriptor[];
  selectedId: string;
  /** Aba do device selecionado no dropdown, se houver. */
  selectedTab: TabState | undefined;
  onSelect: (deviceId: string) => void;
  onRefresh: () => void;
  onStart: () => void;
  onStop: () => void;
}

const platformLabels: Record<Platform, string> = { android: 'Android', ios: 'iOS' };

function DeviceOption({ device }: { device: DeviceDescriptor }) {
  return (
    <option value={device.id}>{device.running ? `${device.name} • running` : device.name}</option>
  );
}

export function DeviceToolbar({
  devices,
  selectedId,
  selectedTab,
  onSelect,
  onRefresh,
  onStart,
  onStop,
}: DeviceToolbarProps) {
  const selected = devices.find((device) => device.id === selectedId);
  // Com as duas plataformas na lista, agrupa para não misturar AVDs e simuladores.
  const platforms = [...new Set(devices.map((device) => device.platform))];

  return (
    <div className="toolbar">
      <select
        aria-label="Device"
        value={selectedId}
        onChange={(event) => onSelect(event.target.value)}
      >
        {devices.length === 0 && <option value="">No devices found</option>}
        {platforms.length > 1
          ? platforms.map((platform) => (
              <optgroup key={platform} label={platformLabels[platform]}>
                {devices
                  .filter((device) => device.platform === platform)
                  .map((device) => (
                    <DeviceOption key={device.id} device={device} />
                  ))}
              </optgroup>
            ))
          : devices.map((device) => <DeviceOption key={device.id} device={device} />)}
      </select>
      <button
        type="button"
        className="icon"
        title="Refresh devices"
        aria-label="Refresh devices"
        onClick={onRefresh}
      >
        ⟳
      </button>
      {selectedTab && selectedTab.kind !== 'error' ? (
        <button type="button" disabled={selectedTab.kind === 'stopping'} onClick={onStop}>
          {/* Durante o Start o descriptor ainda diz "não rodando"; a aba é quem sabe. */}
          {selectedTab.kind !== 'starting' && selectedTab.attached ? 'Detach' : 'Stop'}
        </button>
      ) : (
        <button
          type="button"
          disabled={selectedId === ''}
          title={selected?.running ? 'Connect to the device that is already running' : undefined}
          onClick={onStart}
        >
          {selected?.running ? 'Attach' : 'Start'}
        </button>
      )}
    </div>
  );
}
