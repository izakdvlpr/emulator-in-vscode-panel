import type { HardwareButton, Platform } from '../../shared/device';

interface NavBarProps {
  enabled: boolean;
  platform: Platform;
  onButton: (button: HardwareButton) => void;
}

type NavButton = { button: HardwareButton; label: string; glyph: string };

// O iOS não tem Back; o app switcher sai de `recents` (duplo Home).
const navButtons: Record<Platform, NavButton[]> = {
  android: [
    { button: 'back', label: 'Back', glyph: '◁' },
    { button: 'home', label: 'Home', glyph: '○' },
    { button: 'recents', label: 'Recents', glyph: '□' },
  ],
  ios: [
    { button: 'home', label: 'Home', glyph: '○' },
    { button: 'recents', label: 'App Switcher', glyph: '▭' },
  ],
};

export function NavBar({ enabled, platform, onButton }: NavBarProps) {
  return (
    <nav className="navbar" aria-label="Device navigation">
      {navButtons[platform].map(({ button, label, glyph }) => (
        <button
          key={button}
          type="button"
          className="icon"
          title={label}
          aria-label={label}
          disabled={!enabled}
          onClick={() => onButton(button)}
        >
          {glyph}
        </button>
      ))}
    </nav>
  );
}
