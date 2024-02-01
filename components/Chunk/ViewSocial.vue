<template>
  <div class="fixed flex flex-col gap-2 top-1/2 right-5">
    <a v-for="social in socials" :href="social.url" target="_blank">
      <NuxtImg :src="social.icon" class="w-9 sm:w-10" format="webp" />
    </a>
  </div>
</template>

<script setup>
import { socials } from "assets/constants";
</script>

<style scoped></style>
