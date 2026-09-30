import { useParams } from '@tanstack/react-router';
import { type Locale, localeSchema } from './locales';
import { type Messages, messages } from './messages';

export function useLocale(): Locale {
  const params = useParams({ strict: false });
  return localeSchema.catch('pt').parse(params.lang);
}

export function useMessages(): Messages {
  return messages[useLocale()];
}
