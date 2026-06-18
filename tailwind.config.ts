import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(195 70% 22%)",
          foreground: "hsl(0 0% 100%)",
          50: "#eaf4f6",
          100: "#cfe7ec",
          200: "#9fcfd9",
          300: "#6fb7c6",
          400: "#3f9fb3",
          500: "#1f7e93",
          600: "#156276",
          700: "#114e60",
          800: "#0d3a49",
          900: "#082632",
          950: "#04141c",
        },
        accent: {
          DEFAULT: "hsl(40 85% 55%)",
          foreground: "hsl(30 60% 15%)",
          50: "#fdf6e6",
          100: "#fbe9c0",
          200: "#f7d68a",
          300: "#f3c354",
          400: "#efb02e",
          500: "#d49a1f",
          600: "#a87a18",
          700: "#7c5a12",
          800: "#503a0b",
          900: "#2b1f06",
        },
      },
      boxShadow: {
        glass:
          "0 20px 60px -10px rgba(8, 25, 40, 0.35), inset 0 1px 0 0 rgba(255,255,255,0.08)",
        glow: "0 18px 40px -18px rgba(212, 175, 55, 0.5)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
