import { Link } from '@tanstack/react-router';
import { useLocale, useMessages } from '@/i18n/useLocale';

export function NotFound() {
  const lang = useLocale();
  const t = useMessages();

  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-[88rem] flex-col justify-center px-4 py-20 sm:px-6">
      <p className="font-mono text-xs tracking-[0.06em] text-muted uppercase">404</p>
      <h1 className="mt-3 text-display-s font-semibold">{t.notFound.title}</h1>
      <p className="mt-3 max-w-[48ch] text-lg">{t.notFound.body}</p>
      <Link
        to="/$lang"
        params={{ lang }}
        className="mt-8 inline-flex h-10 w-fit items-center whitespace-nowrap rounded-[var(--radius-control)] bg-button px-4 text-sm font-semibold text-button-ink transition-colors hover:bg-button-hover"
      >
        {t.notFound.back}
      </Link>
    </div>
  );
}
