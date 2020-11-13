module.exports = {
  purge: ['./index.html', './src/**/*.vue', './src/**/*.ts'],
  theme: {
    colors: {
      transparent: 'transparent',
      red: {
        lighter: '#fb4934',
        default: '#cc241d',
        dark: '#9d0006',
      },
      green: {
        lighter: '#b8bb26',
        default: '#98971a',
        dark: '#79740e',
      },
      blue: {
        lighter: '#83a598',
        default: '#458588',
        dark: '#076678',
      },
      yellow: {
        lighter: '#fabd2f',
        default: '#d79921',
        dark: '#b57614',
      },
      orange: {
        lighter: '#fe8019',
        default: '#d65d0e',
        dark: '#af3a03',
      },
      aqua: {
        lighter: '#8ec07c',
        default: '#689d6a',
        dark: '#427b58',
      },
      purple: {
        lighter: '#d3869b',
        default: '#b16286',
        dark: '#8f3f71',
      },
      light: {
        lightest: '#fbf1c7',
        lighter: '#ebdbb2',
        default: '#d5c4a1',
        darker: '#bdae93',
        darkest: '#a89984',
      },
      gray: {
        lighter: '#a89984',
        default: '#928374',
        darker: '#7c6f64',
      },
      dark: {
        lightest: '#7c6f64',
        lighter: '#665c54',
        default: '#504945',
        darker: '#3c3836',
        darkest: '#282828',
      },
    },
    backgroundColor: (theme) => ({
      ...theme('colors'),
    }),
    textColor: (theme) => ({
      ...theme('colors'),
    }),
    fontFamily: {
      sans: ['montserrat', 'system-ui'],
      serif: ['Georgia', 'Cambria'],
      mono: ['SFMono-Regular'],
    },
    extend: {
      inset: {
        20: '20%',
        40: '40%',
        60: '60%',
        80: '80%',
        100: '100%',
      },
      minHeight: (theme) => ({
        ...theme('spacing'),
      }),
      maxHeight: (theme) => ({
				'1/4': '25%',
				'1/2': '50%',
				'3/4': '75%',
				'1/4-screen': '25vh',
				'1/2-screen': '55vh',
				'3/4-screen': '75vh',
        ...theme('spacing'),
      }),
      fontSize: {
        '7xl': ['5rem', '5rem'],
        '8xl': ['6rem', '6rem'],
      },
    },
  },
  variants: {
    visibility: ['responsive', 'group-hover'],
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
}
