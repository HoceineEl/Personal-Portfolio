<script setup>
import { experiences } from "~/assets/constants";
</script>

<template>
  <section id="work" class="section relative">
    <!-- Section header -->
    <div class="text-center mb-16">
      <span class="section-label">Experience</span>
      <h2 class="header-secondary">
        Work
        <span class="relative inline-block">
          <span class="relative z-10">History</span>
          <span class="absolute -bottom-1 left-0 w-full h-3 bg-neo-cyan -z-0 -rotate-1" />
        </span>
      </h2>
    </div>

    <!-- Timeline -->
    <div class="max-w-4xl mx-auto relative">
      <!-- Timeline line -->
      <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-border md:-translate-x-1/2" />

      <!-- Experience items -->
      <div class="space-y-12">
        <div
          v-for="(exp, index) in experiences"
          :key="exp.title"
          class="relative flex flex-col md:flex-row gap-6"
          :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
        >
          <!-- Timeline dot -->
          <div class="absolute left-4 md:left-1/2 w-8 h-8 -translate-x-1/2 bg-neo-lime border-3 border-border z-10 flex items-center justify-center">
            <span class="font-mono font-bold text-neo-black text-xs">{{ index + 1 }}</span>
          </div>

          <!-- Content card -->
          <div
            class="ml-12 md:ml-0 md:w-[calc(50%-2rem)] neo-card p-6"
            :class="index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'"
          >
            <!-- Company logo -->
            <div class="flex items-start gap-4 mb-4">
              <div class="w-14 h-14 bg-surface-alt border-3 border-border flex items-center justify-center p-2 shrink-0">
                <NuxtImg
                  :src="exp.icon"
                  :alt="exp.company_name"
                  class="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 class="font-display font-bold text-lg text-text-primary">{{ exp.title }}</h3>
                <p class="font-mono text-sm text-neo-pink">{{ exp.company_name }}</p>
              </div>
            </div>

            <!-- Date badge -->
            <div class="neo-tag-accent mb-4 text-xs">
              {{ exp.date }}
            </div>

            <!-- Points -->
            <ul class="space-y-2">
              <li
                v-for="(point, pIndex) in exp.points"
                :key="pIndex"
                class="flex items-start gap-3 text-sm text-text-secondary"
              >
                <span class="w-2 h-2 bg-neo-cyan mt-2 shrink-0" />
                <span>{{ point }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
