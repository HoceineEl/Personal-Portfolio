/** @type {import('tailwindcss').Config} */
export default {
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
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },
      backgroundImage: {
        "hero-pattern": "url('/assets/herobg.png')",
      },
      keyframes: {
        bounce2x: {
          '0%,100%': { transform: 'translateY(-60%)' },
          '50%': { transform: 'none' },
        },
      },
      animation: {
        Gargarya: 'bounce2x 1s ease-in-out infinite',
      },
      fontFamily: {
        'hepta-sans': 'Hepta Slab, Arial, sans-serif',
        'hepta-serif': 'Hepta Slab, Arial, serif',
        'Montserrat': 'Montserrat, Arial, sans-serif'
      },
    },
  },
  plugins: [require('@tailwindcss/typography')]
}