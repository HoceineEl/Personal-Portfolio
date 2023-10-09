<script setup>
import { Earth } from "~/assets/constants";
const hadFinishLoading = ref(false);
function resolve() {
  hadFinishLoading.value = true;
}

function fallback() {}

function pending() {}
</script>

<template>
  <TresCanvas alpha>
    <TresPerspectiveCamera :position="[0, 0, 4]" />
    <OrbitControls
      :enableZoom="false"
      :enableDamping="true"
      :autoRotate="true"
      :autoRotateSpeed="10"
      :maxPolarAngle="Math.PI / 2"
      :minPolarAngle="Math.PI / 2"
    />
    <TresAmbientLight :intensity="100" />
    <Suspense @fallback="fallback" @pending="pending" @resolve="resolve">
      <GLTFModel :path="Earth" :scale="1.5" darco="true" />
    </Suspense>
    <TresDirectionalLight :position="[0, 0, 10]" :intensity="60" cast-shadow />
  </TresCanvas>
  <!-- <div
    class="w-full h-full flex justify-center items-center flex-col"
    v-if="!hadFinishLoading"
  >
    <p class="font-bold text-[20px]">Patience, friend!...</p>
  </div> -->
</template>

<style scoped></style>
