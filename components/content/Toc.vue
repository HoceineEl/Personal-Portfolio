<script setup>
const { toc } = defineProps(["toc"]);
const showAside = ref(true);
const active = ref(true);
const currentActiveLink = ref("");
const obeserver = ref(null);
const content = ref(null);
const observerOptions = ref({
  root: content.value,
  threshold: 0.5,
});

onMounted(() => {
  obeserver.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      if (entry.isIntersecting) {
        currentActiveLink.value = id;
      }
    });
  }, observerOptions.value);
  document
    .querySelectorAll(".nuxt-content h2[id],.nuxt-content h3[id]")
    .forEach((section) => {
      obeserver.value.observe(section);
    });

  const handelWindowSize = () => {
    if (window.innerWidth < 1024) {
      active.value = true;
      showAside.value = false;
    } else {
      showAside.value = true;
      active.value = false;
    }
  };
  window.addEventListener("resize", handelWindowSize);
  handelWindowSize();
});
</script>
<template>
  <div
    class="toc"
    v-if="toc && toc.links"
    role="navigation"
    aria-labelledby="toc-heading"
  >
    <!-- Mobile Toggle -->
    <button
      class="w-full flex items-center justify-between p-3 bg-surface border-3 border-border font-display font-bold text-text-primary lg:hidden"
      @click="active = !active"
      v-if="!showAside"
      aria-label="Toggle Table of Contents"
    >
      <span class="flex items-center gap-2">
        <span class="w-3 h-3 bg-neo-lime"></span>
        Contents
      </span>
      <IconsBurger class="w-5 h-5" v-if="!active" />
      <IconsClose class="w-5 h-5" v-if="active" />
    </button>

    <!-- TOC Navigation -->
    <nav
      class="transition-all duration-300 toc-nav"
      v-show="active || showAside"
      aria-hidden="false"
    >
      <header class="mb-4 pb-3 border-b-3 border-border">
        <h3
          id="toc-heading"
          class="font-display font-bold text-text-primary flex items-center gap-2"
          tabindex="-1"
        >
          <span class="w-3 h-3 bg-neo-cyan"></span>
          Table of Contents
        </h3>
      </header>

      <ul class="space-y-1 max-h-[500px] overflow-y-auto pr-2">
        <li
          v-for="link in toc.links"
          :id="`#${link.id}`"
          :key="link.id"
          class="group"
        >
          <a
            :href="`#${link.id}`"
            class="block py-2 px-3 text-sm font-mono text-text-secondary hover:text-text-primary hover:bg-neo-purple/10 border-l-3 transition-all duration-200"
            :class="[
              link.id == currentActiveLink
                ? 'border-neo-purple text-neo-purple font-semibold bg-neo-purple/5'
                : 'border-transparent'
            ]"
          >
            {{ link.text }}
          </a>

          <ul v-if="link.children" class="ml-4 space-y-1 mt-1">
            <li
              v-for="child in link.children"
              :id="`#${child.id}`"
              :key="child.id"
            >
              <a
                :href="`#${child.id}`"
                class="block py-1.5 px-3 text-xs font-mono text-text-secondary hover:text-neo-cyan border-l-2 transition-all duration-200"
                :class="[
                  child.id == currentActiveLink
                    ? 'border-neo-cyan text-neo-cyan font-semibold'
                    : 'border-border'
                ]"
              >
                {{ child.text }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.toc {
  @apply sticky top-24 w-full;
}

.toc-nav {
  @apply bg-surface border-3 border-border p-4 shadow-neo-sm;
}

/* Custom scrollbar for TOC */
.toc-nav ul::-webkit-scrollbar {
  width: 4px;
}

.toc-nav ul::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

.dark .toc-nav ul::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.toc-nav ul::-webkit-scrollbar-thumb {
  @apply bg-neo-purple;
  opacity: 0.5;
}
</style>
