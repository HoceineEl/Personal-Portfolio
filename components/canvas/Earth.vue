<script setup>
import { html } from "~/assets";

const boxRef = shallowRef(null);
const { onLoop } = useRenderLoop();
onLoop(({ delta, elapsed }) => {
  if (boxRef.value) {
    boxRef.value.rotation.x += delta;
  }
});
const pbrTexture = await useTexture({
  map: html,
});
</script>
<template>
  <TresCanvas alpha>
    <TresPerspectiveCamera ref="camera" :position="[3, 3, 3]" />
    <OrbitControls make-default />
    <TresMesh>
      <TresSphereGeometry :args="[1, 32, 32]" />
      <TresMeshStandardMaterial :map="pbrTexture.map" />
    </TresMesh>

    <TresAmbientLight :intensity="1" />
    <TresDirectionalLight :position="[0, 2, 4]" :intensity="2" />
  </TresCanvas>
</template>
