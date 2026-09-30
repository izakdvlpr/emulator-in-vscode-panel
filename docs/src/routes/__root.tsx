import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router';
import { NotFound } from '@/components/site/NotFound';
import { messages } from '@/i18n/messages';

export const Route = createRootRoute({
  head: () => ({ meta: [{ title: messages.pt.brand }] }),
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
