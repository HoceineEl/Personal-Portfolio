<template>
  <div class="relative section flex flex-wrap justify-center gap-4">
    <!-- <div
      v-memo
      v-for="(tech, index) in technologies"
      :key="tech.name"
      class="flex justify-center items-center w-36 h-36 relative group"
    >
      <LazyCanvasObject :object="tech.icon" :scale="1" :speed="10" />
      <span
        class="absolute text-[6px] group-hover:text-lg top-3 group-hover:-top-3 text-secondary opacity-0 group-hover:opacity-100 transition duration-1000 bg-tertiary px-3 py-2 rounded-lg"
        >{{ tech.name }}</span
      >
    </div> -->
  </div>
</template>

<script setup>
import { technologies } from "~/assets/constants";
</script>

<style lang="scss" scoped></style>
