<template>
  <div class="relative section flex flex-wrap justify-center gap-4">
    <div
      v-for="(tech, index) in technologies"
      :key="tech.name"
      class="flex justify-center items-center w-44 h-44 relative group"
      v-once
    >
      <LazyCanvasBall :tech="tech" />
      <span
        class="absolute text-[6px] group-hover:text-lg top-3 group-hover:-top-3 text-secondary opacity-0 group-hover:opacity-100 transition duration-1000 bg-tertiary px-3 py-2 rounded-lg"
        >{{ tech.name }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { technologies } from "~/assets/constants";
</script>

<style lang="scss" scoped></style>
