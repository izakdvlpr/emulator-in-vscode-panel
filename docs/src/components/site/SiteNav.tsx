import { Link } from '@tanstack/react-router';
import { Menu, Search } from 'lucide-react';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLocale, useMessages } from '@/i18n/useLocale';
import { marketplaceUrl, releasesUrl, repositoryUrl } from '@/lib/site';
import { Kbd } from '../docs/prose';
import { DocsSidebar } from './DocsSidebar';
import { GithubMark } from './GithubMark';
import { LangSwitch } from './LangSwitch';
import { useSearch } from './search';

const iconButton =
  'inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] text-muted transition-colors hover:bg-paper-2 hover:text-ink';

export function SiteNav() {
  const lang = useLocale();
  const t = useMessages();
  const search = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-chrome">
      <div className="mx-auto flex h-16 max-w-[88rem] items-center gap-3 px-4 sm:px-6">
        <Link
          to="/$lang"
          params={{ lang }}
          className="flex min-w-0 shrink-0 items-center gap-2.5 whitespace-nowrap font-display text-[0.98rem] font-semibold text-ink"
        >
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="size-6" />
          <span className="hidden min-[400px]:inline">{t.brand}</span>
        </Link>

        <button
          type="button"
          onClick={search.open}
          className="ml-auto hidden h-9 w-full max-w-72 items-center gap-2 rounded-full border border-rule bg-paper-2 pr-1.5 pl-3.5 text-sm text-muted transition-colors hover:border-rule-2 hover:text-ink md:flex lg:ml-8"
        >
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{t.search.placeholder}</span>
          <Kbd className="ml-auto shrink-0 rounded-full border-b px-2">⌘K</Kbd>
        </button>

        <nav className="ml-auto flex items-center gap-1" aria-label={t.brand}>
          <Link
            to="/$lang/docs/$slug"
            params={{ lang, slug: 'requirements' }}
            className="hidden h-9 items-center whitespace-nowrap rounded-[var(--radius-control)] px-3 text-sm font-medium text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink lg:inline-flex"
          >
            {t.nav.docs}
          </Link>
          <a
            href={releasesUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center whitespace-nowrap rounded-[var(--radius-control)] px-3 text-sm font-medium text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink lg:inline-flex"
          >
            {t.nav.changelog}
          </a>
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t.nav.github}
            className={iconButton}
          >
            <GithubMark className="size-[1.1rem]" />
          </a>
          <LangSwitch className="hidden sm:inline-flex" />
          <button
            type="button"
            onClick={search.open}
            aria-label={t.search.label}
            className={`${iconButton} md:hidden`}
          >
            <Search className="size-[1.1rem]" aria-hidden />
          </button>
          <a
            href={marketplaceUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-1 hidden h-9 items-center whitespace-nowrap rounded-[var(--radius-control)] bg-button px-3.5 text-sm font-semibold text-button-ink transition-colors hover:bg-button-hover active:translate-y-px sm:inline-flex"
          >
            {t.nav.install}
          </a>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger aria-label={t.nav.menu} className={`${iconButton} lg:hidden`}>
              <Menu className="size-[1.1rem]" aria-hidden />
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(20rem,86vw)] gap-0 overflow-y-auto p-0">
              <SheetTitle className="border-b border-rule px-5 py-4 font-display text-base">
                {t.brand}
              </SheetTitle>
              <SheetDescription className="sr-only">{t.nav.docs}</SheetDescription>
              <div className="px-3 py-5">
                <DocsSidebar onNavigate={() => setMenuOpen(false)} />
              </div>
              <div className="mt-auto flex items-center gap-2 border-t border-rule px-4 py-3">
                <LangSwitch />
                <a
                  href={marketplaceUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="ml-auto inline-flex h-9 items-center whitespace-nowrap rounded-[var(--radius-control)] bg-button px-3.5 text-sm font-semibold text-button-ink transition-colors hover:bg-button-hover"
                >
                  {t.nav.install}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}
