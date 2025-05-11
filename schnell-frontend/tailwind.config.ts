import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-charcoal': '#0E1116',
        'brand-charcoal-light': '#1A1E25', // Slightly lighter for card backgrounds
        'brand-charcoal-lighter': '#2B303A', // For borders or secondary elements
        'brand-charcoal-dark': '#0A0C10', // Slightly darker for input backgrounds
        'brand-charcoal-darkest': '#07080B', // Even darker for specific input elements
        'brand-teal': '#23FFD2',
        'brand-teal-dark': '#1EDAB4', // For hover states
        'brand-teal-darker': '#19B897', // For active/focus states
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.025em', // Matches -0.25px for hero text if base font is 16px
      },
    },
  },
  plugins: [],
};
export default config;