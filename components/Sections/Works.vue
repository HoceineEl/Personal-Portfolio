<script setup>
import { projects } from "~/assets/constants";
import { github, visit } from "~/assets";
</script>
<template>
  <section id="projects" class="section px-2">
    <h2 class="header">My Work</h2>
    <h3 class="header-secondary">Projects.</h3>
    <p class="description px-2 text-wrap-balance">
      These projects serve as concrete demonstrations of my expertise and experience. They
      offer a glimpse into my ability to tackle intricate challenges, work with diverse
      technologies, and successfully oversee project development. While I have provided
      code repositories for each project, please note that not all of them have live demos
      available.
    </p>
    <div class="flex flex-wrap gap-7 mt-20 justify-between px-2 sm:px-0">
      <div
        v-for="(project, index) in projects"
        class="w-full sm:w-[350px] p-5 bg-tertiary rounded-2xl flex flex-col relative pointer-events-none sm:pointer-events-auto"
        $VanillaTiltF
        data-tilt
        data-tilt-scale="1.05"
        v-motion-slide-visible-once-left="index % 2 === 0"
        v-motion-slide-visible-once-right="index % 2 !== 0"
      >
        <div class="w-full h-[230px] overflow-hidden relative">
          <img
            :src="project.image"
            :alt="project.name"
            class="w-full h-full object-cover rounded-2xl"
            width="200"
            loading="lazy"
          />
          <div class="absolute top-2 right-2 z-50 flex gap-2">
            <a
              class="w-10 h-10 bg-tertiary rounded-full p-2"
              :href="project.source_code_link"
              target="_blank"
              ><img
                :src="github"
                alt="project link on github "
                width="50"
                loading="lazy"
              />
            </a>
            <a
              v-if="project.demo"
              class="w-10 h-10 bg-tertiary rounded-full p-2"
              :href="project.demo"
              target="_blank"
              ><img :src="visit" alt="project link  " width="40" loading="lazy" />
            </a>
          </div>
        </div>
        <div class="my-5">
          <h3 class="sm:text-[21px] text-[16px] font-semibold">{{ project.name }}</h3>
          <p class="sm:text-[15px] text-[12px] leading-6 text-slate-400">
            {{ project.description }}
          </p>
        </div>
        <div class="flex-grow"></div>
        <div class="mt-1 flex flex-wrap gap-2">
          <p v-for="tag in project.tags" :class="tag.color">#{{ tag.name }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
p {
  text-wrap: balance;
}
</style>
