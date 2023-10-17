<template>
  <span class="gradient"></span>
  <main class="relative z-0">
    <header>
      <LazySectionsNavbar />
      <LazySectionsHero />
    </header>
    <LazySectionsAbout />
    <LazySectionsExperience />
    <LazySectionsTech />
    <LazySectionsWorks />
    <LazySectionsFeedbacks />
    <div class="relative">
      <LazySectionsContact />
    </div>
  </main>
</template>

<script setup></script>

<style scoped>
.gradient {
  position: fixed;
  top: 25vh;
  width: 100%;
  height: 30vh;
  background: radial-gradient(50% 50% at 50% 50%, #150c22 0%, rgba(36, 155, 105, 0) 100%);
  filter: blur(180px);
  opacity: 0.6;
  z-index: -1;
}
</style>
