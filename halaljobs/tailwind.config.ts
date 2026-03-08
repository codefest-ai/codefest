import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  "#fdfcfa",
          100: "#faf8f5",
          200: "#f3ede4",
        },
        teal: {
          50:  "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#0d9488",
          600: "#0d7377",
          700: "#0a5f62",
          800: "#064e4e",
          900: "#042f30",
        },
        gold: {
          300: "#e8c96a",
          400: "#d4a843",
          500: "#c9a030",
          600: "#a07820",
        },
        surface: {
          0: "#faf8f5",
          1: "#ffffff",
          2: "#f3ede4",
          3: "#e8e4de",
        },
        ink: {
          0:   "#ffffff",
          100: "#e8e4de",
          200: "#c4bcb6",
          300: "#a09890",
          400: "#887f78",
          500: "#6b5f56",
          600: "#544a43",
          700: "#3d3530",
          800: "#2b2420",
          900: "#1a1410",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
}
export default config
