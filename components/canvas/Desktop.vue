<script setup>
import { pc } from "~/assets/constants";

const hadFinishLoading = ref(false);

function resolve() {
  hadFinishLoading.value = true;
}

function fallback() {
  console.log("fallback");
}

function pending() {
  console.log("pending");
}
const getStat = () => hadFinishLoading.value;
</script>

<template>
  <div class="h-full" :class="[hadFinishLoading ? 'w-full' : 'w-0']">
    <TresCanvas alpha>
      <OrbitControls
        :enableZoom="false"
        :enableDamping="true"
        :autoRotate="true"
        :autoRotateSpeed="4"
        :maxPolarAngle="Math.PI / 2"
        :minPolarAngle="Math.PI / 2"
      />
      <TresAmbientLight :intensity="2" />
      <Suspense @fallback="fallback" @pending="pending" @resolve="resolve">
        <GLTFModel :path="pc" :position="[0, 0, 0]" :draco="true" />
      </Suspense>
      <TresDirectionalLight :position="[10, 0, 10]" :intensity="1" />
    </TresCanvas>
  </div>
  <div class="flex justify-center items-center" v-if="!hadFinishLoading">
    <p>Please Wait ...</p>
  </div>
</template>

<style scoped>
.enterClass {
  @apply opacity-5 transition-opacity duration-200;
}

.leaveClass {
  @apply opacity-0 transition-opacity duration-200;
}

.loadCon {
  @apply absolute top-0 left-0 w-full h-full z-20 flex justify-center items-center text-white text-xl font-mono;
}

.loader {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 6rem;
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.loader:before,
.loader:after {
  content: "";
  position: absolute;
  border-radius: 50%;
  animation: pulsOut 0.8s ease-in-out infinite;
  filter: drop-shadow(0 0 1rem rgba(255, 255, 255, 0.75));
}

.loader:before {
  width: 100%;
  padding-bottom: 100%;
  box-shadow: inset 0 0 0 1rem #fff;
  animation-name: pulsIn;
}

.loader:after {
  width: calc(100% - 2rem);
  padding-bottom: calc(100% - 2rem);
  box-shadow: 0 0 0 0 #fff;
}

@keyframes pulsIn {
  0% {
    box-shadow: inset 0 0 0 1rem #fff;
    opacity: 1;
  }

  50%,
  100% {
    box-shadow: inset 0 0 0 0 #fff;
    opacity: 0;
  }
}

@keyframes pulsOut {
  0%,
  50% {
    box-shadow: 0 0 0 0 #fff;
    opacity: 0;
  }

  100% {
    box-shadow: 0 0 0 1rem #fff;
    opacity: 1;
  }
}
</style>
