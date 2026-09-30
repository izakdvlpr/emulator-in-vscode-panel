import { Code, DataTable, Kbd, List, P, Strong } from '@/components/docs/prose';
import type { Locale } from '@/i18n/locales';
import { type CommandId, manifest } from '@/lib/manifest';
import { defineDoc } from '../types';

const commandPlaces: Record<Locale, Record<CommandId, string>> = {
  pt: {
    'emulatorPanel.open': 'Command Palette.',
    'emulatorPanel.openInEditor':
      'Barra de título da view e Command Palette, quando o device está na sidebar.',
    'emulatorPanel.openInNewWindow': 'Barra de título da view, quando o device está na sidebar.',
    'emulatorPanel.moveToSidebar':
      'Barra da aba de editor e Command Palette, quando o device está numa aba.',
  },
  en: {
    'emulatorPanel.open': 'Command Palette.',
    'emulatorPanel.openInEditor':
      'View title bar and Command Palette, while the device is in the sidebar.',
    'emulatorPanel.openInNewWindow': 'View title bar, while the device is in the sidebar.',
    'emulatorPanel.moveToSidebar':
      'Editor tab bar and Command Palette, while the device is in a tab.',
  },
};

function commandRows(locale: Locale) {
  return manifest.contributes.commands.map((command) => [
    <Code key="title">
      {command.category}: {command.title}
    </Code>,
    commandPlaces[locale][command.command as CommandId],
  ]);
}

export const controls = defineDoc({
  slug: 'controls',
  group: 'start',
  content: {
    pt: {
      title: 'Controles',
      description: 'Toque, gestos, botões do device, teclado, clipboard e onde a tela pode ficar.',
      sections: [
        {
          id: 'touch',
          title: 'Toque e gestos',
          body: (
            <DataTable
              head={['Ação', 'Resultado']}
              rows={[
                [<Strong key="a">Clique / arraste</Strong>, 'Toque / swipe no canvas.'],
                [
                  <span key="b">
                    <Kbd>Alt</Kbd> + arraste
                  </span>,
                  'Pinch (zoom/rotação com dois dedos). Com o Alt pressionado, dois pontos mostram onde ficam os dedos; o segundo é o reflexo do primeiro pelo centro da tela.',
                ],
              ]}
            />
          ),
        },
        {
          id: 'buttons',
          title: 'Botões do device',
          body: (
            <List>
              <li>
                <Strong>◁ ○ □</Strong>, abaixo da tela: Back, Home e Recents. No iOS são só{' '}
                <Strong>○</Strong> (Home) e <Strong>▭</Strong> (App Switcher), já que não existe
                Back.
              </li>
              <li>
                Linha de controles: girar para a esquerda/direita, volume −/+, power (
                <Strong>Lock</Strong> no iOS) e screenshot. O screenshot sai em resolução real e
                abre um diálogo para salvar o PNG.
              </li>
              <li>
                <Strong>⟳</Strong> recarrega a lista de AVDs.
              </li>
            </List>
          ),
        },
        {
          id: 'keyboard',
          title: 'Teclado e clipboard',
          body: (
            <List>
              <li>
                Com o canvas focado, as teclas vão para o emulador. Atalhos com <Kbd>Cmd/Ctrl</Kbd>/
                <Kbd>Alt</Kbd> continuam indo para o VS Code (ex.: <Code>Cmd+P</Code> funciona
                normalmente), exceto <Kbd>Cmd/Ctrl</Kbd>+<Kbd>V</Kbd>, que cola o clipboard do VS
                Code no campo focado do device.
              </li>
              <li>
                Texto copiado dentro do device vai automaticamente para o clipboard do sistema.
              </li>
              <li>
                Clipboard e <Kbd>Cmd/Ctrl</Kbd>+<Kbd>V</Kbd> valem só para a aba visível.
              </li>
            </List>
          ),
        },
        {
          id: 'stop',
          title: 'Stop e Detach',
          body: (
            <>
              <P>
                <Strong>Stop</Strong> desliga o emulador do device selecionado no dropdown. Num
                emulador anexado, o botão vira <Strong>Detach</Strong> e só desconecta. O{' '}
                <Strong>×</Strong> de cada aba faz o mesmo (e fecha abas com erro).
              </P>
              <P>
                Trocar de view na sidebar (ex.: voltar ao Explorer) <Strong>não</Strong> desliga: o
                stream pausa e volta quando a view reaparece.
              </P>
            </>
          ),
        },
        {
          id: 'placement',
          title: 'Sidebar, aba de editor e janela flutuante',
          body: (
            <>
              <P>
                A view pode ser arrastada para a Secondary Side Bar ou para o Panel se precisar de
                mais espaço.
              </P>
              <P>
                Os ícones na barra de título da view abrem o device numa aba de editor (
                <Strong>Open in Editor</Strong>) ou direto numa janela separada (
                <Strong>Open in New Window</Strong>). Como aba, ela se comporta como qualquer
                editor: arraste para um split ao lado do código, ou para fora da janela para virar
                janela flutuante, que pode ficar sempre no topo pelo botão da barra dela.
              </P>
              <P>
                Enquanto isso a sidebar mostra só um aviso. <Strong>Move to Sidebar</Strong> (na
                barra da aba) ou fechar a aba/janela devolve o device para a sidebar, sem desligar
                nada. A view da sidebar em si não pode ser arrastada para a área de editores: é uma
                limitação do VS Code.
              </P>
            </>
          ),
        },
        {
          id: 'commands',
          title: 'Comandos',
          body: <DataTable head={['Comando', 'Onde aparece']} rows={commandRows('pt')} />,
        },
      ],
    },
    en: {
      title: 'Controls',
      description:
        'Touch, gestures, device buttons, keyboard, clipboard and where the screen can live.',
      sections: [
        {
          id: 'touch',
          title: 'Touch and gestures',
          body: (
            <DataTable
              head={['Action', 'Result']}
              rows={[
                [<Strong key="a">Click / drag</Strong>, 'Tap / swipe on the canvas.'],
                [
                  <span key="b">
                    <Kbd>Alt</Kbd> + drag
                  </span>,
                  'Pinch (two-finger zoom/rotate). While Alt is held, two dots show where the fingers are; the second one mirrors the first through the center of the screen.',
                ],
              ]}
            />
          ),
        },
        {
          id: 'buttons',
          title: 'Device buttons',
          body: (
            <List>
              <li>
                <Strong>◁ ○ □</Strong>, below the screen: Back, Home and Recents. On iOS there are
                only <Strong>○</Strong> (Home) and <Strong>▭</Strong> (App Switcher), since there is
                no Back.
              </li>
              <li>
                Control row: rotate left/right, volume −/+, power (<Strong>Lock</Strong> on iOS) and
                screenshot. Screenshots are taken at full resolution and open a dialog to save the
                PNG.
              </li>
              <li>
                <Strong>⟳</Strong> reloads the AVD list.
              </li>
            </List>
          ),
        },
        {
          id: 'keyboard',
          title: 'Keyboard and clipboard',
          body: (
            <List>
              <li>
                With the canvas focused, keys go to the emulator. Shortcuts with <Kbd>Cmd/Ctrl</Kbd>
                /<Kbd>Alt</Kbd> still go to VS Code (e.g. <Code>Cmd+P</Code> works as usual), except{' '}
                <Kbd>Cmd/Ctrl</Kbd>+<Kbd>V</Kbd>, which pastes the VS Code clipboard into the
                device&apos;s focused field.
              </li>
              <li>Text copied inside the device lands in the system clipboard automatically.</li>
              <li>
                Clipboard and <Kbd>Cmd/Ctrl</Kbd>+<Kbd>V</Kbd> only apply to the visible tab.
              </li>
            </List>
          ),
        },
        {
          id: 'stop',
          title: 'Stop and Detach',
          body: (
            <>
              <P>
                <Strong>Stop</Strong> shuts down the device selected in the dropdown. On an attached
                emulator the button becomes <Strong>Detach</Strong> and only disconnects. Each
                tab&apos;s <Strong>×</Strong> does the same (and closes tabs in an error state).
              </P>
              <P>
                Switching views in the sidebar (e.g. back to the Explorer) does <Strong>not</Strong>{' '}
                shut anything down: the stream pauses and resumes when the view comes back.
              </P>
            </>
          ),
        },
        {
          id: 'placement',
          title: 'Sidebar, editor tab and floating window',
          body: (
            <>
              <P>The view can be dragged to the Secondary Side Bar or the Panel for more room.</P>
              <P>
                The icons in the view&apos;s title bar open the device in an editor tab (
                <Strong>Open in Editor</Strong>) or straight into a separate window (
                <Strong>Open in New Window</Strong>). As a tab it behaves like any editor: drag it
                into a split next to your code, or out of the window to make it a floating window,
                which can stay on top through the button in its own title bar.
              </P>
              <P>
                Meanwhile the sidebar only shows a notice. <Strong>Move to Sidebar</Strong> (in the
                tab bar) or closing the tab/window brings the device back to the sidebar without
                shutting anything down. The sidebar view itself cannot be dragged into the editor
                area: that is a VS Code limitation.
              </P>
            </>
          ),
        },
        {
          id: 'commands',
          title: 'Commands',
          body: <DataTable head={['Command', 'Where it shows up']} rows={commandRows('en')} />,
        },
      ],
    },
  },
});
