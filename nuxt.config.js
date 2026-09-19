// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'Hoceine El Idrissi' },
        { name: 'color-scheme', content: 'dark light' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=JetBrains+Mono:wght@400..600&display=swap',
        },
      ],
    },
  },
  content: {
    highlight: {
      theme: {
        default: 'tokyo-night',
        dark: 'tokyo-night',
        light: 'tokyo-night',
      },
      langs: [
        'php',
        'javascript',
        'typescript',
        'vue',
        'vue-html',
        'html',
        'css',
        'scss',
        'json',
        'yaml',
        'bash',
        'shell',
        'sql',
        'markdown',
        'diff',
        'ini',
        'nginx',
        'dockerfile',
        'xml',
        'jsx',
        'tsx',
        'python',
        'ruby',
        'go',
        'rust',
        'blade',
      ],
    },
  },
  vite: {
    build: {
      minify: 'terser',
    },
  },
  robots: {
    allow: ['/'],
    sitemap: ['https://hoceine.com/sitemap.xml'],
  },
  routeRules: {
    '/blog/**': { index: true },
    '/': { index: true },
  },
  site: {
    url: 'https://hoceine.com',
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-delay-hydration',
    '@nuxt/content',
    '@nuxt/image',
    'nuxt-simple-robots',
  ],
  css: ['~/assets/css/tailwind.css'],
  delayHydration: {
    // enables nuxt-delay-hydration in dev mode for testing
    debug: process.env.NODE_ENV === 'development'
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: ['/sitemap.xml', '/rss.xml']
    }
  },
  router: {
    prefetchLinks: false,
  },
  components: true,
  image: {
    screens: {
      'xs': 320,
      'md': 768,
      'xl': 1280,
    },
    quality: 80,
    format: ['avif', 'webp']
  }
})
