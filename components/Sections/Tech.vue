<template>
  <section class="section relative overflow-hidden">
    <!-- Section header -->
    <div class="text-center mb-12">
      <span class="section-label">Technologies</span>
      <h2 class="header-secondary">
        Tech
        <span class="relative inline-block">
          <span class="relative z-10">Stack</span>
          <span class="absolute -bottom-1 left-0 w-full h-3 bg-neo-secondary -z-0 rotate-1" />
        </span>
      </h2>
      <p class="description mx-auto text-center mt-4">
        The tools and technologies I use to bring ideas to life
      </p>
    </div>

    <!-- Masonry Tech Grid -->
    <div class="max-w-4xl mx-auto">
      <!-- Featured technologies - larger cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
        <div
          v-for="tech in featuredTech"
          :key="tech.name"
          class="neo-card p-6 flex flex-col items-center justify-center aspect-square group"
        >
          <div class="w-16 h-16 mb-4 flex items-center justify-center">
            <NuxtImg
              :src="tech.icon"
              :alt="tech.name"
              loading="lazy"
              width="64"
              height="64"
              class="w-full h-full object-contain group-hover:grayscale-0 transition-all duration-300"
            />
          </div>
          <span class="text-sm font-mono text-center text-text-primary font-bold">
            {{ tech.name }}
          </span>
        </div>
      </div>

      <!-- Supporting technologies - smaller cards -->
      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
        <div
          v-for="tech in supportingTech"
          :key="tech.name"
          class="neo-card p-3 flex flex-col items-center justify-center aspect-square group"
        >
          <div class="w-10 h-10 mb-2 flex items-center justify-center">
            <NuxtImg
              :src="tech.icon"
              :alt="tech.name"
              loading="lazy"
              width="40"
              height="40"
              class="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
            />
          </div>
          <span class="text-[10px] font-mono text-center text-text-secondary group-hover:text-text-primary transition-colors">
            {{ tech.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Marquee of skills -->
    <div class="mt-16 border-y-3 border-border py-4 bg-neo-primary overflow-hidden">
      <div class="marquee-container">
        <div class="flex gap-8 animate-marquee whitespace-nowrap">
          <span v-for="i in 2" :key="i" class="flex gap-8">
            <span v-for="tech in technologies" :key="`${i}-${tech.name}`" class="font-display font-bold text-white text-lg uppercase">
              {{ tech.name }} *
            </span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { technologies } from "~/assets/constants";

const featuredTech = computed(() => technologies.filter(t => t.featured));
const supportingTech = computed(() => technologies.filter(t => !t.featured));
</script>

<style scoped>
.marquee-container {
  display: flex;
  overflow: hidden;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}
</style>
