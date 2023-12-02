<script setup>
import { play, pause } from "~/assets";

let played = ref(false);
let audio = null;

const playWaves = async () => {
  if (!audio) {
    const wavesModule = await import("/audio/waves.mp3");
    audio = new Audio(wavesModule.default);
    audio.addEventListener("ended", () => audio.play());
  }

  if (played.value) audio.pause();
  else audio.play();

  played.value = !played.value;
};
</script>

<template>
  <div
    class="rounded-full w-8 h-8 bg-gradient-to-tr from-teal-600 to-purple-400 flex justify-center items-center cursor-pointer"
    @click="playWaves()"
    role="button"
    aria-label="Toggle Audio"
  >
    <NuxtImg
      :src="played ? pause : play"
      class="w-[25px] h-[25px]"
      format="webp"
      alt=" toggle audio state play/pause"
    />
  </div>
</template>

<style scoped></style>
