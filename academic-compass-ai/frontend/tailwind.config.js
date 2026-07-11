/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1A2B",
        "ink-soft": "#1B2A41",
        amber: "#E8A13A",
        "amber-deep": "#C67E1C",
        parchment: "#F5F1E8",
        "parchment-dim": "#E8E2D4",
        slate: "#5A6B82",
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
