<script setup>
let changeMode = ref(false);
import { clear, stars } from "~/assets";
</script>

<template>
  <div class="group flex justify-center fixed bottom-5 left-5">
    <button class="bg-main-violet p-1 rounded-full" @click="changeMode = !changeMode">
      <Transition name="fade"
        ><NuxtImg
          :src="stars"
          class="transition duration-500"
          v-if="!changeMode"
          loading="lazy"
          height="30"
          width="30"
      /></Transition>
      <Transition name="fade"
        ><NuxtImg
          :src="clear"
          class="transition duration-500"
          v-if="changeMode"
          loading="lazy"
          height="30"
          width="30"
      /></Transition>
    </button>
    <div
      class="rounded bg-tertiary py-[6px] px-4 text-sm font-semibold text-white opacity-0 group-hover:opacity-100 absolute left-2 bottom-20 overflow-hidden h-fit w-60"
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(50px);
}
</style>
