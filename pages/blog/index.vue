<script setup>
definePageMeta({
  layout: "blog",
});
//date format i like this dd-mm-yyyy
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};
</script>
<template>
  <main>
    <section
      class="section pt-32 flex flex-col justify-center items-center content-center gap-10"
    >
      <div>
        <h1 class="font-bold font-serif text-7xl mb-7">
          Hey there , <br />Step into my blog.
        </h1>
        <p class="max-w-4xl text-xl font-sans text-gray-300">
          Your source for tips, technologies, tools, and everything you need to level up
          your development skills. Explore, learn, and enhance your journey as a
          developer.
        </p>
      </div>
     
      <ContentList path="/blog" v-slot="{ list }">
        <article
          v-for="(article, index) in list"
          :key="article._path"
          class="max-w-3xl rounded-xl hover:bg-[#1E1E3B] hover:scale-[1.02] hover:-translate-y-2 transition-all duration-500 group"
        >
          <nuxt-link :href="article._path" class="flex flex-col sm:flex-row">
            <div
              class="h-56 sm:w-56 bg-cover text-center overflow-hidden group-hover:opacity-50 sm:rounded-bl-lg rounded-ss-lg rounded-tr-lg sm:rounded-tr-none mb-3 sm:mb-0"
              :style="{ backgroundImage: `url(${article.image})` }"
            ></div>
            <div class="mx-4 flex flex-col justify-center gap-4 py-4">
              <h2 class="text-lg font-bold font-serif">{{ article.title }}</h2>
              <p class="line-clamp-2 max-w-2xl text-sm">{{ article.description }}</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in article.tags"
                  class="px-2 bg-indigo-600 rounded-lg text-sm"
                >
                  {{ tag }}
                </span>
              </div>
              <div
                class="metadata flex gap-3 text-sm font-light text-slate-400 flex-wrap"
              >
                <p class="article-author">Hoceine EL IDRISSI</p>

                <time class="flex gap-1 items-center" :datetime="article.createdAt">
                  <IconsDate /> {{ formatDate(article.createdAt) }}
                </time>
                <p v-if="article.minutes">{{ article.minutes }} minutes</p>
              </div>
            </div>
          </nuxt-link>
        </article>
      </ContentList>
    </section>
  </main>
</template>

<style></style>
