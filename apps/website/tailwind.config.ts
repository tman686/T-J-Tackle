import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Palette sourced from the T&J's Tackle crest — see docs/DESIGN-SYSTEM.md
        navy: {
          DEFAULT: "#0d2438",
          700: "#123a5a",
          600: "#1b4d73",
        },
        copper: {
          DEFAULT: "#b06a34",
          300: "#d79a63",
          200: "#e6bd93",
        },
        parchment: {
          DEFAULT: "#f3e9d2",
          200: "#e7d8b6",
          300: "#dcc99b",
        },
        sea: "#2f7d78",
        silver: "#c6ccce",
        ink: "#1a1a1a",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        crest: "0 10px 30px -12px rgba(13, 36, 56, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
