import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { NotFound } from '@/components/site/NotFound';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteNav } from '@/components/site/SiteNav';
import { SearchProvider } from '@/components/site/search';
import { localeSchema } from '@/i18n/locales';
import { useMessages } from '@/i18n/useLocale';

export const Route = createFileRoute('/$lang')({
  beforeLoad: ({ params }) => {
    if (!localeSchema.safeParse(params.lang).success) throw notFound();
  },
  component: LangLayout,
  notFoundComponent: NotFound,
});

function LangLayout() {
  const t = useMessages();

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
  }, [t.htmlLang]);

  return (
    <SearchProvider>
      <div className="flex min-h-dvh flex-col">
        <SiteNav />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </SearchProvider>
  );
}
