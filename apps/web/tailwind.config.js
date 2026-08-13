/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef2f2",
          100: "#fee2e2",
          light: "#f87171",
          DEFAULT: "#dc2626",
          500: "#dc2626",
          600: "#dc2626",
          700: "#b91c1c",
          dark: "#991b1b",
          900: "#7f1d1d",
        },
        success: {
          DEFAULT: "#16a34a",
          50: "#f0fdf4",
          100: "#dcfce7",
        },
        warning: {
          DEFAULT: "#d97706",
          50: "#fffbeb",
          100: "#fef3c7",
        },
        danger: {
          DEFAULT: "#dc2626",
          50: "#fef2f2",
          100: "#fee2e2",
        },
        info: {
          DEFAULT: "#2563eb",
          50: "#eff6ff",
          100: "#dbeafe",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 12px -2px rgb(0 0 0 / 0.10), 0 2px 6px -2px rgb(0 0 0 / 0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
