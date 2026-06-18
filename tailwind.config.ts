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
        // Stitch design-system tokens
        "surface":                   "#0c1324",
        "surface-dim":               "#0c1324",
        "surface-container-lowest":  "#070d1f",
        "surface-container-low":     "#151b2d",
        "surface-container":         "#191f31",
        "surface-container-high":    "#23293c",
        "surface-container-highest": "#2e3447",
        "surface-variant":           "#2e3447",
        "surface-bright":            "#33394c",
        "on-surface":                "#dce1fb",
        "on-surface-variant":        "#cbc3d7",
        "primary":                   "#d0bcff",
        "on-primary":                "#3c0091",
        "primary-container":         "#a078ff",
        "primary-fixed-dim":         "#d0bcff",
        "secondary":                 "#d1bcff",
        "on-secondary":              "#391e70",
        "secondary-container":       "#53398b",
        "on-secondary-container":    "#c4abff",
        "tertiary":                  "#bec6e0",
        "on-tertiary":               "#283044",
        "tertiary-container":        "#8990a8",
        "outline":                   "#958ea0",
        "outline-variant":           "#494454",
        "error":                     "#ffb4ab",
        "on-error":                  "#690005",
        "error-container":           "#93000a",
        "background":                "#0c1324",
        "on-background":             "#dce1fb",
        "inverse-primary":           "#6d3bd7",
        "inverse-surface":           "#dce1fb",
        "inverse-on-surface":        "#2a3043",
        // Semantic alias (green for positive financial indicators)
        "positive":                  "#4ade80",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm:      "2px",
        DEFAULT: "4px",
        md:      "4px",
        lg:      "8px",
        xl:      "12px",
        "2xl":   "16px",
        full:    "9999px",
      },
      spacing: {
        "sidebar-width": "260px",
      },
    },
  },
  plugins: [],
};
export default config;
