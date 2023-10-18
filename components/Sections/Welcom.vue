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
  position: relative;
  display: grid;
  clip-path: inset(-60px 0 -5px);
}
.loader:after {
  content: "";
  position: relative;
  background: repeating-linear-gradient(
      90deg,
      #0000 0 calc(50% - 8px),
      #ccc 0 calc(50% + 8px),
      #0000 0 100%
    )
    0 0 / calc(100% / 3) 100%;
  animation: l6-1 1s infinite;
}
.loader:before {
  content: "";
  position: absolute;
  width: 20px;
  aspect-ratio: 1;
  left: calc(50% - 7px);
  bottom: 0;
  border-radius: 50%;
  background: rgb(77, 6, 220);
  animation: l6-2 1s infinite;
}
@keyframes l6-1 {
  50%,
  100% {
    background-position: calc(100% / 2) 0;
  }
}
@keyframes l6-2 {
  0%,
  50% {
    transform: translateY(-80px);
  }
}
</style>
