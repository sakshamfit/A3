/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Bone / off-white page background — exact value from source */
        bone: '#FDFBF9',
        /* Primary text */
        ink: '#1a1a1a',
        /* Hover surface for list rows */
        shell: '#F9F9F7',
        /* Dark section background */
        obsidian: '#111111',
        /* Dark section body copy */
        chalk: '#f2f2f2',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', '"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      spacing: {
        26: '6.5rem',
      },
    },
  },
  plugins: [],
}
