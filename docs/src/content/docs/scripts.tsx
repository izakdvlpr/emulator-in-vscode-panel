import { Code, DataTable, P } from '@/components/docs/prose';
import type { Locale } from '@/i18n/locales';
import { defineDoc } from '../types';

const scripts: Record<Locale, readonly (readonly [string, React.ReactNode])[]> = {
  pt: [
    [
      'build',
      <>
        Build de produção em <Code>dist/</Code> (inclui o helper iOS no macOS).
      </>,
    ],
    [
      'build:ios',
      <>
        Só o helper iOS (<Code>ios-helper/</Code> → <Code>dist/bin/ios-helper</Code>, universal
        arm64 + x86_64).
      </>,
    ],
    [
      'typecheck',
      <>
        <Code>tsc</Code> da extensão e da webview.
      </>,
    ],
    ['check', 'Biome (lint + format).'],
    [
      'gen:proto',
      <>
        Regenera os tipos a partir de <Code>proto/emulator_controller.proto</Code>.
      </>,
    ],
    [
      'package',
      <>
        Gera o <Code>.vsix</Code>.
      </>,
    ],
    [
      'install:local',
      <>
        Build + <Code>.vsix</Code> + instala no VS Code.
      </>,
    ],
  ],
  en: [
    [
      'build',
      <>
        Production build into <Code>dist/</Code> (includes the iOS helper on macOS).
      </>,
    ],
    [
      'build:ios',
      <>
        Only the iOS helper (<Code>ios-helper/</Code> → <Code>dist/bin/ios-helper</Code>, universal
        arm64 + x86_64).
      </>,
    ],
    [
      'typecheck',
      <>
        <Code>tsc</Code> for the extension and the webview.
      </>,
    ],
    ['check', 'Biome (lint + format).'],
    [
      'gen:proto',
      <>
        Regenerates the types from <Code>proto/emulator_controller.proto</Code>.
      </>,
    ],
    [
      'package',
      <>
        Builds the <Code>.vsix</Code>.
      </>,
    ],
    [
      'install:local',
      <>
        Build + <Code>.vsix</Code> + install into VS Code.
      </>,
    ],
  ],
};

function rows(locale: Locale) {
  return scripts[locale].map(([name, description]) => [
    <Code key="name">bun run {name}</Code>,
    description,
  ]);
}

export const scriptsDoc = defineDoc({
  slug: 'scripts',
  group: 'reference',
  content: {
    pt: {
      title: 'Scripts',
      description: 'Os scripts do package.json e o que cada um faz.',
      sections: [
        {
          id: 'reference',
          title: 'Referência',
          body: (
            <>
              <P>Todos rodam da raiz do repositório.</P>
              <DataTable head={['Script', 'O que faz']} rows={rows('pt')} />
            </>
          ),
        },
      ],
    },
    en: {
      title: 'Scripts',
      description: 'The package.json scripts and what each one does.',
      sections: [
        {
          id: 'reference',
          title: 'Reference',
          body: (
            <>
              <P>All of them run from the repository root.</P>
              <DataTable head={['Script', 'What it does']} rows={rows('en')} />
            </>
          ),
        },
      ],
    },
  },
});
