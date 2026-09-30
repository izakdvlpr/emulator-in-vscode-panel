import { z } from 'zod';

export const localeSchema = z.enum(['pt', 'en']);

export type Locale = z.infer<typeof localeSchema>;

export const locales = localeSchema.options;

export function detectLocale(languages: readonly string[]): Locale {
  return languages.some((language) => language.toLowerCase().startsWith('pt')) ? 'pt' : 'en';
}
