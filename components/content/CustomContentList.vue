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
  <main class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
    <article
      v-for="article in articles"
      :key="article._path"
      class="group bg-surface border-3 border-border transition-all duration-300 hover:shadow-neo hover:-translate-x-1 hover:-translate-y-1"
      :aria-label="`Read more about ${article.title}`"
    >
      <a
        :href="article._path"
        class="flex flex-col h-full"
        :aria-label="`Read more about ${article.title}`"
      >
        <!-- Image Container -->
        <div class="relative overflow-hidden border-b-3 border-border">
          <NuxtPicture
            :img-attrs="{
              class: 'w-full h-56 object-cover transition-transform duration-500 group-hover:translate-x-1',
              alt: `${article.title} cover image`,
            }"
            :src="article.image"
            format="avif,webp"
          />
          <!-- Category Badge -->
          <div class="absolute top-3 left-3">
            <span class="px-3 py-1 bg-neo-lime text-neo-black border-2 border-neo-black font-mono text-xs uppercase font-bold">
              Article
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-col flex-grow p-5 gap-4">
          <h2 class="text-xl font-display font-bold text-text-primary leading-tight line-clamp-2 group-hover:text-neo-pink transition-colors">
            {{ article.title }}
          </h2>

          <p class="line-clamp-2 text-text-secondary text-sm leading-relaxed flex-grow">
            {{ article.description }}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in article.tags?.slice(0, 3)"
              :key="tag"
              class="px-2 py-1 bg-neo-purple/10 border-2 border-neo-purple text-neo-purple font-mono text-xs uppercase"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Metadata -->
          <div class="flex items-center gap-4 pt-3 border-t-2 border-border text-xs text-text-secondary font-mono">
            <span class="font-semibold text-neo-cyan">Hoceine</span>
            <time class="flex gap-1 items-center" :datetime="article.createdAt">
              <IconsDate class="w-4 h-4" /> {{ useFormatDate(article.createdAt) }}
            </time>
            <span v-if="article.minutes" class="flex gap-1 items-center">
              <IconsTime class="w-4 h-4" /> {{ article.minutes }}m
            </span>
          </div>
        </div>
      </a>
    </article>
  </main>
</template>

<style></style>
