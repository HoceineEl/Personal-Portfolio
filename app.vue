<template>
  <div>
    <ChunkScrollIndicator />
    <NuxtLayout>
      <div>
        <NuxtLoadingIndicator class="z-[300] bg-gr-scroll" :height="8" />
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>
<script setup>
useHead({
  meta: [
    {
      name: "google-site-verification",
      content: "1-6g_gEt8lfYyb7CwGwQ5b2sDuF1eYzKTc0BxdkmviE",
    },
  ],
});
</script>
<style scoped>
/* The progress bar (scroll indicator) */
</style>
