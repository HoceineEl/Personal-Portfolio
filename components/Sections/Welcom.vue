<template>
  <div
    class="w-full h-screen flex justify-center items-center fixed backdrop-blur-lg z-20"
  >
    <p class="text-xl font-semibold">the Page is Loading Now Wait Please...</p>
    <div class="w-[500px] absolute bottom-0 left-0 z-10" ref="astr">
      <img :src="astro" alt="astronaut" />
    </div>
  </div>
</template>

<script setup>
import { astro } from "~/assets";
</script>

<style></style>
