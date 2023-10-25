<template>
  <LazyContentList path="/blog" v-slot="{ list }">
    <article
      v-for="article in list"
      :key="article._path"
      class="max-w-3xl rounded-xl hover:scale-[1.02] hover:-translate-y-2 transition-all duration-500 group hover:shadow-sm hover:shadow-white-100"
    >
      <nuxt-link :href="article._path" class="flex flex-col sm:flex-row">
        <div
          class="h-56 sm:w-64 bg-cover text-center overflow-hidden sm:rounded-bl-lg rounded-ss-lg rounded-tr-lg sm:rounded-tr-none mb-3 sm:mb-0"
          :style="{ backgroundImage: `url(${article.image})` }"
        ></div>
        <div class="mx-4 flex flex-col justify-center gap-4 py-4">
          <h2 class="text-lg font-bold font-serif">{{ article.title }}</h2>
          <p class="line-clamp-2 max-w-2xl text-sm">{{ article.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in article.tags"
              class="px-2 py-1 group-hover: transition-all duration-500 shadow-sm shadow-white-100 rounded-full text-sm"
            >
              {{ tag }}
            </span>
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
      </nuxt-link>
    </article>
  </LazyContentList>
</template>

<script setup></script>

<style></style>
