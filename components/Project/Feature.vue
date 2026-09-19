<script setup>
defineProps({
  project: { type: Object, required: true },
  large: { type: Boolean, default: false },
  eager: { type: Boolean, default: false },
});
</script>

<template>
  <article class="group relative" :class="large && 'grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10'">
    <ProjectCover :project="project" :eager="eager" :class="large && 'lg:col-span-8'" />
    <div :class="large && 'lg:col-span-4 lg:pb-2'">
      <div class="flex items-start justify-between gap-6" :class="large ? '' : 'mt-5'">
        <div>
          <h3 class="wide break-words font-extrabold tracking-tight" :class="large ? 'text-display-md lg:text-[2.75rem]' : 'text-display-sm'">
            <NuxtLink :to="project.url" class="after:absolute after:inset-0 after:content-['']">
              {{ project.name }}
            </NuxtLink>
          </h3>
          <p class="mt-2 text-muted" :class="large && 'text-lg'">{{ project.tagline }}</p>
        </div>
        <span
          v-if="!large"
          class="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg ring-1 ring-inset ring-line/15 transition-colors duration-300 group-hover:bg-sun group-hover:text-on-sun group-hover:ring-sun"
          aria-hidden="true"
        >
          <UiIcon name="arrow-up-right" />
        </span>
      </div>
      <p v-if="large" class="mt-5 leading-relaxed text-muted">{{ project.description }}</p>
      <ul v-if="project.highlights" class="mt-5 space-y-1.5 text-[0.95rem]" :class="large ? 'text-ink' : 'text-ink/85'">
        <li v-for="item in project.highlights" :key="item" class="flex gap-3">
          <span class="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-sun" aria-hidden="true" />
          {{ item }}
        </li>
      </ul>
      <p v-if="large" class="mt-6 inline-flex items-center gap-2 font-semibold text-sun-ink">
        View the project
        <UiIcon name="arrow-right" class="transition-transform duration-300 group-hover:translate-x-1" />
      </p>
      <ul class="mt-5 flex flex-wrap gap-2" aria-label="Stack">
        <li class="chip font-mono tabular-nums">{{ project.year }}</li>
        <li v-for="item in project.stack" :key="item" class="chip">{{ item }}</li>
      </ul>
    </div>
  </article>
</template>
