<script setup>
import { hoceine } from "~/assets";

const { prev, next, toc } = useContent();

console.log("article entered");
</script>
<template>
  <ContentDoc v-slot="{ doc }">
    <article class="flex flex-col justify-center items-center">
      <div
        class="w-full h-[400px] bg-cover rounded-3xl mb-8 bg-center"
        :style="{ backgroundImage: `url(${doc.image})` }"
      ></div>
      <div class="mx-4 flex flex-col justify-center gap-4 py-4">
        <h1
          class="lg:text-6xl font-extrabold sm:text-3xl mt-10 mb-4 text-2xl text-gradient hover:bg-gradient-to-l transition-all duration-400 py-5"
        >
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
            <IconsDate class="w-4 h-4" /> {{ useFormatDate(doc.createdAt) }}
          </time>
          <p v-if="doc.minutes" class="flex gap-1 items-center">
            <IconsTime class="w-4 h-4" /> {{ doc.minutes }} min read
          </p>
        </div>
      </div>
      <span class="article-hr"></span>
      <div class="max-w-6xl w-full px-1 sm:px-0 content grid grid-cols-7">
        <ContentRenderer
          ref="content"
          :value="doc"
          class="col-span-full lg:col-span-5 nuxt-content"
        />
        <aside class="">
          <LazyToc :toc="toc" />
        </aside>
      </div>

      <LazyNeighbor :text="next" :prev="prev" />
    </article>
    <SeeMore :title="doc.title" />
  </ContentDoc>
</template>

<style>
.nuxt-content {
  @apply prose-gray  lg:prose-lg xl:prose-xl prose-img:rounded-xl prose-headings:underline prose-headings:font-poppins prose-headings:text-teal-300 prose-headings:font-semibold prose-p:text-slate-200 prose-img:mx-auto prose-pre:bg-gray-800 prose-li:list-disc prose-ul:ps-10;
}
/* .content h1 {
  @apply font-bold lg:text-2xl sm:text-xl my-5 font-serif text-xl;
}

.content h2 {
  @apply font-bold text-lg sm:text-xl my-3;
}

.content h3 {
  @apply font-semibold text-[16px] my-3;
}

.content {
  @apply text-[18px];
}
.content p,
.content li {
  @apply text-slate-100 break-words;
}

.content pre {
  @apply px-7 py-5 font-mono rounded-xl overflow-auto bg-gray-950 text-sm sm:text-[16px] my-5;
}


.content code {
  @apply w-full;
}

.content img {
  @apply mx-auto px-2;
} */
.content li a {
  @apply text-slate-400 text-[12px] transition-all duration-300;
}
.article-hr {
  @apply max-w-5xl w-full h-1 bg-[#1E1E3B];
}
.content aside {
  @apply sticky col-span-full lg:col-span-2 lg:ms-3 w-full pt-14;
}
.content aside .toc {
  @apply sticky top-10 lg:top-24 w-full;
}
</style>
