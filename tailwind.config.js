/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    'components/**/*.{vue,js,ts}',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'composables/**/*.{js,ts}',
    'plugins/**/*.{js,ts}',
    'App.{js,ts,vue}',
    'app.{js,ts,vue}',
    'Error.{js,ts,vue}',
    'error.{js,ts,vue}',
    'content/**/*.md'
  ],
  theme: {
    extend: {
      colors: {
        // Neo-Brutalism palette
        'neo-black': '#0D0D0D',
        'neo-white': '#FFFEF0',
        'neo-lime': '#CCFF00',
        'neo-pink': '#FF2E63',
        'neo-cyan': '#00D4FF',
        'neo-purple': '#8B5CF6',
        'neo-orange': '#FF6B35',
        'neo-yellow': '#FFE66D',
        // Semantic colors
        'surface': 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'border': 'var(--color-border)',
        'accent': 'var(--color-accent)',
        // Legacy support
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        blogColor: "#0F172A",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
        "main-violet": "#915EFF",
      },
      boxShadow: {
        // Neo-Brutalism shadows - hard offset, no blur
        'neo': '4px 4px 0px var(--color-border)',
        'neo-sm': '2px 2px 0px var(--color-border)',
        'neo-lg': '6px 6px 0px var(--color-border)',
        'neo-xl': '8px 8px 0px var(--color-border)',
        'neo-accent': '4px 4px 0px var(--color-accent)',
        'neo-pink': '4px 4px 0px #FF2E63',
        'neo-lime': '4px 4px 0px #CCFF00',
        'neo-cyan': '4px 4px 0px #00D4FF',
        'neo-hover': '6px 6px 0px var(--color-border)',
        'neo-active': '2px 2px 0px var(--color-border)',
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      fontFamily: {
        'display': ['Clash Display', 'Space Grotesk', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Space Mono', 'monospace'],
        'body': ['DM Sans', 'system-ui', 'sans-serif'],
        'poppins': ['Poppins', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.1', fontWeight: '800' }],
        'display-lg': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.15', fontWeight: '700' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', fontWeight: '700' }],
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'Gargarya': 'bounce2x 1s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        bounce2x: {
          '0%,100%': { transform: 'translateY(-60%)' },
          '50%': { transform: 'none' },
        },
      },
      backgroundImage: {
        'grid-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23000' stroke-width='0.5' opacity='0.08'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        'dots-pattern': `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.05'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
        'hero-pattern': "url('/assets/herobg.webp')",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')]
}
