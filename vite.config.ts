import { defineConfig } from 'vite'
import {svelte } from '@sveltejs/vite-plugin-svelte'
import mpa from 'vite-plugin-mpa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), mpa()],
  build:{
    target:['edge90','chrome90','firefox90','safari15'],
    // sourcemap: true
  }
})
