<script setup>
import { projects } from "~/assets/constants";
const isMobile = ref(false);

onMounted(() => {
  function checkIsMobile() {
    if (window.innerWidth < 480) isMobile.value = true;
  }

  checkIsMobile();
  window.addEventListener("resize", checkIsMobile);
});
</script>

<template>
  <section id="projects" class="section px-2" role="region">
    <h2 class="header">My Work</h2>
    <h3 class="header-secondary">Projects.</h3>
    <p class="description px-2 text-wrap-balance" role="paragraph">
      These projects serve as concrete demonstrations of my expertise and experience. They
      offer a glimpse into my ability to tackle intricate challenges, work with diverse
      technologies, and successfully oversee project development. While I have provided
      code repositories for each project, please note that not all of them have live demos
      available.
    </p>
    <div class="flex flex-wrap gap-7 mt-5 justify-center px-2 sm:px-0 mb-9">
      <LazyChunkProjectTilt :projects="projects" v-if="!isMobile" />
      <LazyChunkProjectNoTilt :projects="projects" v-if="isMobile" />
    </div>
  </section>
</template>

<style scoped>
p {
  text-wrap: balance;
}

/* Add any additional styling if needed */
</style>
