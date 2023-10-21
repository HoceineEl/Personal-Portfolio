<template>
  <div>
    <header>
      <ChunkBlogNavbar />
    </header>
    <slot />
  </div>
  <!-- <p class="bg-indigo-950"></p> -->
</template>

<script setup>
onBeforeMount(() => {
  document.body.classList.add("bg-tertiary");
});
</script>

<style scoped></style>
