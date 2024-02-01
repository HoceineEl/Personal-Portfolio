<template>
  <main
    class="relative z-0 selection:bg-tertiary selection:text-main-violet bg-hero-pattern bg-fixed bg-cover"
  >
    <header class="">
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

    <LazyChunkChangeMode />
    <div class="fixed bottom-5 left-5">
      <ChunkPlayWaves />
    </div>
    <LazyChunkViewSocial />
  </main>
</template>

<script setup></script>

<style scoped>
section {
  @apply scroll-mt-56;
}
</style>
