<script setup>
const articles = await queryContent("blog").limit(3).find();
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};
</script>
<template>
  <section class="section flex flex-col items-center">
    <div class="text-center mb-16">
      <p class="header">What I've Shared</p>
      <h3 class="header-secondary">My Blog.</h3>
    </div>
    <section
      class="w-full flex flex-wrap justify-center items-center gap-10 px-2 sm:px-0"
    >
      <article
        v-for="article in articles"
        :key="article._path"
        $VanillaTiltF
        data-tilt
        data-tilt-scale="1.03"
        class="w-full sm:w-80 rounded-xl bg-tertiary hover:scale-[1.02] hover:-translate-y-2 transition-all duration-500 pointer-events-none sm:pointer-events-auto"
      >
        <nuxt-link :href="article._path" class="flex flex-col">
          <div
            class="w-full h-60 bg-cover overflow-hidden rounded-ss-lg rounded-tr-lg mb-3"
            :style="{ backgroundImage: `url(${article.image})` }"
          ></div>
          <div class="mx-4 flex flex-col justify-center gap-4 py-4">
            <h2 class="text-lg font-bold font-serif">{{ article.title }}</h2>
            <p class="line-clamp-2 max-w-2xl text-sm">{{ article.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in article.tags"
                class="px-2 bg-teal-600 rounded-lg text-sm"
              >
                {{ tag }}
              </span>
            </div>
            <div class="metadata flex gap-3 text-sm font-light text-slate-400 flex-wrap">
              <p class="article-author">Hoceine EL IDRISSI</p>
              <time class="flex gap-1 items-center" :datetime="article.createdAt">
                <IconsDate class="w-4 h-4" /> {{ formatDate(article.createdAt) }}
              </time>
              <p v-if="article.minutes" class="flex gap-1 items-center">
                <IconsTime class="w-4 h-4" /> {{ article.minutes }} min read
              </p>
            </div>
          </div>
        </nuxt-link>
      </article>
    </section>
    <NuxtLink
      to="/blog"
      class="px-6 py-3 flex gap-2 items-center bg-main-violet font-semibold rounded-full text-lg w-fit mt-10 group"
      >See Inside
      <IconsArrow
        class="-rotate-90 group-hover:translate-x-2 transition-all duration-300"
    /></NuxtLink>
  </section>
</template>

<style scoped></style>
