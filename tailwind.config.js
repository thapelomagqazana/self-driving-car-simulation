/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Ensure all files are included
  theme: {
    extend: {
      colors: {
        background: "#000000", // Black background
        primary: "#00FF00", // Neon green for accents
        secondary: "#FF4500", // Bright orange for highlights
      },
      fontFamily: {
        title: ["Orbitron", "sans-serif"], // Cool futuristic font
      },
    },
  },
  plugins: [],
};
