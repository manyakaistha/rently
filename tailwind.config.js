/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FFFFFF',
        fg: '#000000',
        accent: '#0066FF',
        success: '#00FF00',
        warning: '#FFFF00',
        error: '#FF0000',
        border: '#000000',
      },
      boxShadow: {
        'neo': '8px 8px 0px #000000',
        'neo-hover': '4px 4px 0px #000000',
        'neo-sm': '4px 4px 0px #000000',
      },
      borderWidth: {
        'neo': '4px',
      },
      fontFamily: {
        display: ['"Darker Grotesque"', 'sans-serif'],
        sans: ['"Darker Grotesque"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
