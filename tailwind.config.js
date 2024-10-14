/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontSize: theme("fontSize.base"), // Default for small screens
            "@screen md": {
              fontSize: theme("fontSize.lg"), // Larger font for medium screens
            },
            "@screen lg": {
              fontSize: theme("fontSize.xl"), // Even larger for large screens
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
