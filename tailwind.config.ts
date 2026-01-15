import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "poke-red": "#FF0000",
        "slate-gray": "#2F2F2F",
        "gameboy-green": "#9BBC0F",
        "gameboy-offwhite": "#F8F8F8",
        "gameboy-dark": "#0F380F",
      },
      fontFamily: {
        "press-start": ["var(--font-press-start)", "monospace"],
        "vt323": ["var(--font-vt323)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
