import { Code, DocLink, Kbd, P, Steps, Strong } from '@/components/docs/prose';
import { defineDoc } from '../types';

export const usage = defineDoc({
  slug: 'usage',
  group: 'start',
  content: {
    pt: {
      title: 'Primeiros passos',
      description: 'Abrir o painel, ligar um device e rodar vários ao mesmo tempo.',
      sections: [
        {
          id: 'open',
          title: 'Abrir o painel',
          body: (
            <P>
              Clique no ícone de celular (<Strong>Emulator</Strong>) na Activity Bar, ou{' '}
              <Kbd>Cmd/Ctrl</Kbd>+<Kbd>Shift</Kbd>+<Kbd>P</Kbd> →{' '}
              <Strong>Emulator: Open Panel</Strong>.
            </P>
          ),
        },
        {
          id: 'start',
          title: 'Ligar ou anexar um device',
          body: (
            <Steps>
              <li>
                Escolha o device no dropdown. AVDs e simuladores iOS ficam em grupos separados.
              </li>
              <li>
                Clique em <Strong>Start</Strong>. Se ele já estiver aberto (Android Studio,
                Simulator.app, terminal), aparece como <Code>Pixel 10 • running</Code> e o botão
                vira <Strong>Attach</Strong>.
              </li>
              <li>
                Aguarde os estados <em>Launching → Connecting → Booting</em>. A tela aparece quando
                o sistema termina de bootar.
              </li>
            </Steps>
          ),
        },
        {
          id: 'multiple',
          title: 'Vários devices',
          body: (
            <>
              <P>
                Para abrir outro device ao mesmo tempo, escolha outro AVD e clique em{' '}
                <Strong>Start</Strong> de novo. Cada device vira uma aba abaixo do dropdown.
              </P>
              <P>
                Só a aba visível recebe vídeo e input. As outras continuam rodando sem gastar CPU
                com stream. Cada AVD reserva a própria RAM; veja as{' '}
                <DocLink slug="limitations" hash="android">
                  limitações
                </DocLink>
                .
              </P>
            </>
          ),
        },
        {
          id: 'next',
          title: 'Depois disso',
          body: (
            <P>
              Os atalhos de toque, teclado e janela estão em{' '}
              <DocLink slug="controls">Controles</DocLink>.
            </P>
          ),
        },
      ],
    },
    en: {
      title: 'First steps',
      description: 'Open the panel, boot a device and run several at once.',
      sections: [
        {
          id: 'open',
          title: 'Open the panel',
          body: (
            <P>
              Click the phone icon (<Strong>Emulator</Strong>) in the Activity Bar, or{' '}
              <Kbd>Cmd/Ctrl</Kbd>+<Kbd>Shift</Kbd>+<Kbd>P</Kbd> →{' '}
              <Strong>Emulator: Open Panel</Strong>.
            </P>
          ),
        },
        {
          id: 'start',
          title: 'Start or attach a device',
          body: (
            <Steps>
              <li>
                Pick the device in the dropdown. AVDs and iOS simulators sit in separate groups.
              </li>
              <li>
                Click <Strong>Start</Strong>. If it is already open (Android Studio, Simulator.app,
                a terminal), it shows as <Code>Pixel 10 • running</Code> and the button becomes{' '}
                <Strong>Attach</Strong>.
              </li>
              <li>
                Wait through <em>Launching → Connecting → Booting</em>. The screen appears once the
                system finishes booting.
              </li>
            </Steps>
          ),
        },
        {
          id: 'multiple',
          title: 'Several devices',
          body: (
            <>
              <P>
                To open another device at the same time, pick another AVD and click{' '}
                <Strong>Start</Strong> again. Each device becomes a tab below the dropdown.
              </P>
              <P>
                Only the visible tab receives video and input. The others keep running without
                spending CPU on streaming. Each AVD reserves its own RAM; see the{' '}
                <DocLink slug="limitations" hash="android">
                  limitations
                </DocLink>
                .
              </P>
            </>
          ),
        },
        {
          id: 'next',
          title: 'After that',
          body: (
            <P>
              Touch, keyboard and window shortcuts live in{' '}
              <DocLink slug="controls">Controls</DocLink>.
            </P>
          ),
        },
      ],
    },
  },
});
