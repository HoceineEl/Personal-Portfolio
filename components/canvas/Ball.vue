<script setup>
import { technologies } from "~/assets/constants";
</script>

<template>
  <div
    v-for="(tech, index) in technologies"
    :key="tech.name"
    class="flex justify-center items-center w-44 h-44 relative group"
    $VanillaTilt
    data-tilt
    data-tilt-scale="1.05"
   
  >
    <TresCanvas alpha>
      <OrbitControls
        :enableZoom="false"
        :enableDamping="true"
        :autoRotate="true"
        :autoRotateSpeed="index * 0.3 + 1"
        :maxPolarAngle="Math.PI / 2"
        :minPolarAngle="Math.PI / 2"
      />
      <TresSpotLight
        castShadow
        :position="[-20, 50, 10]"
        :intensity="1"
        :penumbra="1"
        :angle="0.12"
      />
      <TresAmbientLight :intensity="1" />
      <Suspense>
        <GLTFModel :path="tech.icon" :position="[0, 0, 0]" />
      </Suspense>
      <TresDirectionalLight :position="[4, 0, 10]" :intensity="1" cast-shadow />
    </TresCanvas>
    <span
      class="absolute text-[6px] group-hover:text-lg top-3 group-hover:-top-3 text-secondary opacity-0 group-hover:opacity-100 transition duration-1000 bg-tertiary px-3 py-2 rounded-lg"
      >{{ tech.name }}</span
    >
  </div>
</template>

<style scoped></style>
