<template>
  <div class="relative section flex flex-wrap justify-center gap-4">
    <div
      v-for="tech in technologies"
      :key="tech.name"
      class="flex justify-center items-center w-44 h-44"
    >
      <ClientOnly>
        <LazyCanvasBall :tech="tech" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { technologies } from "~/assets/constants";
</script>

<style lang="scss" scoped></style>
