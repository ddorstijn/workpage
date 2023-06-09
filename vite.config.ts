import { defineConfig } from "vite";
import webExtension from "@samrum/vite-plugin-web-extension";
import solidPlugin from "vite-plugin-solid";
import UnoCSS from 'unocss/vite';

import path from "path";
import { getManifest } from "./src/manifest";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      webExtension({
        manifest: getManifest(),
      }),
      solidPlugin(),
      UnoCSS()
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  };
});
