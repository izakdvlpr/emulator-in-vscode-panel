import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PipelineMap } from '@/components/home/PipelineMap';
import { docsByGroup } from '@/content/docs';
import { home } from '@/content/home';
import { localeSchema } from '@/i18n/locales';
import { messages } from '@/i18n/messages';
import { useLocale, useMessages } from '@/i18n/useLocale';
import { manifest } from '@/lib/manifest';
import { extensionId, marketplaceUrl } from '@/lib/site';

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

const container = 'mx-auto max-w-[88rem] px-4 sm:px-6';

function Home() {
  const lang = useLocale();
  const t = useMessages();
  const content = home[lang];

  return (
    <>
      <section className={`${container} pt-12 pb-16 sm:pt-20 lg:pb-24`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
          <div className="min-w-0">
            <p className="font-mono text-xs tracking-[0.04em] text-muted">
              v{manifest.version} · VS Code {manifest.engines.vscode} · Android + iOS
            </p>
            <h1 className="mt-5 max-w-[22ch] text-display leading-[1.1] font-semibold">
              {content.title}
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-8 text-ink-2">{content.lede}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={marketplaceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center whitespace-nowrap rounded-[var(--radius-control)] bg-button px-5 text-[0.95rem] font-semibold text-button-ink transition-colors hover:bg-button-hover active:translate-y-px"
              >
                {content.primaryCta}
              </a>
              <Link
                to="/$lang/docs/$slug"
                params={{ lang, slug: 'architecture' }}
                className="group inline-flex h-11 items-center gap-1.5 whitespace-nowrap text-[0.95rem] font-medium text-ink"
              >
                {content.secondaryCta}
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
          <figure className="w-full max-w-[18.5rem] overflow-hidden rounded-[var(--radius-card)] border border-rule">
            <img
              src={`${import.meta.env.BASE_URL}example.gif`}
              alt={content.demoAlt}
              width={594}
              height={986}
              className="block h-auto w-full"
            />
          </figure>
        </div>

        <div className="mt-14 sm:mt-20">
          <PipelineMap content={content.map} />
        </div>

        <div className="mt-10 grid gap-3 border-t border-rule pt-6 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-10">
          <h2 className="text-base font-semibold">{content.map.inputTitle}</h2>
          <p className="max-w-[68ch] leading-7">
            {content.map.input}{' '}
            <Link
              to="/$lang/docs/$slug"
              params={{ lang, slug: 'architecture' }}
              hash="input"
              className="font-medium whitespace-nowrap text-ink underline decoration-rule-2 underline-offset-4 hover:decoration-accent-strong"
            >
              {content.map.inputLink}
            </Link>
          </p>
        </div>
      </section>

      <section className="bg-graphite text-on-graphite">
        <div
          className={`${container} grid gap-8 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:items-center md:gap-14 lg:py-20`}
        >
          <div>
            <h2 className="text-3xl font-semibold text-on-graphite">{content.quickStart.title}</h2>
            <p className="mt-4 leading-7 text-on-graphite-muted">{content.quickStart.lede}</p>
            <p className="mt-3 leading-7 text-on-graphite-muted">{content.quickStart.after}</p>
            <Link
              to="/$lang/docs/$slug"
              params={{ lang, slug: 'requirements' }}
              className="group mt-6 inline-flex items-center gap-1.5 font-medium whitespace-nowrap text-accent-on-graphite"
            >
              {content.quickStart.requirementsLink}
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </div>
          <CodeBlock label="terminal" code={quickStartCode} tone="graphite" className="mt-0" />
        </div>
      </section>

      <section className={`${container} py-16 lg:py-24`}>
        <h2 className="text-3xl font-semibold">{content.index.title}</h2>
        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {docsByGroup().map(({ group, pages }) => (
            <div key={group} className="min-w-0 border-t border-rule pt-4">
              <h3 className="text-[0.72rem] font-semibold tracking-[0.04em] text-muted uppercase">
                {t.groups[group]}
              </h3>
              <ul className="mt-4 space-y-4">
                {pages.map((page) => (
                  <li key={page.slug}>
                    <Link
                      to="/$lang/docs/$slug"
                      params={{ lang, slug: page.slug }}
                      className="group block"
                    >
                      <span className="font-medium text-ink transition-colors group-hover:text-accent-strong">
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
      </section>
    </>
  );
}
