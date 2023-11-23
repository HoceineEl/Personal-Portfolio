// https://nuxt.com/docs/api/configuration/nuxt-config
import { html } from 'property-information';
export default defineNuxtConfig({
  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Hoceine EL IDRISSI - Full Stack Web Developer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Hoceine EL IDRISSI - Full Stack Web Developer | Building creative and elegant web experiences.',
        },
        { name: 'author', content: 'Hoceine EL IDRISSI' },
        // Open Graph/Facebook
        { property: 'og:url', content: 'https://hoceine.vercel.app' },
        { property: 'og:title', content: 'Hoceine EL IDRISSI - Full Stack Web Developer' },
        {
          property: 'og:description',
          content: 'Building creative and elegant web experiences. Check out my portfolio!',
        },
        {
          property: 'og:image',
          content: 'https://hoceine.vercel.app/images/hero.webp',
          width: 1200,
          height: 630,
        },
        // Twitter
        { property: 'twitter:url', content: 'https://hoceine.vercel.app' },
        { property: 'twitter:title', content: 'Hoceine EL IDRISSI - Full Stack Web Developer' },
        {
          property: 'twitter:description',
          content: 'Building creative and elegant web experiences. Check out my portfolio!',
        },
        {
          property: 'twitter:image',
          content: 'https://hoceine.vercel.app/images/hero.webp',
          width: 1200,
          height: 630,
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
          content:
            'hoceine el idrissi, web developer, full stack developer, Laravel expert, PHP developer, Nuxt.js specialist, Vue.js developer, Bootstrap, Tailwind CSS, creative web solutions, elegant web experiences, industry trends, Moroccan web developer, freelance developer',
        },
      ],
    },
  },
  content: {
    highlight: {
        theme:"rose-pine-moon",
    },
    documentDriven: true
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
  modules: [
    '@nuxtjs/tailwindcss',
    '@tresjs/nuxt',
    '@vueuse/motion/nuxt',
    'nuxt-delay-hydration',
    '@nuxt/content',
    '@tailwindcss/typography',
    '@nuxt/image',
    'nuxt-content-git'
  ],
  css: ['~/assets/css/tailwind.css'],
  delayHydration: {
    // enables nuxt-delay-hydration in dev mode for testing
    debug: process.env.NODE_ENV === 'development'
  },
  nitro: {
    compressPublicAssets: true,
  },
  router: {
    prefetchLinks: false
  },
    components: true,
  image: {
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
      '2xl': 1536
    },
    qulity:95
  }
})
