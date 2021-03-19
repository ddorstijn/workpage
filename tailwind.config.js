const production = !process.env.ROLLUP_WATCH;

module.exports = {
    purge: {
        enabled: production,
        content: [
            './src/**/*.html',
            './src/**/*.svelte',
        ]
    },
    darkMode: 'media',
    theme: {
        fontFamily: {
            'sans': ['"Open Sans"'],
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
