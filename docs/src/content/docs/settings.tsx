import { Code, DataTable, Note, P } from '@/components/docs/prose';
import type { Locale } from '@/i18n/locales';
import { manifest, type SettingKey } from '@/lib/manifest';
import { defineDoc } from '../types';

const descriptions: Record<Locale, Record<SettingKey, React.ReactNode>> = {
  pt: {
    'emulatorPanel.androidSdkPath': (
      <>
        Caminho do SDK. Vazio → <Code>ANDROID_HOME</Code> → <Code>ANDROID_SDK_ROOT</Code> → local
        padrão da plataforma (<Code>~/Library/Android/sdk</Code>, <Code>~/Android/Sdk</Code>,{' '}
        <Code>%LOCALAPPDATA%\Android\Sdk</Code>).
      </>
    ),
    'emulatorPanel.grpcPort': (
      <>
        Primeira porta do gRPC; cada emulador iniciado pega a próxima livre a partir dela. Fica fora
        da faixa 8554+ para não colidir com instâncias abertas pelo Android Studio.
      </>
    ),
    'emulatorPanel.videoCodec': (
      <>
        <Code>h264</Code>: vídeo comprimido, gravado no device e decodificado com WebCodecs.{' '}
        <Code>rgba</Code>: bitmaps crus via gRPC, bem mais CPU; útil para depurar.
      </>
    ),
  },
  en: {
    'emulatorPanel.androidSdkPath': (
      <>
        SDK path. Empty → <Code>ANDROID_HOME</Code> → <Code>ANDROID_SDK_ROOT</Code> → the platform
        default (<Code>~/Library/Android/sdk</Code>, <Code>~/Android/Sdk</Code>,{' '}
        <Code>%LOCALAPPDATA%\Android\Sdk</Code>).
      </>
    ),
    'emulatorPanel.grpcPort': (
      <>
        First gRPC port; each emulator started by the extension takes the next free one from here.
        It sits outside the 8554+ range so it does not collide with instances opened by Android
        Studio.
      </>
    ),
    'emulatorPanel.videoCodec': (
      <>
        <Code>h264</Code>: compressed video, recorded on the device and decoded with WebCodecs.{' '}
        <Code>rgba</Code>: raw bitmaps over gRPC, far more CPU; useful for debugging.
      </>
    ),
  },
};

type Setting = (typeof manifest.contributes.configuration.properties)[string];

function constraint(setting: Setting): string | undefined {
  if (setting.enum) return setting.enum.join(' | ');
  if (setting.minimum !== undefined && setting.maximum !== undefined) {
    return `${setting.minimum}–${setting.maximum}`;
  }
  return undefined;
}

function settingsRows(locale: Locale) {
  return Object.entries(manifest.contributes.configuration.properties).map(([key, setting]) => [
    <Code key="key">{key}</Code>,
    <Code key="default">{JSON.stringify(setting.default)}</Code>,
    <span key="description">
      {descriptions[locale][key as SettingKey]}
      {constraint(setting) ? (
        <span className="mt-1 block font-mono text-[0.75rem] text-muted">
          {constraint(setting)}
        </span>
      ) : null}
    </span>,
  ]);
}

export const settings = defineDoc({
  slug: 'settings',
  group: 'reference',
  content: {
    pt: {
      title: 'Configurações',
      description: 'Settings da extensão, lidos direto do manifesto (package.json).',
      sections: [
        {
          id: 'reference',
          title: 'Referência',
          body: <DataTable head={['Setting', 'Padrão', 'Descrição']} rows={settingsRows('pt')} />,
        },
        {
          id: 'android-home',
          title: 'ANDROID_HOME fora do terminal',
          body: (
            <Note label="Nota">
              <P>
                Se o VS Code for aberto pelo Dock/Finder, ele pode não herdar{' '}
                <Code>ANDROID_HOME</Code> do shell. Nesse caso, use o setting{' '}
                <Code>emulatorPanel.androidSdkPath</Code> ou o local padrão.
              </P>
            </Note>
          ),
        },
      ],
    },
    en: {
      title: 'Settings',
      description: 'Extension settings, read straight from the manifest (package.json).',
      sections: [
        {
          id: 'reference',
          title: 'Reference',
          body: (
            <DataTable head={['Setting', 'Default', 'Description']} rows={settingsRows('en')} />
          ),
        },
        {
          id: 'android-home',
          title: 'ANDROID_HOME outside the terminal',
          body: (
            <Note label="Note">
              <P>
                When VS Code is launched from the Dock/Finder, it may not inherit{' '}
                <Code>ANDROID_HOME</Code> from your shell. In that case, use the{' '}
                <Code>emulatorPanel.androidSdkPath</Code> setting or the default location.
              </P>
            </Note>
          ),
        },
      ],
    },
  },
});
