/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./admin.html",
    "./js/**/*.js",
    "./script.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: '#31642D',
        secondary: '#F37021',
        accent: '#D4DF22',
        surface: '#F8F9FA'
      }
    }
  },
  plugins: [],
}
