// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
     head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/logo.svg' 
        }
      ]
     } 
   },

  modules: ['@nuxtjs/tailwindcss', '@tresjs/nuxt', '@vueuse/motion/nuxt'],
  css:['~/assets/css/tailwind.css'],
})
