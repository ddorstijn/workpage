import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import webExtension from "@samrum/vite-plugin-web-extension";
import path from "path";
import { getManifest } from "./src/manifest";
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      solid(),
      Icons({
        compiler: 'jsx',
        jsx: 'preact',
      }),
      webExtension({
        manifest: getManifest(),
      }),
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  };
});
