<template>
  <div class="relative section flex flex-wrap justify-center gap-4">
    <div>
      <div class="text-center">
        <p class="header">Technologies I'm Using</p>
        <h2 class="header-secondary">Tech Stack.</h2>
      </div>
      <div class="flex flex-wrap gap-16 mt-14 justify-center items-center max-w-5xl">
        <div
          v-for="tech in technologies"
          class="w-20 h-20 p-2 bg-[#ffffff11] rounded-xl hover:rounded-full border-transparent border-2 hover:border-teal-500 hover:p-3 transition-all duration-300 group"
        >
          <img :src="tech.icon" :alt="tech.name" loading="lazy" width="80" />
          <div
            class="absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap rounded bg-tertiary py-[6px] px-4 text-sm font-semibold text-white opacity-0 group-hover:opacity-100"
          >
            <span
              class="absolute bottom-[-3px] left-1/2 -z-10 h-2 w-2 -translate-x-1/2 rotate-45 rounded-sm bg-tertiary"
            ></span>
            {{ tech.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- <div
      v-memo
      v-for="(tech, index) in technologies"
      :key="tech.name"
      class="flex justify-center items-center w-36 h-36 relative group"
    >
      <LazyCanvasObject :object="tech.icon" :scale="1" :speed="10" />
      <span
        class="absolute text-[6px] group-hover:text-lg top-3 group-hover:-top-3 text-secondary opacity-0 group-hover:opacity-100 transition duration-1000 bg-tertiary px-3 py-2 rounded-lg"
        >{{ tech.name }}</span
      >
    </div> -->
    <!-- <iframe
      :src="
        loadMore ? 'http://127.0.0.1:3000/sub_tech' : 'http://127.0.0.1:3000/technologies'
      "
      width="100%"
      height="200px"
      frameborder="0"
    ></iframe>
    <button @click="LoadMoreTechs" class="mt-4 px-4 py-2 bg-main-violet rounded-lg">
      Load More
    </button> -->
    <!-- <iframe
      src="http://127.0.0.1:3000/sub_tech"
      width="100%"
      height="100%"
      frameborder="0"
    ></iframe> -->
  </div>
</template>

<script setup>
import { technologies } from "~/assets/constants";
// const loadMore = ref(false);
// const LoadMoreTechs = () => {
//   loadMore.value = !loadMore.value;
// };
</script>

<style lang="scss" scoped></style>
