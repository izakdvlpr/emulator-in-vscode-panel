import { copyFile, writeFile } from 'node:fs/promises';

// GitHub Pages serve 404.html para qualquer rota desconhecida; sendo cópia do index,
// o router assume o deep link.
const dist = new URL('../dist/', import.meta.url);
await copyFile(new URL('index.html', dist), new URL('404.html', dist));
await writeFile(new URL('.nojekyll', dist), '');
