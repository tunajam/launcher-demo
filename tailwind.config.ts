import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          950: '#010f0a',
          900: '#022c22',
        },
        carolina: '#4B9CD3',
        purple: {
          700: '#5B21B6',
          500: '#8B5CF6',
        },
      },
      fontFamily: {
        serif: ['Instrument Serif', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      borderRadius: {
        none: '0',
      },
      backdropBlur: {
        lg: '12px',
      },
    },
  },
  plugins: [],
};
export default config;
