<script setup>
const props = defineProps({ error: Object });
const notFound = computed(() => props.error?.statusCode === 404);
const { t } = useI18n();
const localePath = useLocalePath();

useHead({ title: notFound.value ? t("error.notFoundTitle") : t("error.brokenTitle") });
</script>

<template>
  <NuxtLayout>
    <section class="shell relative isolate flex min-h-[80vh] flex-col justify-center overflow-hidden pb-20 pt-32">
      <div class="error-light blinds absolute -right-20 top-10 -z-10 h-[30rem] w-[40rem] opacity-60" aria-hidden="true" />
      <p class="font-mono text-sm text-muted">{{ error?.statusCode || 500 }}</p>
      <h1 class="wide mt-4 max-w-4xl text-display-xl font-black">
        {{ notFound ? t("error.notFound") : t("error.broken") }}
      </h1>
      <p class="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        {{ notFound ? t("error.notFoundBody") : t("error.brokenBody") }}
      </p>
      <div class="mt-10 flex flex-wrap gap-3">
        <button type="button" class="btn-sun" @click="clearError({ redirect: localePath('/') })">{{ t("error.home") }}</button>
        <button type="button" class="btn-ghost" @click="clearError({ redirect: '/blog' })">{{ t("error.blog") }}</button>
      </div>
    </section>
  </NuxtLayout>
</template>

<style scoped>
.error-light {
  mask-image: radial-gradient(closest-side, black, transparent);
}
</style>
