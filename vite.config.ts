import { defineConfig } from 'vite'
import path from 'path'
import {svelte } from '@sveltejs/vite-plugin-svelte'
import mpa from 'vite-plugin-mpa'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [svelte(), mpa()],
  css: {
    postcss: {
      plugins: [
        autoprefixer()
      ]
    }
  },
  build:{
    target:['edge90','chrome90','firefox90','safari15'],
    // sourcemap: true
  }
})
