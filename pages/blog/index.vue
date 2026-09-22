<script setup>
definePageMeta({ i18n: { locales: ["en"] } });

const route = useRoute();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const PER_PAGE = 12;

const { data: posts } = await useAsyncData(`blog-index-${locale.value}`, () =>
  queryCollection("blog")
    .select("title", "path", "description", "createdAt", "tags", "minutes")
    .order("createdAt", "DESC")
    .all()
);

const topics = computed(() => {
  const counts = {};
  for (const post of posts.value || []) {
    for (const tag of post.tags || []) counts[tag] = (counts[tag] || 0) + 1;
  }
  return Object.entries(counts)
    .filter(([, count]) => count > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);
});

const activeTopic = computed(() => route.query.topic || "");
const page = computed(() => Math.max(1, parseInt(route.query.page) || 1));

const filtered = computed(() =>
  (posts.value || []).filter((post) => !activeTopic.value || post.tags?.includes(activeTopic.value))
);
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)));
const visible = computed(() => filtered.value.slice((page.value - 1) * PER_PAGE, page.value * PER_PAGE));
const latest = computed(() => posts.value?.[0]);
const showLatest = computed(() => !activeTopic.value && page.value === 1);

const pageLink = (target) => ({ query: { ...route.query, page: target > 1 ? target : undefined } });

const blogPath = localePath("/blog");

usePageSeo({
  title: t("blog.seoTitle"),
  description: t("blog.seoDescription", { count: posts.value?.length }),
  path: blogPath,
  image: "/images/blog/blog.webp",
  locale: locale.value,
});

useJsonLd([
  {
    "@type": "Blog",
    "@id": `${absoluteUrl(blogPath)}#blog`,
    url: absoluteUrl(blogPath),
    inLanguage: locale.value,
    name: "Hoceine El Idrissi · Writing",
    author: { "@id": `${absoluteUrl("/")}#person` },
    blogPost: (posts.value || []).slice(0, 20).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(post.path),
      datePublished: post.createdAt,
    })),
  },
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: t("blog.title"), path: blogPath },
  ]),
]);
</script>

<template>
  <div class="shell pb-24 pt-32 md:pt-40">
    <header class="grid gap-6 md:grid-cols-12 md:items-end">
      <h1 class="wide text-display-xl font-black md:col-span-7">{{ t("blog.title") }}</h1>
      <p class="max-w-md text-lg leading-relaxed text-muted md:col-span-5 md:justify-self-end">
        {{ t("blog.intro", { count: posts?.length }) }}
      </p>
    </header>

    <NuxtLink
      v-if="showLatest && latest"
      :to="latest.path"
      class="group relative mt-14 grid gap-8 overflow-hidden rounded-[2rem] bg-sun p-8 text-on-sun md:mt-20 md:grid-cols-12 md:p-12"
    >
      <div class="latest-light absolute inset-y-0 right-0 w-1/2" aria-hidden="true" />
      <div class="relative md:col-span-8">
        <p class="text-sm font-semibold">{{ t("blog.latest", { date: useFormatDate(latest.createdAt, "long", locale) }) }}</p>
        <h2 class="wide mt-4 text-display-md font-black">{{ latest.title }}</h2>
        <p class="mt-5 max-w-2xl text-lg leading-relaxed text-on-sun/80">{{ latest.description }}</p>
      </div>
      <div class="relative flex items-end md:col-span-4 md:justify-end">
        <span class="inline-flex items-center gap-2 rounded-full bg-on-sun px-5 py-3 font-semibold text-sun">
          {{ t("blog.read") }}
          <UiIcon name="arrow-right" class="flip-rtl transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </span>
      </div>
    </NuxtLink>

    <nav class="mt-14 flex flex-wrap gap-2" :aria-label="t('post.topics')">
      <NuxtLink
        :to="{ query: {} }"
        class="rounded-full px-4 py-2 text-[0.95rem] font-medium ring-1 ring-inset transition-colors"
        :class="!activeTopic ? 'bg-ink text-bg ring-ink' : 'text-muted ring-line/15 hover:text-ink'"
      >
        {{ t("blog.everything") }}
      </NuxtLink>
      <NuxtLink
        v-for="topic in topics"
        :key="topic"
        :to="{ query: { topic } }"
        class="rounded-full px-4 py-2 text-[0.95rem] font-medium ring-1 ring-inset transition-colors"
        :class="activeTopic === topic ? 'bg-ink text-bg ring-ink' : 'text-muted ring-line/15 hover:text-ink'"
      >
        {{ topic }}
      </NuxtLink>
    </nav>

    <div class="mt-8 border-t border-line/15">
      <PostRow v-for="post in visible" :key="post.path" :post="post" />
      <p v-if="!visible.length" class="py-16 text-lg text-muted">{{ t("blog.empty") }}</p>
    </div>

    <nav v-if="totalPages > 1" class="mt-12 flex items-center justify-between gap-4" :aria-label="t('blog.pagination')">
      <NuxtLink v-if="page > 1" :to="pageLink(page - 1)" class="btn-ghost">
        <UiIcon name="arrow-left" class="flip-rtl" /> {{ t("blog.newer") }}
      </NuxtLink>
      <span v-else />
      <p class="text-sm tabular-nums text-muted">{{ t("blog.page", { page, total: totalPages }) }}</p>
      <NuxtLink v-if="page < totalPages" :to="pageLink(page + 1)" class="btn-ghost">
        {{ t("blog.older") }} <UiIcon name="arrow-right" class="flip-rtl" />
      </NuxtLink>
      <span v-else />
    </nav>
  </div>
</template>

<style scoped>
.latest-light {
  background-image: repeating-linear-gradient(-32deg, oklch(var(--on-sun) / 0.08) 0 14px, transparent 14px 34px);
  mask-image: linear-gradient(90deg, transparent, black);
}
</style>
