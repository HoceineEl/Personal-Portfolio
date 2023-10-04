<script setup>
import { projects } from "~/assets/constants";
import { github } from "~/assets";
</script>
<template>
  <section id="projects" class="section">
    <h2 class="header">My Work</h2>
    <h3 class="header-secondary">Projects.</h3>
    <p class="description">
      These projects serve as concrete demonstrations of my expertise and experience. They
      offer a glimpse into my ability to tackle intricate challenges, work with diverse
      technologies, and successfully oversee project development. While I have provided
      code repositories for each project, please note that not all of them have live demos
      available.
    </p>
    <div class="flex flex-wrap gap-7 mt-20 justify-center px-2 sm:px-0">
      <div
        v-for="project in projects"
        class="w-full sm:w-[350px] p-5 bg-tertiary rounded-2xl"
        $VanillaTilt
        data-tilt
        data-tilt-scale="1.05"
      >
        <div class="w-full h-[230px] overflow-hidden relative">
          <img
            :src="project.image"
            :alt="project.name"
            class="w-full h-full object-cover rounded-2xl"
          />
          <a
            class="absolute w-10 h-10 top-2 right-2 z-50 bg-tertiary rounded-full p-2"
            :href="project.source_code_link"
            target="_blank"
            ><img :src="github" alt="project link on github "
          /></a>
        </div>
        <div class="my-5">
          <h3 class="text-[21px] font-semibold">{{ project.name }}</h3>
          <p class="text-[15px] leading-6 text-slate-400">{{ project.description }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <p v-for="tag in project.tags" :class="tag.color">#{{ tag.name }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
