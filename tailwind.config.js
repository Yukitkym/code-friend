/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-color': '#1E1E1E',
        'bg-light-color': '#252526',
        'black-light': '#333333',
        'code-white': '#D4D4D4',
        'code-green': '#4EC8B0',
        'code-orange': '#CE9178',
        'tag-gray': '#7F7F7F',
        'code-blue': '#569CD6',
        'comment-out': '#659252',
        'border-color': '#474747',
        'braces-yellow': '#FCD400',
        'braces-pink': '#D66ED2',
        'btn-gray': '#3A3D41',
        'btn-blue': '#0E639C'
      },
      fontFamily: {
        en: [
          'Menlo'
        ],
        ja: [
          'Hiragino Kaku Gothic ProN',
          'ヒラギノ角ゴ ProN',
          'Hiragino Kaku Gothic Pro',
          'ヒラギノ角ゴ Pro'
        ]
      }
    },
  },
  plugins: [],
}
