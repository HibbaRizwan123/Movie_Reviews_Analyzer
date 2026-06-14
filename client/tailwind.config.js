/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        condensed: ['Roboto Condensed', 'sans-serif'],
        serif: ['DM Serif Text', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {'custom-dark-blue': '#0d1626',
        'custom-light-purple': '#a083c9',
        'custom-blue': '#7c3aed',        // proper purple-blue, passes WCAG AA
        'custom-purple-accent': '#a855f7', // brighter accent for underlines
},
    },
  },
  plugins: [],
}
// #05081c