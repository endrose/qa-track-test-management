/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "outline-variant": "#c6c6cd",
        "on-primary-container": "#ffffff",
        "surface": "#f8fafc",
        "on-secondary-fixed-variant": "#003ea8",
        "on-background": "#0f172a",
        "on-primary": "#ffffff",
        "background": "#fdfbf7",
        "surface-container": "#f0edef",
        "on-error": "#ffffff",
        "on-surface-variant": "#45464d",
        "surface-dim": "#e2e8f0",
        "primary-fixed-dim": "#bec6e0",
        "error": "#ef4444",
        "inverse-on-surface": "#f3f0f2",
        "on-primary-fixed": "#131b2e",
        "on-secondary": "#ffffff",
        "secondary-fixed": "#dbe1ff",
        "surface-bright": "#fcf8fa",
        "secondary-container": "#316bf3",
        "inverse-primary": "#bec6e0",
        "surface-container-highest": "#e4e2e4",
        "surface-tint": "#565e74",
        "on-tertiary": "#ffffff",
        "on-secondary-fixed": "#00174b",
        "surface-container-high": "#cbd5e1",
        "primary": "#000000",
        "on-primary-fixed-variant": "#3f465c",
        "secondary-fixed-dim": "#b4c5ff",
        "on-tertiary-container": "#009668",
        "surface-container-low": "#f1f5f9",
        "surface-variant": "#e4e2e4",
        "surface-container-lowest": "#ffffff",
        "on-surface": "#1b1b1d",
        "primary-container": "#3b82f6",
        "tertiary": "#000000",
        "secondary": "#0051d5",
        "on-error-container": "#93000a",
        "inverse-surface": "#303032",
        "tertiary-fixed": "#6ffbbe",
        "primary-fixed": "#dae2fd",
        "outline": "#000000",
        "on-tertiary-fixed": "#002113",
        "on-tertiary-fixed-variant": "#005236",
        "on-secondary-container": "#fefcff",
        "error-container": "#ffdad6",
        "tertiary-container": "#002113",
        "tertiary-fixed-dim": "#4edea3"
      },
      borderRadius: {
        DEFAULT: "0rem",
        lg: "0rem",
        xl: "0rem",
        full: "9999px"
      },
      spacing: {
        "element-gap": "1rem",
        "gutter": "1.5rem",
        "margin": "2rem"
      },
      fontFamily: {
        title: ["Geist", "Inter", "system-ui", "sans-serif"],
        label: ["Geist", "Inter", "system-ui", "sans-serif"],
        display: ["Geist", "Inter", "system-ui", "sans-serif"],
        body: ["Geist", "Inter", "system-ui", "sans-serif"],
        headline: ["Geist", "Inter", "system-ui", "sans-serif"]
      },
      fontSize: {
        title: ["20px", { lineHeight: "28px", fontWeight: "700" }],
        label: ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "700" }],
        display: ["36px", { lineHeight: "40px", letterSpacing: "-0.025em", fontWeight: "800" }],
        body: ["14px", { lineHeight: "20px", fontWeight: "500" }],
        headline: ["24px", { lineHeight: "32px", letterSpacing: "0.025em", fontWeight: "700" }]
      }
    }
  },
  plugins: [],
}
