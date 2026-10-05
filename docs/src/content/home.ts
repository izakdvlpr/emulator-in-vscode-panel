import type { Locale } from '@/i18n/locales';

export interface MapNode {
  tag: string;
  title: string;
  lines: readonly string[];
  slug: string;
  hash?: string;
}

export interface HomeContent {
  title: string;
  lede: string;
  secondaryCta: string;
  demoAlt: string;
  map: {
    label: string;
    android: string;
    ios: string;
    nodes: {
      emulator: MapNode;
      screenrecord: MapNode;
      simulator: MapNode;
      helper: MapNode;
      host: MapNode;
      webview: MapNode;
    };
    transport: string;
    inputTitle: string;
    input: string;
    inputLink: string;
  };
  quickStart: {
    title: string;
    lede: string;
    after: string;
    requirementsLink: string;
  };
  index: {
    title: string;
  };
}

export const home: Record<Locale, HomeContent> = {
  pt: {
    title: 'Android Emulator e iOS Simulator dentro do VS Code.',
    lede: 'A tela do device roda numa view do editor, com toque, pinch, teclado, clipboard e rotação. Sem janela extra, sem Android Studio aberto.',
    secondaryCta: 'Como funciona',
    demoAlt:
      'Painel Emulator: Device no VS Code, escolhendo o Pixel 10, iniciando o emulador e usando a tela do device.',
    map: {
      label: 'Caminho de um frame, do device até o canvas',
      android: 'Android',
      ios: 'iOS',
      nodes: {
        emulator: {
          tag: 'device',
          title: 'Android Emulator',
          lines: ['-no-window', '-grpc <porta>'],
          slug: 'architecture',
          hash: 'launch',
        },
        screenrecord: {
          tag: 'captura',
          title: 'adb screenrecord',
          lines: ['H.264 Annex B', 'fallback: RGBA via gRPC'],
          slug: 'architecture',
          hash: 'video',
        },
        simulator: {
          tag: 'device',
          title: 'iOS Simulator',
          lines: ['simctl boot', 'sem Simulator.app'],
          slug: 'ios',
          hash: 'boot',
        },
        helper: {
          tag: 'captura',
          title: 'ios-helper',
          lines: ['SimulatorKit', 'VideoToolbox H.264'],
          slug: 'ios',
          hash: 'video',
        },
        host: {
          tag: 'extension host',
          title: 'DeviceSession',
          lines: ['h264.ts → access units', 'fila de input'],
          slug: 'architecture',
          hash: 'device-layer',
        },
        webview: {
          tag: 'webview',
          title: 'WebCodecs',
          lines: ['VideoDecoder', 'optimizeForLatency → canvas'],
          slug: 'architecture',
          hash: 'video',
        },
      },
      transport: 'postMessage · ~2–8 Mbps',
      inputTitle: 'Input no caminho de volta',
      input:
        'A webview só conhece coordenadas normalizadas. O host serializa toque, teclado e colar numa fila e entrega via gRPC (Android) ou HID do SimulatorKit (iOS).',
      inputLink: 'Input e clipboard',
    },
    quickStart: {
      title: 'Início rápido',
      lede: 'Instale pelo VS Code Marketplace ou direto do terminal:',
      after: 'O ícone Emulator aparece na Activity Bar. Abra o painel e escolha um device.',
      requirementsLink: 'Pré-requisitos',
    },
    index: {
      title: 'Documentação',
    },
  },
  en: {
    title: 'Android Emulator and iOS Simulator inside VS Code.',
    lede: 'The device screen runs in an editor view, with touch, pinch, keyboard, clipboard and rotation. No extra window, no Android Studio open.',
    secondaryCta: 'How it works',
    demoAlt:
      'Emulator: Device panel in VS Code, picking the Pixel 10, starting the emulator and using the device screen.',
    map: {
      label: 'The path of one frame, from device to canvas',
      android: 'Android',
      ios: 'iOS',
      nodes: {
        emulator: {
          tag: 'device',
          title: 'Android Emulator',
          lines: ['-no-window', '-grpc <port>'],
          slug: 'architecture',
          hash: 'launch',
        },
        screenrecord: {
          tag: 'capture',
          title: 'adb screenrecord',
          lines: ['H.264 Annex B', 'fallback: RGBA over gRPC'],
          slug: 'architecture',
          hash: 'video',
        },
        simulator: {
          tag: 'device',
          title: 'iOS Simulator',
          lines: ['simctl boot', 'no Simulator.app'],
          slug: 'ios',
          hash: 'boot',
        },
        helper: {
          tag: 'capture',
          title: 'ios-helper',
          lines: ['SimulatorKit', 'VideoToolbox H.264'],
          slug: 'ios',
          hash: 'video',
        },
        host: {
          tag: 'extension host',
          title: 'DeviceSession',
          lines: ['h264.ts → access units', 'input queue'],
          slug: 'architecture',
          hash: 'device-layer',
        },
        webview: {
          tag: 'webview',
          title: 'WebCodecs',
          lines: ['VideoDecoder', 'optimizeForLatency → canvas'],
          slug: 'architecture',
          hash: 'video',
        },
      },
      transport: 'postMessage · ~2–8 Mbps',
      inputTitle: 'Input on the way back',
      input:
        'The webview only knows normalized coordinates. The host serializes touch, keyboard and paste through a queue and delivers them over gRPC (Android) or SimulatorKit HID (iOS).',
      inputLink: 'Input and clipboard',
    },
    quickStart: {
      title: 'Quick start',
      lede: 'Install from the VS Code Marketplace or straight from the terminal:',
      after: 'The Emulator icon shows up in the Activity Bar. Open the panel and pick a device.',
      requirementsLink: 'Requirements',
    },
    index: {
      title: 'Documentation',
    },
  },
};
