import { Link } from '@tanstack/react-router';
import { Languages } from 'lucide-react';
import type { Locale } from '@/i18n/locales';
import { useLocale, useMessages } from '@/i18n/useLocale';
import { cn } from '@/lib/utils';

export function LangSwitch({ className }: { className?: string }) {
  const lang = useLocale();
  const t = useMessages();
  const target: Locale = lang === 'pt' ? 'en' : 'pt';

  return (
    <Link
      to="."
      params={(previous) => ({ ...previous, lang: target })}
      hash={(previous) => previous ?? ''}
      hrefLang={target === 'pt' ? 'pt-BR' : 'en'}
      aria-label={t.switchLanguage}
      title={t.switchLanguage}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-control)] px-2.5 font-mono text-xs tracking-[0.04em] text-muted uppercase transition-colors hover:bg-paper-2 hover:text-ink',
        className,
      )}
    >
      <Languages className="size-4" aria-hidden />
      {target}
    </Link>
  );
}
