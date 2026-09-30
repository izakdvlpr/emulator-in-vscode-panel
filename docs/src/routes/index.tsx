import { createFileRoute, redirect } from '@tanstack/react-router';
import { detectLocale } from '@/i18n/locales';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({
      to: '/$lang',
      params: { lang: detectLocale(navigator.languages) },
      replace: true,
    });
  },
});
