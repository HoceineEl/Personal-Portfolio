<script setup>
import { Earth } from "~/assets/constants";
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
    <Suspense>
      <GLTFModel :path="Earth" :scale="1.3" darco="true" />
    </Suspense>
    <TresDirectionalLight :position="[0, 0, 10]" :intensity="60" cast-shadow />
  </TresCanvas>
</template>
