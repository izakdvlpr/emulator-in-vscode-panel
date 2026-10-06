import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react';
import { DocsSidebar } from '@/components/site/DocsSidebar';
import { NotFound } from '@/components/site/NotFound';
import { getDoc, getNeighbors } from '@/content/docs';
import type { DocPage } from '@/content/types';
import { defaultLocale, localeSchema } from '@/i18n/locales';
import { messages } from '@/i18n/messages';
import { useLocale, useMessages } from '@/i18n/useLocale';
import { repositoryUrl } from '@/lib/site';
import { useActiveSection } from '@/lib/useActiveSection';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/$lang/docs/$slug')({
  loader: ({ params }) => {
    if (!getDoc(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const lang = localeSchema.catch(defaultLocale).parse(params.lang);
    const content = getDoc(params.slug)?.content[lang];
    if (!content) return {};
    return {
      meta: [
        { title: `${content.title} · ${messages[lang].brand}` },
        { name: 'description', content: content.description },
      ],
    };
  },
  component: DocRoute,
  notFoundComponent: NotFound,
});

function DocRoute() {
  const { slug } = Route.useParams();
  const doc = getDoc(slug);
  // o loader já garante o slug; isto só estreita o tipo.
  if (!doc) return null;
  return <DocView key={doc.slug} doc={doc} />;
}

function DocView({ doc }: { doc: DocPage }) {
  const lang = useLocale();
  const t = useMessages();
  const content = doc.content[lang];
  const { previous, next } = getNeighbors(doc.slug);
  const active = useActiveSection(content.sections.map((section) => section.id));

  return (
    <div className="mx-auto max-w-[80rem] px-4 sm:px-6 lg:grid lg:grid-cols-[14.5rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[14.5rem_minmax(0,1fr)_13rem]">
      <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-y-auto py-10 pr-2 lg:block">
        <DocsSidebar />
      </aside>

      <article className="min-w-0 max-w-[46rem] py-10 lg:py-14">
        <p className="font-mono text-xs tracking-[0.06em] text-muted uppercase">
          {t.groups[doc.group]}
        </p>
        <h1 className="mt-4 text-display-s leading-[1.04]">{content.title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted">{content.description}</p>
        {content.intro ? <div className="mt-6">{content.intro}</div> : null}

        {content.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="mt-14 first-of-type:mt-12"
          >
            <h2
              id={`${section.id}-title`}
              className="group text-[1.75rem] leading-tight tracking-[-0.035em]"
            >
              <a href={`#${section.id}`} className="inline">
                {section.title}
                <span
                  aria-hidden
                  className="ml-2 text-rule-2 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  #
                </span>
              </a>
            </h2>
            <div className="mt-4">{section.body}</div>
          </section>
        ))}

        <footer className="mt-16 border-t border-rule pt-6">
          <a
            href={`${repositoryUrl}/blob/main/docs/src/content/docs/${doc.slug}.tsx`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm whitespace-nowrap text-muted hover:text-ink"
          >
            <Pencil className="size-3.5" aria-hidden />
            {t.docs.editOnGithub}
          </a>
          <nav
            aria-label={`${t.docs.previous} / ${t.docs.next}`}
            className="mt-8 grid gap-3 sm:grid-cols-2"
          >
            {previous ? (
              <NeighborLink page={previous} label={t.docs.previous} direction="previous" />
            ) : (
              <span className="hidden sm:block" />
            )}
            {next ? <NeighborLink page={next} label={t.docs.next} direction="next" /> : null}
          </nav>
        </footer>
      </article>

      <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] overflow-y-auto py-14 xl:block">
        <p className="font-mono text-xs tracking-[0.06em] text-muted uppercase">
          {t.docs.onThisPage}
        </p>
        <ul className="mt-3 space-y-px border-l border-rule">
          {content.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={active === section.id ? 'location' : undefined}
                className={cn(
                  '-ml-px block border-l py-1 pl-3 text-sm leading-6 transition-colors',
                  active === section.id
                    ? 'border-accent-strong text-ink'
                    : 'border-transparent text-muted hover:text-ink',
                )}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function NeighborLink({
  page,
  label,
  direction,
}: {
  page: DocPage;
  label: string;
  direction: 'previous' | 'next';
}) {
  const lang = useLocale();
  const Icon = direction === 'previous' ? ArrowLeft : ArrowRight;
  return (
    <Link
      to="/$lang/docs/$slug"
      params={{ lang, slug: page.slug }}
      className={cn(
        'group rounded-[var(--radius-card)] border border-rule px-5 py-4 transition-colors hover:border-rule-2 hover:bg-surface',
        direction === 'next' && 'sm:text-right',
      )}
    >
      <span
        className={cn(
          'flex items-center gap-1.5 font-mono text-xs tracking-[0.06em] text-muted uppercase',
          direction === 'next' && 'sm:justify-end',
        )}
      >
        {direction === 'previous' ? <Icon className="size-3.5" aria-hidden /> : null}
        {label}
        {direction === 'next' ? <Icon className="size-3.5" aria-hidden /> : null}
      </span>
      <span className="mt-1.5 block font-medium text-ink-2 transition-colors group-hover:text-ink">
        {page.content[lang].title}
      </span>
    </Link>
  );
}
