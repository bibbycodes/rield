const theme = require('./styles/theme')
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: theme,
      fontFamily: {
        'sans': ['ProximaNova', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
  colors: theme
}
