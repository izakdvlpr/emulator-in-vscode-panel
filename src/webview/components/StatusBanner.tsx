import type { StartingStep, TabState } from '../../shared/device';

const stepLabels: Record<StartingStep, string> = {
  launching: 'Launching device…',
  connecting: 'Connecting to device…',
  booting: 'Waiting for the device to boot…',
};

export function StatusBanner({ tab }: { tab: TabState | undefined }) {
  switch (tab?.kind) {
    case undefined:
      return <p className="status">Select a device and press Start.</p>;
    case 'starting':
      return <p className="status status--busy">{stepLabels[tab.step]}</p>;
    case 'stopping':
      return (
        <p className="status status--busy">
          {tab.attached
            ? 'Detaching from device…'
            : tab.platform === 'android'
              ? 'Stopping emulator… Saving the Quick Boot snapshot can take ~20s.'
              : 'Stopping device…'}
        </p>
      );
    case 'error':
      return (
        <p className="status status--error" role="alert">
          {tab.message}
        </p>
      );
    case 'ready':
      return null;
  }
}
