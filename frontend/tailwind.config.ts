/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "tech-bg": "#0C1521",      // Dark background (deep navy)
        "tech-fg": "#AFC0CE",      // Light text (soft blue-gray)
        "tech-primary": "#072440", // Primary buttons, accents (dark blue)
        "tech-secondary": "#0B4470", // Hover states, secondary elements (mid blue)
        "tech-muted": "#576778",   // Subtle text, borders (muted gray-blue)
      },
    },
  },
  plugins: [],
};
