import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@/components/ui/button';
import { useLocale, useMessages } from '@/i18n/useLocale';
import { cn } from '@/lib/utils';

export function NotFound() {
  const lang = useLocale();
  const t = useMessages();

  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-[80rem] flex-col justify-center px-4 py-20 sm:px-6">
      <p className="font-mono text-xs tracking-[0.06em] text-muted uppercase">404</p>
      <h1 className="mt-4 text-display-s leading-[1.04]">{t.notFound.title}</h1>
      <p className="mt-4 max-w-[48ch] text-lg text-muted">{t.notFound.body}</p>
      <Link
        to="/$lang"
        params={{ lang }}
        className={cn(buttonVariants({ variant: 'glass', size: 'pill-lg' }), 'mt-8 w-fit')}
      >
        {t.notFound.back}
      </Link>
    </div>
  );
}
