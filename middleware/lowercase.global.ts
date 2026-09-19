export default defineNuxtRouteMiddleware((to) => {
  if (/[A-Z]/.test(to.path)) {
    return navigateTo({ path: to.path.toLowerCase(), query: to.query, hash: to.hash }, { redirectCode: 301 })
  }
})
