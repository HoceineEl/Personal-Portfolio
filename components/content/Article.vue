<script setup>
import { hoceine } from "~/assets";

const { prev, next, toc } = useContent();
</script>
<template>
  <ContentDoc v-slot="{ doc }">
    <LazyChunkSeoHead :article="doc" />
    <article
      class="flex flex-col justify-center items-center"
      role="article"
      aria-label="Article"
    >
      <NuxtPicture
        :imgAttrs="{
          class: 'w-full  h-[600px] object-cover rounded-3xl mb-8 object-center',
          alt: `${doc.title}  banner image`,
          role: 'img',
          ariaLabel: 'Article Image',
        }"
        :src="doc.banner"
        format="avif,webp"
      ></NuxtPicture>
      <div class="mx-4 flex flex-col justify-center gap-4 py-4">
        <h1
          class="lg:text-6xl font-extrabold sm:text-3xl mt-10 mb-4 text-2xl text-gradient hover:bg-gradient-to-l transition-all duration-400 py-5"
          role="heading"
          aria-level="1"
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
            role="tag"
          >
            {{ tag }}
          </span>
        </div>
        <div
          class="metadata px-0 sm:px-10 flex gap-5 font-semibold text-white text-[16px] flex-wrap"
          role="contentinfo"
        >
          <div class="flex gap-2 items-center">
            <NuxtImg
              :src="hoceine"
              alt="Hoceine el idrissi picture"
              loading="lazy"
              class="w-10 h-10 rounded-full object-cover border-2 border-teal-700"
              role="img"
              format="webp"
              quality="30"
              aria-label="Author's Picture"
            />
            <p class="article-author">Hoceine El idrissi</p>
          </div>

          <time class="flex gap-1 items-center" :datetime="doc.createdAt" role="time">
            <IconsDate class="w-4 h-4" /> {{ useFormatDate(doc.createdAt) }}
          </time>
          <p v-if="doc.minutes" class="flex gap-1 items-center" role="status">
            <IconsTime class="w-4 h-4" /> {{ doc.minutes }} min read
          </p>
        </div>
      </div>
      <span class="article-hr"></span>
      <div
        class="max-w-6xl px-1 sm:px-0 content grid grid-cols-7"
        role="group"
        aria-label="Article Content Group"
      >
        <ContentRenderer
          ref="content"
          :value="doc"
          class="col-span-full lg:col-span-5 nuxt-content"
          role="article"
          aria-label="Article Content"
        />
        <aside
          class="-order-2 lg:order-2"
          role="complementary"
          aria-label="Article Complementary Content"
        >
          <LazyToc :toc="toc" />
        </aside>
      </div>

      <LazyNeighbor :text="next" :prev="prev" />
    </article>
    <LazySeeMore :title="doc.title" />
  </ContentDoc>
</template>

<style>
.nuxt-content {
  @apply prose-gray  lg:prose-lg xl:prose-xl prose-img:rounded-xl prose-headings:underline prose-headings:font-poppins  prose-h1:text-teal-300 prose-h2:text-purple-500 prose-h3:text-teal-300 prose-h3:text-lg prose-h2:scroll-mt-56 prose-h3:scroll-mt-56 prose-headings:font-semibold prose-p:text-slate-200 prose-img:mx-auto prose-pre:bg-gray-800 prose-li:list-disc prose-ul:ps-10;
}

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
.content pre {
  @apply overflow-x-auto;
}
</style>
