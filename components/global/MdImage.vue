<template>
  <div class="img-cont">
    <NuxtImg
      src="/assets/blog/vdom/vdom1.png"
      sizes="400px md:700px lg:900px xl:900px"
      loading="lazy"
      format="webp"
      densities="x1 x2"
      :quality="60"
    />
  </div>
</template>

<script setup>
const { text } = defineProps(["text"]);
</script>
