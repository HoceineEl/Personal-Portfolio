<script setup>
import { socials } from "~/assets/constants";
</script>

<template>
  <footer class="border-t-3 border-border bg-surface-alt" role="contentinfo">
    <div class="section py-12">
      <div class="grid md:grid-cols-3 gap-8 items-center">
        <!-- Logo & tagline -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-neo-lime border-3 border-border flex items-center justify-center font-display font-bold text-neo-black text-xl">
              H
            </div>
            <span class="font-display font-bold text-xl text-text-primary">HOCEINE</span>
          </div>
          <p class="text-sm text-text-secondary max-w-xs">
            Full Stack Web Developer crafting digital experiences with passion and precision.
          </p>
        </div>

        <!-- Quick links -->
        <div class="flex flex-wrap justify-center gap-4">
          <a href="#about" class="text-sm font-mono uppercase text-text-secondary hover:text-neo-lime transition-colors">
            About
          </a>
          <a href="#projects" class="text-sm font-mono uppercase text-text-secondary hover:text-neo-lime transition-colors">
            Projects
          </a>
          <a href="#work" class="text-sm font-mono uppercase text-text-secondary hover:text-neo-lime transition-colors">
            Experience
          </a>
          <a href="#contact" class="text-sm font-mono uppercase text-text-secondary hover:text-neo-lime transition-colors">
            Contact
          </a>
          <NuxtLink to="/blog" class="text-sm font-mono uppercase text-text-secondary hover:text-neo-lime transition-colors">
            Blog
          </NuxtLink>
        </div>

        <!-- Social links -->
        <div class="flex justify-end gap-3">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`Visit ${social.name}`"
            class="w-10 h-10 border-3 border-border bg-surface flex items-center justify-center transition-all duration-200 hover:bg-neo-lime hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-sm"
          >
            <NuxtImg
              :src="social.icon"
              :alt="social.name"
              width="20"
              height="20"
              class="dark:invert"
            />
          </a>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-8 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-sm font-mono text-text-secondary">
          &copy; {{ new Date().getFullYear() }} Hoceine El Idrissi. All rights reserved.
        </p>
        <p class="text-xs font-mono text-text-secondary">
          Built with
          <span class="text-neo-lime">Nuxt.js</span>
          &
          <span class="text-neo-cyan">Tailwind CSS</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped></style>
