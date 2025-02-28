/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dracula-bg": "#282A36",
        "dracula-fg": "#F8F8F2",
        "dracula-comment": "#6272A4",
        "dracula-purple": "#BD93F9",
      },
    },
  },
  plugins: [],
};
