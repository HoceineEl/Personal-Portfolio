<script setup>
const { toc } = defineProps(["toc"]);
const showAside = ref(true);
const active = ref(true);
const currentActiveLink = ref("");
const obeserver = ref(null);
const content = ref(null);
const observerOptions = ref({
  root: content.value,
  threshold: 0,
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
  document.querySelectorAll(".nuxt-content h2[id]").forEach((section) => {
    obeserver.value.observe(section);
  });
  const show = (link) => {
    const section = document.querySelector(`#${link}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
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
    <button
      class="p-1 bg-[#1E1E3B] rounded-lg"
      @click="active = !active"
      v-if="!showAside"
      aria-label="Toggle Table of Contents"
    >
      <IconsBurger class="w-8 h-8" v-if="!active" />
      <IconsClose class="w-8 h-8" v-if="active" />
    </button>
    <nav
      class="transition-all duration-300 toc-nav"
      v-show="active || showAside"
      aria-hidden="false"
    >
      <header class="font-semibold mb-3 border-b border-slate-700 pb-2">
        <h3 id="toc-heading" class="heading-gradient text-center font-bold" tabindex="-1">
          Table of Contents
        </h3>
      </header>

      <ul class="overflow-y-auto">
        <li
          v-for="link in toc.links"
          :key="link.text"
          class="toc-link"
          @click="show(link.id)"
          role="menuitem"
        >
          <a
            :href="`#${link.id}`"
            :key="link.id + link.text"
            :class="{
              '!text-teal-300 !font-semibold': link.id == currentActiveLink,
            }"
            tabindex="0"
            aria-label="Navigate to Section"
          >
            {{ link.text }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.toc {
  @apply sticky top-16 lg:top-24 w-full;
}

.toc-nav {
  @apply bg-transparent p-5 rounded-lg text-slate-300 mt-3;
}

.toc-link {
  @apply mb-2 text-slate-400 text-[12px] transition-all duration-300 cursor-pointer lg:ms-4;
}

.toc-link a {
  @apply hover:text-teal-600 hover:font-semibold;
}
</style>
