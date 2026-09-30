import { CodeBlock } from '@/components/docs/CodeBlock';
import { Code, DocLink, ExternalLink, Kbd, P, Strong } from '@/components/docs/prose';
import { extensionId, marketplaceUrl } from '@/lib/site';
import { defineDoc } from '../types';

const marketplaceCode = `code --install-extension ${extensionId}`;

const installCode = `bun install
bun run install:local   # build + .vsix + code --install-extension`;

export const install = defineDoc({
  slug: 'install',
  group: 'start',
  content: {
    pt: {
      title: 'Instalação',
      description: 'Marketplace, ou build local com .vsix a partir do código.',
      sections: [
        {
          id: 'marketplace',
          title: 'Pelo Marketplace',
          body: (
            <>
              <P>
                A extensão está no{' '}
                <ExternalLink href={marketplaceUrl}>VS Code Marketplace</ExternalLink>. No VS Code,
                abra Extensions (<Kbd>⇧⌘X</Kbd>), busque <Code>{extensionId}</Code> e clique em{' '}
                <Strong>Install</Strong>. Ou pelo terminal:
              </P>
              <CodeBlock label="terminal" code={marketplaceCode} />
              <P>
                Confira os <DocLink slug="requirements">pré-requisitos</DocLink> antes: sem Android
                SDK ou Xcode, a plataforma correspondente não lista devices.
              </P>
            </>
          ),
        },
        {
          id: 'local',
          title: 'Instalar a partir do código',
          body: (
            <>
              <P>Da raiz do repositório, com Bun instalado:</P>
              <CodeBlock label="terminal" code={installCode} />
              <P>
                Depois rode <Strong>Developer: Reload Window</Strong> no VS Code. Repita{' '}
                <Code>bun run install:local</Code> a cada mudança no código.
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
      description: 'The Marketplace, or a local .vsix build from source.',
      sections: [
        {
          id: 'marketplace',
          title: 'From the Marketplace',
          body: (
            <>
              <P>
                The extension is on the{' '}
                <ExternalLink href={marketplaceUrl}>VS Code Marketplace</ExternalLink>. In VS Code,
                open Extensions (<Kbd>⇧⌘X</Kbd>), search for <Code>{extensionId}</Code> and click{' '}
                <Strong>Install</Strong>. Or from the terminal:
              </P>
              <CodeBlock label="terminal" code={marketplaceCode} />
              <P>
                Check the <DocLink slug="requirements">requirements</DocLink> first: without the
                Android SDK or Xcode, that platform lists no devices.
              </P>
            </>
          ),
        },
        {
          id: 'local',
          title: 'Install from source',
          body: (
            <>
              <P>From the repository root, with Bun installed:</P>
              <CodeBlock label="terminal" code={installCode} />
              <P>
                Then run <Strong>Developer: Reload Window</Strong> in VS Code. Repeat{' '}
                <Code>bun run install:local</Code> after every code change.
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
