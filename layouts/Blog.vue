<template>
  <div>
    <header>
      <ChunkBlogNavbar />
    </header>
    <slot />
  </div>
  <ChunkScrollToggler />
</template>

<script setup>
onBeforeMount(() => {
  document.body.classList.add("bg-gradient");
});
</script>

<style scoped></style>
