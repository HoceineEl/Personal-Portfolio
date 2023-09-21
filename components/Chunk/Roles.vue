<script setup>
import { services } from "~/assets/constants";
import { useMouseInElement } from "@vueuse/core";
const target = ref(null);
const { elementX, elementY, isOutside, elementHeight, elementWidth } = useMouseInElement(
  target
);
const cardTransform = computed(() => {
  const MAX_ROTATION = 6;
  const rX = (
    MAX_ROTATION / 2 -
    (elementY.value / elementHeight.value) * MAX_ROTATION
  ).toFixed(2);
  const rY = (
    (elementY.value / elementWidth.value) * MAX_ROTATION -
    MAX_ROTATION / 2
  ).toFixed(2);
  return isOutside.value ? "" : `rotateX(${rX}deg) rotateY(${rY}deg)`;
});
</script>
<template>
  <div class="w-full flex gap-10 flex-wrap my-16 justify-center items-center">
    <div
      class="xs:w-[250px] p-[1px] green-pink-gradient rounded-[20px]"
      v-for="service in services"
      :key="service.title"
      ref="target"
      :style="{
        transform: cardTransform,
        transition: 'transform 0.5s ease-out',
      }"
    >
      <div
        class="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col text-center"
      >
        <img :src="service.icon" alt="service.title" class="w-16" />
        <p class="font-bold text-[20px] max-w-[150px]">{{ service.title }}</p>
      </div>
    </div>
  </div>
</template>

<style></style>
