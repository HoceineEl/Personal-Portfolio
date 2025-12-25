<script setup>
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

// Color palette for blog articles
const colorPalette = [
  'bg-neo-pink',
  'bg-neo-orange',
  'bg-neo-lime',
  'bg-neo-purple',
  'bg-neo-cyan',
  'bg-neo-yellow',
  'bg-gradient-to-br from-neo-pink to-neo-orange',
  'bg-gradient-to-br from-neo-cyan to-neo-lime',
  'bg-gradient-to-br from-neo-purple to-neo-pink',
  'bg-gradient-to-br from-neo-orange to-neo-yellow',
];

// Get color based on article tags or title hash for variety
const getArticleColor = (article) => {
  const tags = article.tags || [];

  // Priority tag-based colors
  if (tags.includes('Livewire') || tags.includes('Livewire 4')) return 'bg-gradient-to-br from-neo-pink to-neo-purple';
  if (tags.includes('FilamentPHP') || tags.includes('Filament') || tags.includes('Filament v4')) return 'bg-neo-orange';
  if (tags.includes('Laravel 12')) return 'bg-gradient-to-br from-neo-pink to-neo-orange';
  if (tags.includes('SaaS')) return 'bg-gradient-to-br from-neo-cyan to-neo-lime';
  if (tags.includes('Multi-tenancy')) return 'bg-neo-purple';
  if (tags.includes('Testing') || tags.includes('Pest')) return 'bg-gradient-to-br from-neo-lime to-neo-cyan';
  if (tags.includes('Performance')) return 'bg-neo-yellow';
  if (tags.includes('Security')) return 'bg-gradient-to-br from-neo-purple to-neo-pink';
  if (tags.includes('API')) return 'bg-neo-cyan';
  if (tags.includes('Queues') || tags.includes('Horizon')) return 'bg-gradient-to-br from-neo-orange to-neo-pink';
  if (tags.includes('Database') || tags.includes('Eloquent')) return 'bg-neo-lime';
  if (tags.includes('Vue') || tags.includes('Nuxt')) return 'bg-lime-400';
  if (tags.includes('Laravel')) return 'bg-neo-pink';
  if (tags.includes('PHP')) return 'bg-neo-purple';

  // Fallback: use title hash for consistent but varied colors
  const hash = article.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorPalette[hash % colorPalette.length];
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
          .only(["title", "_path", "image", "noImage", "createdAt", "description", "tags"])
          .sort({ createdAt: -1 })
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
            <template v-if="article.noImage">
              <div
                class="w-full h-full flex flex-col items-center justify-center p-4 text-center relative overflow-hidden"
                :class="getArticleColor(article)"
              >
                <!-- Geometric patterns -->
                <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div class="absolute top-2 left-2 w-6 h-6 border-2 border-neo-black rounded-full"></div>
                  <div class="absolute bottom-3 right-3 w-10 h-10 border-2 border-neo-black rotate-45"></div>
                </div>

                <div class="w-14 h-14 mb-2 border-3 border-neo-black bg-white -rotate-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                  <span class="text-neo-black font-display font-black text-2xl">{{ article.title.charAt(0) }}</span>
                </div>

                <p class="font-display font-bold text-neo-black leading-tight uppercase tracking-tight text-xs px-2 py-1 bg-white border-2 border-neo-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] line-clamp-2 max-w-[90%]">
                  {{ article.title.split(':')[0].split('–')[0].substring(0, 25) }}
                </p>

                <!-- Floating elements -->
                <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-neo-lime border-2 border-neo-black rotate-12"></div>
              </div>
            </template>
            <NuxtPicture
              v-else
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
