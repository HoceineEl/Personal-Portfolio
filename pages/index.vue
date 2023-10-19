<template>
  <main
    class="relative z-0 selection:bg-tertiary selection:text-main-violet bg-hero-pattern bg-fixed bg-cover"
  >
    <header class="bg-hero-pattern bg-fixed bg-cover">
      <SectionsNavbar />
      <SectionsHero />
    </header>
    <LazySectionsAbout />
    <LazySectionsTech />
    <LazySectionsExperience />
    <LazySectionsWorks />
    <LazySectionsFeedbacks />
    <div class="relative">
      <LazySectionsContact />
    </div>
  </main>
</template>

<script setup></script>

<style scoped></style>
