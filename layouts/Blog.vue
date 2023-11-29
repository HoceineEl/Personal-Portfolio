<template>
  <main>
    <div>
      <header>
        <LazyBlogNavbar />
      </header>
      <slot />
    </div>
    <LazySectionsFooter />
    <ChunkScrollToggler />
    <ChunkPlayWaves/>
  </main>
</template>

<script setup>
onBeforeMount(() => {
  document.body.classList.add("bg-gradient");
});
</script>

<style scoped></style>
