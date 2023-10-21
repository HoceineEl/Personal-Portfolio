<script setup>
definePageMeta({
  layout: "blog",
});
const { prev, next, toc } = useContent();
</script>
<template>
  <main class="">
    <div class="section max-w-7xl content mt-20 prose md:prose-lg lg:prose-lg">
      <ContentDoc v-slot="{ doc }">
        <article class="flex flex-col justify-center items-center">
          <div
            class="w-full h-[300px] bg-cover rounded-3xl mb-8 bg-center"
            :style="{ backgroundImage: `url(${doc.image})` }"
          ></div>
          <!-- <p>{{ article.readingStats.text }}</p> -->
          <ContentRenderer :value="doc" class="max-w-4xl w-full" />
          <div class="w-full flex justify-between items-center mt-5">
            <ChunkNeighbor :path="prev._path" :title="prev.title" :dir="prev" />
            <ChunkNeighbor :path="next._path" :title="next.title" :dir="next" />
          </div>
        </article>
      </ContentDoc>
    </div>
  </main>
</template>

<style scoped>
::v-deep .content h1 {
  @apply font-bold lg:text-6xl sm:text-4xl my-5 font-serif text-2xl;
}
::v-deep .content h2 {
  @apply font-bold text-lg sm:text-xl my-3;
}
::v-deep .content h3 {
  @apply font-semibold text-[16px] my-3;
}
::v-deep .content p,
::v-deep .content ul {
  @apply ms-5;
}
::v-deep .content pre {
  @apply px-7 py-5  font-mono   rounded-lg bg-gray-950 overflow-auto text-sm  sm:text-[16px];
}
</style>
