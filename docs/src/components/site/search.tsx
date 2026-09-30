import { useNavigate } from '@tanstack/react-router';
import { FileText, Hash } from 'lucide-react';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { searchEntries } from '@/content/docs';
import { useLocale, useMessages } from '@/i18n/useLocale';
import { Kbd } from '../docs/prose';

type SearchContextValue = { open: () => void };

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch(): SearchContextValue {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch fora do SearchProvider');
  return context;
}

export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(() => ({ open: () => setIsOpen(true) }), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen((current) => !current);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <SearchContext.Provider value={value}>
      {children}
      <SearchDialog open={isOpen} onOpenChange={setIsOpen} />
    </SearchContext.Provider>
  );
}

function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const lang = useLocale();
  const t = useMessages();
  const navigate = useNavigate();
  const entries = useMemo(() => searchEntries(lang), [lang]);
  const pages = entries.filter((entry) => !entry.hash);
  const sections = entries.filter((entry) => entry.hash);

  function go(slug: string, hash?: string) {
    onOpenChange(false);
    void navigate({ to: '/$lang/docs/$slug', params: { lang, slug }, ...(hash ? { hash } : {}) });
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t.search.label}
      description={t.search.placeholder}
      showCloseButton={false}
      className="top-[12vh] translate-y-0 border-rule sm:max-w-xl"
    >
      <CommandInput placeholder={t.search.placeholder} />
      <CommandList className="max-h-[min(60vh,26rem)]">
        <CommandEmpty>{t.search.empty}</CommandEmpty>
        <CommandGroup heading={t.search.pages}>
          {pages.map((entry) => (
            <CommandItem
              key={entry.slug}
              value={`${entry.title} ${entry.slug}`}
              onSelect={() => go(entry.slug)}
            >
              <FileText className="text-muted" aria-hidden />
              {entry.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={t.search.sections}>
          {sections.map((entry) => (
            <CommandItem
              key={`${entry.slug}#${entry.hash}`}
              value={`${entry.title} ${entry.parent} ${entry.slug} ${entry.hash}`}
              onSelect={() => go(entry.slug, entry.hash)}
            >
              <Hash className="text-muted" aria-hidden />
              <span className="min-w-0 truncate">{entry.title}</span>
              <span className="ml-auto shrink-0 text-xs text-muted">{entry.parent}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <div className="hidden items-center gap-4 border-t border-rule bg-paper-2 px-3 py-2 text-xs text-muted sm:flex">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> {t.search.hintNavigate}
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd> {t.search.hintOpen}
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>esc</Kbd> {t.search.hintClose}
        </span>
      </div>
    </CommandDialog>
  );
}
