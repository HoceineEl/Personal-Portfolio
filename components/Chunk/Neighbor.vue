<template>
  <NuxtLink
    :to="path"
    class="flex border bg-[#1E1E3B] items-center p-4 max-w-xs text-sm rounded-full"
  >
    <IconsPrev class="w-16 h-16" v-if="dir == 'prev'" />
    <IconsNext class="w-16 h-16" v-if="dir == 'next'" />
    <p>{{ title }}</p>
  </NuxtLink>
</template>

<script setup>
const { path,title, dir } = defineProps(["neighbor", "dir"]);
</script>

<style></style>
