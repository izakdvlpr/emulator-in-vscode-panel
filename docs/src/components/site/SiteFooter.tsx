import { Link } from '@tanstack/react-router';
import { useLocale, useMessages } from '@/i18n/useLocale';
import { manifest } from '@/lib/manifest';
import { author, releasesUrl, repositoryUrl } from '@/lib/site';
import { LangSwitch } from './LangSwitch';

export function SiteFooter() {
  const lang = useLocale();
  const t = useMessages();

  return (
    <footer className="border-t border-rule bg-chrome">
      <div className="mx-auto flex max-w-[88rem] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-5 text-sm text-muted sm:px-6">
        <Link
          to="/$lang"
          params={{ lang }}
          className="whitespace-nowrap font-medium text-ink-2 hover:text-ink"
        >
          {t.brand}
        </Link>
        <span className="whitespace-nowrap font-mono text-xs">v{manifest.version}</span>
        <span className="whitespace-nowrap">{t.footer.license}</span>
        <a
          href={repositoryUrl}
          target="_blank"
          rel="noreferrer"
          className="whitespace-nowrap hover:text-ink"
        >
          {t.footer.source}
        </a>
        <a
          href={releasesUrl}
          target="_blank"
          rel="noreferrer"
          className="whitespace-nowrap hover:text-ink"
        >
          {t.nav.changelog}
        </a>
        <span className="whitespace-nowrap">
          {t.footer.createdBy}{' '}
          <a
            href={author.url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink-2 hover:text-ink"
          >
            {author.name}
          </a>
        </span>
        <LangSwitch className="ml-auto -mr-2.5" />
      </div>
    </footer>
  );
}
