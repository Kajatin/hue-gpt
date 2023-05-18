/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        dot1: {
          "0%, 40%, 100%": { transform: "scale(1)", opacity: 1 },
          "20%": { transform: "scale(1.2)", opacity: 1.2 },
        },
        dot2: {
          "0%, 10%, 50%, 100%": { transform: "scale(1)", opacity: 1 },
          "30%": { transform: "scale(1.2)", opacity: 1.2 },
        },
        dot3: {
          "0%, 20%, 60%, 100%": { transform: "scale(1)", opacity: 1 },
          "40%": { transform: "scale(1.2)", opacity: 1.2 },
        },
      },
      animation: {
        dot1: "dot1 0.9s ease-in-out infinite",
        dot2: "dot2 0.9s ease-in-out infinite",
        dot3: "dot3 0.9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
