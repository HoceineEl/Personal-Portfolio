<script setup>
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
defineRobotMeta();
  const route = useRoute();
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
</script>
<template>
  <div class="">
    <ChunkScrollIndicator />
    <SpeedInsights />
    <NuxtLayout>
      <div>
        <NuxtLoadingIndicator class="z-[100] bg-gr-scroll" :height="8" />
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>
<style scoped></style>
