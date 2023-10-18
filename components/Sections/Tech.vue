<template>
  <div class="relative section flex flex-wrap justify-center gap-4">
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
// const loadMore = ref(false);
// const LoadMoreTechs = () => {
//   loadMore.value = !loadMore.value;
// };
</script>

<style lang="scss" scoped></style>
