<template>
  <div class="cube-loader">
    <div class="cube-top"></div>
    <div class="cube-wrapper">
      <span class="cube-span" style="--i: 0"></span>
      <span class="cube-span" style="--i: 1"></span>
      <span class="cube-span" style="--i: 2"></span>
      <span class="cube-span" style="--i: 3"></span>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.cube-loader {
  position: relative;
  /* u can choose any size */
  width: 75px;
  height: 75px;
  transform-style: preserve-3d;
  transform: rotateX(-30deg);
  animation: animate 4s linear infinite;
}

@keyframes animate {
  0% {
    transform: rotateX(-30deg) rotateY(0);
  }

  100% {
    transform: rotateX(-30deg) rotateY(360deg);
  }
}

.cube-loader .cube-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  /* top: 0;
    left: 0; */
  transform-style: preserve-3d;
}

.cube-loader .cube-wrapper .cube-span {
  position: absolute;
  width: 100%;
  height: 100%;
  /* top: 0;
    left: 0; */
  /* width 75px / 2 = 37.5px */
  transform: rotateY(calc(90deg * var(--i))) translateZ(37.5px);
  background: linear-gradient(
    to bottom,
    hsl(270, 100%, 25.1%) 0%,
    hsl(270, 100%, 32.06%) 5.5%,
    hsl(270, 100%, 36.88%) 12.1%,
    hsl(270, 100%, 40.7%) 19.6%,
    hsl(270, 100%, 43.88%) 27.9%,
    hsl(270, 100%, 46.58%) 36.6%,
    hsl(270, 100%, 48.91%) 45.6%,
    hsl(270, 100%, 50.91%) 54.6%,
    hsl(270, 100%, 52.62%) 63.4%,
    hsl(270, 100%, 54.08%) 71.7%,
    hsl(270, 100%, 55.29%) 79.4%,
    hsl(270, 100%, 56.28%) 86.2%,
    hsl(270, 100%, 57.04%) 91.9%,
    hsl(270, 100%, 57.59%) 96.3%,
    hsl(270, 100%, 57.93%) 99%,
    hsl(270, 100%, 58.04%) 100%
  );
}

.cube-top {
  position: absolute;
  width: 75px;
  height: 75px;
  background: hsl(171, 95%, 25%) 0%;
  /* width 75px / 2 = 37.5px */
  transform: rotateX(90deg) translateZ(37.5px);
  transform-style: preserve-3d;
}

.cube-top::before {
  content: "";
  position: absolute;
  /* u can choose any size */
  width: 75px;
  height: 75px;
  background: hsl(278, 63%, 74%) 19.6%;
  transform: translateZ(-90px);
  filter: blur(10px);
  box-shadow: 0 0 10px #323232, 0 0 20px hsl(280, 42%, 41%) 19.6%, 0 0 30px #323232,
    0 0 40px hsl(283, 42%, 41%) 19.6%;
}
</style>
