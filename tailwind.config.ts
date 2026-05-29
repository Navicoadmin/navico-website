import type { Config } from "tailwindcss";

/**
 * Design tokens port từ DESIGN.md (Navico Marine Biotech).
 * Bảng màu "Clean Biotech": Deep Navy + Teal accent, nền cool gray.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface": "#f9f9f9",
        "surface-dim": "#dadada",
        "surface-bright": "#f9f9f9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f4",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#44474e",
        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f0f1f1",
        "outline": "#74777f",
        "outline-variant": "#c4c6cf",
        "surface-tint": "#465f88",
        "primary": "#000a1e",
        "on-primary": "#ffffff",
        "primary-container": "#002147",
        "on-primary-container": "#708ab5",
        "inverse-primary": "#aec7f6",
        "secondary": "#00696f",
        "on-secondary": "#ffffff",
        "secondary-container": "#71f2fd",
        "on-secondary-container": "#006e74",
        "tertiary": "#000b1b",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#122236",
        "on-tertiary-container": "#7a8aa2",
        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "primary-fixed": "#d6e3ff",
        "primary-fixed-dim": "#aec7f6",
        "on-primary-fixed": "#001b3d",
        "on-primary-fixed-variant": "#2d476f",
        "secondary-fixed": "#77f5ff",
        "secondary-fixed-dim": "#53d8e3",
        "on-secondary-fixed": "#002022",
        "on-secondary-fixed-variant": "#004f54",
        "tertiary-fixed": "#d3e4fe",
        "tertiary-fixed-dim": "#b7c8e1",
        "on-tertiary-fixed": "#0b1c30",
        "on-tertiary-fixed-variant": "#38485d",
        "background": "#f9f9f9",
        "on-background": "#1a1c1c",
        "surface-variant": "#e2e2e2",
        "deep-navy": "#000a1e",
      },
      fontFamily: {
        // Be Vietnam Pro nạp qua next/font, expose qua CSS variable
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      spacing: {
        base: "8px",
        gutter: "24px",
        "margin-desktop": "64px",
        "margin-mobile": "20px",
        "section-padding": "96px",
        "container-max": "1280px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      boxShadow: {
        glass: "0px 4px 20px rgba(0,33,71,0.05)",
        "card-hover": "0px 12px 32px rgba(0,33,71,0.08)",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.15)" },
        },
      },
      animation: {
        kenburns: "kenburns 20s ease infinite alternate",
      },
    },
  },
  plugins: [],
};

export default config;
