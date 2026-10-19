<script setup>
const { t } = useI18n();
const localePath = useLocalePath();
const { projects } = useSiteData();

const featured = computed(() => projects.value.filter((project) => project.featured && !project.plugin));
const plugins = computed(() => projects.value.filter((project) => project.plugin));
const lead = computed(() => featured.value[0]);
const grid = computed(() => featured.value.slice(1, 7));
const others = computed(() => [...featured.value.slice(7), ...projects.value.filter((project) => !project.featured && !project.plugin).slice(0, 3)]);
</script>

<template>
  <section id="work" class="shell py-20 md:py-32" aria-labelledby="work-title">
    <div class="grid gap-6 md:grid-cols-12 md:items-end">
      <h2 id="work-title" class="wide text-display-lg font-black md:col-span-7">{{ t("work.title") }}</h2>
      <p class="max-w-md text-lg text-muted md:col-span-5 md:justify-self-end">
        {{ t("work.intro") }}
      </p>
    </div>

    <div class="mt-14 md:mt-20">
      <ProjectFeature :project="lead" large eager class="reveal" />
    </div>

    <div class="mt-20 grid gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-16">
      <ProjectFeature v-for="project in grid" :key="project.url" :project="project" class="reveal" />
    </div>

    <div class="mt-24 md:mt-32">
      <h3 class="text-xl font-semibold">{{ t("work.plugins") }}</h3>
      <div class="mt-6 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectFeature v-for="project in plugins" :key="project.url" :project="project" small class="reveal" />
      </div>
    </div>

    <div class="mt-24 md:mt-32">
      <div class="mb-6 flex items-end justify-between gap-4">
        <h3 class="text-xl font-semibold">{{ t("work.more") }}</h3>
        <NuxtLink :to="localePath('/projects')" class="link text-[0.95rem] font-medium">{{ t("work.all", { count: projects.length }) }}</NuxtLink>
      </div>
      <ProjectList :projects="others" />
    </div>
  </section>
</template>
