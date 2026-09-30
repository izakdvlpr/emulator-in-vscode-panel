import { Link } from '@tanstack/react-router';
import { ArrowDown, ArrowRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { HomeContent, MapNode } from '@/content/home';
import { useLocale } from '@/i18n/useLocale';
import { useReveal } from '@/lib/useReveal';
import { cn } from '@/lib/utils';

function Node({ node, emphasis = false }: { node: MapNode; emphasis?: boolean }) {
  const lang = useLocale();
  return (
    <Link
      to="/$lang/docs/$slug"
      params={{ lang, slug: node.slug }}
      {...(node.hash ? { hash: node.hash } : {})}
      className={cn(
        'group block min-w-0 flex-1 rounded-[var(--radius-card)] border bg-paper px-4 py-3.5 transition-[border-color] duration-200',
        'hover:border-focus',
        emphasis ? 'border-rule-2' : 'border-rule',
      )}
    >
      <span className="text-[0.72rem] font-semibold tracking-[0.04em] text-muted uppercase">
        {node.tag}
      </span>
      <span className="mt-1 block font-display text-[1.05rem] font-semibold text-ink transition-colors group-hover:text-accent-strong">
        {node.title}
      </span>
      <span className="mt-2 block space-y-0.5 font-mono text-[0.75rem] leading-5 text-ink-2">
        {node.lines.map((line) => (
          <span key={line} className="block break-words">
            {line}
          </span>
        ))}
      </span>
    </Link>
  );
}

// Seta que aponta para baixo no empilhamento mobile e para a direita no desktop.
function Connector({ breakpoint, label }: { breakpoint: 'sm' | 'lg'; label?: string }) {
  const horizontal = breakpoint === 'sm' ? 'sm' : 'lg';
  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center gap-2 self-center text-rule-2',
        horizontal === 'sm' ? 'h-7 sm:h-auto sm:w-7' : 'h-9 lg:h-auto lg:flex-col lg:px-3',
        label && 'text-accent-strong',
      )}
    >
      {label ? (
        <span className="order-last flex gap-1.5 font-mono text-[0.7rem] leading-4 whitespace-nowrap text-accent-strong lg:order-first lg:flex-col lg:items-center lg:gap-0">
          {label.split(' · ').map((part) => (
            <span key={part}>{part}</span>
          ))}
        </span>
      ) : null}
      <ArrowDown className={cn('size-4', horizontal === 'sm' ? 'sm:hidden' : 'lg:hidden')} />
      <ArrowRight className={cn('hidden size-4', horizontal === 'sm' ? 'sm:block' : 'lg:block')} />
    </span>
  );
}

function Step({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('reveal', className)} style={{ '--reveal-step': index } as CSSProperties}>
      {children}
    </div>
  );
}

function Lane({
  label,
  platform,
  source,
  capture,
}: {
  label: string;
  platform: 'android' | 'ios';
  source: MapNode;
  capture: MapNode;
}) {
  return (
    <div className="rounded-[calc(var(--radius-card)+4px)] border border-dashed border-rule-2 p-2.5">
      <p className="flex items-center gap-2 px-1.5 pb-2 text-[0.8rem] font-semibold text-ink-2">
        {/* Mesmas cores de plataforma da webview (--android / --ios). */}
        <span
          aria-hidden
          className={cn('size-2 rounded-full', platform === 'android' ? 'bg-android' : 'bg-ios')}
        />
        {label}
      </p>
      <div className="flex flex-col sm:flex-row">
        <Node node={source} />
        <Connector breakpoint="sm" />
        <Node node={capture} />
      </div>
    </div>
  );
}

export function PipelineMap({ content }: { content: HomeContent['map'] }) {
  const ref = useReveal<HTMLDivElement>();
  const { nodes } = content;

  return (
    <figure ref={ref} aria-label={content.label} className="min-w-0">
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        <div className="flex min-w-0 flex-col gap-3 lg:flex-[2.1]">
          <Step index={0}>
            <Lane
              label={content.android}
              platform="android"
              source={nodes.emulator}
              capture={nodes.screenrecord}
            />
          </Step>
          <Step index={1}>
            <Lane
              label={content.ios}
              platform="ios"
              source={nodes.simulator}
              capture={nodes.helper}
            />
          </Step>
        </div>
        <Connector breakpoint="lg" />
        <Step index={2} className="flex min-w-0 lg:flex-1">
          <Node node={nodes.host} emphasis />
        </Step>
        <Connector breakpoint="lg" label={content.transport} />
        <Step index={3} className="flex min-w-0 lg:flex-1">
          <Node node={nodes.webview} emphasis />
        </Step>
      </div>
      <figcaption className="mt-4 font-mono text-[0.72rem] tracking-[0.04em] text-muted">
        {content.label}
      </figcaption>
    </figure>
  );
}
