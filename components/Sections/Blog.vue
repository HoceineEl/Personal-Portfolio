<script setup>
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

let fetched = ref(false);
let articles = ref([]); // Define the articles array

onMounted(() => {
  if (!fetched.value) {
    window.addEventListener("scroll", async () => {
      const wScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const windHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledUntil = (wScroll / windHeight) * 100;
      if (scrolledUntil > 60) {
        fetched.value = true;
        const newArticles = await queryContent("blog")
          .only(["title", "_path", "image", "createdAt", "description", "tags"])
          .limit(3)
          .find();
        articles.value = newArticles;
      }
    });
  }
});
</script>

<template>
  <section id="blog" class="section flex flex-col items-center" role="section">
    <div class="text-center mb-16">
      <h2 class="header">What I've Shared</h2>
      <h3 class="header-secondary">My Blog.</h3>
    </div>

    <section
      v-if="fetched"
      class="w-full flex flex-wrap justify-center items-center gap-10 px-2 sm:px-0"
      role="list"
    >
      <article
        v-for="article in articles"
        :key="article._path"
        class="w-full sm:w-80 rounded-xl bg-tertiary hover:scale-[1.02] hover:-translate-y-2 transition-all duration-500 pointer-events-none sm:pointer-events-auto"
        role="listitem"
      >
        <a :href="article._path" class="flex flex-col" :alt="article.title">
          <div
            class="w-full h-60 bg-cover overflow-hidden rounded-ss-lg rounded-tr-lg mb-3"
            :style="{ backgroundImage: `url(${article.image})` }"
            role="img"
            aria-label="Article Image"
          ></div>
          <div class="mx-4 flex flex-col justify-center gap-4 py-4">
            <h2 class="text-lg font-bold font-serif" role="heading">
              {{ article.title }}
            </h2>
            <p class="line-clamp-2 max-w-2xl text-sm" role="article-description">
              {{ article.description }}
            </p>
            <div class="flex flex-wrap gap-2" role="list">
              <span
                v-for="tag in article.tags"
                class="px-2 bg-teal-600 rounded-lg text-sm"
                role="listitem"
              >
                {{ tag }}
              </span>
            </div>
            <div
              class="metadata flex gap-3 text-sm font-light text-slate-400 flex-wrap"
              role="contentinfo"
            >
              <p class="article-author" role="author">Hoceine EL IDRISSI</p>
              <time
                class="flex gap-1 items-center"
                :datetime="article.createdAt"
                role="time"
              >
                <IconsDate class="w-4 h-4" aria-hidden="true" />
                {{ formatDate(article.createdAt) }}
              </time>
              <p
                v-if="article.minutes"
                class="flex gap-1 items-center"
                role="time-to-read"
              >
                <IconsTime class="w-4 h-4" aria-hidden="true" /> {{ article.minutes }} min
                read
              </p>
            </div>
          </div>
        </a>
      </article>
    </section>
    <IconsCube v-show="!fetched" />
    <NuxtLink
      :prefetch="false"
      to="/blog"
      class="px-6 py-3 flex gap-2 items-center bg-[#4a148c] font-semibold rounded-full text-lg w-fit mt-10 group"
      aria-label="See Inside Blog"
    >
      See Inside
      <IconsArrow
        class="-rotate-90 group-hover:translate-x-2 transition-all duration-300"
        aria-hidden="true"
      />
    </NuxtLink>
  </section>
</template>

<style scoped></style>
