<template>
  <div
    class="w-full h-screen flex fixed backdrop-blur-lg z-20 items-center justify-center"
  >
    <TresCanvas window-size alpha>
      <TresPerspectiveCamera ref="cameraRef" :position="[0, 2, 5]" />
      <Stars :size="0.6" :depth="3" :count="500" ref="starRef" />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
const starRef = shallowRef<THREE.Mesh>();
const { onLoop } = useRenderLoop();
const scRef = ref();
const cameraRef = ref();

//@ts-ignore
function lerp(start, end, t) {
  return -1 * (start * (1 - t) + end * t);
}

onLoop(({ delta }) => {
  if (cameraRef.value) {
    cameraRef.value.position.z = lerp(-0.1, 1, 500);
  }
  if (starRef.value) {
    // @ts-ignore
    starRef.value.value.rotation.y += delta;
    // @ts-ignore
    starRef.value.value.rotation.x += delta;
  }
});
</script>
