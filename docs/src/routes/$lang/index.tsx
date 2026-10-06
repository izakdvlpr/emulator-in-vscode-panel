import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PipelineMap } from '@/components/home/PipelineMap';
import { MarketplaceBadge } from '@/components/site/MarketplaceBadge';
import { buttonVariants } from '@/components/ui/button';
import { docsByGroup } from '@/content/docs';
import { home } from '@/content/home';
import { localeSchema } from '@/i18n/locales';
import { messages } from '@/i18n/messages';
import { useLocale, useMessages } from '@/i18n/useLocale';
import { manifest } from '@/lib/manifest';
import { extensionId, marketplaceUrl } from '@/lib/site';
import { cn } from '@/lib/utils';

const quickStartCode = `code --install-extension ${extensionId}`;

export const Route = createFileRoute('/$lang/')({
  head: ({ params }) => {
    const lang = localeSchema.catch('pt').parse(params.lang);
    return {
      meta: [{ title: messages[lang].brand }, { name: 'description', content: home[lang].lede }],
    };
  },
  component: Home,
});

const container = 'mx-auto max-w-[80rem] px-4 sm:px-6';
const sectionTitle = 'text-section leading-[1.1] tracking-section';

function Home() {
  const lang = useLocale();
  const t = useMessages();
  const content = home[lang];

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--gradient-glow)]"
        />
        <div
          className={`${container} grid gap-14 pt-14 pb-24 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16 lg:pb-32`}
        >
          <div className="min-w-0">
            <p className="inline-flex h-8 items-center whitespace-nowrap rounded-full border border-rule bg-surface px-3.5 font-mono text-xs text-muted">
              v{manifest.version} · VS Code {manifest.engines.vscode}
              <span className="hidden min-[400px]:inline">&nbsp;· Android + iOS</span>
            </p>
            <h1 className="text-fade mt-7 pb-1 text-display leading-[1.02]">{content.title}</h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-8 text-muted">{content.lede}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={marketplaceUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'glass', size: 'pill-lg' }))}
              >
                {t.nav.install}
              </a>
              <Link
                to="/$lang/docs/$slug"
                params={{ lang, slug: 'architecture' }}
                className={cn(
                  buttonVariants({ variant: 'quiet', size: 'pill-lg' }),
                  'group gap-1.5',
                )}
              >
                {content.secondaryCta}
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
          <figure className="w-full min-w-0 overflow-hidden rounded-[var(--radius-card)] border border-rule-2">
            <img
              src={`${import.meta.env.BASE_URL}example.gif`}
              alt={content.demoAlt}
              width={800}
              height={437}
              className="block h-auto w-full"
            />
          </figure>
        </div>
      </section>

      <section className="border-t border-rule">
        <div className={`${container} py-24 lg:py-32`}>
          <div className="mx-auto max-w-[40rem] text-center">
            <h2 className={sectionTitle}>{content.secondaryCta}</h2>
            <p className="mt-5 text-lg leading-8 text-muted">{content.map.label}</p>
          </div>
          <div className="mt-14 rounded-[var(--radius-panel)] border border-rule p-3 sm:p-6 lg:p-8">
            <PipelineMap content={content.map} />
            <div className="mt-8 grid gap-3 border-t border-rule px-1 pt-6 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10">
              <h3 className="text-lg">{content.map.inputTitle}</h3>
              <p className="max-w-[68ch] leading-7 text-muted">
                {content.map.input}{' '}
                <Link
                  to="/$lang/docs/$slug"
                  params={{ lang, slug: 'architecture' }}
                  hash="input"
                  className="font-medium whitespace-nowrap text-ink underline decoration-rule-2 underline-offset-4 hover:decoration-ink"
                >
                  {content.map.inputLink}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-rule">
        <div className={`${container} py-24 lg:py-32`}>
          <div className="mx-auto max-w-[40rem] text-center">
            <h2 className={sectionTitle}>{content.quickStart.title}</h2>
            <p className="mt-5 text-lg leading-8 text-muted">{content.quickStart.lede}</p>
          </div>
          <div className="mx-auto mt-10 max-w-[42rem]">
            <CodeBlock label="terminal" code={quickStartCode} />
          </div>
          <p className="mx-auto mt-6 max-w-[40rem] text-center leading-7 text-muted">
            {content.quickStart.after}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <MarketplaceBadge store="vscode" />
            <MarketplaceBadge store="openvsx" />
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/$lang/docs/$slug"
              params={{ lang, slug: 'requirements' }}
              className="group inline-flex items-center gap-1.5 font-medium whitespace-nowrap text-ink-2 transition-colors hover:text-ink"
            >
              {content.quickStart.requirementsLink}
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-rule">
        <div className={`${container} py-24 lg:py-32`}>
          <h2 className={sectionTitle}>{content.index.title}</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {docsByGroup().map(({ group, pages }) => (
              <div key={group} className="min-w-0 bg-paper p-6">
                <h3 className="font-mono text-xs font-normal tracking-[0.06em] text-muted uppercase">
                  {t.groups[group]}
                </h3>
                <ul className="mt-5 space-y-5">
                  {pages.map((page) => (
                    <li key={page.slug}>
                      <Link
                        to="/$lang/docs/$slug"
                        params={{ lang, slug: page.slug }}
                        className="group block"
                      >
                        <span className="font-medium text-ink-2 transition-colors group-hover:text-ink">
                          {page.content[lang].title}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-muted">
                          {page.content[lang].description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-rule">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--gradient-glow-low)]"
        />
        <div className={`${container} py-28 text-center lg:py-40`}>
          <h2 className="text-fade mx-auto max-w-[14ch] pb-1 font-display text-display leading-[1.02] font-normal tracking-display">
            {content.closing.title}
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted">{content.closing.lede}</p>
          <a
            href={marketplaceUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: 'glass', size: 'pill-lg' }), 'mt-10')}
          >
            {content.closing.cta}
          </a>
        </div>
      </section>
    </>
  );
}
