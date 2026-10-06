import { Check, Copy, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useMessages } from '@/i18n/useLocale';
import { cn } from '@/lib/utils';

type CopyState = 'idle' | 'copied' | 'failed';

export function CodeBlock({
  label,
  code,
  tone = 'paper',
  className,
}: {
  label: string;
  code: string;
  tone?: 'paper' | 'graphite';
  className?: string;
}) {
  const t = useMessages();
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setState('copied');
    } catch {
      setState('failed');
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), 1600);
  }

  const graphite = tone === 'graphite';
  const lines = code.split('\n');

  return (
    <figure
      className={cn(
        'not-first:mt-5 overflow-hidden rounded-[var(--radius-card)] border',
        graphite
          ? 'border-graphite-rule bg-graphite-2 text-on-graphite'
          : 'border-rule bg-graphite text-on-graphite',
        className,
      )}
    >
      <figcaption className="flex items-center justify-between gap-3 border-b border-graphite-rule py-1.5 pr-1.5 pl-4">
        <span className="truncate font-mono text-[0.7rem] tracking-[0.06em] text-on-graphite-muted uppercase">
          {label}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-live="polite"
          className={cn(
            'inline-flex h-7 shrink-0 items-center gap-1.5 rounded-[var(--radius-control)] px-2 font-mono text-[0.7rem] tracking-[0.04em] text-on-graphite-muted uppercase transition-colors duration-150',
            'hover:bg-graphite-rule hover:text-on-graphite active:translate-y-px',
            'focus-visible:outline-2 focus-visible:outline-accent-on-graphite',
            state === 'copied' && 'text-accent-on-graphite',
          )}
        >
          {state === 'copied' ? (
            <Check className="size-3.5" aria-hidden />
          ) : state === 'failed' ? (
            <TriangleAlert className="size-3.5" aria-hidden />
          ) : (
            <Copy className="size-3.5" aria-hidden />
          )}
          {t.code[state === 'idle' ? 'copy' : state]}
        </button>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[0.85rem] leading-6">
        {lines.length > 1 ? (
          <code className="table">
            {lines.map((line, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: linhas estáticas do snippet
              <span key={index} className="table-row">
                <span
                  aria-hidden
                  className="table-cell pr-5 text-right text-on-graphite-muted/60 select-none"
                >
                  {index + 1}
                </span>
                <span className="table-cell">{line}</span>
              </span>
            ))}
          </code>
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </figure>
  );
}
