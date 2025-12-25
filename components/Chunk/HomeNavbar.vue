<script setup>
import { navLinks } from "~/assets/constants";

const { isDark, toggleTheme } = useTheme();
const active = ref("");
const toggle = ref(false);
const onScroll = ref(false);

const setActive = (link) => {
  active.value = link;
};

const setToggle = () => {
  toggle.value = !toggle.value;
};

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
        @click="setActive('')"
      >
        <div class="w-10 h-10 bg-neo-primary border-3 border-border flex items-center justify-center font-display font-bold text-white text-lg">
          H
        </div>
        <span class="font-display font-bold text-lg hidden sm:block text-text-primary">
          HOCEINE
        </span>
      </a>

      <!-- Desktop Navigation -->
      <ul class="hidden lg:flex items-center gap-1">
        <li v-for="link in navLinks" :key="link.title">
          <NuxtLink
            :to="link.id"
            :prefetch="false"
            class="px-4 py-2 font-mono text-sm uppercase tracking-wide transition-all duration-200"
            :class="[
              active === link.title
                ? 'bg-neo-primary text-white border-3 border-border'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
            ]"
            @click="setActive(link.title)"
          >
            {{ link.title }}
          </NuxtLink>
        </li>
      </ul>

      <!-- Right side: Theme toggle & Mobile menu -->
      <div class="flex items-center gap-3">
        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="w-10 h-10 border-3 border-border bg-surface flex items-center justify-center transition-all duration-200 hover:shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <!-- Sun icon (shown in dark mode) -->
          <svg
            v-if="isDark"
            class="w-5 h-5 text-neo-secondary"
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
          <!-- Moon icon (shown in light mode) -->
          <svg
            v-else
            class="w-5 h-5 text-neo-primary"
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

        <!-- Mobile Menu Button -->
        <button
          @click="setToggle"
          class="lg:hidden w-10 h-10 border-3 border-border bg-surface flex items-center justify-center"
          :class="toggle ? 'bg-neo-secondary' : ''"
          aria-label="Toggle menu"
        >
          <svg
            v-if="!toggle"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div
        v-show="toggle"
        class="lg:hidden absolute top-full left-0 w-full bg-surface border-b-3 border-border"
      >
        <ul class="flex flex-col p-4">
          <li v-for="link in navLinks" :key="link.title">
            <NuxtLink
              :to="link.id"
              :prefetch="false"
              class="block px-4 py-3 font-mono text-sm uppercase tracking-wide border-b border-border/20 transition-colors"
              :class="[
                active === link.title
                  ? 'bg-neo-primary text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
              ]"
              @click="() => { setActive(link.title); setToggle(); }"
            >
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
