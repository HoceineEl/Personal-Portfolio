// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  app: {
    head: {
      title: "Hoceine EL IDRISSI's Portfolio",
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/logo.svg'
        }
      ], meta: [
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
      theme: 'github-dark'
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@tresjs/nuxt',
    '@vueuse/motion/nuxt',
    'nuxt-delay-hydration',
    '@nuxt/content',
    '@tailwindcss/typography',
     ['nuxt-content-git'],
  ],
  css: ['~/assets/css/tailwind.css'],
   delayHydration: {
    // enables nuxt-delay-hydration in dev mode for testing
    debug: process.env.NODE_ENV === 'development'
  },
  nitro: {
    compressPublicAssets: true,
  },
})
