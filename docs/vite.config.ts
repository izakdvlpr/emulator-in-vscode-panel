import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/emulator-in-vscode-panel/',
  plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // O conteúdo lê o package.json da extensão, que fica fora da raiz do Vite.
  server: { fs: { allow: ['.', '../package.json'] } },
  build: { target: 'es2022' },
});
