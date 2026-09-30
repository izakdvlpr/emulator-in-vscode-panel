import type { DeviceDescriptor, TabState } from '../../shared/device';
import { deviceName } from '../deviceName';
import { Icon, PlatformIcon } from './Icon';

interface DeviceTabsProps {
  tabs: TabState[];
  activeId: string | undefined;
  devices: DeviceDescriptor[];
  onSelect: (deviceId: string) => void;
  onClose: (deviceId: string) => void;
}

const statusLabels: Record<TabState['kind'], string> = {
  starting: 'starting',
  ready: 'running',
  stopping: 'stopping',
  error: 'error',
};

function closeLabel(tab: TabState): string {
  switch (tab.kind) {
    case 'error':
      return 'Close';
    case 'ready':
    case 'stopping':
      return tab.attached ? 'Detach' : 'Stop';
    case 'starting':
      return 'Stop';
  }
}

export function DeviceTabs({ tabs, activeId, devices, onSelect, onClose }: DeviceTabsProps) {
  if (tabs.length === 0) return null;
  return (
    <div className="tabs" role="tablist" aria-label="Devices">
      {tabs.map((tab) => {
        const name = deviceName(devices, tab.deviceId);
        const active = tab.deviceId === activeId;
        const status = (
          <span className={`tab__status tab__status--${tab.kind}`} aria-hidden="true" />
        );
        // A aba pode existir antes de a plataforma ser conhecida (Start ainda em curso).
        const platform =
          tab.kind === 'ready' || tab.kind === 'stopping'
            ? tab.platform
            : devices.find((device) => device.id === tab.deviceId)?.platform;
        return (
          <div key={tab.deviceId} className={active ? 'tab tab--active' : 'tab'}>
            <button
              type="button"
              role="tab"
              className="tab__label"
              aria-selected={active}
              title={`${name} (${statusLabels[tab.kind]})`}
              onClick={() => onSelect(tab.deviceId)}
            >
              {platform ? <PlatformIcon platform={platform} badge={status} /> : status}
              <span className="tab__name">{name}</span>
            </button>
            <button
              type="button"
              className="tab__close"
              title={`${closeLabel(tab)} ${name}`}
              aria-label={`${closeLabel(tab)} ${name}`}
              disabled={tab.kind === 'stopping'}
              onClick={() => onClose(tab.deviceId)}
            >
              <Icon name="close" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
