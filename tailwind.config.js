/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kitchen: {
          50: '#f4fbf7',
          100: '#e6f7ef',
          200: '#c5eed9',
          300: '#93dfb9',
          400: '#5bc794',
          500: '#32ab75',
          600: '#238b5c',
          700: '#1d6e4b',
          800: '#1b573d',
          900: '#174834',
          950: '#0b281d',
        },
        biotech: {
          blue: '#0ea5e9',
          purple: '#8b5cf6',
          amber: '#f59e0b',
          rose: '#f43f5e',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
