<script setup>
const isPressed = ref(false);
const handleMouseDown = () => {
  isPressed.value = true;
};
const handleMouseUp = () => {
  isPressed.value = false;
};
import { portrait } from "~/assets/constants";
</script>
<template>
  <section
    class="relative w-full h-screen mx-auto max-w-7xl pt-32 flex justify-center items-center overflow-hidden"
  >
    <div class="w-full h-full flex lg:flex-row flex-col md:justify-between items-center">
      <div class="flex gap-5 px-6 w-full">
        <div class="flex flex-col items-center justify-center">
          <div class="w-4 h-4 rounded-full bg-main-violet" />
          <div class="w-1 h-40 sm:h-80 bg-gradient-to-b from-main-violet" />
        </div>
        <div class="flex flex-col gap-5">
          <h1
            class="lg:text-7xl sm:text-6xl xs:text-5xl text-4xl font-black lg:leading-[96px] mt-4 text-white-100"
          >
            Hi ,I'm <span class="text-main-violet">Hoceine</span>
          </h1>
          <p
            class="text-md sm:text-lg lg:text-2xl mt-2 font-semibold text-white-100 text-w"
          >
            Passionate coder crafting digital solutions with creativity and precision.
            Explore more!
          </p>
          <a href="#contact">
            <div
              class="px-6 py-3 text-main-violet font-bold border-2 rounded-xl w-fit group relative hover:text-white-100 overflow-hidden"
            >
              Hire Me!
              <span
                class="w-0 h-0 group-hover:w-52 group-hover:h-52 bg-main-violet transition-all duration-500 absolute inset-0 rounded-full -z-20"
              ></span>
            </div>
          </a>
        </div>
      </div>

      <div
        @mousedown="handleMouseDown"
        @mouseup="handleMouseUp"
        :class="isPressed ? 'cursor-grabbing' : 'cursor-grab'"
        class="flex justify-center items-center w-full h-full"
      >
        <LazyCanvasObject :object="portrait" :scale="1" :speed="4" :type="portrait" />
      </div>
    </div>
    <div class="absolute bottom-3 lg:bottom-32 w-full flex justify-center z-[80]">
      <LazyChunkDown />
    </div>
  </section>
</template>

<style scoped>
p,
h1 {
  text-wrap: balance;
}
</style>
