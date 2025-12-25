<template>
  <main class="relative z-0 selection:bg-neo-lime selection:text-neo-black bg-surface">
    <!-- Decorative grid background -->
    <div class="fixed inset-0 bg-grid-pattern opacity-30 dark:opacity-10 pointer-events-none" />

    <header>
      <ChunkHomeNavbar />
      <SectionsHero />
    </header>

    <LazySectionsAbout />
    <LazySectionsTech />
    <LazySectionsExperience />
    <LazySectionsWorks />
    <LazySectionsBlog />

    <div class="relative">
      <LazySectionsContact />
    </div>

    <LazySectionsFooter />

    <LazyChunkViewSocial />
  </main>
</template>

<script setup></script>

<style scoped>
section {
  @apply scroll-mt-24;
}
</style>
