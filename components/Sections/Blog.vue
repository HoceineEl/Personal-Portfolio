<script setup>
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

let fetched = ref(false);
let articles = ref([]);

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
  <section id="blog" class="section relative">
    <!-- Section header -->
    <div class="text-center mb-12">
      <span class="section-label">Articles</span>
      <h2 class="header-secondary">
        Latest
        <span class="relative inline-block">
          <span class="relative z-10">Blog</span>
          <span class="absolute -bottom-1 left-0 w-full h-3 bg-neo-orange -z-0 -rotate-1" />
        </span>
        Posts
      </h2>
      <p class="description mx-auto text-center mt-4">
        Thoughts, tutorials, and insights from my journey in web development
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="!fetched" class="flex justify-center py-16">
      <div class="w-16 h-16 border-4 border-border border-t-neo-lime animate-spin" />
    </div>

    <!-- Articles grid -->
    <div
      v-else
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <article
        v-for="article in articles"
        :key="article._path"
        class="neo-card overflow-hidden group"
      >
        <NuxtLink :to="article._path" class="block">
          <!-- Article image -->
          <div class="relative h-48 overflow-hidden border-b-3 border-border">
            <NuxtPicture
              :src="article.image"
              :img-attrs="{
                alt: article.title,
                class: 'w-full h-full object-cover',
              }"
              format="avif,webp"
              loading="lazy"
            />
          </div>

          <!-- Article content -->
          <div class="p-5">
            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="tag in article.tags?.slice(0, 2)"
                :key="tag"
                class="text-xs font-mono font-bold px-2 py-1 bg-neo-lime text-neo-black border-2 border-border"
              >
                {{ tag }}
              </span>
            </div>

            <h3 class="font-display font-bold text-lg mb-2 text-text-primary line-clamp-2">
              {{ article.title }}
            </h3>

            <p class="text-sm text-text-secondary mb-4 line-clamp-2">
              {{ article.description }}
            </p>

            <!-- Meta -->
            <div class="flex items-center gap-4 text-xs font-mono text-text-secondary">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Hoceine
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(article.createdAt) }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </article>
    </div>

    <!-- See more button -->
    <div class="flex justify-center mt-12">
      <NuxtLink
        to="/blog"
        :prefetch="false"
        class="neo-btn-primary"
      >
        <span>View All Posts</span>
        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped></style>
