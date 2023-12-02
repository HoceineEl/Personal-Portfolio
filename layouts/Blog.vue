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
    <div class="fixed bottom-5 left-5"><ChunkPlayWaves /></div>
  </main>
</template>

<script setup>
onBeforeMount(() => {
  document.body.classList.add("bg-gradient");
});
</script>

<style scoped></style>
