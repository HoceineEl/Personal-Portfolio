<template>
  <nav class="toc" v-if="toc && toc.links && showAside">
    <header class="font-semibold mb-3 border-b border-slate-700 pb-2">
      <h3>Table of Contents</h3>
    </header>

    <ul>
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
</template>

<script setup>
const showAside = ref(true);
defineProps({
  toc: {
    type: Array,
    required: true,
  },
});
const handelWindowSize = () => {
  if (window.innerWidth < 1024) showAside.value = false;
  else showAside.value = true;
};
onBeforeMount(() => {
  window.addEventListener("resize", handelWindowSize);
  handelWindowSize();
});
</script>

<style>
.toc {
  @apply border border-slate-700  px-3 py-4 rounded-lg mt-5 bg-[#1E1E3B];
}

.toc .toc-link a {
  @apply line-clamp-1 hover:underline;
}

.toc .toc-link .child-link {
  @apply text-sm ms-2;
}
</style>
