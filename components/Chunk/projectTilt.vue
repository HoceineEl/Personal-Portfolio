<template>
  <section id="projects" class="section px-2">
    <h2 class="header">My Work</h2>
    <h3 class="header-secondary">Projects.</h3>

    <div class="flex flex-wrap gap-7 mt-20 justify-center px-2 sm:px-0 mb-9">
      <div
        v-for="(project, index) in projects"
        :key="project.name"
        class="w-full sm:w-[350px] p-5 bg-tertiary rounded-2xl flex flex-col relative"
        $VanillaTiltF
        data-tilt
        data-tilt-scale="1.05"
        v-motion-slide-visible-once-left="index % 2 === 0"
        v-motion-slide-visible-once-right="index % 2 !== 0"
      >
        <div class="w-full h-[230px] overflow-hidden relative">
          <NuxtImg
            :src="project.image"
            :alt="project.name"
            class="w-full h-full object-cover rounded-2xl"
            format="webp"
            loading="lazy"
          />
          <div class="absolute top-2 right-2 z-50 flex gap-2">
            <a
              class="w-10 h-10 bg-tertiary rounded-full p-2"
              :href="project.source_code_link"
              target="_blank"
              :aria-label="`Visit project on GitHub: ${project.name}`"
            >
              <NuxtImg
                :src="github"
                alt="GitHub Logo"
                width="50"
                height="50"
                format="webp"
                quality="70"
                loading="lazy"
              />
            </a>
            <a
              v-if="project.demo"
              class="w-10 h-10 bg-tertiary rounded-full p-2"
              :href="project.demo"
              target="_blank"
              :aria-label="`Visit project demo: ${project.name}`"
            >
              <NuxtImg
                :src="visit"
                alt="Visit Logo"
                width="40"
                format="webp"
                quality="70"
                height="40"
                loading="lazy"
              />
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

<script setup>
const { projects } = defineProps(["projects"]);

import { github, visit } from "~/assets";
</script>

<style></style>
