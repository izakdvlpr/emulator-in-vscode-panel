import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// O helper usa frameworks do Xcode (SimulatorKit), então só existe em macOS. Nos outros
// sistemas a extensão funciona sem ele e o provider de iOS nem é carregado.
if (process.platform !== 'darwin') {
  console.warn('[ios-helper] skipped: iOS Simulator support is only built on macOS.');
  process.exit(0);
}

const sources = readdirSync('ios-helper')
  .filter((file) => file.endsWith('.swift'))
  .map((file) => join('ios-helper', file));
const outDir = 'dist/bin';
const workDir = join(tmpdir(), `ios-helper-${process.pid}`);
mkdirSync(outDir, { recursive: true });
mkdirSync(workDir, { recursive: true });

try {
  // Binário universal: a extensão pode rodar num Mac Intel ou Apple Silicon.
  const slices = ['arm64', 'x86_64'].map((arch) => {
    const output = join(workDir, arch);
    execFileSync(
      'xcrun',
      [
        'swiftc',
        '-O',
        // Swift 5: o modo 6 exige `Sendable` em tudo que cruza filas, e o helper conversa com
        // APIs em C/Objective-C sem essas anotações.
        '-swift-version',
        '5',
        '-target',
        `${arch}-apple-macos13`,
        '-o',
        output,
        ...sources,
      ],
      { stdio: 'inherit' },
    );
    return output;
  });
  execFileSync('lipo', ['-create', '-output', join(outDir, 'ios-helper'), ...slices], {
    stdio: 'inherit',
  });
  console.log(`[ios-helper] built ${join(outDir, 'ios-helper')}`);
} finally {
  rmSync(workDir, { recursive: true, force: true });
}
