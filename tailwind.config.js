/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif']
      }
    }
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}


