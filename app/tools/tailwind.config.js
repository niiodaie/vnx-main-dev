/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🌐 Visnec Brand Palette
        visnecBlue: "#0047FF",
        visnecCyan: "#06B6D4",
        visnecOrange: "#FF7A00",
        visnecPurple: "#9D50FF",
        visnecGreen: "#00C853",
        visnecTeal: "#00BFA5",
        visnecGray: "#F5F7FA",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        geist: ["Geist", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 6px rgba(0,0,0,0.08)",
        card: "0 4px 16px rgba(0,0,0,0.06)",
        glow: "0 0 20px rgba(0, 71, 255, 0.2)",
      },
      backgroundImage: {
        "visnec-gradient": "linear-gradient(to right, #0047FF, #06B6D4)",
        "visnec-orange": "linear-gradient(to right, #FF7A00, #FFB800)",
        "visnec-purple": "linear-gradient(to right, #9D50FF, #C77DFF)",
        "visnec-green": "linear-gradient(to right, #00C853, #69F0AE)",
      },
      transitionDuration: {
        250: "250ms",
      },
    },
  },
  plugins: [],
};
