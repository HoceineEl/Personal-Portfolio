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
          href: 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500..900&family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&family=Alexandria:wght@300..900&family=JetBrains+Mono:wght@400..600&display=swap',
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
    groups: [{ userAgent: '*', contentSignal: { search: 'yes', 'ai-input': 'yes', 'ai-train': 'yes' } }],
    sitemap: ['https://hoceine.com/sitemap.xml'],
  },
  routeRules: {
    '/ar/blog': { redirect: { to: '/blog', statusCode: 301 } },
    '/ar/blog/**': { redirect: { to: '/blog/**', statusCode: 301 } },
    '/ar/rss.xml': { redirect: { to: '/rss.xml', statusCode: 301 } },
    '/blog/filament-schemas-guide': { redirect: { to: '/blog/filament-4-complete-guide', statusCode: 301 } },
    '/blog/filament-v4-nested-resources': { redirect: { to: '/blog/filament-4-complete-guide', statusCode: 301 } },
    '/blog/laravel-octane-performance': { redirect: { to: '/blog/laravel-performance-optimization', statusCode: 301 } },
    '/blog/laravel-12-automatic-eager-loading': { redirect: { to: '/blog/laravel-performance-optimization', statusCode: 301 } },
    '/blog/pest-architecture-testing': { redirect: { to: '/blog/laravel-testing-best-practices', statusCode: 301 } },
    '/blog/pest-browser-testing': { redirect: { to: '/blog/laravel-testing-best-practices', statusCode: 301 } },
    '/blog/pest-mutation-testing': { redirect: { to: '/blog/laravel-testing-best-practices', statusCode: 301 } },
    '/blog/livewire-state-management': { redirect: { to: '/blog/livewire-form-objects', statusCode: 301 } },
    '/blog/brute-force-attacks': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/webp-vs-avif-vs-png': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/filament-custom-actions-bulk': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/filament-form-builder-advanced': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/filament-infolists-guide': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/filament-notifications-system': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/filament-table-builder-advanced': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/filament-widgets-dashboard': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-11-streamlined-structure': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-12-complete-guide': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-12-starter-kits': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-api-development': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-cashier-stripe-subscriptions': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-context-facade': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-deployment-best-practices': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-folio-routing': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-pennant-feature-flags': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-precognition': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-pulse-monitoring': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-reverb-websockets': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/laravel-security-best-practices': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/livewire-4-features': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/livewire-islands-architecture': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/php-85-complete-guide': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/tailwind-css-v4-guide': { redirect: { to: '/blog', statusCode: 301 } },
    '/blog/**': { robots: true },
    '/': {
      robots: true,
      headers: {
        Link: [
          '</.well-known/api-catalog>; rel="api-catalog"',
          '</llms.txt>; rel="describedby"; type="text/plain"',
          '</rss.xml>; rel="alternate"; type="application/rss+xml"',
          '</sitemap.xml>; rel="sitemap"; type="application/xml"',
        ].join(', '),
        Vary: 'Accept',
      },
    },
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
      routes: ['/robots.txt', '/sitemap.xml', '/rss.xml', '/llms.txt', '/llms-full.txt', '/.well-known/api-catalog']
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
