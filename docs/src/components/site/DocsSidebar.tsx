import { Link } from '@tanstack/react-router';
import { docsByGroup } from '@/content/docs';
import { useLocale, useMessages } from '@/i18n/useLocale';

export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const lang = useLocale();
  const t = useMessages();

  return (
    <nav aria-label={t.nav.docs} className="space-y-7">
      {docsByGroup().map(({ group, pages }) => (
        <div key={group}>
          <p className="px-2.5 text-[0.72rem] font-semibold tracking-[0.04em] text-muted uppercase">
            {t.groups[group]}
          </p>
          <ul className="mt-2 space-y-px">
            {pages.map((page) => (
              <li key={page.slug}>
                <Link
                  to="/$lang/docs/$slug"
                  params={{ lang, slug: page.slug }}
                  onClick={onNavigate}
                  className="block rounded-[var(--radius-control)] px-2.5 py-1.5 text-[0.92rem] text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
                  activeProps={{
                    'aria-current': 'page',
                    className: 'bg-accent-soft text-ink hover:bg-accent-soft hover:text-ink',
                  }}
                >
                  {page.content[lang].title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
