import { defineConfig, presetIcons, presetUno } from "unocss";

export default defineConfig({
    presets: [
        presetIcons({
            warn: true,
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            },
        }),
        presetUno({
            dark: "class",
        })
    ]
})