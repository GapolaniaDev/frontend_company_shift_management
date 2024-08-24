/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        full: {
          primary: "#1D5A73",
          secondary: "#54B5BF",
          accent1: "#1F8C45",
          accent2: "#97BF41",
          highlight: "#F2E422",
        },
        bright: {
          primary: "#1F8C45",
          secondary: "#97BF41",
          accent1: "#F2E422",
          background: "#F2F2F2",
          text: "#0D0D0D",
        },
        muted: {
          primary: "#1D5A73",
          secondary: "#54B5BF",
          accent1: "#1CA698",
          accent2: "#1F8C45",
          highlight: "#97BF41",
        },
        deep: {
          primary: "#1D5A73",
          accent1: "#1F8C45",
          accent2: "#97BF41",
          background: "#F2F2F2",
          text: "#0D0D0D",
        },
        dark: {
          primary: "#1D5A73",
          accent1: "#1CA698",
          accent2: "#1F8C45",
          background: "#F2F2F2",
          text: "#0D0D0D",
        },
        gradient: {
          start: "#83ACBE",
          middle: "#3F7C99",
          end: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
