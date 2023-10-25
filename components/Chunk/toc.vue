<script setup>
const showAside = ref(true);
const active = ref(true);
defineProps({
  toc: {
    type: Array,
    required: true,
  },
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
onBeforeMount(() => {
  window.addEventListener("resize", handelWindowSize);
  handelWindowSize();
});
</script>
<template>
  <div class="toc" v-if="toc && toc.links">
    <button
      class="p-1 bg-[#1E1E3B] rounded-lg"
      @click="active = !active"
      v-if="!showAside"
    >
      <IconsBurger class="w-8 h-8" v-if="!active" />
      <IconsClose class="w-8 h-8" v-if="active" />
    </button>
    <nav class="transition-all duration-300 toc-nav" v-if="active || showAside">
      <header class="font-semibold mb-3 border-b border-slate-700 pb-2">
        <h3 class="heading-gradient text-center font-bold">Table of Contents</h3>
      </header>

      <ul class="overflow-y-auto">
        <li v-for="link in toc.links" :key="link.text" class="toc-link">
          <a :href="`#${link.id}`"> {{ link.text }} </a>
          <ul class="toc-child">
            <li
              v-if="link.children"
              v-for="child in link.children"
              class="child-link"
              :key="child"
            >
              <a :href="`#${child.id}`"> {{ child.text }} </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style>
.toc-nav {
  @apply border border-slate-700  max-w-sm px-1 sm:px-3 py-4 rounded-lg mt-5 bg-[#0d0d3fd0] overscroll-auto;
}

.toc .toc-link a {
  @apply hover:underline;
}

.toc .toc-link .child-link {
  @apply text-[12px] ms-2 text-slate-500;
}
</style>
