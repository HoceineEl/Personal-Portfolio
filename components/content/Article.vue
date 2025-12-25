<script setup>
import { hoceine } from "~/assets";

const { prev, next, toc } = useContent();

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
const getArticleColor = (doc) => {
  const tags = doc.tags || [];

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
  const hash = doc.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorPalette[hash % colorPalette.length];
};
</script>
<template>
  <ContentDoc v-slot="{ doc }">
    <LazyChunkSeoHead :page="doc" />
    <article
      class="flex flex-col justify-center items-center"
      role="article"
      aria-label="Article"
    >
      <!-- Hero Banner -->
      <div class="relative w-full border-3 border-border overflow-hidden">
        <!-- Image placeholder for noImage articles -->
        <template v-if="doc.noImage || !doc.banner">
          <div
            class="w-full h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden"
            :class="getArticleColor(doc)"
          >
            <!-- Geometric patterns -->
            <div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div class="absolute top-8 left-8 w-24 h-24 border-4 border-neo-black rounded-full"></div>
              <div class="absolute bottom-12 right-12 w-32 h-32 border-4 border-neo-black rotate-45"></div>
              <div class="absolute top-1/3 right-1/4 w-16 h-16 border-4 border-neo-black"></div>
              <div class="absolute bottom-1/4 left-1/3 w-20 h-4 border-4 border-neo-black"></div>
            </div>

            <!-- Main content -->
            <div class="w-28 h-28 mb-6 border-4 border-neo-black bg-white -rotate-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <span class="text-neo-black font-display font-black text-6xl">{{ doc.title.charAt(0) }}</span>
            </div>

            <p class="font-display font-black text-neo-black leading-tight uppercase tracking-tighter text-xl px-4 py-2 bg-white border-3 border-neo-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-md">
              {{ doc.title.split(':')[0].split('–')[0].substring(0, 40) }}
            </p>

            <!-- Floating elements -->
            <div class="absolute -bottom-4 -right-4 w-16 h-16 bg-neo-lime border-4 border-neo-black rotate-12"></div>
            <div class="absolute top-6 right-12 w-10 h-10 bg-white border-3 border-neo-black rounded-full"></div>
            <div class="absolute bottom-8 left-8 w-8 h-8 bg-neo-cyan border-3 border-neo-black -rotate-12"></div>
          </div>
        </template>
        <template v-else>
          <NuxtPicture
            :imgAttrs="{
              class: 'w-full h-[500px] object-cover object-center',
              alt: `${doc.title} banner image`,
              role: 'img',
              ariaLabel: 'Article Image',
            }"
            :src="doc.banner"
            format="avif,webp"
          />
        </template>
        <div class="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
      </div>

      <!-- Article Header -->
      <div class="w-full max-w-4xl mx-auto px-4 -mt-20 relative z-10">
        <div class="bg-surface border-3 border-border p-8 shadow-neo">
          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tag in doc.tags"
              :key="tag"
              class="px-3 py-1 bg-neo-purple/10 border-2 border-neo-purple text-neo-purple font-mono text-xs uppercase font-bold"
              role="tag"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Title -->
          <h1
            class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary leading-tight mb-6"
            role="heading"
            aria-level="1"
          >
            <span class="relative inline">
              {{ doc.title }}
              <span class="absolute -bottom-2 left-0 w-full h-3 bg-neo-pink/30 -z-10 -rotate-1" />
            </span>
          </h1>

          <!-- Description -->
          <p class="text-lg text-text-secondary leading-relaxed mb-8">
            {{ doc.description }}
          </p>

          <!-- Author & Meta -->
          <div
            class="flex flex-wrap items-center gap-6 pt-6 border-t-3 border-border"
            role="contentinfo"
          >
            <div class="flex gap-3 items-center">
              <div class="w-12 h-12 border-3 border-border overflow-hidden">
                <NuxtImg
                  :src="hoceine"
                  alt="Hoceine el idrissi picture"
                  loading="lazy"
                  class="w-full h-full object-cover"
                  role="img"
                  format="webp"
                  quality="30"
                  aria-label="Author's Picture"
                />
              </div>
              <div>
                <p class="font-display font-bold text-text-primary">Hoceine El Idrissi</p>
                <p class="text-xs text-text-secondary font-mono">Full Stack Developer</p>
              </div>
            </div>

            <div class="flex items-center gap-4 text-sm text-text-secondary font-mono">
              <time class="flex gap-2 items-center" :datetime="doc.createdAt" role="time">
                <IconsDate class="w-4 h-4 text-neo-cyan" /> {{ useFormatDate(doc.createdAt) }}
              </time>
              <span v-if="doc.minutes" class="flex gap-2 items-center" role="status">
                <IconsTime class="w-4 h-4 text-neo-lime" /> {{ doc.minutes }} min read
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div
        class="w-full max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-7 gap-8"
        role="group"
        aria-label="Article Content Group"
      >
        <!-- Main Content -->
        <ContentRenderer
          ref="content"
          :value="doc"
          class="col-span-full lg:col-span-5 nuxt-content"
          role="article"
          aria-label="Article Content"
        />

        <!-- Sidebar -->
        <aside
          class="-order-2 lg:order-2 col-span-full lg:col-span-2"
          role="complementary"
          aria-label="Article Complementary Content"
        >
          <LazyToc :toc="toc" />
        </aside>
      </div>

      <!-- Share & Navigation -->
      <div class="w-full max-w-4xl mx-auto px-4 mt-12">
        <ShareSocial :article="doc" />
        <LazyNeighbor :text="next" :prev="prev" />
      </div>
    </article>

    <div class="max-w-4xl mx-auto px-4">
      <LazySeeMore :title="doc.title" />
    </div>
  </ContentDoc>
</template>

<style>
.nuxt-content {
  @apply prose prose-lg max-w-none prose-invert;
}

/* Headings */
.nuxt-content h1,
.nuxt-content h2,
.nuxt-content h3,
.nuxt-content h4 {
  @apply font-display font-bold scroll-mt-24;
  color: var(--color-text-primary);
}

.nuxt-content h2 {
  @apply text-2xl sm:text-3xl mt-12 mb-6 pb-3;
  border-bottom: 3px solid #8B5CF6;
}

.nuxt-content h3 {
  @apply text-xl sm:text-2xl mt-8 mb-4;
  color: #00D4FF;
}

.nuxt-content h4 {
  @apply text-lg sm:text-xl mt-6 mb-3;
  color: #CCFF00;
}

/* Paragraphs */
.nuxt-content p {
  @apply leading-relaxed mb-6;
  color: var(--color-text-secondary);
}

/* Links */
.nuxt-content a:not(h2 a):not(li a):not(h3 a):not(h1 a):not(h4 a):not(h5 a):not(h6 a) {
  color: #FF2E63;
  font-weight: 600;
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
}

.nuxt-content a:not(h2 a):not(li a):not(h3 a):not(h1 a):not(h4 a):not(h5 a):not(h6 a):hover {
  color: #CCFF00;
}

/* Images */
.nuxt-content img {
  @apply my-8;
  border: 3px solid var(--color-border);
  box-shadow: 4px 4px 0px var(--color-border);
}

/* Code blocks */
.nuxt-content pre {
  @apply my-8 overflow-x-auto rounded-none p-0;
  background: #0d1117 !important;
  border: 3px solid var(--color-border);
  box-shadow: 4px 4px 0px var(--color-border);
}

.nuxt-content pre code {
  @apply font-mono text-sm block p-4 overflow-x-auto;
  background: transparent !important;
  line-height: 1.7;
  tab-size: 2;
}

/* Inline code */
.nuxt-content :not(pre) > code {
  background: rgba(139, 92, 246, 0.15);
  color: #8B5CF6;
  padding: 2px 8px;
  border: 2px solid rgba(139, 92, 246, 0.3);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875em;
  font-weight: 500;
}

/* Code block with filename/language label */
.nuxt-content pre[class*="language-"]::before {
  content: attr(data-language);
  @apply absolute top-0 right-0 px-3 py-1 text-xs font-mono font-bold uppercase;
  background: #CCFF00;
  color: #0D0D0D;
  border-left: 3px solid var(--color-border);
  border-bottom: 3px solid var(--color-border);
}

/* Line highlighting */
.nuxt-content pre code .line.highlighted {
  background: rgba(204, 255, 0, 0.1);
  border-left: 3px solid #CCFF00;
  margin-left: -1rem;
  padding-left: calc(1rem - 3px);
  display: inline-block;
  width: calc(100% + 2rem);
}

/* Diff styling */
.nuxt-content pre code .line.diff.add {
  background: rgba(0, 212, 255, 0.1);
  border-left: 3px solid #00D4FF;
}

.nuxt-content pre code .line.diff.remove {
  background: rgba(255, 46, 99, 0.1);
  border-left: 3px solid #FF2E63;
}

/* Line numbers if enabled */
.nuxt-content pre code .line::before {
  content: counter(line);
  counter-increment: line;
  @apply inline-block w-8 mr-4 text-right opacity-40 select-none;
  color: var(--color-text-secondary);
}

/* Lists */
.nuxt-content ul {
  @apply list-disc pl-6 space-y-2 mb-6;
}

.nuxt-content ol {
  @apply list-decimal pl-6 space-y-2 mb-6;
}

.nuxt-content li {
  color: var(--color-text-secondary);
}

.nuxt-content li::marker {
  color: #CCFF00;
}

/* Blockquotes */
.nuxt-content blockquote {
  @apply pl-6 py-4 my-8 italic;
  border-left: 4px solid #CCFF00;
  background: rgba(204, 255, 0, 0.05);
  color: var(--color-text-secondary);
}

/* Tables */
.nuxt-content table {
  @apply w-full my-8;
  border: 3px solid var(--color-border);
}

.nuxt-content th {
  @apply font-display font-bold p-3 text-left;
  background: #CCFF00;
  color: #0D0D0D;
  border-bottom: 3px solid var(--color-border);
}

.nuxt-content td {
  @apply p-3;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.nuxt-content tr:hover td {
  background: rgba(139, 92, 246, 0.05);
}

/* Strong and emphasis */
.nuxt-content strong {
  color: var(--color-text-primary);
  font-weight: 700;
}

.nuxt-content em {
  color: #00D4FF;
}

/* Horizontal rule */
.nuxt-content hr {
  border: none;
  border-top: 3px solid var(--color-border);
  margin: 2rem 0;
}
</style>
