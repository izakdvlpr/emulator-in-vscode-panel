import type { Locale } from '@/i18n/locales';
import { type DocGroup, type DocPage, docGroups } from '../types';
import { architecture } from './architecture';
import { controls } from './controls';
import { install } from './install';
import { ios } from './ios';
import { limitations } from './limitations';
import { requirements } from './requirements';
import { roadmap } from './roadmap';
import { scriptsDoc } from './scripts';
import { settings } from './settings';
import { shutdown } from './shutdown';
import { usage } from './usage';

// A ordem aqui define sidebar, busca e prev/next.
export const docs: readonly DocPage[] = [
  requirements,
  install,
  usage,
  controls,
  settings,
  scriptsDoc,
  architecture,
  ios,
  shutdown,
  limitations,
  roadmap,
];

export function getDoc(slug: string): DocPage | undefined {
  return docs.find((doc) => doc.slug === slug);
}

export function getNeighbors(slug: string): { previous?: DocPage; next?: DocPage } {
  const index = docs.findIndex((doc) => doc.slug === slug);
  const previous = index > 0 ? docs[index - 1] : undefined;
  const next = index >= 0 ? docs[index + 1] : undefined;
  return { ...(previous ? { previous } : {}), ...(next ? { next } : {}) };
}

export function docsByGroup(): readonly { group: DocGroup; pages: readonly DocPage[] }[] {
  return docGroups.map((group) => ({ group, pages: docs.filter((doc) => doc.group === group) }));
}

export type SearchEntry = {
  slug: string;
  hash?: string;
  title: string;
  parent?: string;
};

export function searchEntries(locale: Locale): readonly SearchEntry[] {
  return docs.flatMap((doc) => {
    const content = doc.content[locale];
    return [
      { slug: doc.slug, title: content.title },
      ...content.sections.map((section) => ({
        slug: doc.slug,
        hash: section.id,
        title: section.title,
        parent: content.title,
      })),
    ];
  });
}
