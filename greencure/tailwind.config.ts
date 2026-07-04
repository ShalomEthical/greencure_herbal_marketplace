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
        forest: {
          DEFAULT: "#1B4332",
          50: "#d8f3dc",
          100: "#b7e4c7",
          200: "#95d5b2",
          300: "#74c69d",
          400: "#52b788",
          500: "#40916c",
          600: "#2d6a4f",
          700: "#1B4332",
          800: "#0a3d2a",
          900: "#012d1d",
        },
        sage: {
          DEFAULT: "#52796F",
          light: "#84a89f",
          dark: "#3f665c",
        },
        earth: {
          DEFAULT: "#1c1c19",
          50: "#f6f3ee",
          100: "#f0ede9",
          200: "#e0ddd8",
          300: "#c1c8c2",
          400: "#9a9a94",
          500: "#717973",
          600: "#5a5a55",
          700: "#414844",
          800: "#31302d",
          900: "#1c1c19",
        },
        cream: "#fcf9f4",
        "warm-white": "#fefcf9",
      },
      fontFamily: {
        sans: ["var(--font-headline)", "system-ui", "sans-serif"],
        headline: ["var(--font-headline)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(28,28,25,0.04)",
        "card-hover": "0 4px 16px -2px rgba(28,28,25,0.08)",
        elevated: "0 4px 16px -2px rgba(28,28,25,0.06), 0 1px 3px rgba(28,28,25,0.04)",
        dashboard: "0 1px 3px rgba(0,0,0,0.04)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
