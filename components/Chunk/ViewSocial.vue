<script setup>
import { socials } from "~/assets/constants";
</script>

<template>
  <div class="fixed top-1/2 -translate-y-1/2 right-6 z-40 flex flex-col gap-3">
    <a
      v-for="social in socials"
      :key="social.name"
      :href="social.url"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Visit ${social.name}`"
      class="w-10 h-10 border-3 border-border bg-surface flex items-center justify-center transition-all duration-200 hover:bg-neo-primary hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-sm"
    >
      <NuxtImg
        :src="social.icon"
        :alt="social.name"
        width="18"
        height="18"
        class="dark:invert"
      />
    </a>
  </div>
</template>

<style scoped></style>
