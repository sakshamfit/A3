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
        /* Dark section background */
        inkdeep: '#111111',
        /* Hover surface for list rows */
        shell: '#F9F9F7',
        /* Dark section body copy */
        chalk: '#f2f2f2',
      },
      fontFamily: {
        /* Display — the Archivo system carried over from trendy-attier */
        display: ['Archivo', 'Helvetica', 'Arial', 'sans-serif'],
        /* Body + UI */
        sans: ['"Inter Tight"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        /* Accent — italic serif used inside display headings */
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      letterSpacing: {
        display: '-0.03em',
        headline: '-0.045em',
        label: '0.2em',
        btn: '0.18em',
      },
      lineHeight: {
        display: '0.92',
        lede: '1.62',
      },
      maxWidth: {
        lede: '46ch',
        copy: '52ch',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
        atelier: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      spacing: {
        26: '6.5rem',
      },
    },
  },
  plugins: [],
}
