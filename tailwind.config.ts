import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f5',
          100: '#ffe4ec',
          200: '#fecddc',
          300: '#fea3be',
          400: '#fb6b94',
          500: '#f43f75',
          600: '#e11d5d',
          700: '#d81b60',
          800: '#9f123f',
          900: '#881337',
          deep: '#b81248',
          accent: '#e6195e',
          subtle: '#fff5f8',
        },
        sage: {
          50: '#f4f9f6',
          100: '#e3f1e9',
          500: '#10b981',
          600: '#059669',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(225, 29, 93, 0.08)',
        'card': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        'glow': '0 0 25px rgba(225, 29, 93, 0.25)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        signature: ['var(--font-caveat)', 'cursive'],
      }
    },
  },
  plugins: [],
};
export default config;
