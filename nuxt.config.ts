// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

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
    '@vueuse/nuxt',
  ],
  css:['~/assets/css/tailwind.css'],
})