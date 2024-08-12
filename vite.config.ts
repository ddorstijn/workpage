import { defineConfig, Plugin } from "vite";
import path from "path";

import webExtension from "@samrum/vite-plugin-web-extension";
import { getManifest } from "./src/manifest";
import { htmlIncludePlugin } from "./includeHTML.plugin";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      webExtension({
        manifest: getManifest(),
      }),
      htmlIncludePlugin(),
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  };
});
