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

    if (scrolledUntil > 90) {
      showSeeMore.value = true;
      const newArticles = await queryContent("blog")
        .limit(10)
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
  <section class="flex flex-col justify-center items-center gap-14 mt-10">
    <h4
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
        <a :href="article._path" @click="scrollToTop" :alt="article.title">
          <div
            class="bg-cover w-full h-40 rounded-ss-lg rounded-tr-lg"
            :style="{ backgroundImage: `url(${article.image})` }"
          ></div>
          <div class="mx-1 flex flex-col justify-center gap-2 py-4">
            <h1 class="text-[16px] font-bold">
              {{ article.title }}
            </h1>
            <time class="flex gap-1 items-center" :datetime="article.createdAt">
              <IconsDate class="w-4 h-4" /> {{ useFormatDate(article.createdAt) }}
            </time>
          </div>
        </a>
      </article>
      <LazyIconsCube v-show="!showSeeMore" :class="{ 'opacity-0': showSeeMore }" />
    </div>
  </section>
</template>
