import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import webExtension from '@samrum/vite-plugin-web-extension';
import { getManifest } from './src/manifest';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [solidPlugin(), webExtension({ manifest: getManifest() })],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
    outDir: resolve(__dirname, 'dist'),
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
