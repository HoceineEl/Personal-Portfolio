<template>
  <div
    class="w-full h-screen flex fixed backdrop-blur-lg z-20 items-center justify-center"
  >
    <div class="loader"></div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>
.loader {
  width: 90px;
  height: 14px;
  box-shadow: 0 3px 0 #fff;
  display: grid;
}
.loader:before,
.loader:after {
  content: "";
  grid-area: 1/1;
  background: radial-gradient(circle closest-side, var(--c, rgb(134, 7, 184)) 92%, #0000)
    0 0 / calc(100% / 4) 100%;
  animation: l4 1s infinite linear;
}
.loader:after {
  --c: #000;
  background-color: #fff;
  box-shadow: 0 -2px 0 0 #fff;
  clip-path: inset(-2px calc(50% - 10px));
}
@keyframes l4 {
  100% {
    background-position: calc(100% / 3) 0;
  }
}
</style>
