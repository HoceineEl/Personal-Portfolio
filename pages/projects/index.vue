<script setup>
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { projects, profile } = useSiteData();

const featured = computed(() => projects.value.filter((project) => project.featured));
const others = computed(() => projects.value.filter((project) => !project.featured));

usePageSeo({
  title: t("seo.projectsTitle"),
  description: t("seo.projectsDescription", { count: projects.value.length }),
  path: localePath("/projects"),
  locale: locale.value,
});

useJsonLd([
  {
    "@type": "CollectionPage",
    url: absoluteUrl(localePath("/projects")),
    name: `${t("seo.projectsTitle")} · ${profile.value.name}`,
    inLanguage: locale.value,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.value.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(project.url),
        name: project.name,
      })),
    },
  },
  breadcrumbSchema([
    { name: profile.value.name, path: localePath("/") },
    { name: t("seo.projectsTitle"), path: localePath("/projects") },
  ]),
]);
</script>

<template>
  <div class="shell pb-24 pt-32 md:pt-40">
    <header class="grid gap-6 md:grid-cols-12 md:items-end">
      <h1 class="wide text-display-xl font-black md:col-span-7">{{ t("projects.title") }}</h1>
      <p class="max-w-md text-lg leading-relaxed text-muted md:col-span-5 md:justify-self-end">
        {{ t("projects.intro") }}
      </p>
    </header>

    <div class="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-24">
      <ProjectFeature
        v-for="(project, index) in featured"
        :key="project.url"
        :project="project"
        :eager="index < 2"
        class="reveal"
        :class="index % 2 === 1 && 'md:mt-24'"
      />
    </div>

    <section class="mt-24 md:mt-32" aria-labelledby="earlier-title">
      <h2 id="earlier-title" class="text-xl font-semibold">{{ t("projects.earlier") }}</h2>
      <ProjectList :projects="others" class="mt-6" />
    </section>
  </div>
</template>
