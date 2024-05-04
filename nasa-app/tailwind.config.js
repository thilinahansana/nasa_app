const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "color-change": "color-change 2s infinite",
      },
      keyframes: {
        "color-change": {
          "0%": { color: "#00ff00" }, // Starting color
          "50%": { color: "#ff00ff" }, // Middle color
          "100%": { color: "#00ff00" }, // Ending color
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
