<script setup>
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

defineRobotMeta();

const route = useRoute();
const { initTheme } = useTheme();

useHead({
  meta: [
    {
      name: "google-site-verification",
      content: "4AxK4N9GEIAr7luoQ-C4sMlPs-3TtU52SAy-r07bN84",
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://hoceine.com' + route.path,
    },
  ],
});

onMounted(() => {
  initTheme();
});
</script>

<template>
  <div class="min-h-screen bg-surface text-text-primary">
    <ChunkScrollIndicator />
    <SpeedInsights />
    <NuxtLayout>
      <div>
        <NuxtLoadingIndicator class="z-[100]" color="#CCFF00" :height="4" />
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped></style>
