<template>
  <section class="section relative overflow-hidden">
    <!-- Section header -->
    <div class="text-center mb-12">
      <span class="section-label">Technologies</span>
      <h2 class="header-secondary">
        Tech
        <span class="relative inline-block">
          <span class="relative z-10">Stack</span>
          <span class="absolute -bottom-1 left-0 w-full h-3 bg-neo-pink -z-0 rotate-1" />
        </span>
      </h2>
      <p class="description mx-auto text-center mt-4">
        The tools and technologies I use to bring ideas to life
      </p>
    </div>

    <!-- Tech grid -->
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
      <div
        v-for="(tech, index) in technologies"
        :key="tech.name"
        class="neo-card p-4 flex flex-col items-center justify-center aspect-square group"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <div class="w-12 h-12 mb-3 flex items-center justify-center">
          <NuxtImg
            :src="tech.icon"
            :alt="tech.name"
            loading="lazy"
            width="48"
            height="48"
            class="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        </div>
        <span class="text-xs font-mono text-center text-text-secondary group-hover:text-text-primary transition-colors">
          {{ tech.name }}
        </span>
      </div>
    </div>

    <!-- Marquee of skills -->
    <div class="mt-16 border-y-3 border-border py-4 bg-neo-lime overflow-hidden">
      <div class="marquee-container">
        <div class="flex gap-8 animate-marquee whitespace-nowrap">
          <span v-for="i in 2" :key="i" class="flex gap-8">
            <span v-for="tech in technologies" :key="`${i}-${tech.name}`" class="font-display font-bold text-neo-black text-lg uppercase">
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
