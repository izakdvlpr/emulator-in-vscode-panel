import { Code, DataTable, P, Strong } from '@/components/docs/prose';
import type { Locale } from '@/i18n/locales';
import { cn } from '@/lib/utils';
import { defineDoc } from '../types';

type Status = 'done' | 'planned' | 'dropped';

const statusLabel: Record<Locale, Record<Status, string>> = {
  pt: { done: 'Feito', planned: 'Planejado', dropped: 'Descartado' },
  en: { done: 'Done', planned: 'Planned', dropped: 'Dropped' },
};

const statusColor: Record<Status, string> = {
  done: 'text-ok',
  planned: 'text-accent',
  dropped: 'text-muted',
};

function StatusTag({ status, locale }: { status: Status; locale: Locale }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[0.75rem]',
        statusColor[status],
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
    {
      status: 'done',
      title: 'Biometria',
      detail:
        'Digital no Android via gRPC; Face ID/Touch ID no iOS via notificações do BiometricKit.',
    },
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
    {
      status: 'done',
      title: 'Biometrics',
      detail:
        'Fingerprint on Android through gRPC; Face ID/Touch ID on iOS through BiometricKit notifications.',
    },
  ],
};

const vscodeIntegration: Record<Locale, readonly Item[]> = {
  pt: [
    {
      status: 'planned',
      title: 'Remote SSH, WSL e Dev Containers',
      detail: (
        <>
          <Code>extensionKind: ["ui", "workspace"]</Code> para a extensão rodar no lado local, onde
          o emulador está, mesmo com o workspace remoto.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Comandos e atalhos para os controles',
      detail: 'Home, back, rotação, screenshot e stop no Command Palette, com keybindings.',
    },
    {
      status: 'planned',
      title: 'Item na status bar',
      detail: 'Mostra o device ativo e abre o painel ao clicar.',
    },
    {
      status: 'planned',
      title: 'Walkthrough de primeiro uso',
      detail: 'Checklist dos requisitos: Android SDK encontrado, AVD criado, Xcode instalado.',
    },
  ],
  en: [
    {
      status: 'planned',
      title: 'Remote SSH, WSL and Dev Containers',
      detail: (
        <>
          <Code>extensionKind: ["ui", "workspace"]</Code> so the extension runs on the local side,
          where the emulator is, even with a remote workspace.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Commands and shortcuts for the controls',
      detail: 'Home, back, rotation, screenshot and stop in the Command Palette, with keybindings.',
    },
    {
      status: 'planned',
      title: 'Status bar item',
      detail: 'Shows the active device and opens the panel on click.',
    },
    {
      status: 'planned',
      title: 'First-run walkthrough',
      detail: 'Requirements checklist: Android SDK found, AVD created, Xcode installed.',
    },
  ],
};

const devTools: Record<Locale, readonly Item[]> = {
  pt: [
    {
      status: 'done',
      title: 'Logs do device',
      detail: (
        <>
          Logcat e <Code>log stream</Code> do simulador num output channel, com filtro por app. O
          logcat vem do <Code>adb logcat</Code>: o <Code>streamLogcat</Code> do emulador 36.x para
          de entregar linhas ao abrir um app.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Abrir deep link / URL',
      detail: (
        <>
          <Code>am start -d</Code> no Android e <Code>simctl openurl</Code> no iOS.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Instalar app arrastando o arquivo',
      detail: (
        <>
          <Code>.apk</Code> via <Code>adb install</Code> e <Code>.app</Code> via{' '}
          <Code>simctl install</Code>.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Localização GPS',
      detail: (
        <>
          Coordenada fixa ou rota GPX: <Code>setGps</Code> no Android e <Code>simctl location</Code>{' '}
          no iOS.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Alternar dark mode',
      detail: (
        <>
          <Code>cmd uimode night</Code> no Android e <Code>simctl ui appearance</Code> no iOS.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Push notification no iOS',
      detail: (
        <>
          Payload JSON via <Code>simctl push</Code>.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Bateria, rede, SMS e chamada no Android',
      detail: (
        <>
          <Code>setBattery</Code>, <Code>sendSms</Code> e <Code>sendPhone</Code> do gRPC.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Gravar a tela em MP4',
      detail: 'Reaproveitando o stream H.264 que já existe nas duas plataformas.',
    },
    {
      status: 'planned',
      title: 'Screenshot para o clipboard',
      detail: 'Além de salvar em arquivo.',
    },
    {
      status: 'planned',
      title: 'Scroll com mouse e trackpad',
      detail: (
        <>
          <Code>injectWheel</Code> no Android; no iOS, pelo helper.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Postura de foldables',
      detail: (
        <>
          <Code>setPosture</Code> no Android.
        </>
      ),
    },
  ],
  en: [
    {
      status: 'done',
      title: 'Device logs',
      detail: (
        <>
          Logcat and the simulator's <Code>log stream</Code> in an output channel, filtered by app.
          Logcat comes from <Code>adb logcat</Code>: emulator 36.x's <Code>streamLogcat</Code>
          stops delivering lines when an app opens.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Open a deep link / URL',
      detail: (
        <>
          <Code>am start -d</Code> on Android and <Code>simctl openurl</Code> on iOS.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Install an app by dropping the file',
      detail: (
        <>
          <Code>.apk</Code> through <Code>adb install</Code> and <Code>.app</Code> through{' '}
          <Code>simctl install</Code>.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'GPS location',
      detail: (
        <>
          A fixed point or a GPX route: <Code>setGps</Code> on Android and{' '}
          <Code>simctl location</Code> on iOS.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Dark mode toggle',
      detail: (
        <>
          <Code>cmd uimode night</Code> on Android and <Code>simctl ui appearance</Code> on iOS.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Push notifications on iOS',
      detail: (
        <>
          JSON payload through <Code>simctl push</Code>.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Battery, network, SMS and calls on Android',
      detail: (
        <>
          <Code>setBattery</Code>, <Code>sendSms</Code> and <Code>sendPhone</Code> from gRPC.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Record the screen to MP4',
      detail: 'Reusing the H.264 stream both platforms already have.',
    },
    { status: 'planned', title: 'Screenshot to clipboard', detail: 'Besides saving to a file.' },
    {
      status: 'planned',
      title: 'Mouse and trackpad scrolling',
      detail: (
        <>
          <Code>injectWheel</Code> on Android; on iOS, through the helper.
        </>
      ),
    },
    {
      status: 'planned',
      title: 'Foldable postures',
      detail: (
        <>
          <Code>setPosture</Code> on Android.
        </>
      ),
    },
  ],
};

const quality: Record<Locale, readonly Item[]> = {
  pt: [
    {
      status: 'planned',
      title: 'Publicar no Open VSX',
      detail: 'Para Cursor, Windsurf e VSCodium, que não usam o Marketplace da Microsoft.',
    },
    {
      status: 'planned',
      title: 'Testes unitários',
      detail:
        'Parsing de H.264, geometria de rotação e touch, mapas de teclas e schema do protocolo.',
    },
    {
      status: 'planned',
      title: 'CI em pull requests',
      detail: 'Typecheck, Biome e build, incluindo um runner Windows.',
    },
    {
      status: 'planned',
      title: 'Release automatizado por tag',
      detail: 'Build no runner macOS (helper Swift) e publicação no Marketplace e no Open VSX.',
    },
    { status: 'planned', title: 'CHANGELOG' },
    {
      status: 'planned',
      title: 'Erro claro no iOS sem H.264',
      detail: (
        <>
          Avisar quando faltar WebCodecs ou <Code>emulatorPanel.videoCodec</Code> estiver em{' '}
          <Code>rgba</Code>, em vez de falhar sem explicação.
        </>
      ),
    },
  ],
  en: [
    {
      status: 'planned',
      title: 'Publish to Open VSX',
      detail: "For Cursor, Windsurf and VSCodium, which do not use Microsoft's Marketplace.",
    },
    {
      status: 'planned',
      title: 'Unit tests',
      detail: 'H.264 parsing, rotation and touch geometry, key maps and the protocol schema.',
    },
    {
      status: 'planned',
      title: 'CI on pull requests',
      detail: 'Typecheck, Biome and build, including a Windows runner.',
    },
    {
      status: 'planned',
      title: 'Tag-driven releases',
      detail: 'Build on a macOS runner (Swift helper) and publish to the Marketplace and Open VSX.',
    },
    { status: 'planned', title: 'CHANGELOG' },
    {
      status: 'planned',
      title: 'Clear error on iOS without H.264',
      detail: (
        <>
          Warn when WebCodecs is missing or <Code>emulatorPanel.videoCodec</Code> is set to{' '}
          <Code>rgba</Code>, instead of failing without a reason.
        </>
      ),
    },
  ],
};

const later: Record<Locale, readonly Item[]> = {
  pt: [
    {
      status: 'planned',
      title: 'Áudio',
      detail: (
        <>
          <Code>streamAudio</Code> do gRPC tocado com WebAudio.
        </>
      ),
    },
    { status: 'planned', title: 'Moldura do device opcional' },
    {
      status: 'planned',
      title: 'Integração com launch configs e tasks',
      detail: 'Rodar o app no device do painel antes de iniciar o debug.',
    },
  ],
  en: [
    {
      status: 'planned',
      title: 'Audio',
      detail: (
        <>
          gRPC <Code>streamAudio</Code> played through WebAudio.
        </>
      ),
    },
    { status: 'planned', title: 'Optional device frame' },
    {
      status: 'planned',
      title: 'Launch config and task integration',
      detail: 'Run the app on the panel device before the debugger starts.',
    },
  ],
};

export const roadmap = defineDoc({
  slug: 'roadmap',
  group: 'project',
  content: {
    pt: {
      title: 'Roadmap',
      description: 'O que entrou nas fases 2 e 3, o que foi descartado e o que vem a seguir.',
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
        {
          id: 'vscode-integration',
          title: 'Integração com o VS Code',
          body: <DataTable head={['Status', 'Item']} rows={rows('pt', vscodeIntegration.pt)} />,
        },
        {
          id: 'dev-tools',
          title: 'Ferramentas de desenvolvimento',
          body: <DataTable head={['Status', 'Item']} rows={rows('pt', devTools.pt)} />,
        },
        {
          id: 'quality',
          title: 'Qualidade e release',
          body: <DataTable head={['Status', 'Item']} rows={rows('pt', quality.pt)} />,
        },
        {
          id: 'later',
          title: 'Mais adiante',
          body: <DataTable head={['Status', 'Item']} rows={rows('pt', later.pt)} />,
        },
      ],
    },
    en: {
      title: 'Roadmap',
      description: 'What shipped in phases 2 and 3, what was dropped and what comes next.',
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
        {
          id: 'vscode-integration',
          title: 'VS Code integration',
          body: <DataTable head={['Status', 'Item']} rows={rows('en', vscodeIntegration.en)} />,
        },
        {
          id: 'dev-tools',
          title: 'Developer tools',
          body: <DataTable head={['Status', 'Item']} rows={rows('en', devTools.en)} />,
        },
        {
          id: 'quality',
          title: 'Quality and releases',
          body: <DataTable head={['Status', 'Item']} rows={rows('en', quality.en)} />,
        },
        {
          id: 'later',
          title: 'Later',
          body: <DataTable head={['Status', 'Item']} rows={rows('en', later.en)} />,
        },
      ],
    },
  },
});
