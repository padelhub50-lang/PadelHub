/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0806",
        bg2: "#161009",
        bg3: "#1F1710",
        bg4: "#2C1608",
        line: "rgba(255,255,255,0.09)",
        orange: "#FF5A1F",
        orange2: "#FF8A3D",
        rust: "#B8360F",
        gold: "#FFB84D",
        cream: "#cabfb3",
        good: "#4ADE80",
        bad: "#FF6B6B",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      boxShadow: {
        btn: "0 6px 0 #B8360F, 0 14px 26px rgba(255,90,31,0.32)",
        card: "0 20px 40px rgba(0,0,0,0.35)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        floaty: "floaty 5s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};
