<script setup>
const { object, scale, speed } = defineProps(["object", "scale", "speed"]);
</script>
<template>
  <TresCanvas alpha>
    <TresPerspectiveCamera :position="[0, 0, 4]" />
    <OrbitControls
      :enableZoom="false"
      :enableDamping="true"
      :autoRotate="true"
      :autoRotateSpeed="speed"
      :maxPolarAngle="Math.PI / 2"
      :minPolarAngle="Math.PI / 2"
    />
    <TresAmbientLight :intensity="2" />
    <Suspense>
      <GLTFModel :path="object" :scale="scale" darco="true" />
    </Suspense>
    <TresDirectionalLight :position="[10, 0, 10]" :intensity="1" />
  </TresCanvas>
</template>
