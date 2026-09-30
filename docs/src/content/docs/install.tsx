import { CodeBlock } from '@/components/docs/CodeBlock';
import { Code, DocLink, Kbd, P, Strong } from '@/components/docs/prose';
import { defineDoc } from '../types';

const installCode = `bun install
bun run install:local   # build + .vsix + code --install-extension`;

export const install = defineDoc({
  slug: 'install',
  group: 'start',
  content: {
    pt: {
      title: 'Instalação',
      description: 'Build local, empacotamento em .vsix e instalação no VS Code.',
      sections: [
        {
          id: 'local',
          title: 'Instalar a partir do código',
          body: (
            <>
              <CodeBlock label="terminal" code={installCode} />
              <P>
                Depois rode <Strong>Developer: Reload Window</Strong> no VS Code. Repita{' '}
                <Code>bun run install:local</Code> a cada mudança no código.
              </P>
              <P>
                Confira os <DocLink slug="requirements">pré-requisitos</DocLink> antes: sem Android
                SDK ou Xcode, a plataforma correspondente não lista devices.
              </P>
            </>
          ),
        },
        {
          id: 'debug',
          title: 'Depurar',
          body: (
            <P>
              Abra a pasta no VS Code e aperte <Kbd>F5</Kbd>. A task <Code>watch</Code> recompila a
              extensão (esbuild) e a webview (Vite) e abre uma janela separada, o{' '}
              <Strong>Extension Development Host</Strong>.
            </P>
          ),
        },
        {
          id: 'logs',
          title: 'Logs',
          body: (
            <P>
              Logs do processo do emulador e erros de gRPC ficam no Output channel{' '}
              <Strong>Emulator</Strong>.
            </P>
          ),
        },
      ],
    },
    en: {
      title: 'Installation',
      description: 'Local build, .vsix packaging and installing it into VS Code.',
      sections: [
        {
          id: 'local',
          title: 'Install from source',
          body: (
            <>
              <CodeBlock label="terminal" code={installCode} />
              <P>
                Then run <Strong>Developer: Reload Window</Strong> in VS Code. Repeat{' '}
                <Code>bun run install:local</Code> after every code change.
              </P>
              <P>
                Check the <DocLink slug="requirements">requirements</DocLink> first: without the
                Android SDK or Xcode, that platform lists no devices.
              </P>
            </>
          ),
        },
        {
          id: 'debug',
          title: 'Debugging',
          body: (
            <P>
              Open the folder in VS Code and press <Kbd>F5</Kbd>. The <Code>watch</Code> task
              rebuilds the extension (esbuild) and the webview (Vite) and opens a separate window,
              the <Strong>Extension Development Host</Strong>.
            </P>
          ),
        },
        {
          id: 'logs',
          title: 'Logs',
          body: (
            <P>
              Emulator process logs and gRPC errors go to the <Strong>Emulator</Strong> Output
              channel.
            </P>
          ),
        },
      ],
    },
  },
});
