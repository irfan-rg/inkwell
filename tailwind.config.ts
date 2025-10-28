import type { Config } from "tailwindcss";

const config: Config = {
  // Keep shadcn/ui dark mode behavior using class strategy
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Inkwell brand – elegant purple/indigo palette
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6", // primary
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
          DEFAULT: "#8b5cf6",
          foreground: "#ffffff"
        }
      },
      fontFamily: {
        // Use Inter for sans and Merriweather for serif
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji"
        ],
        serif: [
          "Merriweather",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "Times",
          "serif"
        ]
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        }
      },
      animation: {
        "fade-in": "fade-in 300ms ease-in-out"
      }
    }
  },
  plugins: []
};

export default config;
