<template>
  <div>
    <header>
      <ChunkBlogNavbar />
    </header>
    <slot />
  </div>
  <LazySectionsFooter />
  <ChunkScrollToggler />
</template>

<script setup>
onBeforeMount(() => {
  document.body.classList.add("bg-gradient");
});
</script>

<style scoped></style>
