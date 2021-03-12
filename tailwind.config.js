const production = !process.env.ROLLUP_WATCH;

module.exports = {
    purge: {
        enabled: production,
        content: [
            './src/**/*.html',
            './src/**/*.svelte',
        ]
    },
    darkMode: 'class', // 'media' / 'class' / 'false'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
