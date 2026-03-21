/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg:    '#0e0f11',
        s1:    '#141518',
        s2:    '#1c1d21',
        s3:    '#242629',
        s4:    '#2c2e34',
        t1:    '#f1f2f4',
        t2:    '#9499a8',
        t3:    '#545968',
        acc:   '#5b7cf6',
        acch:  '#4a6cf0',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}
