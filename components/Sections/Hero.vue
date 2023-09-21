<script setup>
const isPressed = ref(false);
const handleMouseDown = () => {
  isPressed.value = true;
};
const handleMouseUp = () => {
  isPressed.value = false;
};
</script>
<template>
  <section class="relative w-full h-screen mx-auto max-w-7xl mt-16">
    <div class="flex gap-5 px-6">
      <div class="flex flex-col items-center justify-center">
        <div class="w-4 h-4 rounded-full bg-main-violet" />
        <div class="w-1 h-40 sm:h-80 bg-gradient-to-b from-main-violet" />
      </div>
      <div>
        <h1
          class="lg:text-7xl sm:text-6xl xs:text-5xl text-4xl font-black lg:leading-[96px] mt-4 text-white-100"
        >
          Hi ,I'm <span class="text-main-violet">Hoceine</span>
        </h1>
        <p class="text-md sm:text-lg lg:text-2xl mt-2 font-semibold text-white-100">
          Passionate coder crafting digital<br class="hidden sm:block" />
          solutions with creativity and precision. Explore more!
        </p>
      </div>
    </div>

    <div
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      :class="isPressed ? 'cursor-grabbing' : 'cursor-grab'"
      class="absolute z-30 h-[600px] bottom-20 xs:h-[600px] xs:bottom-40 w-full md:bottom-16 md:h-[600px] lg:bottom-10 lg:h-[600px] 2xl:h-[900px] flex justify-center items-center"
    >
      <ClientOnly>
        <CanvasDesktop />
      </ClientOnly>
    </div>
    <div class="absolute bottom-40 w-full flex justify-center z-[80]">
      <ChunkDown />
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
