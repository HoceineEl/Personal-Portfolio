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
    <Transition name="slide"><slot /></Transition>
  </div>
  <!-- <cursor-fx /> -->
</template>
<style scoped>
.spbg {
  background-color: #673dff73;
  background-image: linear-gradient(319deg, #673dff73 0%, #aa00ff8c 37%, #cc44989d 100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
.slide-leave-active {
  transition: transform 1.5s;
}
</style>
