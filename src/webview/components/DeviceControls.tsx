import { Fragment } from 'react';
import type {
  BiometricAction,
  HardwareButton,
  Platform,
  RotateDirection,
} from '../../shared/device';
import { Icon, type IconName } from './Icon';

interface DeviceControlsProps {
  enabled: boolean;
  platform: Platform;
  onButton: (button: HardwareButton) => void;
  onRotate: (direction: RotateDirection) => void;
  onBiometric: (action: BiometricAction) => void;
  onScreenshot: () => void;
  onLogs: () => void;
}

interface Control {
  label: string;
  icon: IconName;
  action: (props: DeviceControlsProps) => void;
  /** Sem valor, aparece nas duas plataformas. */
  platform?: Platform;
}

const groups: Control[][] = [
  [
    { label: 'Rotate left', icon: 'rotateLeft', action: ({ onRotate }) => onRotate('left') },
    { label: 'Rotate right', icon: 'rotateRight', action: ({ onRotate }) => onRotate('right') },
  ],
  [
    {
      label: 'Volume down',
      icon: 'volumeDown',
      action: ({ onButton }) => onButton('volumeDown'),
    },
    { label: 'Volume up', icon: 'volumeUp', action: ({ onButton }) => onButton('volumeUp') },
  ],
  [
    {
      label: 'Enroll biometrics',
      icon: 'fingerprintAdd',
      action: ({ onBiometric }) => onBiometric('enroll'),
      platform: 'ios',
    },
    {
      label: 'Biometric match',
      icon: 'fingerprint',
      action: ({ onBiometric }) => onBiometric('match'),
    },
    {
      label: 'Biometric no match',
      icon: 'fingerprintOff',
      action: ({ onBiometric }) => onBiometric('noMatch'),
    },
  ],
  [
    { label: 'Power', icon: 'power', action: ({ onButton }) => onButton('power') },
    { label: 'Take screenshot', icon: 'camera', action: ({ onScreenshot }) => onScreenshot() },
    { label: 'Show logs', icon: 'logs', action: ({ onLogs }) => onLogs() },
  ],
];

// No iPhone o botão lateral só bloqueia a tela; desligar é pelo Stop.
function presentation(control: Control, platform: Platform): Pick<Control, 'label' | 'icon'> {
  return platform === 'ios' && control.label === 'Power'
    ? { label: 'Lock', icon: 'lock' }
    : control;
}

export function DeviceControls(props: DeviceControlsProps) {
  return (
    <div className="controls" role="toolbar" aria-label="Device controls">
      {groups.map((group, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: os grupos são fixos.
        <Fragment key={index}>
          {index > 0 && <span className="controls__divider" aria-hidden="true" />}
          {group.map((control) => {
            if (control.platform && control.platform !== props.platform) return null;
            const { label, icon } = presentation(control, props.platform);
            return (
              <button
                key={control.label}
                type="button"
                className="ghost"
                title={label}
                aria-label={label}
                disabled={!props.enabled}
                onClick={() => control.action(props)}
              >
                <Icon name={icon} />
              </button>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
