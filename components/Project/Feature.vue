<script setup>
const localePath = useLocalePath();
const { t } = useI18n();

defineProps({
  project: { type: Object, required: true },
  large: { type: Boolean, default: false },
  small: { type: Boolean, default: false },
  eager: { type: Boolean, default: false },
});
</script>

<template>
  <article class="group relative" :class="large && 'grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12'">
    <ProjectCover
      :project="project"
      :eager="eager"
      class="ring-1 ring-line/10 transition-shadow duration-300 group-hover:ring-sun"
      :class="large && 'lg:col-span-8'"
    />
    <div :class="large ? 'lg:col-span-4' : 'mt-5'">
      <div class="flex items-baseline justify-between gap-4">
        <h3 class="font-semibold tracking-tight transition-colors group-hover:text-sun-ink" :class="large ? 'wide text-display-sm' : small ? 'text-lg' : 'text-2xl'">
          <NuxtLink :to="localePath(project.url)" class="after:absolute after:inset-0 after:content-['']">
            {{ project.name }}
          </NuxtLink>
        </h3>
        <span class="shrink-0 font-mono text-sm tabular-nums text-muted">{{ project.year }}</span>
      </div>
      <p class="mt-1.5 text-muted" :class="small && 'text-[0.95rem]'">{{ project.tagline }}</p>
      <template v-if="large">
        <p class="mt-5 leading-relaxed text-muted">{{ project.description }}</p>
        <p class="mt-6 inline-flex items-center gap-2 font-semibold text-sun-ink">
          {{ t("work.view") }}
          <UiIcon name="arrow-right" class="flip-rtl transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </p>
      </template>
    </div>
  </article>
</template>
