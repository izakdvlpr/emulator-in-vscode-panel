import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { docsByGroup } from '@/content/docs';
import { locales } from '@/i18n/locales';
import { messages } from '@/i18n/messages';
import { useLocale, useMessages } from '@/i18n/useLocale';
import { manifest } from '@/lib/manifest';
import { author, marketplaceUrl, openVsxUrl, releasesUrl, repositoryUrl } from '@/lib/site';

const footerLink = 'whitespace-nowrap text-muted transition-colors hover:text-ink';

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <h2 className="text-sm font-medium tracking-normal text-ink">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}

function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noreferrer" className={footerLink}>
        {children}
      </a>
    </li>
  );
}

export function SiteFooter() {
  const lang = useLocale();
  const t = useMessages();

  return (
    <footer className="border-t border-rule">
      <div className="mx-auto grid max-w-[80rem] grid-cols-2 gap-x-6 gap-y-12 px-4 pt-16 pb-20 sm:grid-cols-3 sm:px-6 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
        <div className="col-span-2 min-w-0 sm:col-span-3 lg:col-span-1">
          <Link
            to="/$lang"
            params={{ lang }}
            className="inline-flex items-center gap-2.5 whitespace-nowrap font-heading text-[0.95rem] font-medium tracking-[-0.01em] text-ink"
          >
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-6" />
            {t.brand}
          </Link>
          <p className="mt-5 font-mono text-xs text-muted">
            v{manifest.version} · {t.footer.license}
          </p>
          <p className="mt-2 text-sm text-muted">
            {t.footer.createdBy}{' '}
            <a
              href={author.url}
              target="_blank"
              rel="noreferrer"
              className="text-ink-2 transition-colors hover:text-ink"
            >
              {author.name}
            </a>
          </p>
        </div>

        <Column title={t.footer.docs}>
          {docsByGroup().map(({ group, pages }) => {
            const first = pages[0];
            if (!first) return null;
            return (
              <li key={group}>
                <Link
                  to="/$lang/docs/$slug"
                  params={{ lang, slug: first.slug }}
                  className={footerLink}
                >
                  {t.groups[group]}
                </Link>
              </li>
            );
          })}
        </Column>

        <Column title={t.footer.project}>
          <External href={repositoryUrl}>{t.footer.source}</External>
          <External href={releasesUrl}>{t.nav.changelog}</External>
          <External href={marketplaceUrl}>VS Code Marketplace</External>
          <External href={openVsxUrl}>Open VSX</External>
        </Column>

        <Column title={t.footer.language}>
          {locales.map((locale) => (
            <li key={locale}>
              <Link
                to="."
                params={(previous) => ({ ...previous, lang: locale })}
                hash={(previous) => previous ?? ''}
                hrefLang={messages[locale].htmlLang}
                aria-current={locale === lang ? 'true' : undefined}
                className={locale === lang ? 'whitespace-nowrap text-ink' : footerLink}
              >
                {messages[locale].languageName}
              </Link>
            </li>
          ))}
        </Column>
      </div>
    </footer>
  );
}
