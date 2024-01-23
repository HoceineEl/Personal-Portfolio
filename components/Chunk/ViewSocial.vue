<template>
  <div class="md:fixed flex md:flex-col gap-2 md:top-1/2 md:right-5">
    <a v-for="social in socials" :href="social.url" target="_blank">
      <NuxtImg :src="social.icon" width="35" format="webp" />
    </a>
  </div>
</template>

<script setup>
import { socials } from "assets/constants";
</script>

<style scoped></style>
