import type { ReactNode } from 'react';
import type { Platform } from '../../shared/device';

const fingerprint = (
  <path d="M5 9a8 8 0 0 1 14 0M7.5 18.5A9 9 0 0 1 6 13a6 6 0 0 1 12 0v1M9.5 20a12 12 0 0 1-1-7a3.5 3.5 0 0 1 7 0a14 14 0 0 1-.8 5.5M12 13v1.5a11 11 0 0 0 1 4.5" />
);

const paths = {
  play: <path d="M8 5.5v13l10-6.5z" />,
  stop: <rect x="6.5" y="6.5" width="11" height="11" rx="2" />,
  link: (
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  ),
  unlink: (
    <path d="M17 13.5l1.7-1.8a4 4 0 0 0-5.7-5.6L11.3 8M7 10.5l-1.7 1.8a4 4 0 0 0 5.7 5.6l1.7-1.9M4 4l16 16" />
  ),
  refresh: (
    <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4" />
  ),
  chevron: <path d="M7 10l5 5 5-5" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  close: <path d="M7 7l10 10M17 7L7 17" />,
  back: <path d="M16 5.5v13L6 12z" />,
  home: <circle cx="12" cy="12" r="6.5" />,
  recents: <rect x="6" y="6" width="12" height="12" rx="2" />,
  switcher: (
    <>
      <rect x="4" y="7" width="7" height="11" rx="1.5" />
      <rect x="13" y="7" width="7" height="11" rx="1.5" />
    </>
  ),
  rotateLeft: <path d="M4 4v5h5M4.5 9A7 7 0 1 1 5 15" />,
  rotateRight: <path d="M20 4v5h-5M19.5 9A7 7 0 1 0 19 15" />,
  volumeDown: <path d="M4 9v6h4l5 4V5L8 9H4zM16 12h5" />,
  volumeUp: <path d="M4 9v6h4l5 4V5L8 9H4zM16 12h5M18.5 9.5v5" />,
  power: <path d="M12 3v8M7 6.3a7 7 0 1 0 10 0" />,
  lock: (
    <>
      <rect x="5.5" y="10.5" width="13" height="9" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  fingerprint,
  fingerprintOff: (
    <>
      {fingerprint}
      <path d="M4 4l16 16" />
    </>
  ),
  fingerprintAdd: (
    <>
      <g transform="translate(-1 -1) scale(.82)">{fingerprint}</g>
      <path d="M19 15v6M16 18h6" />
    </>
  ),
  alert: <path d="M12 4l9 16H3zM12 10v4M12 17v.01" />,
  phone: (
    <>
      <rect x="6.5" y="2.75" width="11" height="18.5" rx="2.5" />
      <path d="M10.5 18.25h3" />
    </>
  ),
  android: (
    <>
      <path d="M5 16a7 7 0 0 1 14 0z" />
      <path d="M7.5 8.5L6 6M16.5 8.5L18 6" />
      <circle cx="9.5" cy="12.75" r=".4" />
      <circle cx="14.5" cy="12.75" r=".4" />
    </>
  ),
  ios: (
    <>
      <rect x="6.5" y="2.75" width="11" height="18.5" rx="3" />
      <path d="M10.5 5.75h3" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

export function PlatformIcon({ platform, badge }: { platform: Platform; badge?: ReactNode }) {
  return (
    <span className={`platform platform--${platform}`} title={platformLabels[platform]}>
      <Icon name={platform} />
      {badge}
    </span>
  );
}

export const platformLabels: Record<Platform, string> = { android: 'Android', ios: 'iOS' };
