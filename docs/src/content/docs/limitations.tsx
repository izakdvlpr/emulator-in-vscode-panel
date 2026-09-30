import { Code, Kbd, List, Strong } from '@/components/docs/prose';
import { defineDoc } from '../types';

export const limitations = defineDoc({
  slug: 'limitations',
  group: 'project',
  content: {
    pt: {
      title: 'Limitações conhecidas',
      description:
        'O que ainda não funciona, o que custa caro e onde o comportamento vem do Android ou do Xcode.',
      sections: [
        {
          id: 'video',
          title: 'Vídeo',
          body: (
            <List>
              <li>
                <Strong>Fallback RGBA</Strong> usa bastante CPU: cada frame é bitmap cru (~2.5 MB em
                534×1200).
              </li>
              <li>
                <Strong>
                  <Code>screenrecord</Code> antigo
                </Strong>{' '}
                (imagens de sistema mais velhas) limita a gravação a 180s. O stream reinicia
                sozinho, com um pequeno soluço a cada 3 minutos.
              </li>
              <li>Sem moldura de device, sem áudio.</li>
            </List>
          ),
        },
        {
          id: 'android',
          title: 'Android',
          body: (
            <List>
              <li>
                <Strong>Rotação</Strong> segue as regras do Android: apps travados em retrato (ex.:
                o launcher) continuam em retrato com o device deitado, e o auto-rotate precisa estar
                ligado no device.
              </li>
              <li>
                <Strong>Volume</Strong>: o primeiro toque só mostra o painel de volume do Android,
                como num aparelho de verdade.
              </li>
              <li>
                <Strong>Vários devices pesam na RAM</Strong>: cada AVD reserva o{' '}
                <Code>hw.ramSize</Code> dele (4 GB num Pixel recente). Com 16 GB de RAM, dois
                emuladores já apertam.
              </li>
              <li>
                <Strong>Emulador anexado mostra cantos arredondados e o furo da câmera</Strong>:
                esconder isso exige reiniciar o SystemUI, o que seria invasivo num emulador que a
                extensão não abriu.
              </li>
              <li>
                <Strong>Attach</Strong> precisa do gRPC ligado no emulador. É o padrão no Android
                Studio e no emulador 36+.
              </li>
              <li>
                <Strong>Porta ocupada</Strong> → o Start pula para a próxima livre (até 32 portas
                depois de <Code>emulatorPanel.grpcPort</Code>).
              </li>
              <li>
                <Strong>Tela sem cantos/câmera</Strong>: o <Code>debug.*</Code> não persiste, mas o
                snapshot de Quick Boot salvo no Stop guarda a memória. Se o mesmo AVD for aberto
                pelo Android Studio via Quick Boot, ele também vem sem cantos até um cold boot.
              </li>
            </List>
          ),
        },
        {
          id: 'shutdown',
          title: 'Desligamento',
          body: (
            <List>
              <li>
                <Strong>Stop demora</Strong> ~20s quando o AVD salva snapshot (Quick Boot) no
                desligamento. É o mesmo custo do Android Studio; desligar o Quick Boot no AVD
                elimina a espera, ao preço de cold boot.
              </li>
              <li>
                <Strong>Fechar a janela do VS Code</Strong> usa kill rápido: o snapshot de Quick
                Boot daquela sessão pode não ser salvo, e o próximo boot será cold boot.
              </li>
            </List>
          ),
        },
        {
          id: 'keyboard',
          title: 'Teclado',
          body: (
            <List>
              <li>
                ASCII imprimível e teclas especiais comuns (Backspace, Delete, Enter, Tab, Esc,
                setas, Home/End, PageUp/PageDown).
              </li>
              <li>
                Caracteres acentuados usam o campo <Code>text</Code> do emulador, que é best-effort
                e pode não chegar; para texto acentuado, cole com <Kbd>Cmd/Ctrl</Kbd>+<Kbd>V</Kbd>.
                Não há IME nem suporte a composição (dead keys).
              </li>
              <li>
                Teclas têm intervalo mínimo de 40ms entre si, porque em rajada o Android reordena
                Backspace e letras.
              </li>
            </List>
          ),
        },
        {
          id: 'ios',
          title: 'iOS',
          body: (
            <List>
              <li>
                <Strong>Frameworks privadas</Strong> da Apple: uma versão nova do Xcode pode quebrar
                o helper. Testado com Xcode 26.0.1 / iOS 26.0.
              </li>
              <li>
                <Strong>Só vídeo H.264</Strong>: não existe fallback RGBA, então a webview precisa
                de WebCodecs e <Code>emulatorPanel.videoCodec</Code> precisa estar em{' '}
                <Code>h264</Code>.
              </li>
              <li>
                <Strong>Teclado</Strong>: só ASCII no layout US. Para o resto, cole com{' '}
                <Kbd>Cmd/Ctrl</Kbd>+<Kbd>V</Kbd>.
              </li>
              <li>
                <Strong>Attach</Strong> assume que o simulador está em retrato. Girar pela extensão
                um simulador que também está aberto no Simulator.app deixa a janela do Simulator.app
                com a orientação errada.
              </li>
            </List>
          ),
        },
        {
          id: 'platforms',
          title: 'Plataformas',
          body: (
            <List>
              <li>
                Windows não testado (kill do processo usa <Code>taskkill /T /F</Code>).
              </li>
            </List>
          ),
        },
      ],
    },
    en: {
      title: 'Known limitations',
      description:
        'What does not work yet, what is expensive and where behaviour comes from Android or Xcode.',
      sections: [
        {
          id: 'video',
          title: 'Video',
          body: (
            <List>
              <li>
                <Strong>RGBA fallback</Strong> is CPU-heavy: every frame is a raw bitmap (~2.5 MB at
                534×1200).
              </li>
              <li>
                <Strong>
                  Older <Code>screenrecord</Code>
                </Strong>{' '}
                (older system images) caps recording at 180s. The stream restarts on its own, with a
                small hiccup every 3 minutes.
              </li>
              <li>No device frame, no audio.</li>
            </List>
          ),
        },
        {
          id: 'android',
          title: 'Android',
          body: (
            <List>
              <li>
                <Strong>Rotation</Strong> follows Android&apos;s rules: portrait-locked apps (e.g.
                the launcher) stay in portrait with the device in landscape, and auto-rotate must be
                on in the device.
              </li>
              <li>
                <Strong>Volume</Strong>: the first press only shows Android&apos;s volume panel,
                like on real hardware.
              </li>
              <li>
                <Strong>Several devices eat RAM</Strong>: each AVD reserves its{' '}
                <Code>hw.ramSize</Code> (4 GB on a recent Pixel). With 16 GB of RAM, two emulators
                are already tight.
              </li>
              <li>
                <Strong>An attached emulator shows rounded corners and the camera cutout</Strong>:
                hiding them requires restarting SystemUI, which would be invasive on an emulator the
                extension did not start.
              </li>
              <li>
                <Strong>Attach</Strong> needs gRPC enabled on the emulator. That is the default in
                Android Studio and on emulator 36+.
              </li>
              <li>
                <Strong>Port in use</Strong> → Start moves on to the next free one (up to 32 ports
                after <Code>emulatorPanel.grpcPort</Code>).
              </li>
              <li>
                <Strong>No corners/cutout</Strong>: <Code>debug.*</Code> does not persist, but the
                Quick Boot snapshot saved on Stop keeps the memory. If Android Studio opens the same
                AVD through Quick Boot, it also comes up without corners until a cold boot.
              </li>
            </List>
          ),
        },
        {
          id: 'shutdown',
          title: 'Shutdown',
          body: (
            <List>
              <li>
                <Strong>Stop takes</Strong> ~20s when the AVD saves a Quick Boot snapshot on
                shutdown. Android Studio pays the same cost; turning Quick Boot off in the AVD
                removes the wait, at the price of a cold boot.
              </li>
              <li>
                <Strong>Closing the VS Code window</Strong> uses a fast kill: that session&apos;s
                Quick Boot snapshot may not be saved, and the next boot will be a cold boot.
              </li>
            </List>
          ),
        },
        {
          id: 'keyboard',
          title: 'Keyboard',
          body: (
            <List>
              <li>
                Printable ASCII and common special keys (Backspace, Delete, Enter, Tab, Esc, arrows,
                Home/End, PageUp/PageDown).
              </li>
              <li>
                Accented characters go through the emulator&apos;s <Code>text</Code> field, which is
                best-effort and may not arrive; for accented text, paste with <Kbd>Cmd/Ctrl</Kbd>+
                <Kbd>V</Kbd>. There is no IME and no composition (dead keys).
              </li>
              <li>
                Keys are at least 40ms apart, because in a burst Android reorders Backspace and
                letters.
              </li>
            </List>
          ),
        },
        {
          id: 'ios',
          title: 'iOS',
          body: (
            <List>
              <li>
                <Strong>Private frameworks</Strong> from Apple: a new Xcode release can break the
                helper. Tested with Xcode 26.0.1 / iOS 26.0.
              </li>
              <li>
                <Strong>H.264 video only</Strong>: there is no RGBA fallback, so the webview needs
                WebCodecs and <Code>emulatorPanel.videoCodec</Code> must be <Code>h264</Code>.
              </li>
              <li>
                <Strong>Keyboard</Strong>: ASCII on the US layout only. For anything else, paste
                with <Kbd>Cmd/Ctrl</Kbd>+<Kbd>V</Kbd>.
              </li>
              <li>
                <Strong>Attach</Strong> assumes the simulator is in portrait. Rotating from the
                extension a simulator that is also open in Simulator.app leaves the Simulator.app
                window in the wrong orientation.
              </li>
            </List>
          ),
        },
        {
          id: 'platforms',
          title: 'Platforms',
          body: (
            <List>
              <li>
                Windows is untested (process kill uses <Code>taskkill /T /F</Code>).
              </li>
            </List>
          ),
        },
      ],
    },
  },
});
