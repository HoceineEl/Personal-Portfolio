<script setup>
import { experiences, openSource, technologies } from "~/assets/constants";

const groups = [
  { key: "core", label: "Every day" },
  { key: "also", label: "When the project needs it" },
  { key: "tools", label: "On my desk" },
];
</script>

<template>
  <section id="about" class="shell py-20 md:py-32" aria-labelledby="about-title">
    <div class="grid gap-14 lg:grid-cols-12 lg:gap-10">
      <div class="lg:col-span-6">
        <h2 id="about-title" class="wide text-display-lg font-black">Salaam, I'm Hoceine</h2>
        <div class="mt-8 max-w-xl space-y-5 text-lg leading-relaxed text-muted">
          <p>
            I started with C# desktop apps during an internship in 2022, worked nights as a web developer while
            finishing my studies, and have been building Laravel products full time ever since.
          </p>
          <p>
            Laravel is home. On top of it I reach for whatever the product needs:
            <strong class="font-semibold text-ink">Livewire and Filament</strong> for admin-heavy platforms,
            <strong class="font-semibold text-ink">React or Vue</strong> for rich interfaces, and a
            <strong class="font-semibold text-ink">PWA</strong> when people should keep it on their phone. That is how
            a Quran circles app ends up on students' home screens, and a Hajj platform ships with six separate panels
            without turning to mud.
          </p>
          <p>
            I care about the parts nobody sees in a demo: tenancy boundaries, queues that recover, tests that catch the
            regression before a customer does, and Arabic interfaces that feel native rather than mirrored.
          </p>
          <p>
            When something is worth sharing, I write it up. There are
            <NuxtLink to="/blog" class="link font-medium text-ink">long-form guides</NuxtLink>
            here on Filament, Livewire and Laravel, written for developers doing the same work.
          </p>
        </div>

        <div class="mt-12 space-y-6">
          <div v-for="group in groups" :key="group.key">
            <h3 class="text-sm font-semibold text-muted">{{ group.label }}</h3>
            <ul class="mt-3 flex flex-wrap gap-2">
              <li
                v-for="tech in technologies.filter((item) => item.group === group.key)"
                :key="tech.name"
                class="flex items-center gap-2 rounded-full bg-raised py-1.5 pl-2 pr-3.5 text-[0.95rem] font-medium"
              >
                <img
                  v-if="tech.icon"
                  :src="tech.icon"
                  alt=""
                  width="20"
                  height="20"
                  loading="lazy"
                  class="h-5 w-5 object-contain"
                  :class="tech.name === 'GitHub' && 'dark:invert'"
                />
                <span v-else class="h-5 w-5 rounded-full bg-sun/70" aria-hidden="true" />
                {{ tech.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="lg:col-span-5 lg:col-start-8">
        <h3 class="text-xl font-semibold">Experience</h3>
        <ol class="mt-6 border-t border-line/15">
          <li v-for="item in experiences" :key="item.company_name + item.date" class="reveal border-b border-line/15 py-6">
            <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p class="text-lg font-semibold">
                <NuxtLink v-if="item.url" :to="item.url" class="link">{{ item.company_name }}</NuxtLink>
                <template v-else>{{ item.company_name }}</template>
              </p>
              <p class="font-mono text-sm tabular-nums text-muted">{{ item.date }}</p>
            </div>
            <p class="mt-1 text-[0.95rem] text-ink/80">{{ item.title }}</p>
            <p class="mt-3 leading-relaxed text-muted">{{ item.summary }}</p>
          </li>
        </ol>

        <h3 class="mt-14 text-xl font-semibold">Open source</h3>
        <ul class="mt-6 space-y-5">
          <li v-for="repo in openSource" :key="repo.url">
            <a :href="repo.url" target="_blank" rel="noopener" class="group block">
              <span class="flex items-center gap-2 font-mono text-[0.95rem] font-medium transition-colors group-hover:text-sun-ink">
                {{ repo.name }}
                <UiIcon name="arrow-up-right" class="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              <span class="mt-1 block text-muted">{{ repo.body }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
