<script setup>
import { play, pause } from "~/assets";
let played = ref(false);
const playWaves = () => {
  played.value = !played.value;
};
</script>
<template>
  <div
    class="fixed bottom-5 left-5 rounded-full w-10 h-10 bg-gradient-to-tr from-teal-600 to-purple-400 flex justify-center items-center cursor-pointer"
    @click="playWaves()"
  >
    <NuxtImg :src="played ? play : pause" class="w-[30px] h-[30px]" format="webp" />
  </div>
</template>

<style></style>
