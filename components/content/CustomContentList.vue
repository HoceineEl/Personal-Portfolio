<script setup>
const articles = await queryContent("blog").sort({ createdAt: -1 }).find();
let keywords = [];
let description =
  "Explore the insightful writings on technology, web development, and more on Hoceine EL IDRISSI's Blog.";
for (let i = 0; i < articles.length; i++) {
  keywords.push(articles[i].title);
}

useSeoMeta({
  title: "Hoceine EL IDRISSI | Blog",
  description: description,
  ogTitle: "Hoceine EL IDRISSI | Blog",
  ogDescription: description,
  ogType: "article",
  ogImageAlt: "Hoceine EL Idrissi's Blog",
  ogUrl: "https://hoceine.com/blog",
  ogImage: "https://hoceine.com/images/blog/blog.webp",
  ogImageWidth: 1427,
  ogImageHeight: 908,
  twitterCard: "summary_large_image",
  twitterCreator: "@HoceineElidrisi",
  twitterDescription: description,
  twitterTitle: "Hoceine EL IDRISSI | Blog",
  twitterImage: "https://hoceine.com/images/blog/blog.webp",
  keywords: () => keywords,
  articleSection: "Technology",
  articlePublishedTime: articles.length > 0 ? articles[0].createdAt : "",
  articleModifiedTime: articles.length > 0 ? articles[0].updatedAt : "",
  articleAuthor: "Hoceine EL IDRISSI",
  twitterImageHeight: 908,
  twitterImageWidth: 1427,
});
</script>

<template>
  <main class="w-full flex flex-wrap gap-20 justify-center items-start mt-20">
    <article
      v-for="article in articles"
      :key="article._path"
      v-motion-slide-visible-once-bottom
      class="max-w-sm rounded-xl transition-all duration-500 group hover:shadow-md hover:shadow-indigo-800"
      :aria-label="`Read more about ${article.title}`"
    >
      <a
        :href="article._path"
        class="flex flex-col"
        :aria-label="`Read more about ${article.title}`"
      >
        <NuxtPicture
          :img-attrs="{
            class:
              'w-full h-80 mx-auto object-cover text-center overflow-hidden rounded-tr-lg rounded-tl-lg mb-3 sm:mb-0',
            alt: `${article.title}  cover image`,
          }"
          :src="article.image"
          format="avif,webp"
        ></NuxtPicture>
        <div class="mx-4 flex flex-col justify-center gap-4 py-4">
          <h2 class="text-lg font-bold font-serif">{{ article.title }}</h2>
          <p class="line-clamp-2 max-w-2xl text-sm">{{ article.description }}</p>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="tag in article.tags"
              class="px-2 py-1 transition-all duration-500 shadow-sm shadow-white-100 rounded-full text-sm flex justify-center items-center"
            >
              {{ tag }}
            </div>
          </div>
          <div class="metadata flex gap-3 text-sm font-light text-slate-400 flex-wrap">
            <p class="article-author">Hoceine EL IDRISSI</p>

            <time class="flex gap-1 items-center" :datetime="article.createdAt">
              <IconsDate class="w-4 h-4" /> {{ useFormatDate(article.createdAt) }}
            </time>
            <p v-if="article.minutes" class="flex gap-1 items-center">
              <IconsTime class="w-4 h-4" /> {{ article.minutes }} min read
            </p>
          </div>
        </div>
      </a>
    </article>
  </main>
</template>

<style></style>
