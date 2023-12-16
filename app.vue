<script setup>
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
defineRobotMeta();
useHead({
  meta: [
    {
      name: "google-site-verification",
      content: "1-6g_gEt8lfYyb7CwGwQ5b2sDuF1eYzKTc0BxdkmviE",
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
