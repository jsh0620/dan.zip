/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#F0F4FF',
          100: '#D6E2FF',
          200: '#ADC4FF',
          400: '#6B9BFF',
          500: '#4C82F7',
          600: '#3464D4',
        },
        pastel: {
          pink:   '#FFE4EE',
          peach:  '#FFECD6',
          mint:   '#D6F5EC',
          sky:    '#D6EEFF',
          purple: '#EAD6FF',
          yellow: '#FFF8D6',
        }
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}