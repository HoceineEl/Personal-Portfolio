<template>
  <div class="w-full h-screen flex fixed backdrop-blur-lg z-20 items-center">
    <div class="w-[500px] moving-astronaut" ref="astr">
      <img :src="astro" alt="astronaut" />
    </div>
  </div>
</template>

<script setup>
import { astro } from "~/assets";
const astr = ref();
const counter = useInterval(50);
if (astr.value) astr.value.style.transform = `translateX(${counter * 5}px)`;
</script>

<style scoped></style>
