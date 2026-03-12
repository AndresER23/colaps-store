import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        accent: "var(--color-accent)",
        "accent-light": "var(--color-accent-light)",
        surface: "var(--color-bg)",
        "surface-secondary": "var(--color-bg-secondary)",
        "on-surface": "var(--color-text)",
        muted: "var(--color-text-muted)",
        card: "var(--color-card-bg)",
      },
      borderRadius: {
        card: "var(--radius-card)",
      },
    },
  },
  plugins: [],
};

export default config;
