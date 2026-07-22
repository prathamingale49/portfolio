import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        panel: "#111511",
        "panel-soft": "#171c17",
        "line-soft": "#2d332d",
        copper: "#c7a04a",
        solder: "#4f8069",
        signal: "#8aa0a3",
        warning: "#c8a957",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(199,160,74,0.14), 0 18px 60px rgba(0,0,0,0.28)",
      },
    },
  },
  plugins: [typography],
};

export default config;
