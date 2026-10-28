/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          bg: '#0A0E17',
          card: '#121826',
          surface: '#1A2234',
          border: '#242F48',
          red: '#E50914',
          'red-hover': '#B80710',
          'red-glow': 'rgba(229, 9, 20, 0.4)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(229, 9, 20, 0.35)',
        'glow-lg': '0 0 35px rgba(229, 9, 20, 0.5)',
      }
    },
  },
  plugins: [],
}
