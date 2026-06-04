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
        panel: "#10151f",
        "panel-soft": "#151b28",
        "line-soft": "#283241",
        copper: "#d48a3a",
        solder: "#25b77f",
        signal: "#55b8ff",
        warning: "#f0c35a",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(85,184,255,0.18), 0 20px 80px rgba(0,0,0,0.32)",
      },
    },
  },
  plugins: [typography],
};

export default config;
