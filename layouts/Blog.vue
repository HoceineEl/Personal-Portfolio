<template>
  <div>
    <header>
      <ChunkBlogNavbar />
    </header>
    <slot />
  </div>
</template>

<script setup>
onMounted(() => {
  document.body.classList.add("bg-tertiary");
});
</script>

<style scoped></style>
