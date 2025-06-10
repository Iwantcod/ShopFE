/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3A6EF2',
          dark: '#2958D7',
          light: '#5C88F5',
        },
        accent: {
          DEFAULT: '#D7B17C',
          light: '#E3C49B',
        },
        stone: { 50: '#F6F7F9' }, // 배경 전용
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0,0,0,.04)',
      },
      fontFamily: { sans: ['"Pretendard Variable"', 'Inter', 'sans-serif'] },
    },
  },
};
