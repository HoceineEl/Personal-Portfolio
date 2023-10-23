<script setup>
import { hoceine } from "~/assets";
definePageMeta({
  layout: "blog",
});
const { prev, next, toc } = useContent();
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};
</script>
<template>
  <main class="relative">
    <div class="section max-w-7xl mt-20 prose md:prose-lg lg:prose-lg">
      <ContentDoc v-slot="{ doc }">
        <article class="flex flex-col justify-center items-center">
          <div
            class="w-full h-[400px] bg-cover rounded-3xl mb-8 bg-center"
            :style="{ backgroundImage: `url(${doc.image})` }"
          ></div>
          <div class="mx-4 flex flex-col justify-center gap-4 py-4">
            <h1 class="lg:text-6xl font-extrabold sm:text-3xl mt-10 mb-4 text-2xl">
              {{ doc.title }}
            </h1>
            <p class="sm:text-lg text-sm text-gray-400 px-0 sm:px-10">
              {{ doc.description }}
            </p>
            <div class="flex flex-wrap gap-2 px-0 sm:px-10">
              <span
                v-for="tag in doc.tags"
                class="px-3 py-1 bg-teal-600 rounded-lg text-sm font-semibold"
              >
                {{ tag }}
              </span>
            </div>
            <div
              class="metadata px-0 sm:px-10 flex gap-5 font-semibold text-white text-[16px] flex-wrap"
            >
              <div class="flex gap-2 items-center">
                <img
                  :src="hoceine"
                  alt="Hoceine el idrissi picture"
                  loading="lazy"
                  class="w-10 h-10 rounded-full object-cover border-2 border-teal-700"
                />
                <p class="article-author">Hoceine El idrissi</p>
              </div>

              <time class="flex gap-1 items-center" :datetime="doc.createdAt">
                <IconsDate class="w-4 h-4" /> {{ formatDate(doc.createdAt) }}
              </time>
              <p v-if="doc.minutes" class="flex gap-1 items-center">
                <IconsTime class="w-4 h-4" /> {{ doc.minutes }} min read
              </p>
            </div>
          </div>
          <span class="article-hr"></span>
          <div class="max-w-6xl px-1 sm:px-0 content lg:grid lg:grid-cols-4">
            <aside class="aside md:col-span-1 pt-14 mx-3 order-2">
              <ChunkToc :toc="toc" />
            </aside>
            <ContentRenderer :value="doc" class="col-span-3" />
          </div>

          <ChunkNeighbor :next="next" :prev="prev" />
        </article>
      </ContentDoc>
    </div>
  </main>
</template>

<style>
.content h1 {
  @apply font-bold lg:text-2xl sm:text-xl my-5 font-serif text-xl;
}
.content h2 {
  @apply font-bold text-lg sm:text-xl my-3;
}
.content h3 {
  @apply font-semibold text-[16px] my-3;
}
.content p,
.content ul {
  @apply ms-1 md:ms-5;
}
.content p,
.content li {
  @apply text-slate-300;
}
.content pre {
  @apply px-7 py-5  font-mono   rounded-lg bg-gray-950 overflow-auto text-sm  sm:text-[16px];
}
.article-hr {
  @apply max-w-5xl w-full h-1 bg-[#1E1E3B];
}
.aside .toc {
  @apply lg:sticky top-24;
}
</style>
