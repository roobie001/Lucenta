import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1220",
          50: "#1A2436",
          100: "#141C2C",
        },
        ink: "#E2E8F0",
        teal: {
          DEFAULT: "#0D9488",
          light: "#14B8A6",
          dark: "#0F766E",
        },
        amber: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(226,232,240,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(226,232,240,0.06) 1px, transparent 1px)",
        "dot-pattern":
          "radial-gradient(circle, rgba(226,232,240,0.14) 1px, transparent 1px)",
      },
      boxShadow: {
        "glow-teal": "0 0 0 1px rgba(13,148,136,0.4), 0 0 24px rgba(13,148,136,0.25)",
        "glow-amber": "0 0 0 1px rgba(245,158,11,0.4), 0 0 24px rgba(245,158,11,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
