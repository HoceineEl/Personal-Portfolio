<script setup>
defineProps({
  projects: { type: Array, required: true },
});
</script>

<template>
  <ul class="border-t border-line/15">
    <li v-for="project in projects" :key="project.url" class="border-b border-line/15">
      <NuxtLink
        :to="project.url"
        class="group grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-x-4 gap-y-1 py-5 transition-colors sm:grid-cols-[4.5rem_minmax(0,1.1fr)_minmax(0,1fr)_auto] sm:gap-x-6"
      >
        <span class="font-mono text-sm tabular-nums text-muted">{{ project.year }}</span>
        <span class="text-lg font-semibold transition-colors group-hover:text-sun-ink sm:text-xl">{{ project.name }}</span>
        <span class="col-start-2 text-muted sm:col-start-auto">{{ project.tagline }}</span>
        <UiIcon
          name="arrow-up-right"
          class="row-start-1 self-center justify-self-end text-lg text-muted transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink sm:col-start-4"
        />
      </NuxtLink>
    </li>
  </ul>
</template>
