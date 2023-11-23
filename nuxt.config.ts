// https://nuxt.com/docs/api/configuration/nuxt-config
import { html } from 'property-information';
export default defineNuxtConfig({
  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: {
      lang: 'en'
    },
      title: "Hoceine EL IDRISSI",
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/logo.svg'
        }
      ], meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Hoceine EL IDRISSI Personal Portfolio ' },
        { name: "author", content: "Hoceine EL IDRISSI" },
        
        //Open Graph/Facebook
        { property: "og:url", content: "https://hoceine.vercel.app" },
        { property: "og:title", content: "Hoceine EL IDRISSI" },
        {
          property: "og:description",
          content: "Hoceine's Personal Portfolio",
        },
        {
          property: "og:image",
          content: "https://hoceine.vercel.app/images/hero.jpeg",
        },
        //Twitter
        { property: "twitter:url", content: "https://hoceine.vercel.app" },
        { property: "twitter:title", content: "Hoceine EL IDRISSI" },
        {
          property: "twitter:description",
          content: "Hoceine's Personal Portfolio",
        },
        {
          property: "twitter:image",
          content: "https://hoceine.vercel.app/images/hero.jpeg",
        },
        {
          property: "twitter:card",
          content: "summary_large_image",
        },
        {
          property: "twitter:creator",
          content: "Hoceine EL IDRISSI",
        },
      ],
    }
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
        maxSize: 30000
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
    '@nuxt/image'
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
