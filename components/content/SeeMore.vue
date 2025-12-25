<script setup>
const showSeeMore = ref(false);
const articles = ref([]);
const { title } = defineProps(["title"]);

onBeforeMount(() => {
  window.addEventListener("scroll", handleScroll);

  async function handleScroll() {
    const wind = document.body.scrollTop || document.documentElement.scrollTop;
    const windHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolledUntil = (wind / windHeight) * 100;

    if (scrolledUntil > 90 && !showSeeMore.value) {
      showSeeMore.value = true;
      const newArticles = await queryContent("blog")
        .limit(3)
        .where({ title: { $ne: title } })
        .only(["title", "_path", "image", "createdAt"])
        .find();
      articles.value = newArticles;
      window.removeEventListener("scroll", handleScroll);
    }
  }
});

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
<template>
  <section
    class="flex flex-col justify-center items-center gap-10 mt-16 mb-12"
    aria-labelledby="related-articles-heading"
  >
    <!-- Section Header -->
    <div class="text-center">
      <span class="inline-block px-4 py-1 bg-neo-pink/10 border-2 border-neo-pink text-neo-pink font-mono text-xs uppercase mb-4">
        Related
      </span>
      <h4
        id="related-articles-heading"
        class="font-display text-2xl font-bold text-text-primary"
      >
        You may also like
      </h4>
    </div>

    <!-- Articles Grid -->
    <div class="flex flex-wrap gap-6 justify-center w-full">
      <template v-if="showSeeMore">
        <article
          v-for="article in articles"
          :key="article._path"
          class="w-64 bg-surface border-3 border-border group transition-all duration-300 hover:shadow-neo hover:-translate-x-1 hover:-translate-y-1"
        >
          <a
            :href="article._path"
            @click="scrollToTop"
            :alt="article.title"
            :aria-label="`Read more about ${article.title}`"
            class="block"
          >
            <!-- Image -->
            <div class="border-b-3 border-border overflow-hidden">
              <NuxtImg
                class="w-full h-40 object-cover transition-transform duration-500 group-hover:translate-x-1"
                :src="article.image"
                :quality="80"
                format="webp"
                loading="lazy"
                :alt="article.title"
              />
            </div>

            <!-- Content -->
            <div class="p-4 flex flex-col gap-3">
              <h5 class="font-display font-bold text-text-primary line-clamp-2 group-hover:text-neo-pink transition-colors">
                {{ article.title }}
              </h5>
              <time
                class="flex gap-2 items-center text-xs font-mono text-text-secondary"
                :datetime="article.createdAt"
              >
                <IconsDate class="w-4 h-4 text-neo-cyan" aria-hidden="true" />
                {{ useFormatDate(article.createdAt) }}
              </time>
            </div>
          </a>
        </article>
      </template>

      <!-- Loading State -->
      <div
        v-if="!showSeeMore"
        class="flex items-center justify-center gap-2 text-text-secondary font-mono text-sm"
      >
        <div class="w-2 h-2 bg-neo-lime animate-pulse"></div>
        <span>Scroll to discover more...</span>
      </div>
    </div>
  </section>
</template>
