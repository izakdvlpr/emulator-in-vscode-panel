import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/locales';

export const docGroups = ['start', 'reference', 'internals', 'project'] as const;

export type DocGroup = (typeof docGroups)[number];

export interface DocSection {
  id: string;
  title: string;
  body: ReactNode;
}

export interface DocContent {
  title: string;
  description: string;
  intro?: ReactNode;
  sections: DocSection[];
}

export interface DocPage {
  slug: string;
  group: DocGroup;
  content: Record<Locale, DocContent>;
}

export function defineDoc(page: DocPage): DocPage {
  return page;
}
