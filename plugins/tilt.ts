import VanillaTilt from 'vanilla-tilt'
export default defineNuxtPlugin((nuxtApp) => {

    return {
        provide: {
            VanillaTilt: VanillaTilt
        }
    }
 })

