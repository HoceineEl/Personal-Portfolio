<script setup>
const { hasFinishLoading, progress } = await useProgress();
</script>

<template>
  <Transition
    name="fade-overlay"
    enter-active-class="enterClass"
    leave-active-class="leaveClass"
  >
    <div v-show="!hasFinishLoading" class="loadCon">
      <span class="loader">{{ progress }} %</span>
    </div>
  </Transition>
  <TresCanvas shadows alpha>
    <TresPerspectiveCamera :position="[0, -4, 14]" />
    <OrbitControls
      :enableZoom="false"
      :enableDamping="false"
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
    <TresHemisphereLight :ground-color="'black'" intensity="0.2" />
    <TresAmbientLight :intensity="1" />
    <Suspense>
      <GLTFModel
        path="/pc/scene.gltf"
        :position="[2.1, -2.8, 0]"
        :rotation-x="Math.PI * 0.03"
        :rotation-y="Math.PI * 1.5"
        darco="true"
      />
    </Suspense>

    <!-- <TresDirectionalLight :position="[-80, -10, 120]" :intensity="0.5" cast-shadow /> -->
    <TresDirectionalLight :position="[4, 0, 10]" :intensity="1" cast-shadow />
  </TresCanvas>
</template>

<style scoped>
.enterClass {
  @apply opacity-5 transition-opacity duration-200;
}

.leaveClass {
  @apply opacity-0 transition-opacity duration-200;
}

.loadCon {
  @apply absolute top-0 left-0 w-full h-full z-20 flex justify-center items-center text-white text-xl font-mono;
}

.loader {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 6rem;
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.loader:before,
.loader:after {
  content: "";
  position: absolute;
  border-radius: 50%;
  animation: pulsOut 0.8s ease-in-out infinite;
  filter: drop-shadow(0 0 1rem rgba(255, 255, 255, 0.75));
}

.loader:before {
  width: 100%;
  padding-bottom: 100%;
  box-shadow: inset 0 0 0 1rem #fff;
  animation-name: pulsIn;
}

.loader:after {
  width: calc(100% - 2rem);
  padding-bottom: calc(100% - 2rem);
  box-shadow: 0 0 0 0 #fff;
}

@keyframes pulsIn {
  0% {
    box-shadow: inset 0 0 0 1rem #fff;
    opacity: 1;
  }

  50%,
  100% {
    box-shadow: inset 0 0 0 0 #fff;
    opacity: 0;
  }
}

@keyframes pulsOut {
  0%,
  50% {
    box-shadow: 0 0 0 0 #fff;
    opacity: 0;
  }

  100% {
    box-shadow: 0 0 0 1rem #fff;
    opacity: 1;
  }
}
</style>
