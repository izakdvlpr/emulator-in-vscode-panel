import type { ReactNode } from 'react';
import type { HardwareButton, Platform, RotateDirection } from '../../shared/device';

interface DeviceControlsProps {
  enabled: boolean;
  platform: Platform;
  onButton: (button: HardwareButton) => void;
  onRotate: (direction: RotateDirection) => void;
  onScreenshot: () => void;
}

interface Control {
  label: string;
  icon: ReactNode;
  action: (props: DeviceControlsProps) => void;
}

const controls: Control[] = [
  {
    label: 'Rotate left',
    icon: <path d="M4 4v5h5M4.5 9A7 7 0 1 1 5 15" />,
    action: ({ onRotate }) => onRotate('left'),
  },
  {
    label: 'Rotate right',
    icon: <path d="M20 4v5h-5M19.5 9A7 7 0 1 0 19 15" />,
    action: ({ onRotate }) => onRotate('right'),
  },
  {
    label: 'Volume down',
    icon: <path d="M4 9v6h4l5 4V5L8 9H4zM16 12h5" />,
    action: ({ onButton }) => onButton('volumeDown'),
  },
  {
    label: 'Volume up',
    icon: <path d="M4 9v6h4l5 4V5L8 9H4zM16 12h5M18.5 9.5v5" />,
    action: ({ onButton }) => onButton('volumeUp'),
  },
  {
    label: 'Power',
    icon: <path d="M12 3v8M7 6.3a7 7 0 1 0 10 0" />,
    action: ({ onButton }) => onButton('power'),
  },
  {
    label: 'Take screenshot',
    icon: (
      <>
        <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
    action: ({ onScreenshot }) => onScreenshot(),
  },
];

// No iPhone o botão lateral só bloqueia a tela; desligar é pelo Stop.
function controlLabel(label: string, platform: Platform): string {
  return platform === 'ios' && label === 'Power' ? 'Lock' : label;
}

export function DeviceControls(props: DeviceControlsProps) {
  return (
    <div className="controls" role="toolbar" aria-label="Device controls">
      {controls.map(({ label, icon, action }) => (
        <button
          key={label}
          type="button"
          className="icon"
          title={controlLabel(label, props.platform)}
          aria-label={controlLabel(label, props.platform)}
          disabled={!props.enabled}
          onClick={() => action(props)}
        >
          <svg className="controls__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {icon}
          </svg>
        </button>
      ))}
    </div>
  );
}
