// https://nuxt.com/docs/api/configuration/nuxt-config
import { html } from 'property-information';
export default defineNuxtConfig({
  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/images/logo.svg' }
      ],
      title: 'Hoceine EL IDRISSI - Full Stack Web Developer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Explore the portfolio of Hoceine El Idrissi, a Moroccan freelance web developer with expertise in Laravel, PHP, Nuxt.js, and Vue.js, offering industry-leading web development solutions and staying up-to-date with the latest trends.',
        },
        { name: 'author', content: 'Hoceine EL IDRISSI' },
        // Open Graph/Facebook
        { property: 'og:url', content: 'https://hoceine.com' },
        { property: 'og:title', content: 'Hoceine EL IDRISSI - Full Stack Web Developer' },
        {
          property: 'og:description',
          content: 'Explore the portfolio of Hoceine El Idrissi, a Moroccan freelance web developer with expertise in Laravel, PHP, Nuxt.js, and Vue.js, offering industry-leading web development solutions and staying up-to-date with the latest trends.',
        },
        {
          property: 'og:image',
          content: 'https://hoceine.com/images/hero.webp',
        },
        // Twitter
        { property: 'twitter:url', content: 'https://hoceine.com' },
        { property: 'twitter:title', content: 'Hoceine EL IDRISSI - Full Stack Web Developer' },
        {
          property: 'twitter:description',
          content: 'Explore the portfolio of Hoceine El Idrissi, a Moroccan freelance web developer with expertise in Laravel, PHP, Nuxt.js, and Vue.js, offering industry-leading web development solutions and staying up-to-date with the latest trends.',
        },
        {
          property: 'twitter:image',
          content: 'https://hoceine.com/images/hero.webp',
        },
        {
          property: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          property: 'twitter:creator',
          content: '@HoceineElidrisi', // Replace with your Twitter handle
        },
        {
          name: 'keywords',
          content: 'Hoceine El Idrissi, Web Developer, Full Stack Developer, Laravel , PHP Developer, Nuxt.js , Vue.js Developer, Bootstrap, Tailwind CSS,Web Solutions, Web, Moroccan Web Developer, Freelance Developer, Web Development Portfolio',
        },
      ],
    },

  },
  content: {
    documentDriven: true,
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
  build: {
    extractCSS: true,
    splitChunks: {
      pages: true,
      vendor: true,
      commons: true,
      runtime: true,
      layouts: true
    },
    optimization: {
      splitChunks: {
        maxSize: 100000
      }
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        preserveLineBreaks: false,
        collapseWhitespace: true
      }
    },
  },
  robots: {
    allow: ['/', '/blog', '/blog/**']
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
    '@tresjs/nuxt',
    '@vueuse/motion/nuxt',
    'nuxt-delay-hydration',
    '@nuxt/content',
    '@tailwindcss/typography',
    '@nuxt/image',
    'nuxt-simple-robots',
    '@stefanobartoletti/nuxt-social-share',
    '@nuxthq/studio'
  ],
  socialShare: {
    // module options
  },
  css: ['~/assets/css/tailwind.css'],
  delayHydration: {
    // enables nuxt-delay-hydration in dev mode for testing
    debug: process.env.NODE_ENV === 'development'
  },
  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: ['/sitemap.xml']
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
    qulity: 95
  }
})
