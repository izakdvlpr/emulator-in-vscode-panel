import { Code, List, P, Strong } from '@/components/docs/prose';
import { defineDoc } from '../types';

export const shutdown = defineDoc({
  slug: 'shutdown',
  group: 'internals',
  content: {
    pt: {
      title: 'Encerramento',
      description: 'Stop, Detach, fechar a janela e o que acontece se o extension host morrer.',
      sections: [
        {
          id: 'stop',
          title: 'Stop',
          body: (
            <>
              <P>
                O emulador recebe <Code>setVmState(SHUTDOWN)</Code>, salva o snapshot de Quick Boot
                (~20s num AVD de 4 GB) e sai sozinho. Ele termina se matando com{' '}
                <Code>SIGKILL</Code> (exit 137) para pular a limpeza; isso é normal, e o próximo
                boot carrega o snapshot.
              </P>
              <P>
                A extensão espera até 90s antes de mandar <Code>SIGTERM</Code>/<Code>SIGKILL</Code>,
                porque matar no meio do save invalida o snapshot.
              </P>
            </>
          ),
        },
        {
          id: 'detach',
          title: 'Detach',
          body: <P>A extensão só fecha os streams e o client. O emulador nunca é morto.</P>,
        },
        {
          id: 'device-processes',
          title: 'Processos no device',
          body: (
            <P>
              O <Code>screenrecord</Code> e o loop de rotação são mortos pelo pid ao parar o stream.
              Matar só o <Code>adb</Code> do host deixaria o <Code>screenrecord</Code> gravando por
              mais alguns segundos.
            </P>
          ),
        },
        {
          id: 'deactivate',
          title: 'Janela fechando e host morto',
          body: (
            <List>
              <li>
                No <Strong>deactivate</Strong> (janela fechando), os timeouts caem para ~3s, por
                causa do orçamento do VS Code.
              </li>
              <li>
                Se o extension host morrer sem cleanup, o <Code>-idle-grpc-timeout</Code> derruba o
                emulador em ~2 minutos.
              </li>
            </List>
          ),
        },
        {
          id: 'ios',
          title: 'iOS',
          body: (
            <P>
              Um simulador que a extensão ligou roda o helper com <Code>--owned</Code>. Quando o
              stdin do helper fecha (Stop, deactivate ou extension host morto) ou ele recebe{' '}
              <Code>SIGTERM</Code>, ele roda <Code>simctl shutdown</Code> antes de sair. Num
              simulador anexado, o helper só sai.
            </P>
          ),
        },
      ],
    },
    en: {
      title: 'Shutdown',
      description: 'Stop, Detach, closing the window and what happens if the extension host dies.',
      sections: [
        {
          id: 'stop',
          title: 'Stop',
          body: (
            <>
              <P>
                The emulator receives <Code>setVmState(SHUTDOWN)</Code>, saves the Quick Boot
                snapshot (~20s on a 4 GB AVD) and exits on its own. It ends by killing itself with{' '}
                <Code>SIGKILL</Code> (exit 137) to skip cleanup; that is expected, and the next boot
                loads the snapshot.
              </P>
              <P>
                The extension waits up to 90s before sending <Code>SIGTERM</Code>/
                <Code>SIGKILL</Code>, because killing it mid-save invalidates the snapshot.
              </P>
            </>
          ),
        },
        {
          id: 'detach',
          title: 'Detach',
          body: (
            <P>
              The extension only closes the streams and the client. The emulator is never killed.
            </P>
          ),
        },
        {
          id: 'device-processes',
          title: 'Processes on the device',
          body: (
            <P>
              <Code>screenrecord</Code> and the rotation loop are killed by pid when the stream
              stops. Killing only the host&apos;s <Code>adb</Code> would leave{' '}
              <Code>screenrecord</Code> recording for a few more seconds.
            </P>
          ),
        },
        {
          id: 'deactivate',
          title: 'Window closing and a dead host',
          body: (
            <List>
              <li>
                On <Strong>deactivate</Strong> (window closing), timeouts drop to ~3s because of VS
                Code&apos;s shutdown budget.
              </li>
              <li>
                If the extension host dies without cleanup, <Code>-idle-grpc-timeout</Code> takes
                the emulator down in ~2 minutes.
              </li>
            </List>
          ),
        },
        {
          id: 'ios',
          title: 'iOS',
          body: (
            <P>
              A simulator the extension booted runs the helper with <Code>--owned</Code>. When the
              helper&apos;s stdin closes (Stop, deactivate or a dead extension host) or it receives{' '}
              <Code>SIGTERM</Code>, it runs <Code>simctl shutdown</Code> before exiting. On an
              attached simulator, the helper just exits.
            </P>
          ),
        },
      ],
    },
  },
});
