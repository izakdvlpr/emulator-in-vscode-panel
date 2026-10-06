import { Link } from '@tanstack/react-router';
import type { ComponentProps, ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useLocale } from '@/i18n/useLocale';
import { cn } from '@/lib/utils';

export function P({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('leading-7 not-first:mt-4', className)} {...props} />;
}

export function H3({ className, ...props }: ComponentProps<'h3'>) {
  return <h3 className={cn('mt-9 text-lg tracking-[-0.02em]', className)} {...props} />;
}

export function Strong(props: ComponentProps<'strong'>) {
  return <strong className="font-semibold text-ink" {...props} />;
}

export function Code({ className, ...props }: ComponentProps<'code'>) {
  return (
    <code
      className={cn(
        'rounded-[5px] border border-rule bg-paper-2 px-1 py-px font-mono text-[0.84em] break-words text-ink',
        className,
      )}
      {...props}
    />
  );
}

export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'inline-flex min-w-[1.6em] items-center justify-center rounded-[5px] border border-rule-2 border-b-2 bg-paper-2 px-1 font-mono text-[0.78em] leading-5 text-ink',
        className,
      )}
      {...props}
    />
  );
}

export function List({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      className={cn(
        'not-first:mt-4 space-y-2.5 pl-5 leading-7 marker:text-rule-2 list-disc',
        className,
      )}
      {...props}
    />
  );
}

export function Steps({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      className={cn(
        'not-first:mt-4 space-y-2.5 pl-6 leading-7 list-decimal marker:font-mono marker:text-sm marker:text-muted',
        className,
      )}
      {...props}
    />
  );
}

export function Note({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="not-first:mt-6 rounded-[var(--radius-card)] border border-rule bg-surface px-5 py-4 text-[0.95rem] leading-7">
      <p className="font-mono text-xs tracking-[0.06em] text-muted uppercase">{label}</p>
      <div className="mt-1">{children}</div>
    </aside>
  );
}

export function ExternalLink({ className, ...props }: ComponentProps<'a'>) {
  return (
    <a
      className={cn(
        'font-medium text-ink underline decoration-rule-2 underline-offset-4 transition-colors hover:decoration-ink',
        className,
      )}
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  );
}

export function DocLink({
  slug,
  hash,
  children,
}: {
  slug: string;
  hash?: string;
  children: ReactNode;
}) {
  const lang = useLocale();
  return (
    <Link
      to="/$lang/docs/$slug"
      params={{ lang, slug }}
      {...(hash ? { hash } : {})}
      className="font-medium text-ink underline decoration-rule-2 underline-offset-4 transition-colors hover:decoration-ink"
    >
      {children}
    </Link>
  );
}

export function DataTable({
  head,
  rows,
}: {
  head: readonly ReactNode[];
  rows: readonly (readonly ReactNode[])[];
}) {
  return (
    <div className="not-first:mt-5 overflow-hidden rounded-[var(--radius-card)] border border-rule">
      <Table className="text-[0.9rem]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {head.map((cell, index) => (
              <TableHead
                // biome-ignore lint/suspicious/noArrayIndexKey: colunas fixas, sem reordenação
                key={index}
                className="h-10 bg-surface px-3 font-mono text-xs font-normal tracking-[0.06em] text-muted uppercase"
              >
                {cell}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: linhas estáticas
            <TableRow key={rowIndex} className="hover:bg-transparent">
              {row.map((cell, cellIndex) => (
                <TableCell
                  // biome-ignore lint/suspicious/noArrayIndexKey: colunas fixas
                  key={cellIndex}
                  className="min-w-40 px-3 py-3 align-top leading-6 whitespace-normal first:min-w-0 first:whitespace-nowrap"
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
