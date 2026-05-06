import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Benson Brand Colors
        "benson-maroon": "#722F37",
        "benson-maroon-dark": "#5C252C",
        "benson-burgundy": "#8B454D",
        "benson-wine": "#4A1F24",
        "benson-cream": "#F5F1E8",
        "benson-offwhite": "#FAF8F3",
        "benson-charcoal": "#2D2D2D",
        "benson-slate": "#4A4A4A",
        "benson-pale": "#E5E5E5",
      },
    },
  },
  plugins: [],
};
export default config;
