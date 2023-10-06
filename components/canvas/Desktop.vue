<script setup>
import { pc } from "~/assets/constants";
const hadFinishLoading = ref(false);

function resolve() {
  hadFinishLoading.value = true;
}

function fallback() {}

function pending() {}
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
  <div class="flex justify-center items-center flex-col" v-if="!hadFinishLoading">
    <p class="font-bold text-[20px]">Patience, friend!...</p>
    <span class="text-main-violet">
      Our 3D team is sipping on 'nus-nus' coffee and sharing tales to pass the time.
    </span>
  </div>
</template>

<style scoped></style>
