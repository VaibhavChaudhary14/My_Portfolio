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
      },
      colors: {
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
      },
      boxShadow: {
        'neobrutalism': '4px 4px 0px 0px #18181b',
        'neobrutalism-sm': '2px 2px 0px 0px #18181b',
      },
    },
  },
  plugins: [],
};
export default config;
