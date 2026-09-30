import { Code, DataTable, P, Strong } from '@/components/docs/prose';
import type { Locale } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { defineDoc } from '../types';

type Status = 'done' | 'dropped';

const statusLabel: Record<Locale, Record<Status, string>> = {
  pt: { done: 'Feito', dropped: 'Descartado' },
  en: { done: 'Done', dropped: 'Dropped' },
};

function StatusTag({ status, locale }: { status: Status; locale: Locale }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[0.75rem]',
        status === 'done' ? 'text-ok' : 'text-muted',
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {statusLabel[locale][status]}
    </span>
  );
}

type Item = { status: Status; title: React.ReactNode; detail?: React.ReactNode };

function rows(locale: Locale, items: readonly Item[]) {
  return items.map((item) => [
    <StatusTag key="status" status={item.status} locale={locale} />,
    <span key="item">
      <Strong>{item.title}</Strong>
      {item.detail ? <span className="mt-1 block text-muted">{item.detail}</span> : null}
    </span>,
  ]);
}

const phase2: Record<Locale, readonly Item[]> = {
  pt: [
    {
      status: 'done',
      title: 'Vídeo comprimido',
      detail: (
        <>
          H.264 via <Code>screenrecord</Code> + WebCodecs. O emulador 36.x não expõe o serviço{' '}
          <Code>Rtc</Code>, então WebRTC ficou de fora.
        </>
      ),
    },
    {
      status: 'dropped',
      title: (
        <>
          Transporte fora do <Code>postMessage</Code>
        </>
      ),
      detail:
        'Com H.264 a banda cai para poucos Mbps, e um servidor WebSocket seria complexidade sem ganho.',
    },
    { status: 'done', title: 'Rotação' },
    { status: 'done', title: 'Multi-touch', detail: 'Pinch com Alt+arraste.' },
    { status: 'done', title: 'Clipboard bidirecional e colar texto' },
    { status: 'done', title: 'Anexar a emulador já rodando' },
    {
      status: 'done',
      title: 'Botões de volume/power e screenshot para arquivo',
      detail: 'A moldura do device ficou de fora, já que a tela é mostrada sem cantos.',
    },
    { status: 'done', title: 'Vários devices ao mesmo tempo', detail: 'Em abas no mesmo painel.' },
  ],
  en: [
    {
      status: 'done',
      title: 'Compressed video',
      detail: (
        <>
          H.264 through <Code>screenrecord</Code> + WebCodecs. Emulator 36.x does not expose the{' '}
          <Code>Rtc</Code> service, so WebRTC was left out.
        </>
      ),
    },
    {
      status: 'dropped',
      title: (
        <>
          Transport outside <Code>postMessage</Code>
        </>
      ),
      detail:
        'With H.264 the bandwidth drops to a few Mbps, and a WebSocket server would be complexity with no gain.',
    },
    { status: 'done', title: 'Rotation' },
    { status: 'done', title: 'Multi-touch', detail: 'Pinch with Alt+drag.' },
    { status: 'done', title: 'Two-way clipboard and text paste' },
    { status: 'done', title: 'Attach to an already running emulator' },
    {
      status: 'done',
      title: 'Volume/power buttons and screenshot to file',
      detail: 'The device frame was left out, since the screen is shown without corners.',
    },
    { status: 'done', title: 'Several devices at once', detail: 'As tabs in the same panel.' },
  ],
};

export const roadmap = defineDoc({
  slug: 'roadmap',
  group: 'project',
  content: {
    pt: {
      title: 'Roadmap',
      description: 'O que entrou nas fases 2 e 3 e o que foi descartado.',
      sections: [
        {
          id: 'phase-2',
          title: 'Fase 2',
          body: <DataTable head={['Status', 'Item']} rows={rows('pt', phase2.pt)} />,
        },
        {
          id: 'phase-3',
          title: 'Fase 3',
          body: (
            <P>
              <StatusTag status="done" locale="pt" /> iOS Simulator com helper Swift próprio
              (CoreSimulator/SimulatorKit + VideoToolbox), atrás da mesma interface.
            </P>
          ),
        },
      ],
    },
    en: {
      title: 'Roadmap',
      description: 'What shipped in phases 2 and 3 and what was dropped.',
      sections: [
        {
          id: 'phase-2',
          title: 'Phase 2',
          body: <DataTable head={['Status', 'Item']} rows={rows('en', phase2.en)} />,
        },
        {
          id: 'phase-3',
          title: 'Phase 3',
          body: (
            <P>
              <StatusTag status="done" locale="en" /> iOS Simulator with its own Swift helper
              (CoreSimulator/SimulatorKit + VideoToolbox), behind the same interface.
            </P>
          ),
        },
      ],
    },
  },
});
