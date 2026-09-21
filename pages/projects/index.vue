<script setup>
import { projects } from "~/assets/constants";

const featured = projects.filter((project) => project.featured);
const others = projects.filter((project) => !project.featured);

usePageSeo({
  title: "Projects",
  description: `${projects.length} projects by Hoceine El Idrissi: web platforms, admin panels, installable web apps, browser extensions and developer tools built with Laravel, Filament, Livewire and Vue.`,
  path: "/projects",
});

useJsonLd([
  {
    "@type": "CollectionPage",
    url: absoluteUrl("/projects"),
    name: "Projects by Hoceine El Idrissi",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(project.url),
        name: project.name,
      })),
    },
  },
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
  ]),
]);
</script>

<template>
  <div class="shell pb-24 pt-32 md:pt-40">
    <header class="grid gap-6 md:grid-cols-12 md:items-end">
      <h1 class="wide text-display-xl font-black md:col-span-7">Projects</h1>
      <p class="max-w-md text-lg leading-relaxed text-muted md:col-span-5 md:justify-self-end">
        Everything worth showing, from products used every day to the small tools that got me here.
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
      <h2 id="earlier-title" class="text-xl font-semibold">Earlier work and side projects</h2>
      <ProjectList :projects="others" class="mt-6" />
    </section>
  </div>
</template>
