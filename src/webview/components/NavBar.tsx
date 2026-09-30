import type { HardwareButton, Platform } from '../../shared/device';
import { Icon, type IconName } from './Icon';

interface NavBarProps {
  enabled: boolean;
  platform: Platform;
  onButton: (button: HardwareButton) => void;
}

type NavButton = { button: HardwareButton; label: string; icon: IconName };

// O iOS não tem Back; o app switcher sai de `recents` (duplo Home).
const navButtons: Record<Platform, NavButton[]> = {
  android: [
    { button: 'back', label: 'Back', icon: 'back' },
    { button: 'home', label: 'Home', icon: 'home' },
    { button: 'recents', label: 'Recents', icon: 'recents' },
  ],
  ios: [
    { button: 'home', label: 'Home', icon: 'home' },
    { button: 'recents', label: 'App Switcher', icon: 'switcher' },
  ],
};

export function NavBar({ enabled, platform, onButton }: NavBarProps) {
  return (
    <nav className="navbar" aria-label="Device navigation">
      {navButtons[platform].map(({ button, label, icon }) => (
        <button
          key={button}
          type="button"
          className="ghost ghost--nav"
          title={label}
          aria-label={label}
          disabled={!enabled}
          onClick={() => onButton(button)}
        >
          <Icon name={icon} />
        </button>
      ))}
    </nav>
  );
}
