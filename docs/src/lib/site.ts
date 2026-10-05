import { manifest } from './manifest';

export const repositoryUrl = 'https://github.com/izakdvlpr/emulator-in-vscode-panel';

export const releasesUrl = `${repositoryUrl}/releases`;

export const author = { name: 'izakdvlpr', url: 'https://github.com/izakdvlpr' };

export const extensionId = `${manifest.publisher}.${manifest.name}`;

export const marketplaceUrl = `https://marketplace.visualstudio.com/items?itemName=${extensionId}`;

export const openVsxUrl = `https://open-vsx.org/extension/${manifest.publisher}/${manifest.name}`;
