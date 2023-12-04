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
        content: 'Explore the portfolio of Hoceine El Idrissi, a Moroccan freelance web developer with expertise in Laravel, PHP, Nuxt.js, and Vue.js, offering industry-leading web development solutions and staying up-to-date with the latest trends.',
      },
      { name: 'author', content: 'Hoceine EL IDRISSI' },
      // Open Graph/Facebook
      { property: 'og:url', content: 'https://hoceine.vercel.app' },
      { property: 'og:title', content: 'Hoceine EL IDRISSI - Full Stack Web Developer' },
      {
        property: 'og:description',
        content: 'Explore the portfolio of Hoceine El Idrissi, a Moroccan freelance web developer with expertise in Laravel, PHP, Nuxt.js, and Vue.js, offering industry-leading web development solutions and staying up-to-date with the latest trends.',
      },
      {
        property: 'og:image',
        content: 'https://hoceine.vercel.app/images/hero.webp',
      },
      // Twitter
      { property: 'twitter:url', content: 'https://hoceine.vercel.app' },
      { property: 'twitter:title', content: 'Hoceine EL IDRISSI - Full Stack Web Developer' },
      {
        property: 'twitter:description',
        content: 'Explore the portfolio of Hoceine El Idrissi, a Moroccan freelance web developer with expertise in Laravel, PHP, Nuxt.js, and Vue.js, offering industry-leading web development solutions and staying up-to-date with the latest trends.',
      },
      {
        property: 'twitter:image',
        content: 'https://hoceine.vercel.app/images/hero.webp',
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
        content: 'Hoceine El Idrissi, Web Developer, Full Stack Developer, Laravel Expert, PHP Developer, Nuxt.js Specialist, Vue.js Developer, Bootstrap, Tailwind CSS, Creative Web Solutions, Elegant Web Experiences, Industry Trends, Moroccan Web Developer, Freelance Developer, Web Development Portfolio',
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
    prefetchLinks: false,
  },
    components: true,
  image: {
    screens: {
      'xs': 320,
      'md': 768,
      'xl': 1280,
    },
    qulity:95
  }
})
