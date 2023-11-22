<template>
  <div class="img-cont">
    <NuxtImg
      :src="text"
      loading="lazy"
      format="webp"
      fit="cover"
      :quality="60"
      :modifiers="{ roundCorner: '100' }"
    />
  </div>
</template>
<script setup>
defineProps(["text"]);
</script>
