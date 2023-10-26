<script setup>
const showAside = ref(true);
const active = ref(true);
const showChildern = ref(false);
defineProps(["toc", "active"]);
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
        <li
          v-for="link in toc.links"
          :key="link.text"
          data-link-{{
          link.id
          }}
          class="toc-link"
          @click="show"
        >
          <a
            :href="`#${link.id}`"
            :key="link.id + link.text"
            :class="{ '!text-emerald-500 !font-semibold': active == link.id }"
          >
            {{ link.text }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style>
.toc-nav {
  @apply border border-slate-700   w-full px-1 sm:px-3 py-4 rounded-lg mt-2 md:mt-5 bg-[#0d0d3fd0] overscroll-auto;
}

.toc .toc-link a {
  @apply hover:underline;
}

.toc .toc-link .child-link > a {
  @apply text-[12px] ms-1 !text-slate-500 line-clamp-1;
}
</style>
