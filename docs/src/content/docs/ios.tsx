import { Code, P, Strong } from '@/components/docs/prose';
import { defineDoc } from '../types';

export const ios = defineDoc({
  slug: 'ios',
  group: 'internals',
  content: {
    pt: {
      title: 'iOS Simulator',
      description:
        'O helper Swift, frameworks privadas do Xcode e o mesmo protocolo de vídeo do Android.',
      sections: [
        {
          id: 'helper',
          title: 'O helper',
          body: (
            <>
              <P>
                Um processo <Code>ios-helper</Code> (Swift, em <Code>ios-helper/</Code>) por sessão.
                Ele carrega as frameworks privadas <Strong>CoreSimulator</Strong> e{' '}
                <Strong>SimulatorKit</Strong> do Xcode, as mesmas que o Simulator.app usa, porque
                não existe API pública para framebuffer nem para input.
              </P>
              <P>
                Protocolo: comandos JSON por linha no stdin; no stdout, frames{' '}
                <Code>[tipo][tamanho][payload]</Code> com eventos JSON, access units H.264 e PNGs;
                log no stderr (vai para o Output).
              </P>
            </>
          ),
        },
        {
          id: 'video',
          title: 'Vídeo',
          body: (
            <P>
              O helper lê o IOSurface do framebuffer, gira com <Code>VTPixelRotationSession</Code>{' '}
              quando o device está deitado e comprime com <Code>VTCompressionSession</Code> (H.264
              baseline, sem B-frames). A webview decodifica igual ao Android. O callback do
              SimulatorKit só dispara quando a tela muda, então tela parada não gera tráfego.
            </P>
          ),
        },
        {
          id: 'input',
          title: 'Toque, botões e teclado',
          body: (
            <P>
              Viram mensagens HID do SimulatorKit (<Code>IndigoHID…</Code>). O SimulatorKit descarta
              moves com menos de 16ms entre si; o helper guarda o último e reenvia.
            </P>
          ),
        },
        {
          id: 'rotation',
          title: 'Rotação',
          body: (
            <P>
              Mensagem Mach para a <Code>PurpleWorkspacePort</Code> do simulador, a mesma do menu{' '}
              <em>Device → Rotate</em> do Simulator.app.
            </P>
          ),
        },
        {
          id: 'boot',
          title: 'Boot e lista',
          body: (
            <P>
              <Code>simctl list/boot/bootstatus/shutdown</Code>. O simulador sobe sem abrir o
              Simulator.app.
            </P>
          ),
        },
        {
          id: 'clipboard',
          title: 'Clipboard',
          body: (
            <P>
              <Code>simctl pbcopy</Code>/<Code>pbpaste</Code>; mudanças no device chegam por{' '}
              <Code>
                simctl spawn &lt;udid&gt; notifyutil -w com.apple.pasteboard.notify.changed
              </Code>
              . Colar é <Code>pbcopy</Code> + Cmd+V.
            </P>
          ),
        },
      ],
    },
    en: {
      title: 'iOS Simulator',
      description: 'The Swift helper, Xcode private frameworks and the same video path as Android.',
      sections: [
        {
          id: 'helper',
          title: 'The helper',
          body: (
            <>
              <P>
                One <Code>ios-helper</Code> process (Swift, in <Code>ios-helper/</Code>) per
                session. It loads Xcode&apos;s private <Strong>CoreSimulator</Strong> and{' '}
                <Strong>SimulatorKit</Strong> frameworks, the same ones Simulator.app uses, because
                there is no public API for the framebuffer or for input.
              </P>
              <P>
                Protocol: line-delimited JSON commands on stdin; on stdout,{' '}
                <Code>[type][length][payload]</Code> frames carrying JSON events, H.264 access units
                and PNGs; logs on stderr (forwarded to the Output).
              </P>
            </>
          ),
        },
        {
          id: 'video',
          title: 'Video',
          body: (
            <P>
              The helper reads the framebuffer IOSurface, rotates it with{' '}
              <Code>VTPixelRotationSession</Code> when the device is in landscape and compresses it
              with <Code>VTCompressionSession</Code> (H.264 baseline, no B-frames). The webview
              decodes it the same way as Android. The SimulatorKit callback only fires when the
              screen changes, so a still screen generates no traffic.
            </P>
          ),
        },
        {
          id: 'input',
          title: 'Touch, buttons and keyboard',
          body: (
            <P>
              They become SimulatorKit HID messages (<Code>IndigoHID…</Code>). SimulatorKit drops
              moves less than 16ms apart; the helper keeps the last one and resends it.
            </P>
          ),
        },
        {
          id: 'rotation',
          title: 'Rotation',
          body: (
            <P>
              A Mach message to the simulator&apos;s <Code>PurpleWorkspacePort</Code>, the same one
              behind Simulator.app&apos;s <em>Device → Rotate</em> menu.
            </P>
          ),
        },
        {
          id: 'boot',
          title: 'Boot and listing',
          body: (
            <P>
              <Code>simctl list/boot/bootstatus/shutdown</Code>. The simulator boots without opening
              Simulator.app.
            </P>
          ),
        },
        {
          id: 'clipboard',
          title: 'Clipboard',
          body: (
            <P>
              <Code>simctl pbcopy</Code>/<Code>pbpaste</Code>; device changes arrive through{' '}
              <Code>
                simctl spawn &lt;udid&gt; notifyutil -w com.apple.pasteboard.notify.changed
              </Code>
              . Pasting is <Code>pbcopy</Code> + Cmd+V.
            </P>
          ),
        },
      ],
    },
  },
});
