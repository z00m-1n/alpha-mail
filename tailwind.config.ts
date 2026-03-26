import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#09111f",
        slate: {
          25: "#f9fbff",
          950: "#0f172a",
        },
        brand: {
          50: "#eef3ff",
          100: "#dfe8ff",
          200: "#c4d4ff",
          300: "#99b4ff",
          400: "#6f8dff",
          500: "#3e63f4",
          600: "#2949d2",
          700: "#2038a4",
          800: "#1f327d",
          900: "#1d2f67"
        },
        accent: {
          mint: "#d8fff3",
          amber: "#fff4d6",
          rose: "#ffe1e7"
        }
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-space-grotesk)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.08)",
        panel: "0 10px 30px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "hero-grid": "radial-gradient(circle at top left, rgba(62, 99, 244, 0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(15, 23, 42, 0.08), transparent 28%)",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseSoft: "pulseSoft 2.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
