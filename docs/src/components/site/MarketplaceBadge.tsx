import type { ReactNode } from 'react';
import { marketplaceUrl, openVsxUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

const stores = {
  vscode: {
    name: 'VS Code Marketplace',
    href: marketplaceUrl,
    logo: (
      <svg viewBox="0 0 24 24" fill="#23a9f2" aria-hidden className="size-8 shrink-0">
        <path d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
      </svg>
    ),
  },
  openvsx: {
    name: 'Open VSX Registry',
    href: openVsxUrl,
    logo: (
      <svg viewBox="4.6 5 96.2 122.7" aria-hidden className="h-8 w-[1.6rem] shrink-0">
        <path
          d="M30 44.2L52.6 5H7.3zM4.6 88.5h45.3L27.2 49.4zm51 0l22.6 39.2 22.6-39.2z"
          fill="#c160ef"
        />
        <path
          d="M52.6 5L30 44.2h45.2zM27.2 49.4l22.7 39.1 22.6-39.1zm51 0L55.6 88.5h45.2z"
          fill="#a60ee5"
        />
      </svg>
    ),
  },
} satisfies Record<string, { name: string; href: string; logo: ReactNode }>;

// Mesma arte de media/*-badge.svg, com texto em HTML para usar a fonte do site.
export function MarketplaceBadge({
  store,
  className,
}: {
  store: keyof typeof stores;
  className?: string;
}) {
  const { name, href, logo } = stores[store];

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Download on the ${name}`}
      className={cn(
        'inline-flex h-14 items-center gap-3 whitespace-nowrap rounded-[10px] border border-[#a6a6a6] bg-black pr-4 pl-3 text-white transition-[filter] hover:brightness-150 active:translate-y-px',
        className,
      )}
    >
      {logo}
      <span className="flex flex-col">
        <span className="text-[0.66rem] leading-none font-medium">Download on the</span>
        <span className="mt-1 text-[1.05rem] leading-tight font-semibold">{name}</span>
      </span>
    </a>
  );
}
