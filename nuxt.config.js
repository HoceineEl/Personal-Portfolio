// https://nuxt.com/docs/api/configuration/nuxt-config
const countWords = (node) =>
  typeof node === 'string'
    ? node.trim().split(/\s+/).filter(Boolean).length
    : node.slice(2).reduce((total, child) => total + countWords(child), 0)

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
          href: 'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Alexandria:wght@300..900&family=JetBrains+Mono:wght@400..600&display=swap',
        },
      ],
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'tokyo-night',
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
    },
  },
  hooks: {
    'content:file:afterParse'({ content }) {
      if (content.body?.type !== 'minimark') return
      content.wordCount = content.body.value.reduce((total, node) => total + countWords(node), 0)
      content.minutes = Math.ceil(content.wordCount / 200)
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
    '/blog/**': { robots: true },
    '/': { robots: true },
  },
  site: {
    url: 'https://hoceine.com',
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-delay-hydration',
    '@nuxtjs/i18n',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/robots',
  ],
  i18n: {
    baseUrl: 'https://hoceine.com',
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    langDir: 'locales',
    locales: [
      { code: 'en', language: 'en-US', dir: 'ltr', name: 'English', file: 'en.json' },
      { code: 'ar', language: 'ar', dir: 'rtl', name: 'العربية', file: 'ar.json' },
    ],
  },
  css: ['~/assets/css/tailwind.css'],
  delayHydration: {
    // enables nuxt-delay-hydration in dev mode for testing
    debug: process.env.NODE_ENV === 'development'
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: ['/sitemap.xml', '/rss.xml', '/llms.txt', '/llms-full.txt']
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
