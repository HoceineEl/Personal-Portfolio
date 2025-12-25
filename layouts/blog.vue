<template>
  <main class="min-h-screen bg-surface text-text-primary">
    <!-- Grid background -->
    <div class="fixed inset-0 bg-grid-pattern opacity-30 dark:opacity-10 pointer-events-none" />

    <div class="relative">
      <header>
        <LazyBlogNavbar />
      </header>
      <slot />
    </div>
    <LazySectionsFooter />
    <ChunkScrollIndicator />
  </main>
</template>

<script setup>
const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>

<style scoped></style>
