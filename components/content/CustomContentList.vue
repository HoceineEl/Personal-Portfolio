<script setup>
const route = useRoute();
const router = useRouter();

// Pagination
const perPage = 9;
const currentPage = ref(parseInt(route.query.page) || 1);

const allArticles = await queryContent("blog").sort({ createdAt: -1 }).find();
const totalArticles = allArticles.length;
const totalPages = Math.ceil(totalArticles / perPage);

// Paginated articles
const articles = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return allArticles.slice(start, start + perPage);
});

// Navigate to page
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages) {
    currentPage.value = page;
    router.push({ query: { page } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
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
  if (tags.includes('PHP') || tags.includes('PHP 8.5')) return 'bg-neo-purple';
  if (tags.includes('WebSockets') || tags.includes('Reverb')) return 'bg-gradient-to-br from-neo-cyan to-neo-purple';
  if (tags.includes('Laravel')) return 'bg-neo-pink';

  // Fallback: use title hash for consistent but varied colors
  const hash = article.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorPalette[hash % colorPalette.length];
};

let keywords = [];
let description =
  "Explore the insightful writings on technology, web development, and more on Hoceine EL IDRISSI's Blog.";
for (let i = 0; i < allArticles.length; i++) {
  keywords.push(allArticles[i].title);
}

useSeoMeta({
  title: "Hoceine EL IDRISSI | Blog",
  description: description,
  ogTitle: "Hoceine EL IDRISSI | Blog",
  ogDescription: description,
  ogType: "article",
  ogImageAlt: "Hoceine EL Idrissi's Blog",
  ogUrl: "https://hoceine.com/blog",
  ogImage: "https://hoceine.com/images/blog/blog.webp",
  ogImageWidth: 1427,
  ogImageHeight: 908,
  twitterCard: "summary_large_image",
  twitterCreator: "@HoceineElidrisi",
  twitterDescription: description,
  twitterTitle: "Hoceine EL IDRISSI | Blog",
  twitterImage: "https://hoceine.com/images/blog/blog.webp",
  keywords: () => keywords,
  articleSection: "Technology",
  articlePublishedTime: allArticles.length > 0 ? allArticles[0].createdAt : "",
  articleModifiedTime: allArticles.length > 0 ? allArticles[0].updatedAt : "",
  articleAuthor: "Hoceine EL IDRISSI",
  twitterImageHeight: 908,
  twitterImageWidth: 1427,
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4">
    <!-- Articles count -->
    <div class="mb-8 flex items-center justify-between">
      <p class="text-text-secondary font-mono text-sm">
        Showing {{ (currentPage - 1) * perPage + 1 }}-{{ Math.min(currentPage * perPage, totalArticles) }} of {{ totalArticles }} articles
      </p>
    </div>

    <!-- Articles Grid -->
    <main class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article
        v-for="article in articles"
        :key="article._path"
        class="group bg-surface border-3 border-border transition-all duration-300 hover:shadow-neo hover:-translate-x-1 hover:-translate-y-1"
        :aria-label="`Read more about ${article.title}`"
      >
        <a
          :href="article._path"
          class="flex flex-col h-full"
          :aria-label="`Read more about ${article.title}`"
        >
          <!-- Image Container -->
          <div class="relative overflow-hidden border-b-3 border-border h-56">
            <template v-if="article.noImage">
              <div
                class="w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
                :class="getArticleColor(article)"
              >
                <!-- Geometric patterns -->
                <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div class="absolute top-2 left-2 w-8 h-8 border-2 border-neo-black rounded-full"></div>
                  <div class="absolute bottom-4 right-4 w-12 h-12 border-2 border-neo-black rotate-45"></div>
                  <div class="absolute top-1/2 left-4 w-6 h-1 border-b-2 border-neo-black"></div>
                </div>

                <div class="w-16 h-16 mb-3 border-4 border-neo-black bg-white -rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                  <span class="text-neo-black font-display font-black text-3xl">{{ article.title.charAt(0) }}</span>
                </div>

                <p class="font-display font-black text-neo-black leading-tight uppercase tracking-tighter text-sm px-2 bg-white border-2 border-neo-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] line-clamp-2">
                  {{ article.title.split(':')[0].split('–')[0].substring(0, 30) }}
                </p>

                <!-- Floating elements -->
                <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-neo-lime border-3 border-neo-black rotate-12"></div>
                <div class="absolute top-2 right-4 w-5 h-5 bg-white border-2 border-neo-black rounded-full"></div>
              </div>
            </template>
            <NuxtPicture
              v-else
              :img-attrs="{
                class: 'w-full h-full object-cover transition-transform duration-500 group-hover:translate-x-1',
                alt: `${article.title} cover image`,
              }"
              :src="article.image"
              format="avif,webp"
            />
            <!-- Category Badge -->
            <div class="absolute top-3 left-3">
              <span class="px-3 py-1 bg-neo-lime text-neo-black border-2 border-neo-black font-mono text-xs uppercase font-bold">
                Article
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="flex flex-col flex-grow p-5 gap-4">
            <h2 class="text-xl font-display font-bold text-text-primary leading-tight line-clamp-2 group-hover:text-neo-pink transition-colors">
              {{ article.title }}
            </h2>

            <p class="line-clamp-2 text-text-secondary text-sm leading-relaxed flex-grow">
              {{ article.description }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in article.tags?.slice(0, 3)"
                :key="tag"
                class="px-2 py-1 bg-neo-purple/10 border-2 border-neo-purple text-neo-purple font-mono text-xs uppercase"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Metadata -->
            <div class="flex items-center gap-4 pt-3 border-t-2 border-border text-xs text-text-secondary font-mono">
              <span class="font-semibold text-neo-cyan">Hoceine</span>
              <time class="flex gap-1 items-center" :datetime="article.createdAt">
                <IconsDate class="w-4 h-4" /> {{ useFormatDate(article.createdAt) }}
              </time>
              <span v-if="article.minutes" class="flex gap-1 items-center">
                <IconsTime class="w-4 h-4" /> {{ article.minutes }}m
              </span>
            </div>
          </div>
        </a>
      </article>
    </main>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="mt-12 flex justify-center" aria-label="Pagination">
      <div class="flex items-center gap-2">
        <!-- Previous -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 border-3 border-border bg-surface font-mono text-sm font-bold transition-all duration-200"
          :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5'"
        >
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </span>
        </button>

        <!-- Page Numbers -->
        <div class="flex items-center gap-1">
          <template v-for="page in totalPages" :key="page">
            <!-- Show first, last, current and neighbors -->
            <button
              v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
              @click="goToPage(page)"
              class="w-10 h-10 border-3 border-border font-mono text-sm font-bold transition-all duration-200"
              :class="page === currentPage
                ? 'bg-neo-pink text-neo-black shadow-neo'
                : 'bg-surface hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5'"
            >
              {{ page }}
            </button>
            <!-- Ellipsis -->
            <span
              v-else-if="page === currentPage - 2 || page === currentPage + 2"
              class="px-2 text-text-secondary"
            >
              ...
            </span>
          </template>
        </div>

        <!-- Next -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border-3 border-border bg-surface font-mono text-sm font-bold transition-all duration-200"
          :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5'"
        >
          <span class="flex items-center gap-2">
            Next
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>
    </nav>
  </div>
</template>

<style></style>
