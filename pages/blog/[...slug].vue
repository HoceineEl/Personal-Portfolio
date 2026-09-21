<script setup>
definePageMeta({ i18n: { locales: ["en"] } });

import { profile } from "~/assets/constants";

const route = useRoute();
const path = route.path.replace(/\/$/, "");
const fields = ["title", "path", "description", "createdAt", "tags", "minutes"];

const { data } = await useAsyncData(`post-${path}`, async () => {
  const [post, surround, pool] = await Promise.all([
    queryCollection("blog").path(path).first(),
    queryCollectionItemSurroundings("blog", path, { fields }).order("createdAt", "DESC"),
    queryCollection("blog").select(...fields).where("path", "<>", path).all(),
  ]);
  return { post, surround, pool };
});

if (!data.value?.post) {
  throw createError({ statusCode: 404, statusMessage: "Article not found", fatal: true });
}

const post = computed(() => data.value.post);
const [newer, older] = data.value.surround || [];

const related = computed(() => {
  const tags = new Set(post.value.tags || []);
  return (data.value.pool || [])
    .map((item) => ({ item, score: (item.tags || []).filter((tag) => tags.has(tag)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.item.createdAt) - new Date(a.item.createdAt))
    .slice(0, 3)
    .map(({ item }) => item);
});

const primaryTopic = post.value.tags?.[0];
const updated = post.value.updatedAt && post.value.updatedAt.slice(0, 10) !== post.value.createdAt?.slice(0, 10);
const shareUrl = absoluteUrl(post.value.path);
const shares = [
  { name: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.value.title)}&url=${encodeURIComponent(shareUrl)}&via=${profile.twitter.slice(1)}` },
  { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
];

usePageSeo({
  title: post.value.title,
  description: post.value.description,
  path: post.value.path,
  image: post.value.image,
  type: "article",
  publishedTime: post.value.createdAt,
  modifiedTime: post.value.updatedAt || post.value.createdAt,
  tags: post.value.tags,
});

useJsonLd([
  {
    "@type": "BlogPosting",
    "@id": `${shareUrl}#article`,
    headline: post.value.title,
    description: post.value.description,
    url: shareUrl,
    mainEntityOfPage: shareUrl,
    datePublished: post.value.createdAt,
    dateModified: post.value.updatedAt || post.value.createdAt,
    image: absoluteUrl(post.value.image || "/images/og.png"),
    keywords: (post.value.tags || []).join(", "),
    wordCount: post.value.wordCount,
    timeRequired: post.value.minutes ? `PT${post.value.minutes}M` : undefined,
    inLanguage: "en",
    author: { "@id": `${absoluteUrl("/")}#person`, "@type": "Person", name: profile.name, url: absoluteUrl("/") },
    publisher: { "@id": `${absoluteUrl("/")}#person` },
  },
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Writing", path: "/blog" },
    { name: post.value.title, path: post.value.path },
  ]),
]);
</script>

<template>
  <article class="pb-24 pt-28 md:pt-36">
    <UiReadingProgress />

    <header class="shell">
      <nav class="flex flex-wrap items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
        <NuxtLink to="/blog" class="transition-colors hover:text-ink">Writing</NuxtLink>
        <template v-if="primaryTopic">
          <span aria-hidden="true">/</span>
          <NuxtLink :to="{ path: '/blog', query: { topic: primaryTopic } }" class="transition-colors hover:text-ink">
            {{ primaryTopic }}
          </NuxtLink>
        </template>
      </nav>

      <h1 class="wide mt-6 max-w-5xl text-display-lg font-black">{{ post.title }}</h1>
      <p class="mt-6 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">{{ post.description }}</p>

      <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-line/15 py-4 text-[0.95rem]">
        <NuxtLink to="/#about" class="flex items-center gap-3">
          <NuxtImg :src="profile.photo" alt="" width="40" height="40" class="h-10 w-10 rounded-full object-cover object-top" />
          <span class="font-semibold">{{ profile.name }}</span>
        </NuxtLink>
        <time :datetime="post.createdAt" class="text-muted">{{ useFormatDate(post.createdAt) }}</time>
        <span v-if="updated" class="text-muted">Updated {{ useFormatDate(post.updatedAt) }}</span>
        <span v-if="post.minutes" class="text-muted">{{ post.minutes }} min read</span>
      </div>
    </header>

    <figure v-if="post.banner && !post.noImage" class="shell mt-10">
      <NuxtImg
        :src="post.banner"
        :alt="post.title"
        class="max-h-[34rem] w-full rounded-[2rem] bg-raised object-cover"
        sizes="xs:100vw xl:1280px"
        loading="eager"
      />
    </figure>

    <div class="shell mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <ContentRenderer :value="post" class="nuxt-content min-w-0" />

      <aside class="order-first lg:order-none">
        <div class="lg:sticky lg:top-28">
          <details class="rounded-2xl bg-raised p-5 lg:hidden">
            <summary class="cursor-pointer text-sm font-semibold">On this page</summary>
            <PostToc :links="post.body?.toc?.links || []" class="mt-2 [&>p]:hidden" />
          </details>
          <PostToc :links="post.body?.toc?.links || []" class="hidden max-h-[calc(100vh-10rem)] overflow-y-auto lg:block" />
        </div>
      </aside>
    </div>

    <footer class="shell mt-20">
      <div class="max-w-prose">
        <ul v-if="post.tags?.length" class="flex flex-wrap gap-2" aria-label="Topics">
          <li v-for="tag in post.tags" :key="tag">
            <NuxtLink :to="{ path: '/blog', query: { topic: tag } }" class="chip transition-colors hover:text-ink">{{ tag }}</NuxtLink>
          </li>
        </ul>

        <div class="mt-8 flex flex-wrap items-center gap-3 text-[0.95rem]">
          <span class="text-muted">Share</span>
          <a
            v-for="share in shares"
            :key="share.name"
            :href="share.href"
            target="_blank"
            rel="noopener"
            class="rounded-full px-4 py-2 font-medium ring-1 ring-inset ring-line/15 transition-colors hover:bg-ink hover:text-bg"
          >
            {{ share.name }}
          </a>
        </div>

        <div class="mt-12 flex gap-5 rounded-[2rem] bg-raised p-6 sm:p-8">
          <NuxtImg :src="profile.photo" alt="" width="64" height="64" class="h-16 w-16 shrink-0 rounded-full object-cover object-top" />
          <div>
            <p class="font-semibold">Written by {{ profile.name }}</p>
            <p class="mt-2 leading-relaxed text-muted">
              Full-stack web developer in Morocco building products with Laravel, Filament and Livewire.
              If you need someone who has already solved this kind of problem,
              <NuxtLink to="/#contact" class="link font-medium text-ink">let's talk</NuxtLink>.
            </p>
          </div>
        </div>
      </div>

      <nav v-if="newer || older" class="mt-16 grid gap-4 md:grid-cols-2" aria-label="More articles">
        <NuxtLink v-if="older" :to="older.path" class="group rounded-[1.5rem] p-6 ring-1 ring-inset ring-line/15 transition-colors hover:bg-raised">
          <span class="flex items-center gap-2 text-sm text-muted"><UiIcon name="arrow-left" /> Previous</span>
          <span class="mt-3 block text-lg font-semibold leading-snug">{{ older.title }}</span>
        </NuxtLink>
        <span v-else class="hidden md:block" />
        <NuxtLink v-if="newer" :to="newer.path" class="group rounded-[1.5rem] p-6 text-right ring-1 ring-inset ring-line/15 transition-colors hover:bg-raised">
          <span class="flex items-center justify-end gap-2 text-sm text-muted">Next <UiIcon name="arrow-right" /></span>
          <span class="mt-3 block text-lg font-semibold leading-snug">{{ newer.title }}</span>
        </NuxtLink>
      </nav>

      <section v-if="related.length" class="mt-20" aria-labelledby="related-title">
        <h2 id="related-title" class="wide text-display-sm font-extrabold">Keep reading</h2>
        <div class="mt-6 border-t border-line/15">
          <PostRow v-for="item in related" :key="item.path" :post="item" />
        </div>
      </section>
    </footer>
  </article>
</template>
