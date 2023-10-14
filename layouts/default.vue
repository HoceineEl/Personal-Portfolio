<script setup>
const showWelcomeScreen = ref(true);

function welcomeScreen() {
  setTimeout(() => {
    showWelcomeScreen.value = false;
  }, 1000);
}
welcomeScreen();
// import { CursorFx } from "@luxdamore/vue-cursor-fx";
</script>

<template>
  <!-- <Transition name="slide">
    <SectionsWelcom v-show="showWelcomeScreen" />
  </Transition> -->
  <div>
    <slot />
  </div>
  <!-- <cursor-fx /> -->
</template>
<style scoped>
.spbg {
  /* background: url('https://i.ytimg.com/vi/nqxrFkfgLJY/maxresdefault.jpg') repeat-y center center/cover; */
  /* background-color: #663dff; */
  background-color: #673dff73;
  /* background-image: linear-gradient(319deg, #663dff 0%, #aa00ff 37%, #cc4499 100%); */
  background-image: linear-gradient(319deg, #673dff73 0%, #aa00ff8c 37%, #cc44989d 100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
.slide-leave-active {
  transition: transform 1.5s;
}
</style>
