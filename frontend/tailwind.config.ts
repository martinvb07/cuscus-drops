import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:    '#0a0a0a',
        bone:   '#ebe6db',
        'bone-2': '#cfc8b8',
        'bone-3': '#7a7567',
      },
      fontFamily: {
        gothic:   ['var(--font-gothic)'],
        garamond: ['var(--font-garamond)'],
        mono:     ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
};

export default config;
