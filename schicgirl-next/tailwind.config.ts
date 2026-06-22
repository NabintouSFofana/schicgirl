import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#fdf8f2",
        ink: "#2d1a0e",
        "ink-soft": "#5a3a22",
        muted: "rgba(45,26,14,.6)",
        gold: "#c9934a",
        "gold-deep": "#a06d28",
        "gold-lt": "#e8c07e",
        "gold-pale": "#f5e8d0",
        rose: "#e8b4a0",
        "rose-deep": "#c47a65",
        cream: "#fffaf3",
        stroke: "rgba(201,147,74,.22)",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      borderRadius: { brand: "20px" },
      boxShadow: {
        warm: "0 1px 2px rgba(62,38,28,.04),0 6px 18px rgba(201,147,74,.1),0 18px 38px -10px rgba(201,147,74,.12)",
        soft: "0 2px 4px rgba(62,38,28,.06),0 8px 20px rgba(62,38,28,.1),0 24px 48px -12px rgba(62,38,28,.14)",
      },
    },
  },
  plugins: [],
};

export default config;
