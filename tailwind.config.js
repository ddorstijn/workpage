module.exports = {
  purge: {
    content: ["./src/**/*.svelte"],
  },
  theme: {
    colors: {
      red: "var(--red)",
      orange: "var(--orange)",
      yellow: "var(--yellow)",
      green: "var(--green)",
      aqua: "var(--aqua)",
      blue: "var(--blue)",
      purple: "var(--purple)",
      gray: {
        50:  "var(--gray-50)",
        100: "var(--gray-100)",
        200: "var(--gray-200)",
        300: "var(--gray-300)",
        400: "var(--gray-400)",
        500: "var(--gray-500)",
        600: "var(--gray-600)",
        700: "var(--gray-700)",
        800: "var(--gray-800)",
        900: "var(--gray-900)",
        950: "var(--gray-950)",
      },
    },
  },
  variants: {},
  plugins: [],
};
