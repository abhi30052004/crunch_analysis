/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        'surface-100': '#08090B',
        'surface-200': '#0D0F12',
        'border-color': 'rgba(255,255,255,0.08)',
        'text-primary': '#F5F5F5',
        'text-secondary': '#A1A1AA',
        'text-tertiary': '#71717A',
        accent: '#00FF9D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
