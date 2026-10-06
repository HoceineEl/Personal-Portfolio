/** @type {import('tailwindcss').Config} */
const token = (name) => `oklch(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: [
    'components/**/*.{vue,js,ts}',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'composables/**/*.{js,ts}',
    'plugins/**/*.{js,ts}',
    'assets/constants/**/*.js',
    'App.{js,ts,vue}',
    'app.{js,ts,vue}',
    'Error.{js,ts,vue}',
    'error.{js,ts,vue}',
    'content/**/*.md'
  ],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        raised: token('raised'),
        ink: token('ink'),
        muted: token('muted'),
        line: token('line'),
        sun: token('sun'),
        'sun-ink': token('sun-ink'),
        'on-sun': token('on-sun'),
        live: token('live'),
        deep: token('deep'),
        'on-deep': token('on-deep'),
        // Legacy aliases kept so older markup (tools page, markdown) still resolves
        surface: token('bg'),
        'surface-alt': token('raised'),
        'text-primary': token('ink'),
        'text-secondary': token('muted'),
        border: token('line'),
        accent: token('sun'),
        'neo-black': 'oklch(0.16 0.006 80)',
        'neo-white': 'oklch(0.985 0 0)',
        'neo-primary': token('sun'),
        'neo-secondary': token('sun'),
        'neo-lime': token('sun'),
        'neo-pink': token('sun'),
        'neo-cyan': token('sun'),
        'neo-purple': token('sun'),
        'neo-orange': token('sun'),
        'neo-yellow': token('sun'),
      },
      fontFamily: {
        sans: ['"Schibsted Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Big Shoulders Display"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Schibsted Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 1.6rem + 7.6vw, 6rem)', { lineHeight: '0.86', letterSpacing: '-0.01em' }],
        'display-lg': ['clamp(2.75rem, 1.5rem + 4.8vw, 5rem)', { lineHeight: '0.9', letterSpacing: '-0.005em' }],
        'display-md': ['clamp(2rem, 1.3rem + 2.8vw, 3.25rem)', { lineHeight: '0.95', letterSpacing: '0' }],
        'display-sm': ['clamp(1.6rem, 1.2rem + 1.4vw, 2.1rem)', { lineHeight: '1', letterSpacing: '0' }],
      },
      maxWidth: {
        prose: '68ch',
        page: '84rem',
      },
      screens: {
        xs: '450px',
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      zIndex: {
        sticky: '30',
        header: '40',
        overlay: '50',
        toast: '60',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')]
}
