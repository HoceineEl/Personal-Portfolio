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

      <ul class="ml-0 pl-4 max-h-[600px] overflow-y-auto">
        <li
          v-for="link in toc.links"
          :id="`#${link.id}`"
          :key="link.id"
          class="mb-2 ml-0 cursor-pointer list-none text-sm last:mb-0"
        >
          <a
            :href="`#${link.id}`"
            :class="{
              '!text-purple-300 !font-semibold': link.id == currentActiveLink,
            }"
            >{{ link.text }}</a
          >

          <ul v-if="link.children" class="my-2 ml-3">
            <li
              v-for="child in link.children"
              :id="`#${child.id}`"
              :key="child.id"
              class="mb-2 ml-0 cursor-pointer list-none text-xs last:mb-0"
              :class="{
                '!text-teal-200 !font-semibold': child.id == currentActiveLink,
              }"
            >
              <a
                :href="`#${child.id}`"
                :class="{
                  '!text-teal-200 !font-semibold': child.id == currentActiveLink,
                }"
                >{{ child.text }}</a
              >
            </li>
          </ul>
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
