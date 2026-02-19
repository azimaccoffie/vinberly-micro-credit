// Railway-compatible build script
import { build } from 'esbuild';
import { readFileSync } from 'fs';

// Read package.json to get dependencies
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

// Build the server
await build({
  entryPoints: ['server/_core/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist/index.js',
  external: [
    // Externalize all dependencies to reduce bundle size
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
    'esbuild'
  ],
  sourcemap: true,
  minify: false,
  target: 'node18'
});

console.log('Server build completed successfully!');