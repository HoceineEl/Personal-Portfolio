<script setup>
const showSeeMore = ref(false);
const otherArticles = ref([]); // Define the otherArticles array

console.log("otherArticles.value");
onBeforeMount(() => {
  if (!showSeeMore.value) {
    window.onscroll = async () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      if (scrolled > 90) {
        showSeeMore.value = true;
        const newArticles = await queryContent("blog")
          .limit(10)
          .only(["title", "_path", "image", "createdAt"])
          .find();
        otherArticles.value = newArticles;
      }
    };
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
        v-for="otherArticle in otherArticles"
        :key="otherArticle._path"
        class="w-52 border rounded-lg border-slate-500 p-2"
      >
        <nuxt-link :to="otherArticle._path" @click="scrollToTop">
          <div
            class="bg-cover w-full h-40 rounded-ss-lg rounded-tr-lg"
            :style="{ backgroundImage: `url(${otherArticle.image})` }"
          ></div>
          <div class="mx-1 flex flex-col justify-center gap-2 py-4">
            <h1 class="text-[16px] font-bold">
              {{ otherArticle.title }}
            </h1>
            <time class="flex gap-1 items-center" :datetime="otherArticle.createdAt">
              <IconsDate class="w-4 h-4" /> {{ useFormatDate(otherArticle.createdAt) }}
            </time>
          </div>
        </nuxt-link>
      </article>
      <LazyIconsCube v-if="false == showSeeMore" :class="{ 'opacity-0': showSeeMore }" />
    </div>
  </section>
</template>

<style></style>
