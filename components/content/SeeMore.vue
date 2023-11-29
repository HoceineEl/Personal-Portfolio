<script setup>
const showSeeMore = ref(false);
const articles = ref([]); // Define the articles array
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
    class="flex flex-col justify-center items-center gap-14 mt-10"
    aria-labelledby="related-articles-heading"
  >
    <h4
      id="related-articles-heading"
      class="uppercase font-serif text-2xl text-gradient border-b-2 border-slate-400 pb-3 px-5"
    >
      You may also like
    </h4>

    <div class="flex flex-wrap gap-5 justify-center">
      <article
        v-if="showSeeMore"
        v-for="article in articles"
        :key="article._path"
        class="w-52 border rounded-lg border-slate-500 p-2"
      >
        <a
          :href="article._path"
          @click="scrollToTop"
          :alt="article.title"
          aria-label="Read more about {{ article.title }}"
        >
          <NuxtImg
            class="bg-cover w-full h-40 rounded-ss-lg rounded-tr-lg"
            :src="article.image"
            :quality="80"
            format="webp"
            loading="lazy"
          />
          <div class="mx-1 flex flex-col justify-center gap-2 py-4">
            <h1 class="text-[16px] font-bold">{{ article.title }}</h1>
            <time class="flex gap-1 items-center" :datetime="article.createdAt">
              <IconsDate class="w-4 h-4" aria-hidden="true" />
              {{ useFormatDate(article.createdAt) }}
            </time>
          </div>
        </a>
      </article>
      <IconsCube
        v-show="!showSeeMore"
        :class="{ 'opacity-0': showSeeMore }"
        aria-hidden="true"
      />
    </div>
  </section>
</template>
