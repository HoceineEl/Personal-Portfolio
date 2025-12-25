<template>
  <div class="w-full flex flex-col md:flex-row justify-between items-stretch gap-4 mt-12">
    <!-- Previous Article -->
    <a
      v-if="prev"
      :href="prev._path"
      class="flex-1 flex flex-col gap-3 p-6 bg-surface border-3 border-border group transition-all duration-300 hover:shadow-neo hover:-translate-x-1 hover:-translate-y-1"
      :aria-label="`Previous: ${prev.title}`"
    >
      <div class="flex items-center gap-2 text-text-secondary font-mono text-xs uppercase">
        <IconsPrev class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Previous</span>
      </div>
      <p class="font-display font-bold text-text-primary group-hover:text-neo-purple transition-colors line-clamp-2">
        {{ prev.title }}
      </p>
    </a>

    <!-- Spacer when only one exists -->
    <div v-if="!prev || !next" class="hidden md:block flex-1"></div>

    <!-- Next Article -->
    <a
      v-if="next"
      :href="next._path"
      class="flex-1 flex flex-col gap-3 p-6 bg-surface border-3 border-border group transition-all duration-300 hover:shadow-neo hover:-translate-x-1 hover:-translate-y-1 text-right"
      :aria-label="`Next: ${next.title}`"
    >
      <div class="flex items-center justify-end gap-2 text-text-secondary font-mono text-xs uppercase">
        <span>Next</span>
        <IconsNext class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
      <p class="font-display font-bold text-text-primary group-hover:text-neo-cyan transition-colors line-clamp-2">
        {{ next.title }}
      </p>
    </a>
  </div>
</template>

<script setup>
const { prev, next } = defineProps(["prev", "next"]);
</script>

<style></style>
