import { Code, ExternalLink, List, Note, P, Strong } from '@/components/docs/prose';
import { defineDoc } from '../types';

export const requirements = defineDoc({
  slug: 'requirements',
  group: 'start',
  content: {
    pt: {
      title: 'Pré-requisitos',
      description: 'O que precisa estar instalado antes do primeiro build.',
      sections: [
        {
          id: 'common',
          title: 'Para qualquer plataforma',
          body: (
            <List>
              <li>
                VS Code <Strong>1.95</Strong> ou mais novo.
              </li>
              <li>
                <ExternalLink href="https://bun.sh">Bun</ExternalLink>, usado no build e em todos os
                scripts.
              </li>
              <li>macOS ou Linux. O caminho de Windows está implementado, mas não foi testado.</li>
            </List>
          ),
        },
        {
          id: 'android',
          title: 'Android',
          body: (
            <List>
              <li>
                Android SDK com o pacote <Strong>Android Emulator</Strong> (testado com 36.6).
              </li>
              <li>
                Ao menos um AVD criado, pelo Android Studio (Device Manager) ou com{' '}
                <Code>avdmanager create avd</Code>.
              </li>
            </List>
          ),
        },
        {
          id: 'ios',
          title: 'iOS',
          body: (
            <>
              <List>
                <li>
                  macOS com <Strong>Xcode</Strong> (testado com 26.0.1) e um runtime iOS instalado.
                </li>
                <li>
                  O Xcode selecionado em <Code>xcode-select</Code>. As Command Line Tools sozinhas
                  não têm simulador.
                </li>
                <li>
                  O build compila o helper Swift, então precisa do <Code>swiftc</Code> do Xcode.
                </li>
              </List>
              <Note label="Nota">
                <P>
                  Sem Xcode, a lista de iOS falha sozinha e o Android continua funcionando. O erro
                  vai para o Output channel <Strong>Emulator</Strong>.
                </P>
              </Note>
            </>
          ),
        },
      ],
    },
    en: {
      title: 'Requirements',
      description: 'What needs to be installed before the first build.',
      sections: [
        {
          id: 'common',
          title: 'Any platform',
          body: (
            <List>
              <li>
                VS Code <Strong>1.95</Strong> or newer.
              </li>
              <li>
                <ExternalLink href="https://bun.sh">Bun</ExternalLink>, used for the build and every
                script.
              </li>
              <li>macOS or Linux. The Windows path is implemented but untested.</li>
            </List>
          ),
        },
        {
          id: 'android',
          title: 'Android',
          body: (
            <List>
              <li>
                Android SDK with the <Strong>Android Emulator</Strong> package (tested with 36.6).
              </li>
              <li>
                At least one AVD, created in Android Studio (Device Manager) or with{' '}
                <Code>avdmanager create avd</Code>.
              </li>
            </List>
          ),
        },
        {
          id: 'ios',
          title: 'iOS',
          body: (
            <>
              <List>
                <li>
                  macOS with <Strong>Xcode</Strong> (tested with 26.0.1) and an iOS runtime
                  installed.
                </li>
                <li>
                  Xcode selected in <Code>xcode-select</Code>. The Command Line Tools alone ship no
                  simulator.
                </li>
                <li>
                  The build compiles the Swift helper, so it needs Xcode&apos;s <Code>swiftc</Code>.
                </li>
              </List>
              <Note label="Note">
                <P>
                  Without Xcode, only the iOS list fails; Android keeps working. The error goes to
                  the <Strong>Emulator</Strong> Output channel.
                </P>
              </Note>
            </>
          ),
        },
      ],
    },
  },
});
