<template>
  <nav
    class="w-full flex items-center py-4 fixed top-0 z-50 transition-all duration-300"
    :class="[
      onScroll
        ? 'bg-surface/95 backdrop-blur-sm border-b-3 border-border shadow-neo-sm'
        : 'bg-transparent'
    ]"
  >
    <div class="w-full flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6">
      <!-- Logo -->
      <a
        href="/"
        aria-label="Hoceine EL IDRISSI"
        class="flex items-center gap-3 group"
      >
        <div class="w-10 h-10 bg-neo-lime border-3 border-border flex items-center justify-center font-display font-bold text-neo-black text-lg">
          H
        </div>
        <span class="font-display font-bold text-lg hidden sm:block text-text-primary">
          HOCEINE
        </span>
      </a>

      <!-- Navigation -->
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/"
          class="px-4 py-2 font-mono text-sm uppercase tracking-wide text-text-secondary hover:text-text-primary transition-colors"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/blog"
          :prefetch="false"
          class="px-4 py-2 font-mono text-sm uppercase tracking-wide bg-neo-lime text-neo-black border-3 border-border"
        >
          Blog
        </NuxtLink>

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="w-10 h-10 border-3 border-border bg-surface flex items-center justify-center transition-all duration-200 hover:shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg
            v-if="isDark"
            class="w-5 h-5 text-neo-yellow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-neo-purple"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { socials } from "~/assets/constants";

const { isDark, toggleTheme } = useTheme();
const onScroll = ref(false);

const handleScroll = () => {
  onScroll.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped></style>
