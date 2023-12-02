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
    <div
      class="rounded bg-tertiary py-[6px] px-4 text-sm font-semibold text-white opacity-0 group-hover:opacity-100 absolute left-2 bottom-14 overflow-hidden h-fit w-60"
      :aria-hidden="true"
    >
      <span
        class="absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-tertiary"
      ></span>
      <span :aria-hidden="true" class="">
        "Trade a bit of fun for a new experience on this site. Uncover the hidden bugs
        once the novelty wears off, and you've clicked your way through the new
        adventure.(solution -> reload)"
      </span>
    </div>
  </div>
  <div class="absolute -z-10" v-if="changeMode">
    <LazyCanvasStarsCanvas />
  </div>
</template>

<style scoped></style>
