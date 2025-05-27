/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: "#f0f4f7",
          100: "#d9e3eb",
          200: "#b3c7d7",
          300: "#8dabc3",
          400: "#678faf",
          500: "#41739b",
          600: "#195175",
          700: "#14405c",
          800: "#0f2f43",
          900: "#0a1f2a",
        },
        // Secondary colors for accents
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Success colors
        success: {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
        },
        // Warning colors
        warning: {
          50: "#fffbeb",
          500: "#f59e0b",
          600: "#d97706",
        },
        // Error colors
        error: {
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
        },
        // Background colors
        background: {
          light: "#ffffff",
          dark: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Inter var", "system-ui", "sans-serif"],
        display: ["Lexend", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 4px rgba(0, 0, 0, 0.05), 0 4px 8px rgba(0, 0, 0, 0.05)",
        "card-hover":
          "0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
