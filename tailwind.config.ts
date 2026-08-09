import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-comic)", "cursive"],
        hand: ["var(--font-patrick)", "cursive"],
        "editorial-serif": ["var(--font-newsreader)", "Georgia", "serif"],
        "editorial-sans": ["var(--font-plus-jakarta)", "Inter", "system-ui", "sans-serif"],
        "editorial-mono": ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      colors: {
        // Editorial Palette
        editorial: {
          bg: "#faf9f5",
          "bg-card": "#ffffff",
          ink: "#141413",
          "ink-muted": "#5e5e5a",
          "ink-faint": "#8e8e88",
          border: "#e8e6df",
          "border-subtle": "#f0eee6",
          accent: "#9a3412", // Terracotta / warm rust
          "accent-soft": "#ffedd5",
          gold: "#b45309",
          sage: "#2b5329",
          navy: "#1e293b",
          dark: {
            bg: "#0d0f11",
            "bg-card": "#13171b",
            "bg-elevated": "#1a1f24",
            ink: "#f3f3f0",
            "ink-muted": "#a1a19b",
            "ink-faint": "#6b6b66",
            border: "#232930",
            "border-subtle": "#1c2126",
            accent: "#ea580c",
            "accent-soft": "rgba(234, 88, 12, 0.15)",
          }
        },

        // Sketchbook Palette
        background: "#fbfbfb", // Paper White
        foreground: "#18181b", // Ink Black
        primary: "#a855f7", // Pastel Purple
        secondary: "#f4f4f5", // Light Gray
        accent: "#fb7185", // Rose
        border: "#18181b", // Black Border
        "paper-yellow": "#fef08a",
        "paper-blue": "#bae6fd",
        "paper-pink": "#fbcfe8",

        // Venom Palette
        "venom-black": "#09090b", // Deep Void Black
        "venom-white": "#f4f4f5", // Stark White
        "venom-slime": "#84cc16", // Toxic Lime
        "venom-purple": "#a855f7", // Symbiote Accent
        'spidy-red': '#ef4444', // Classic Red
        'spidy-blue': '#3b82f6', // Classic Blue
      },
      boxShadow: {
        'neobrutalism': '4px 4px 0px 0px #18181b',
        'neobrutalism-lg': '8px 8px 0px 0px #18181b',
        'neobrutalism-sm': '2px 2px 0px 0px #18181b',
        'venom': '4px 4px 0px 0px #84cc16',
        'venom-lg': '8px 8px 0px 0px #84cc16',
        'spidy': '4px 4px 0px 0px #3b82f6', // Blue Shadow
        'spidy-lg': '8px 8px 0px 0px #3b82f6', // Blue Shadow Large
        'indigo': '4px 4px 0px 0px #6366f1',
        'red-neo': '4px 4px 0px 0px #ef4444',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
export default config;
