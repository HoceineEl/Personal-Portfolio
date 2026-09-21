<script setup>
import { navLinks, profile, socials } from "~/assets/constants";

const year = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-line/10">
    <div class="shell grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end md:py-16">
      <div>
        <p class="wide text-2xl font-extrabold tracking-tight">{{ profile.name }}</p>
        <p class="mt-2 max-w-md text-muted">
          {{ profile.role }} in {{ profile.location }}. Building web apps with Laravel, and writing
          about how.
        </p>
        <a :href="`mailto:${profile.email}`" class="link mt-5 inline-block font-medium">{{ profile.email }}</a>
      </div>

      <div class="flex flex-col gap-6 md:items-end">
        <ul class="flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem]">
          <li v-for="link in navLinks" :key="link.id">
            <NuxtLink :to="link.id" class="text-muted transition-colors hover:text-ink">{{ link.title }}</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/projects" class="text-muted transition-colors hover:text-ink">All projects</NuxtLink>
          </li>
        </ul>
        <ul class="flex gap-1">
          <li v-for="social in socials" :key="social.name">
            <a
              :href="social.url"
              target="_blank"
              rel="noopener me"
              class="grid h-11 w-11 place-items-center rounded-full text-lg text-muted transition-colors hover:bg-raised hover:text-ink"
              :aria-label="`${profile.firstName} on ${social.name}`"
            >
              <UiIcon :name="social.name" />
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="shell flex flex-col gap-2 border-t border-line/10 py-6 text-sm text-muted sm:flex-row">
      <p>&copy; {{ year }} {{ profile.name }}</p>
    </div>
  </footer>
</template>
