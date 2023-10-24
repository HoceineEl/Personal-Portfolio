<script setup>
useHead({
  meta: [
    {
      name: "google-site-verification",
      content: "1-6g_gEt8lfYyb7CwGwQ5b2sDuF1eYzKTc0BxdkmviE",
    },
  ],
});
// import { CursorFx } from "@luxdamore/vue-cursor-fx";
</script>

<template>
  <div>
    <slot />
  </div>
  <!-- <cursor-fx /> -->
  <ChunkScrollToggler />
</template>
<style scoped></style>
