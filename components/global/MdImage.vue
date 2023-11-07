<template>
  <div class="img-cont">
    <NuxtImg
      :src="text"
      loading="lazy"
      format="webp"
      fit="cover"
      densities="x1 x2"
      :quality="60"
      :modifiers="{ roundCorner: '100' }"
    />
  </div>
</template>

<script setup>
const { text } = defineProps(["text"]);
</script>
