import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router';
import { NotFound } from '@/components/site/NotFound';
import { defaultLocale } from '@/i18n/locales';
import { messages } from '@/i18n/messages';

export const Route = createRootRoute({
  head: () => ({ meta: [{ title: messages[defaultLocale].brand }] }),
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}
