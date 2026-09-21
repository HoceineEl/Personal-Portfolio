<script setup>
import { projects } from "~/assets/constants";

const featured = projects.filter((project) => project.featured);
const [lead, ...rest] = featured;
const pairs = rest.slice(0, 6);
const others = [...rest.slice(6), ...projects.filter((project) => !project.featured).slice(0, 3)];
const layout = ["md:col-span-7", "md:col-span-5 md:mt-40", "md:col-span-5", "md:col-span-7 md:mt-24"];
</script>

<template>
  <section id="work" class="shell py-20 md:py-32" aria-labelledby="work-title">
    <div class="grid gap-6 md:grid-cols-12 md:items-end">
      <h2 id="work-title" class="wide text-display-lg font-black md:col-span-7">Selected work</h2>
      <p class="max-w-md text-lg text-muted md:col-span-5 md:justify-self-end">
        Web platforms, installable web apps and a commercial Filament plugin, in production since 2023 and several of them in
        Arabic. A few up close:
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
        class="reveal"
        :class="layout[index % 4]"
      />
    </div>

    <div class="mt-24 md:mt-32">
      <div class="mb-6 flex items-end justify-between gap-4">
        <h3 class="text-xl font-semibold">More projects</h3>
        <NuxtLink to="/projects" class="link text-[0.95rem] font-medium">All {{ projects.length }} projects</NuxtLink>
      </div>
      <ProjectList :projects="others" />
    </div>
  </section>
</template>
