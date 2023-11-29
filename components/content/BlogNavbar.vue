<template>
  <nav class="w-full flex items-center fixed top-2 z-10">
    <div
      class="w-full flex justify-between items-center max-w-7xl mx-auto px-4 xs:px-10 py-2 xs:py-5 mx-30 rounded-full backdrop-blur-[150px] border border-gray-700"
    >
      <a
        href="/"
        alt="Logo"
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
        <li class="flex gap-3">
          <div>
            <a
              href="https://github.com/hoceineel"
              target="_blank"
              aria-label="Visit GitHub profile"
            >
              <NuxtImg
                :src="github"
                alt="hoceine EL IDRISSI github profile"
                width="30"
                loading="lazy"
                format="webp"
                quality="80"
            /></a>
          </div>

          <div>
            <a
              href="https://www.linkedin.com/in/elidrissihoceine/"
              target="_blank"
              aria-label="Visit LinkedIn profile"
            >
              <NuxtImg
                :src="linkedin"
                alt="hoceine EL IDRISSI linkedin profile"
                width="30"
                loading="lazy"
                format="webp"
                quality="80"
            /></a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { logo, linkedin, github } from "../assets";
</script>

<style scoped></style>
