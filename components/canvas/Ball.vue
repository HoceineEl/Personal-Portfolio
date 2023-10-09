<script setup>
const { tech } = defineProps(["tech"]);
</script>

<template>
  <TresCanvas alpha>
    <TresPerspectiveCamera :position="[0, 0, 4]" />
    <OrbitControls
      :enableZoom="false"
      :enableDamping="true"
      :autoRotate="true"
      :autoRotateSpeed="tech.progress"
      :maxPolarAngle="Math.PI / 2"
      :minPolarAngle="Math.PI / 2"
    />
    <TresSpotLight
      :position="[-20, 50, 10]"
      :intensity="1"
    />
    <TresAmbientLight :intensity="1" />
    <Suspense>
      <GLTFModel :path="tech.icon" :position="[0, 0, 0]" :draco="true" />
    </Suspense>
  </TresCanvas>
</template>

<style scoped></style>
