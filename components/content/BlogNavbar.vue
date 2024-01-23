<template>
  <nav class="w-full flex items-center fixed top-2 z-10">
    <div
      class="w-full flex justify-between items-center max-w-7xl mx-auto px-4 xs:px-10 py-2 xs:py-5 mx-30 rounded-full backdrop-blur-[150px] border border-gray-700"
    >
      <a
        href="/"
        aria-label="Hoceine El Idrissi's Logo"
        class="flex items-center gap-1 font-semibold text-[16px] xs:gap-3 xs:font-bold xs:text-[18px] text-white"
      >
        <NuxtImg format="webp" :src="logo" alt="Hoceine log" width="60" loading="lazy" />
        <p class="hidden xs:block">Hoceine EL IDRISSI</p>
      </a>
      <ul class="justify-between gap-3 flex items-center">
        <li class="font-semibold text-lg">
          <NuxtLink to="/blog" aria-label="Visit the Blog page" :prefetch="false"
            >Blog</NuxtLink
          >
        </li>
        <li class="flex gap-2">
          <a
            v-for="social in socials"
            class="w-7 h-7 rounded-full"
            :href="social.url"
            target="_blank"
          >
            <NuxtImg :src="social.icon" class="object-fill w-full h-full" format="webp" />
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { logo } from "../assets";
import { socials } from "~/assets/constants";
</script>

<style scoped></style>
