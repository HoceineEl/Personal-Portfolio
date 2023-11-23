<script setup>
import { services } from "~/assets/constants";
</script>
<template>
  <div class="w-full flex gap-10 flex-wrap my-16 justify-center items-center">
    <div
      class="card xs:w-[250px] p-[1px] green-pink-gradient rounded-[20px] transition-all duration-200 w-full pointer-events-none sm:pointer-events-auto"
      v-for="service in services"
      :key="service.title"
      $VanillaTilt
      data-tilt
      data-tilt-scale="1.05"
    >
      <div
        class="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col text-center"
      >
        <NuxtImg
          :src="service.icon"
          alt="service.title"
          width="64"
          loading="lazy"
          format="webp"
          quality="70"
          height="64"
        />
        <p class="font-bold text-[20px] max-w-[150px]">{{ service.title }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
