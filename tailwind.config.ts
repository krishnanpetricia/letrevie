import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:          '#faf7f2',
        'cream-dark':   '#ede7db',
        terra:          '#b5522a',
        'terra-deep':   '#9e4421',
        ink:            '#181410',
        'ink-mid':      '#6b5d4f',
        gold:           '#e8c46a',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        jost:      ['Jost', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.22em',
        widest3: '0.32em',
      },
    },
  },
  plugins: [],
}

export default config
