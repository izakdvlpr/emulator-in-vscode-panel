import { z } from 'zod';

export const localeSchema = z.enum(['pt', 'en']);

export type Locale = z.infer<typeof localeSchema>;

export const locales = localeSchema.options;

export const defaultLocale: Locale = 'en';
