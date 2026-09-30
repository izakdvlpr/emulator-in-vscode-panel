import { cpSync, mkdirSync } from 'node:fs';
import { type BuildOptions, context, type Plugin } from 'esbuild';

const watch = process.argv.includes('--watch');

// Marcadores lidos pelo problemMatcher de .vscode/tasks.json para saber quando o watch terminou.
const watchMarkers: Plugin = {
  name: 'watch-markers',
  setup(build) {
    build.onStart(() => console.log('[watch] build started'));
    build.onEnd((result) => {
      for (const { text, location } of result.errors) {
        console.error(`✘ [ERROR] ${text}`);
        if (location) console.error(`    ${location.file}:${location.line}:${location.column}:`);
      }
      console.log('[watch] build finished');
    });
  },
};

const options: BuildOptions = {
  entryPoints: ['src/extension/extension.ts'],
  outfile: 'dist/extension.js',
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  external: ['vscode'],
  sourcemap: true,
  minify: !watch,
  logLevel: watch ? 'silent' : 'info',
  plugins: watch ? [watchMarkers] : [],
};

mkdirSync('dist/proto', { recursive: true });
cpSync('proto/emulator_controller.proto', 'dist/proto/emulator_controller.proto');

const ctx = await context(options);
if (watch) {
  await ctx.watch();
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
