import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["var(--font-pixel)", "Courier New", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        arcade: {
          bg: "var(--arcade-bg)",
          surface: "var(--arcade-surface)",
          ink: "var(--arcade-ink)",
          "ink-dim": "var(--arcade-ink-dim)",
        },
        neon: {
          pink: "var(--neon-pink)",
          blue: "var(--neon-blue)",
          lime: "var(--neon-lime)",
          yellow: "var(--neon-yellow)",
          orange: "var(--neon-orange)",
          purple: "var(--neon-purple)",
          red: "var(--neon-red)",
          cyan: "var(--neon-cyan)",
        },
      },
      boxShadow: {
        arcade: "4px 4px 0 rgba(0,0,0,0.4)",
        "arcade-glow-pink": "0 0 24px rgba(255, 45, 149, 0.35)",
        "arcade-glow-blue": "0 0 24px rgba(0, 212, 255, 0.35)",
        "arcade-glow-lime": "0 0 20px rgba(184, 255, 60, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
