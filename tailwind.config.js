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
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.75rem, 1.2rem + 6.4vw, 6rem)', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(2.25rem, 1.3rem + 4vw, 4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(1.75rem, 1.2rem + 2.4vw, 3rem)', { lineHeight: '1', letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(1.375rem, 1.1rem + 1.1vw, 1.875rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
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
