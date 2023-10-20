<template>
  <Transition name="slide">
    <SectionsWelcom v-if="showWelcomeScreen" />
  </Transition>
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
    <LazySectionsFeedbacks />
    <div class="relative">
      <LazySectionsContact />
    </div>
  </main>
</template>

<script setup>
const showWelcomeScreen = ref(true);

function welcomeScreen() {
  setTimeout(() => {
    showWelcomeScreen.value = false;
  }, 20);
}

welcomeScreen();
</script>

<style scoped></style>
