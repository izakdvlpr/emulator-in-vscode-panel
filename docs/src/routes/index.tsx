import { createFileRoute, redirect } from '@tanstack/react-router';
import { defaultLocale } from '@/i18n/locales';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({
      to: '/$lang',
      params: { lang: defaultLocale },
      replace: true,
    });
  },
});
