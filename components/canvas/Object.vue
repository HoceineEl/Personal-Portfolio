<script setup>
const { object, scale, speed, type } = defineProps(["object", "scale", "speed", "type"]);
const hadFinishLoading = ref(false);

function resolve() {
  hadFinishLoading.value = true;
}

function fallback() {}

function pending() {}
</script>
<template>
  <Transition name="fade"
    ><div
      class="h-full"
      :class="[hadFinishLoading ? 'w-full' : 'w-0']"
      v-show="hadFinishLoading"
    >
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
        <Suspense @fallback="fallback" @pending="pending" @resolve="resolve">
          <GLTFModel :path="object" :scale="scale" darco="true" />
        </Suspense>
        <TresDirectionalLight :position="[10, 0, 10]" :intensity="1" />
      </TresCanvas>
    </div>
  </Transition>
  <div class="flex justify-center items-center flex-col" v-if="!hadFinishLoading && type">
    <LazyChunkWait />
  </div>
</template>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
