/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f4f4f5',
        surface: '#ffffff',
        primary: '#fbbf24', // Electric yellow accent
        secondary: '#3b82f6', // Bright blue
        accent: '#84cc16', // Lime
        danger: '#ef4444', // Red
        border: '#000000',
        text: '#000000',
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '6px 6px 0px 0px rgba(0,0,0,1)',
        'neo-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
      },
      borderWidth: {
        'neo': '3px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
