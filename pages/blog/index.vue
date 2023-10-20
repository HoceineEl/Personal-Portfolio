<script setup>
definePageMeta({
  layout: "blog",
});

function formatDate(date) {
  return new Date(date).toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>
<template>
  <main class="">
    <ChunkBlogNavbar />

    <div class="section content mt-20 flex flex-wrap gap-10 justify-center">
      <!-- <div>
        <ContentQuery path="/blog" limit="1">
          <template #default="{ data }">
            <div>
              <img :src="data.image" :alt="data.title" />
              <h1>{{ data.title }}</h1>
            </div>
          </template>
        </ContentQuery>
      </div> -->
      <ContentList path="/blog" v-slot="{ list }">
        <div
          v-for="(article, index) in list"
          :key="article._path"
          class="w-full sm:w-[353px] bg-indigo-950 rounded-lg"
        >
          <nuxt-link :href="article._path">
            <img
              :src="article.image"
              :alt="article.title"
              class="w-full rounded-se-lg object-cover"
            />
            <div>
              <span>Posted: {{ formatDate(article.gitCreatedAt) }}</span>
            </div>
            <h2 class="font-bold px-6 my-6">{{ article.title }}</h2>
          </nuxt-link>
        </div>
      </ContentList>
    </div>
  </main>
</template>

<style></style>
