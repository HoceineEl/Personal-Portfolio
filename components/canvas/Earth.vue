<script setup>
import { Earth } from "~/assets/constants";
const hadFinishLoading = ref(false);
function resolve() {
  hadFinishLoading.value = true;
  console.log("resolved");
  console.log(hadFinishLoading.value);
}

function fallback() {
  console.log("fallback");
  console.log(hadFinishLoading.value);
}

function pending() {
  console.log("pending");
  console.log(hadFinishLoading.value);
}
const earthRef = shallowRef(null);
const { onLoop } = useRenderLoop();
onLoop(() => {
  if (earthRef.value) {
    earthRef.value.rotation.x += 2;
  }
});
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
</template>

<style scoped></style>
