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
    <header>
      <ChunkBlogNavbar />
    </header>

    <section class="mt-20">
      <ContentList path="/blog" v-slot="{ list }">
        <article
          v-for="(article, index) in list"
          :key="article._path"
          class="article-card w-full sm:w-[353px] bg-indigo-950 rounded-lg"
        >
          <nuxt-link :href="article._path">
            <figure class="image-wrapper w-full h-72 rounded-se-lg overflow-hidden">
              <img
                :src="article.image"
                :alt="article.title"
                class="object-cover w-full h-72"
              />
            </figure>
            <div
              class="metadata p-4 flex justify-between text-sm font-light text-slate-500"
            >
              <time class="article-date" datetime="{{ article.createdAt }}">
                {{ formatDate(article.createdAt) }}
              </time>
              <p class="article-author">Hoceine EL IDRISSI</p>
            </div>
            <h2 class="article-title font-bold px-6 my-6">{{ article.title }}</h2>
          </nuxt-link>
        </article>
      </ContentList>
    </section>
  </main>
</template>

<style></style>
