<script setup>
import { projects } from "~/assets/constants";

const INITIAL_COUNT = 9;
const LOAD_MORE_COUNT = 9;

const visibleCount = ref(INITIAL_COUNT);
const isExpanded = ref(false);

const visibleProjects = computed(() => {
  return projects.slice(0, visibleCount.value);
});

const hasMore = computed(() => {
  return visibleCount.value < projects.length;
});

const remainingCount = computed(() => {
  return projects.length - visibleCount.value;
});

const showMore = () => {
  visibleCount.value = Math.min(visibleCount.value + LOAD_MORE_COUNT, projects.length);
  if (visibleCount.value >= projects.length) {
    isExpanded.value = true;
  }
};

const showLess = () => {
  visibleCount.value = INITIAL_COUNT;
  isExpanded.value = false;
  // Scroll to projects section
  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
};

const tagColors = {
  'VueJs': 'bg-neo-lime text-neo-black',
  'NuxtJs': 'bg-neo-lime text-neo-black',
  'Laravel': 'bg-neo-pink text-white',
  'Tailwind CSS': 'bg-neo-cyan text-neo-black',
  'TailwindCss': 'bg-neo-cyan text-neo-black',
  'TailwindcsCss': 'bg-neo-cyan text-neo-black',
  'Filament': 'bg-neo-orange text-white',
  'FilamentPHP': 'bg-neo-orange text-white',
  'Livewire': 'bg-neo-purple text-white',
  'JavaScript': 'bg-neo-yellow text-neo-black',
  'Javascript': 'bg-neo-yellow text-neo-black',
  'VanillaJs': 'bg-neo-yellow text-neo-black',
  'TypeScript': 'bg-neo-cyan text-neo-black',
  'default': 'bg-surface-alt text-text-primary'
};

const getTagColor = (tagName) => {
  return tagColors[tagName] || tagColors.default;
};
</script>

<template>
  <section id="projects" class="section relative">
    <!-- Decorative elements -->
    <div class="absolute top-20 right-10 w-16 h-16 bg-neo-orange border-3 border-border -rotate-12 hidden lg:block" />
    <div class="absolute bottom-40 left-10 w-12 h-12 bg-neo-cyan border-3 border-border rotate-6 hidden lg:block" />

    <!-- Section header -->
    <div class="mb-12">
      <span class="section-label">Portfolio</span>
      <h2 class="header-secondary">
        Featured
        <span class="relative inline-block">
          <span class="relative z-10">Projects</span>
          <span class="absolute -bottom-1 left-0 w-full h-3 bg-neo-lime -z-0 rotate-1" />
        </span>
      </h2>
      <p class="description max-w-2xl mt-4">
        A showcase of my work demonstrating expertise in tackling complex challenges
        with diverse technologies.
      </p>
    </div>

    <!-- Projects grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="(project, index) in visibleProjects"
        :key="project.name"
        class="neo-card overflow-hidden group"
      >
        <!-- Project image -->
        <div class="relative h-48 overflow-hidden border-b-3 border-border">
          <template v-if="project.noImage">
            <div
              class="w-full h-full flex flex-col items-center justify-center p-6 text-center transform group-hover:scale-105 transition-all duration-500 relative overflow-hidden"
              :class="[
                index % 4 === 0 ? 'bg-neo-purple' :
                index % 4 === 1 ? 'bg-neo-yellow' :
                index % 4 === 2 ? 'bg-neo-cyan' : 'bg-neo-pink'
              ]"
            >
              <!-- Geometric patterns -->
              <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div class="absolute top-2 left-2 w-8 h-8 border-2 border-neo-black rounded-full"></div>
                <div class="absolute bottom-4 right-4 w-12 h-12 border-2 border-neo-black rotate-45"></div>
                <div class="absolute top-1/2 left-4 w-6 h-1 border-b-2 border-neo-black"></div>
              </div>

              <div class="w-20 h-20 mb-3 border-4 border-neo-black bg-white -rotate-3 group-hover:rotate-6 transition-transform duration-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                 <span class="text-neo-black font-display font-black text-4xl">{{ project.name.charAt(0) }}</span>
              </div>

              <p class="font-display font-black text-neo-black leading-tight uppercase tracking-tighter text-lg px-2 bg-white border-2 border-neo-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {{ project.name.split(' – ')[0] }}
              </p>

              <!-- Floating elements -->
              <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-neo-lime border-3 border-neo-black rotate-12 group-hover:-translate-y-2 transition-transform"></div>
              <div class="absolute top-2 right-4 w-6 h-6 bg-white border-2 border-neo-black rounded-full group-hover:scale-125 transition-transform"></div>
            </div>
          </template>
          <NuxtImg
            v-else
            :src="project.image"
            :alt="project.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />

          <!-- Overlay with links -->
          <div class="absolute inset-0 bg-neo-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            <a
              v-if="project.demo"
              :href="project.demo"
              target="_blank"
              rel="noopener noreferrer"
              class="w-12 h-12 bg-neo-lime border-3 border-border flex items-center justify-center"
              aria-label="View demo"
            >
              <svg class="w-5 h-5 text-neo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <a
              v-if="project.source_code_link"
              :href="project.source_code_link"
              target="_blank"
              rel="noopener noreferrer"
              class="w-12 h-12 bg-surface border-3 border-border flex items-center justify-center"
              aria-label="View source code"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Project content -->
        <div class="p-5">
          <h3 class="font-display font-bold text-lg mb-2 text-text-primary">
            {{ project.name }}
          </h3>
          <p class="text-sm text-text-secondary mb-4 line-clamp-2">
            {{ project.description }}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="tag in project.tags.slice(0, 4)"
              :key="tag.name"
              class="text-xs font-mono font-bold px-2 py-1 border-2 border-border"
              :class="getTagColor(tag.name)"
            >
              {{ tag.name }}
            </span>
          </div>

          <!-- View project link -->
          <NuxtLink
            :to="project.url"
            class="inline-flex items-center gap-2 font-mono text-sm font-bold text-text-primary hover:text-neo-pink transition-colors"
          >
            View Details
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>
      </article>
    </div>

    <!-- Show More / Show Less Button -->
    <div class="flex justify-center mt-10">
      <button
        v-if="hasMore"
        @click="showMore"
        class="group neo-btn-primary px-8 py-4"
      >
        <span>Show More Projects</span>
        <span class="ml-2 px-2 py-0.5 bg-white/20 rounded text-sm font-mono">+{{ remainingCount }}</span>
        <svg class="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
      <button
        v-else-if="isExpanded"
        @click="showLess"
        class="group neo-btn px-8 py-4"
      >
        <span>Show Less</span>
        <svg class="w-5 h-5 ml-2 transition-transform duration-200 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped></style>
