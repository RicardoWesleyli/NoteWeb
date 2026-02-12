/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          card: '#252525',
          border: '#333333',
        }
      }
    },
  },
  plugins: [],
};
