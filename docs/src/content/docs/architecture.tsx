import { Code, DocLink, H3, List, P, Strong } from '@/components/docs/prose';
import { defineDoc } from '../types';

export const architecture = defineDoc({
  slug: 'architecture',
  group: 'internals',
  content: {
    pt: {
      title: 'Como funciona',
      description:
        'Do processo do emulador até o canvas da webview: vídeo, input, attach e clipboard.',
      sections: [
        {
          id: 'launch',
          title: 'Subindo o emulador',
          body: (
            <P>
              O emulador sobe com{' '}
              <Code>-no-window -grpc &lt;porta&gt; -grpc-use-token -idle-grpc-timeout 120</Code>. O
              token é lido do arquivo de discovery (<Code>pid_&lt;pid&gt;.ini</Code>) e enviado como{' '}
              <Code>authorization: Bearer</Code>.
            </P>
          ),
        },
        {
          id: 'video',
          title: 'Vídeo H.264 (padrão)',
          body: (
            <>
              <P>
                <Code>adb exec-out screenrecord --output-format=h264 … -</Code> grava dentro do
                device e entrega H.264 Annex B cru. O host separa o stream em access units (
                <Code>src/extension/android/h264.ts</Code>) e manda cada frame para a webview, que
                decodifica com <Strong>WebCodecs</Strong> (<Code>VideoDecoder</Code>,{' '}
                <Code>optimizeForLatency</Code>). São ~2–8 Mbps, então o <Code>postMessage</Code> dá
                conta e não há servidor WebSocket.
              </P>
              <List>
                <li>
                  O tamanho do vídeo cabe na view × <Code>devicePixelRatio</Code>, até a resolução
                  real.
                </li>
                <li>
                  O <Code>screenrecord</Code> grava o display lógico e não gira sozinho. Um loop no
                  device lê <Code>mCurrentRotation</Code> do WindowManager a cada 0.5s e reinicia a
                  gravação com as dimensões trocadas quando a rotação muda.
                </li>
                <li>
                  Se o decoder atrasar (fila &gt; 6 frames) ou der erro, a webview pede um recomeço,
                  que começa com keyframe.
                </li>
              </List>
            </>
          ),
        },
        {
          id: 'rgba',
          title: 'Fallback RGBA',
          body: (
            <P>
              Sem <Code>adb</Code>, se o <Code>screenrecord</Code> falhar duas vezes seguidas ou se
              a webview não decodificar H.264, a tela passa para <Code>streamScreenshot</Code> em
              RGBA8888, já redimensionada pelo emulador. Nesse modo o host manda um frame por vez e
              só envia o próximo depois do <Code>frameAck</Code>; frames intermediários são
              descartados (o mais recente sempre ganha). O motivo do fallback fica no Output.
            </P>
          ),
        },
        {
          id: 'rotation',
          title: 'Rotação',
          body: (
            <P>
              <Code>setPhysicalModel(ROTATION)</Code> gira o sensor. Cada frame carrega a rotação da
              imagem, e a webview converte o toque para a orientação natural do device antes de
              enviar.
            </P>
          ),
        },
        {
          id: 'attach',
          title: 'Attach',
          body: (
            <P>
              O arquivo de discovery (<Code>pid_&lt;pid&gt;.ini</Code>) de cada emulador rodando
              traz a porta gRPC e o token. O token vale mesmo em emuladores do Android Studio, que
              usam <Code>-grpc-use-jwt</Code>, então não é preciso assinar JWT. A saída do emulador
              é detectada checando o pid a cada 2s.
            </P>
          ),
        },
        {
          id: 'decorations',
          title: 'Tela sem cantos e sem furo da câmera',
          body: (
            <P>
              Depois do boot, <Code>adb shell setprop debug.disable_screen_decorations true</Code> +
              restart do SystemUI removem cantos arredondados e furo da câmera, que o SystemUI
              desenha por cima da tela e aparecem no stream. Precisa de{' '}
              <Code>platform-tools/adb</Code>; se falhar, só loga no Output.
            </P>
          ),
        },
        {
          id: 'input',
          title: 'Input e clipboard',
          body: (
            <List>
              <li>
                Toque, teclado e colar são serializados numa fila; moves de toque consecutivos são
                coalescidos.
              </li>
              <li>
                <Code>streamClipboard</Code> avisa quando o device copia algo; colar faz{' '}
                <Code>setClipboard</Code> + <Code>KEYCODE_PASTE</Code>. O emulador não ecoa para o
                mesmo client o que ele próprio gravou.
              </li>
            </List>
          ),
        },
        {
          id: 'device-layer',
          title: 'Camada de device',
          body: (
            <>
              <P>
                A camada de device fica atrás de <Code>DeviceProvider</Code> /{' '}
                <Code>DeviceSession</Code> (<Code>src/extension/device/DeviceProvider.ts</Code>). A
                webview só conhece coordenadas normalizadas e botões abstratos.
              </P>
              <P>
                O <Code>CompositeProvider</Code> junta a lista de Android e iOS; se uma plataforma
                falhar (sem SDK, sem Xcode), a outra continua listando e o erro vai para o Output. O
                lado iOS está em <DocLink slug="ios">iOS Simulator</DocLink>.
              </P>
            </>
          ),
        },
        {
          id: 'placement',
          title: 'Onde o app vive',
          body: (
            <>
              <P>
                O app fica em um lugar por vez: na aba de editor (<Code>WebviewPanel</Code>) quando
                ela existe, senão na view da sidebar.
              </P>
              <H3>Troca de lugar</H3>
              <P>
                Trocar de lugar só para o stream e recarrega o app na webview nova, que pede o
                estado de novo; as sessões são do host e não reiniciam.
              </P>
            </>
          ),
        },
      ],
    },
    en: {
      title: 'How it works',
      description:
        'From the emulator process to the webview canvas: video, input, attach and clipboard.',
      sections: [
        {
          id: 'launch',
          title: 'Launching the emulator',
          body: (
            <P>
              The emulator starts with{' '}
              <Code>-no-window -grpc &lt;port&gt; -grpc-use-token -idle-grpc-timeout 120</Code>. The
              token is read from the discovery file (<Code>pid_&lt;pid&gt;.ini</Code>) and sent as{' '}
              <Code>authorization: Bearer</Code>.
            </P>
          ),
        },
        {
          id: 'video',
          title: 'H.264 video (default)',
          body: (
            <>
              <P>
                <Code>adb exec-out screenrecord --output-format=h264 … -</Code> records inside the
                device and emits raw H.264 Annex B. The host splits the stream into access units (
                <Code>src/extension/android/h264.ts</Code>) and sends each frame to the webview,
                which decodes it with <Strong>WebCodecs</Strong> (<Code>VideoDecoder</Code>,{' '}
                <Code>optimizeForLatency</Code>). That is ~2–8 Mbps, so <Code>postMessage</Code>{' '}
                keeps up and there is no WebSocket server.
              </P>
              <List>
                <li>
                  The video size fits the view × <Code>devicePixelRatio</Code>, up to the real
                  resolution.
                </li>
                <li>
                  <Code>screenrecord</Code> records the logical display and does not rotate on its
                  own. A loop on the device reads <Code>mCurrentRotation</Code> from the
                  WindowManager every 0.5s and restarts recording with swapped dimensions when the
                  rotation changes.
                </li>
                <li>
                  If the decoder falls behind (queue &gt; 6 frames) or errors, the webview asks for
                  a restart, which begins with a keyframe.
                </li>
              </List>
            </>
          ),
        },
        {
          id: 'rgba',
          title: 'RGBA fallback',
          body: (
            <P>
              Without <Code>adb</Code>, if <Code>screenrecord</Code> fails twice in a row, or if the
              webview cannot decode H.264, the screen switches to <Code>streamScreenshot</Code> in
              RGBA8888, already resized by the emulator. In this mode the host sends one frame at a
              time and only sends the next one after a <Code>frameAck</Code>; frames in between are
              dropped (the latest always wins). The fallback reason is logged to the Output.
            </P>
          ),
        },
        {
          id: 'rotation',
          title: 'Rotation',
          body: (
            <P>
              <Code>setPhysicalModel(ROTATION)</Code> rotates the sensor. Every frame carries the
              image rotation, and the webview maps touches back to the device&apos;s natural
              orientation before sending them.
            </P>
          ),
        },
        {
          id: 'attach',
          title: 'Attach',
          body: (
            <P>
              The discovery file (<Code>pid_&lt;pid&gt;.ini</Code>) of each running emulator holds
              its gRPC port and token. The token works even on Android Studio emulators, which use{' '}
              <Code>-grpc-use-jwt</Code>, so there is no JWT to sign. Emulator exit is detected by
              checking the pid every 2s.
            </P>
          ),
        },
        {
          id: 'decorations',
          title: 'No rounded corners, no camera cutout',
          body: (
            <P>
              After boot, <Code>adb shell setprop debug.disable_screen_decorations true</Code> plus
              a SystemUI restart remove the rounded corners and camera cutout that SystemUI draws on
              top of the screen and that would show up in the stream. Requires{' '}
              <Code>platform-tools/adb</Code>; on failure it only logs to the Output.
            </P>
          ),
        },
        {
          id: 'input',
          title: 'Input and clipboard',
          body: (
            <List>
              <li>
                Touch, keyboard and paste are serialized through a queue; consecutive touch moves
                are coalesced.
              </li>
              <li>
                <Code>streamClipboard</Code> reports when the device copies something; pasting does{' '}
                <Code>setClipboard</Code> + <Code>KEYCODE_PASTE</Code>. The emulator does not echo
                back to the same client what that client wrote.
              </li>
            </List>
          ),
        },
        {
          id: 'device-layer',
          title: 'Device layer',
          body: (
            <>
              <P>
                The device layer sits behind <Code>DeviceProvider</Code> /{' '}
                <Code>DeviceSession</Code> (<Code>src/extension/device/DeviceProvider.ts</Code>).
                The webview only knows normalized coordinates and abstract buttons.
              </P>
              <P>
                <Code>CompositeProvider</Code> merges the Android and iOS lists; if one platform
                fails (no SDK, no Xcode), the other keeps listing and the error goes to the Output.
                The iOS side is covered in <DocLink slug="ios">iOS Simulator</DocLink>.
              </P>
            </>
          ),
        },
        {
          id: 'placement',
          title: 'Where the app lives',
          body: (
            <>
              <P>
                The app lives in one place at a time: in the editor tab (<Code>WebviewPanel</Code>)
                when it exists, otherwise in the sidebar view.
              </P>
              <H3>Moving it</H3>
              <P>
                Moving only stops the stream and reloads the app in the new webview, which asks for
                the state again; sessions belong to the host and do not restart.
              </P>
            </>
          ),
        },
      ],
    },
  },
});
