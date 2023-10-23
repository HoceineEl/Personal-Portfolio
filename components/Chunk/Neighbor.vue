<template>
  <div class="w-full flex justify-between items-center gap-3 flex-col md:flex-row mt-10">
    <NuxtLink
      v-if="prev"
      :to="prev._path"
      class="text-[12px] sm:text-sm flex items-center gap-2 border border-gray-600 rounded-lg px-6 py-4 group flex-col hover:bg-[#1E1E3B]"
    >
      <IconsPrev
        class="w-10 h-10 group-hover:-translate-x-2 self-start transition-transform duration-300"
      />
      <p class="font-semibold">{{ prev.title }}</p>
    </NuxtLink>
    <div></div>
    <NuxtLink
      v-if="next"
      :to="next._path"
      class="text-[12px] sm:text-sm flex items-center gap-2 border border-gray-600 rounded-lg px-6 py-4 group flex-col hover:bg-[#1E1E3B]"
    >
      <IconsNext
        class="w-10 h-10 group-hover:translate-x-2 self-end transition-transform duration-300"
      />
      <p class="font-semibold">{{ next.title }}</p>
    </NuxtLink>
  </div>
</template>

<script setup>
const { prev, next } = defineProps(["prev", "next"]);
</script>

<style></style>
