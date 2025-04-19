/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1b1c1d",
        secondary: "#282a2c",
        green: "#2e6427",
      },
    },
  },
  plugins: [],
};
