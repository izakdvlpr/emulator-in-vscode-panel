# Emulator in VSCode Panel

Extensão do VS Code que roda o Android Emulator e o iOS Simulator em modo headless e
mostra/controla a tela dentro da sidebar, no estilo do "Running Devices" do Android Studio.

## Pré-requisitos

- VS Code 1.95+
- [Bun](https://bun.sh) (build e scripts)
- Android SDK com o pacote **Android Emulator** (testado com 36.6) e ao menos um AVD criado
  (Android Studio → Device Manager, ou `avdmanager create avd`)
- Para iOS: macOS com **Xcode** (testado com 26.0.1), um runtime iOS instalado e o Xcode
  selecionado em `xcode-select` (as Command Line Tools sozinhas não têm simulador). O build
  compila o helper Swift, então precisa do `swiftc` do Xcode.
- macOS ou Linux. O caminho de Windows está implementado, mas não foi testado.

## Como rodar

```bash
bun install
bun run install:local   # build + .vsix + instala no VS Code
```

Depois rode **Developer: Reload Window** no VS Code. Repita `bun run install:local` a cada
mudança no código.

Para depurar, abra a pasta no VS Code e aperte **F5**: a task `watch` recompila a extensão
(esbuild) e a webview (Vite) e abre uma janela separada (Extension Development Host).

Uso:

1. Clique no ícone de celular (**Emulator**) na Activity Bar, ou `Cmd/Ctrl+Shift+P` → **Emulator: Open Panel**
2. Escolha o device no dropdown (AVDs e simuladores iOS ficam em grupos separados) e clique em
   **Start**. Se ele já estiver aberto (Android Studio, Simulator.app, terminal), aparece como
   `Pixel 10 • running` e o botão vira **Attach**
3. Aguarde os estados *Launching → Connecting → Booting*; a tela aparece quando o sistema termina de bootar
4. Para abrir outro device ao mesmo tempo, escolha outro AVD e clique em **Start** de novo. Cada
   device vira uma aba abaixo do dropdown; só a aba visível recebe vídeo e input, as outras
   continuam rodando sem gastar CPU com stream

Controles:

- **Clique / arraste** no canvas → toque / swipe
- **Alt + arraste** → pinch (zoom/rotação com dois dedos). Enquanto o Alt está pressionado,
  dois pontos mostram onde ficam os dedos; o segundo é o reflexo do primeiro pelo centro da tela.
- **◁ ○ □** (abaixo da tela) → Back / Home / Recents. No iOS são só **○** (Home) e **▭**
  (App Switcher), já que não existe Back.
- Linha de controles → girar para a esquerda/direita, volume −/+, power (**Lock** no iOS) e
  screenshot. O screenshot sai em resolução real e abre um diálogo para salvar o PNG.
- **⟳** → recarrega a lista de AVDs
- **Teclado**: com o canvas focado, teclas vão para o emulador. Atalhos com Cmd/Ctrl/Alt
  continuam indo para o VS Code (ex.: `Cmd+P` funciona normalmente), exceto **Cmd/Ctrl+V**,
  que cola o clipboard do VS Code no campo focado do device.
- **Clipboard**: texto copiado dentro do device vai automaticamente para o clipboard do sistema.
- **Stop** desliga o emulador do device selecionado no dropdown; num emulador anexado, o botão
  vira **Detach** e só desconecta. O **×** de cada aba faz o mesmo (e fecha abas com erro).
- **Clipboard e Cmd/Ctrl+V** valem só para a aba visível.
  Trocar de view na sidebar (ex.: voltar ao Explorer) **não** desliga: o stream pausa e volta
  quando a view reaparece.
- A view pode ser arrastada para a Secondary Side Bar ou para o Panel se precisar de mais espaço.

Logs do processo do emulador e erros de gRPC ficam no Output channel **Emulator**.

Outros scripts:

| Script | O que faz |
|---|---|
| `bun run build` | Build de produção em `dist/` (inclui o helper iOS no macOS) |
| `bun run build:ios` | Só o helper iOS (`ios-helper/` → `dist/bin/ios-helper`, universal arm64 + x86_64) |
| `bun run typecheck` | `tsc` da extensão e da webview |
| `bun run check` | Biome (lint + format) |
| `bun run gen:proto` | Regenera os tipos a partir de `proto/emulator_controller.proto` |
| `bun run package` | Gera o `.vsix` |

## Configurações

| Setting | Padrão | Descrição |
|---|---|---|
| `emulatorPanel.androidSdkPath` | `""` | Caminho do SDK. Vazio → `ANDROID_HOME` → `ANDROID_SDK_ROOT` → local padrão da plataforma (`~/Library/Android/sdk`, `~/Android/Sdk`, `%LOCALAPPDATA%\Android\Sdk`). |
| `emulatorPanel.grpcPort` | `8654` | Primeira porta do gRPC; cada emulador iniciado pega a próxima livre a partir dela. Fica fora da faixa 8554+ para não colidir com instâncias abertas pelo Android Studio. |
| `emulatorPanel.videoCodec` | `"h264"` | `h264`: vídeo comprimido (ver abaixo). `rgba`: bitmaps crus via gRPC, bem mais CPU; útil para depurar. |

Se o VS Code for aberto pelo Dock/Finder, ele pode não herdar `ANDROID_HOME` do shell. Nesse
caso, use o setting ou o local padrão.

## Como funciona

- O emulador sobe com `-no-window -grpc <porta> -grpc-use-token -idle-grpc-timeout 120`.
  O token é lido do arquivo de discovery (`pid_<pid>.ini`) e enviado como `authorization: Bearer`.
- **Vídeo (padrão)**: `adb exec-out screenrecord --output-format=h264 … -` grava dentro do
  device e entrega H.264 Annex B cru. O host separa o stream em access units
  (`src/extension/android/h264.ts`) e manda cada frame para a webview, que decodifica com
  **WebCodecs** (`VideoDecoder`, `optimizeForLatency`). São ~2–8 Mbps, então o `postMessage`
  dá conta e não há servidor WebSocket.
  - O tamanho do vídeo cabe na view × `devicePixelRatio`, até a resolução real.
  - O `screenrecord` grava o display lógico e não gira sozinho. Um loop no device lê
    `mCurrentRotation` do WindowManager a cada 0.5s e reinicia a gravação com as dimensões
    trocadas quando a rotação muda.
  - Se o decoder atrasar (fila > 6 frames) ou der erro, a webview pede um recomeço, que
    começa com keyframe.
- **Fallback RGBA**: sem `adb`, se o `screenrecord` falhar duas vezes seguidas ou se a webview
  não decodificar H.264, a tela passa para `streamScreenshot` em RGBA8888, já redimensionada
  pelo emulador. Nesse modo o host manda um frame por vez e só envia o próximo depois do
  `frameAck`; frames intermediários são descartados (o mais recente sempre ganha). O motivo
  do fallback fica no Output.
- **Rotação**: `setPhysicalModel(ROTATION)` gira o sensor. Cada frame carrega a rotação da
  imagem, e a webview converte o toque para a orientação natural do device antes de enviar.
- **Attach**: o arquivo de discovery (`pid_<pid>.ini`) de cada emulador rodando traz a porta
  gRPC e o token. O token vale mesmo em emuladores do Android Studio, que usam
  `-grpc-use-jwt`, então não é preciso assinar JWT. A saída do emulador é detectada checando
  o pid a cada 2s.
- Depois do boot, `adb shell setprop debug.disable_screen_decorations true` + restart do SystemUI
  removem cantos arredondados e furo da câmera, que o SystemUI desenha por cima da tela e
  aparecem no stream. Precisa de `platform-tools/adb`; se falhar, só loga no Output.
- Toque, teclado e colar são serializados numa fila; moves de toque consecutivos são coalescidos.
- Clipboard: `streamClipboard` avisa quando o device copia algo; colar faz `setClipboard` +
  `KEYCODE_PASTE`. O emulador não ecoa para o mesmo client o que ele próprio gravou.
- A camada de device fica atrás de `DeviceProvider` / `DeviceSession`
  (`src/extension/device/DeviceProvider.ts`). A webview só conhece coordenadas normalizadas e
  botões abstratos. O `CompositeProvider` junta a lista de Android e iOS; se uma plataforma
  falhar (sem SDK, sem Xcode), a outra continua listando e o erro vai para o Output.

iOS:

- Um processo `ios-helper` (Swift, em `ios-helper/`) por sessão. Ele carrega as frameworks
  privadas **CoreSimulator** e **SimulatorKit** do Xcode, as mesmas que o Simulator.app usa,
  porque não existe API pública para framebuffer nem para input. Protocolo: comandos JSON por
  linha no stdin; no stdout, frames `[tipo][tamanho][payload]` com eventos JSON, access units
  H.264 e PNGs; log no stderr (vai para o Output).
- **Vídeo**: o helper lê o IOSurface do framebuffer, gira com `VTPixelRotationSession` quando o
  device está deitado e comprime com `VTCompressionSession` (H.264 baseline, sem B-frames). A
  webview decodifica igual ao Android. O callback do SimulatorKit só dispara quando a tela muda,
  então tela parada não gera tráfego.
- **Toque, botões e teclado** viram mensagens HID do SimulatorKit (`IndigoHID…`). O SimulatorKit
  descarta moves com menos de 16ms entre si; o helper guarda o último e reenvia.
- **Rotação**: mensagem Mach para a `PurpleWorkspacePort` do simulador, a mesma do menu
  *Device → Rotate* do Simulator.app.
- **Boot e lista**: `simctl list/boot/bootstatus/shutdown`. O simulador sobe sem abrir o
  Simulator.app.
- **Clipboard**: `simctl pbcopy`/`pbpaste`; mudanças no device chegam por
  `simctl spawn <udid> notifyutil -w com.apple.pasteboard.notify.changed`. Colar é `pbcopy` +
  Cmd+V.

Encerramento:

- No **Stop**, o emulador recebe `setVmState(SHUTDOWN)`, salva o snapshot de Quick Boot (~20s
  num AVD de 4 GB) e sai sozinho. Ele termina se matando com `SIGKILL` (exit 137) para pular a
  limpeza; isso é normal, e o próximo boot carrega o snapshot. A extensão espera até 90s antes
  de mandar `SIGTERM`/`SIGKILL`, porque matar no meio do save invalida o snapshot.
- No **Detach**, a extensão só fecha os streams e o client. O emulador nunca é morto.
- Os processos no device (`screenrecord` e o loop de rotação) são mortos pelo pid ao parar o
  stream. Matar só o `adb` do host deixaria o `screenrecord` gravando por mais alguns segundos.
- No **deactivate** (janela fechando), os timeouts caem para ~3s, por causa do orçamento do VS Code.
- Se o extension host morrer sem cleanup, o `-idle-grpc-timeout` derruba o emulador em ~2 minutos.
- **iOS**: um simulador que a extensão ligou roda o helper com `--owned`. Quando o stdin do
  helper fecha (Stop, deactivate ou extension host morto) ou ele recebe `SIGTERM`, ele roda
  `simctl shutdown` antes de sair. Num simulador anexado, o helper só sai.

## Limitações conhecidas

- **Fallback RGBA** usa bastante CPU: cada frame é bitmap cru (~2.5 MB em 534×1200).
- **`screenrecord` antigo** (imagens de sistema mais velhas) limita a gravação a 180s. O
  stream reinicia sozinho, com um pequeno soluço a cada 3 minutos.
- **Rotação** segue as regras do Android: apps travados em retrato (ex.: o launcher) continuam
  em retrato com o device deitado, e o auto-rotate precisa estar ligado no device.
- **Volume**: o primeiro toque só mostra o painel de volume do Android, como num aparelho de verdade.
- **Vários devices pesam na RAM**: cada AVD reserva o `hw.ramSize` dele (4 GB num Pixel
  recente). Com 16 GB de RAM, dois emuladores já apertam.
- **Emulador anexado mostra cantos arredondados e o furo da câmera**: esconder isso exige
  reiniciar o SystemUI, o que seria invasivo num emulador que a extensão não abriu.
- **Attach** precisa do gRPC ligado no emulador. É o padrão no Android Studio e no emulador 36+.
- **Porta ocupada** → o Start pula para a próxima livre (até 32 portas depois de
  `emulatorPanel.grpcPort`).
- **Stop demora** ~20s quando o AVD salva snapshot (Quick Boot) no desligamento. É o mesmo
  custo do Android Studio; desligar o Quick Boot no AVD elimina a espera, ao preço de cold boot.
- **Fechar a janela do VS Code** usa kill rápido: o snapshot de Quick Boot daquela sessão pode
  não ser salvo, e o próximo boot será cold boot.
- **Teclado**: ASCII imprimível e teclas especiais comuns (Backspace, Delete, Enter, Tab, Esc, setas,
  Home/End, PageUp/PageDown). Caracteres acentuados usam o campo `text` do emulador, que é
  best-effort e pode não chegar; para texto acentuado, cole com Cmd/Ctrl+V. Não há IME nem
  suporte a composição (dead keys).
  Teclas têm intervalo mínimo de 40ms entre si, porque em rajada o Android reordena Backspace
  e letras.
- **Tela sem cantos/câmera**: o `debug.*` não persiste, mas o snapshot de Quick Boot salvo no
  Stop guarda a memória. Se o mesmo AVD for aberto pelo Android Studio via Quick Boot, ele
  também vem sem cantos até um cold boot.
- Sem moldura de device, sem áudio.
- **iOS usa frameworks privadas** da Apple: uma versão nova do Xcode pode quebrar o helper.
  Testado com Xcode 26.0.1 / iOS 26.0.
- **iOS só tem vídeo H.264**: não existe fallback RGBA, então a webview precisa de WebCodecs e
  `emulatorPanel.videoCodec` precisa estar em `h264`.
- **Teclado no iOS**: só ASCII no layout US. Para o resto, cole com Cmd/Ctrl+V.
- **Attach no iOS** assume que o simulador está em retrato. Girar pela extensão um simulador
  que também está aberto no Simulator.app deixa a janela do Simulator.app com a orientação errada.
- Windows não testado (kill do processo usa `taskkill /T /F`).

## Roadmap

Fase 2:

1. ✅ **Vídeo comprimido**: H.264 via `screenrecord` + WebCodecs. O emulador 36.x não expõe o
   serviço `Rtc`, então WebRTC ficou de fora.
2. ❌ **Transporte fora do `postMessage`**: descartado. Com H.264 a banda cai para poucos Mbps,
   e um servidor WebSocket seria complexidade sem ganho.
3. ✅ **Rotação**.
4. ✅ **Multi-touch** (pinch com Alt+arraste).
5. ✅ **Clipboard** bidirecional e colar texto.
6. ✅ **Anexar a emulador já rodando**.
7. ✅ Botões de volume/power e screenshot para arquivo. A moldura do device ficou de fora, já
   que a tela é mostrada sem cantos.

- ✅ **Vários devices** ao mesmo tempo, em abas no mesmo painel.

- ✅ **Fase 3**: iOS Simulator com helper Swift próprio (CoreSimulator/SimulatorKit +
  VideoToolbox), atrás da mesma interface.
