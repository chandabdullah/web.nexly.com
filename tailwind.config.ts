import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Sora"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 30px 80px rgba(3, 105, 161, 0.18)',
        card: '0 24px 60px rgba(15, 23, 42, 0.12)',
      },
      colors: {
        skybrand: {
          50: '#eefbff',
          100: '#d7f4ff',
          200: '#b3ecff',
          300: '#78ddff',
          400: '#2acff3',
          500: '#11b8e7',
          600: '#0991c9',
          700: '#0c72a3',
          800: '#115f86',
          900: '#154f6d',
        },
      },
      backgroundImage: {
        'hero-wash':
          'radial-gradient(circle at top right, rgba(34, 211, 238, 0.32), transparent 28%), radial-gradient(circle at left 35%, rgba(56, 189, 248, 0.24), transparent 24%), linear-gradient(180deg, #0e78cf 0%, #17c3e2 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config
