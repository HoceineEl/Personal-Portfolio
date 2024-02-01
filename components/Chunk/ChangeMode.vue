<script setup>
let changeMode = ref(false);
import { clear, stars } from "~/assets";
</script>

<template>
  <div class="group flex justify-center fixed bottom-16 left-5">
    <button
      class="bg-main-violet p-1 rounded-full"
      @click="changeMode = !changeMode"
      aria-label="Toggle Mode"
    >
      <NuxtImg
        :src="stars"
        alt="Stars Image"
        class="transition duration-500"
        v-if="!changeMode"
        loading="lazy"
        height="25"
        width="25"
      />

      <NuxtImg
        :src="clear"
        alt="Clear Image"
        class="transition duration-500"
        v-if="changeMode"
        loading="lazy"
        height="25"
        width="25"
      />
    </button>
  </div>
  <div class="absolute -z-10" v-if="changeMode">
    <LazyCanvasStarsCanvas />
  </div>
</template>

<style scoped></style>
