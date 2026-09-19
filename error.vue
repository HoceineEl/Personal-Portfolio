<script setup>
const props = defineProps({ error: Object });
const notFound = computed(() => props.error?.statusCode === 404);

useHead({ title: notFound.value ? "Page not found" : "Something broke" });
</script>

<template>
  <NuxtLayout>
    <section class="shell relative isolate flex min-h-[80vh] flex-col justify-center overflow-hidden pb-20 pt-32">
      <div class="error-light blinds absolute -right-20 top-10 -z-10 h-[30rem] w-[40rem] opacity-60" aria-hidden="true" />
      <p class="font-mono text-sm text-muted">{{ error?.statusCode || 500 }}</p>
      <h1 class="wide mt-4 max-w-4xl text-display-xl font-black">
        {{ notFound ? "This page wandered off." : "Something broke on my end." }}
      </h1>
      <p class="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        {{ notFound
          ? "The link might be old, or I renamed something. The good stuff is still here."
          : "It's been logged. Try again in a moment, or head back home." }}
      </p>
      <div class="mt-10 flex flex-wrap gap-3">
        <button type="button" class="btn-sun" @click="clearError({ redirect: '/' })">Back home</button>
        <button type="button" class="btn-ghost" @click="clearError({ redirect: '/blog' })">Read the blog</button>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.error-light {
  mask-image: radial-gradient(closest-side, black, transparent);
}
</style>
