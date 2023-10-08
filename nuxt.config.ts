// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   buildModules: [
    'nuxt-vite'
  ],
  vite: {
    build: true
  },
  devtools: { enabled: false },

  app: {
    head: {
       title:"Hoceine EL IDRISSI's Portfolio",
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/logo.svg' 
        }
      ]
     } 
   },

  modules: [
    '@nuxtjs/tailwindcss',
    '@tresjs/nuxt',
  ],
  css: ['~/assets/css/tailwind.css'],

})
