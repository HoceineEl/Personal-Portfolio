<template>
  <div class="relative section flex flex-wrap justify-center gap-4">
    <div>
      <div class="text-center">
        <p class="header">Technologies I'm Using</p>
        <h2 class="header-secondary">Tech Stack.</h2>
      </div>
      <div class="flex flex-wrap gap-16 mt-14 justify-center items-center max-w-5xl">
        <div
          v-for="tech in technologies"
          :key="tech.name"
          class="transition-all duration-300 group relative"
        >
          <div
            class="w-20 h-20 p-2 bg-[#ffffff11] rounded-xl hover:rounded-full border-transparent border-2 hover:border-teal-500 hover:p-3"
          >
            <NuxtImg
              format="webp"
              quality="70"
              :src="tech.icon"
              :alt="tech.name"
              loading="lazy"
              width="80"
              height="80"
            />
          </div>
          <div
            class="absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded bg-tertiary py-[6px] px-4 text-sm font-semibold text-white opacity-0 group-hover:opacity-100"
            :aria-hidden="true"
          >
            <span
              class="absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-tertiary"
            ></span>
            <span :aria-hidden="true">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { technologies } from "~/assets/constants";

</script>

<style lang="scss" scoped></style>
