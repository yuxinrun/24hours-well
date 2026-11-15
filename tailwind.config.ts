import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFBF7',
          100: '#F9F6EF',
          200: '#F3EEE3',
          300: '#EAE2D3',
          400: '#DED2BE',
        },
        ink: {
          DEFAULT: '#2A2724',
          soft: '#4A453F',
          muted: '#7A736A',
          faint: '#A9A297',
        },
        caramel: {
          50: '#FBF3EC',
          100: '#F4E2D1',
          200: '#E8C4A3',
          300: '#D9A075',
          400: '#C67C4B',
          500: '#A8623C',
          600: '#8A4E2F',
          700: '#6B3C26',
        },
        forest: {
          DEFAULT: '#33513F',
          light: '#4F6E58',
          soft: '#E7EDE8',
        },
        clay: '#B5651D',
      },
      fontFamily: {
        serif: ['var(--font-serif)', '"Noto Serif SC"', '"Source Han Serif SC"', '"Songti SC"', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', '"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', '-apple-system', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
        prose: '760px',
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(42,39,36,0.04), 0 8px 28px rgba(42,39,36,0.05)',
        lift: '0 4px 12px rgba(42,39,36,0.06), 0 18px 44px rgba(42,39,36,0.08)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
