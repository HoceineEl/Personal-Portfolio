<script setup>
const { t } = useI18n();
const localePath = useLocalePath();
const { projects } = useSiteData();

const featured = computed(() => projects.value.filter((project) => project.featured));
const lead = computed(() => featured.value[0]);
const pairs = computed(() => featured.value.slice(1, 8));
const others = computed(() => [...featured.value.slice(8), ...projects.value.filter((project) => !project.featured).slice(0, 3)]);
const isLoneLast = (index) => pairs.value.length % 2 === 1 && index === pairs.value.length - 1;
const layout = ["md:col-span-7", "md:col-span-5 md:mt-40", "md:col-span-5", "md:col-span-7 md:mt-24"];
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

    <div class="mt-20 grid gap-x-8 gap-y-20 md:grid-cols-12 md:gap-y-28">
      <ProjectFeature
        v-for="(project, index) in pairs"
        :key="project.url"
        :project="project"
        :large="isLoneLast(index)"
        class="reveal"
        :class="isLoneLast(index) ? 'md:col-span-12' : layout[index % 4]"
      />
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
