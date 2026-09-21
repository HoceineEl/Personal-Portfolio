<script setup>
const route = useRoute();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const { projects, profile } = useSiteData();
const { projectsCollection, basePath } = useContentLocale();
const path = route.path.replace(/\/$/, "");
const enPath = basePath(path);

const { data: doc } = await useAsyncData(`project-${path}`, () => queryCollection(projectsCollection.value).path(path).first());

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: "Project not found", fatal: true });
}

const meta = computed(
  () => projects.value.find((project) => project.url === enPath) || { name: doc.value.title, tagline: doc.value.description, url: enPath, image: doc.value.image }
);
const next = computed(() => {
  const index = projects.value.findIndex((project) => project.url === enPath);
  return projects.value[(index + 1) % projects.value.length];
});

const links = computed(() =>
  [
    meta.value.demo && { label: meta.value.demo.includes("youtu") ? t("project.demo") : t("project.live"), href: meta.value.demo, primary: true },
    meta.value.chrome && { label: t("project.chrome"), href: meta.value.chrome },
    meta.value.firefox && { label: t("project.firefox"), href: meta.value.firefox },
    meta.value.source && { label: t("project.source"), href: meta.value.source },
  ].filter(Boolean)
);

const url = absoluteUrl(path);

usePageSeo({
  title: `${meta.value.name}: ${meta.value.tagline}`,
  description: meta.value.description || doc.value.description,
  path,
  image: meta.value.image || doc.value.image,
  locale: locale.value,
});

useJsonLd([
  {
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: meta.value.name,
    headline: `${meta.value.name}: ${meta.value.tagline}`,
    description: meta.value.description || doc.value.description,
    url,
    inLanguage: locale.value,
    dateCreated: doc.value.createdAt,
    keywords: (meta.value.stack || doc.value.tags || []).join(", "),
    creator: { "@id": `${absoluteUrl("/")}#person`, "@type": "Person", name: profile.value.name },
    ...(meta.value.demo && !meta.value.demo.includes("youtu") ? { sameAs: meta.value.demo } : {}),
  },
  breadcrumbSchema([
    { name: t("post.home"), path: localePath("/") },
    { name: t("projects.title"), path: localePath("/projects") },
    { name: meta.value.name, path },
  ]),
]);
</script>

<template>
  <article class="pb-24 pt-28 md:pt-36">
    <header class="shell">
      <nav class="text-sm text-muted" :aria-label="t('post.breadcrumb')">
        <NuxtLink :to="localePath('/projects')" class="transition-colors hover:text-ink">{{ t("projects.title") }}</NuxtLink>
      </nav>
      <div class="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
        <div class="lg:col-span-8">
          <h1 class="wide text-display-xl font-black">{{ meta.name }}</h1>
          <p class="mt-5 max-w-2xl text-xl leading-relaxed text-muted">{{ meta.description || doc.description }}</p>
        </div>
        <dl class="grid grid-cols-2 gap-x-6 gap-y-4 text-[0.95rem] lg:col-span-4">
          <div v-if="meta.year">
            <dt class="text-muted">{{ t("project.year") }}</dt>
            <dd class="mt-1 font-semibold tabular-nums">{{ meta.year }}</dd>
          </div>
          <div v-if="meta.role">
            <dt class="text-muted">{{ t("project.role") }}</dt>
            <dd class="mt-1 font-semibold">{{ meta.role }}</dd>
          </div>
          <div v-if="meta.stack" class="col-span-2">
            <dt class="text-muted">{{ t("project.builtWith") }}</dt>
            <dd class="mt-1 font-semibold" dir="ltr">{{ meta.stack.join(", ") }}</dd>
          </div>
        </dl>
      </div>

      <ul v-if="links.length" class="mt-8 flex flex-wrap gap-3">
        <li v-for="link in links" :key="link.href">
          <a :href="link.href" target="_blank" rel="noopener" :class="link.primary ? 'btn-sun' : 'btn-ghost'">
            {{ link.label }} <UiIcon name="arrow-up-right" class="flip-rtl" />
          </a>
        </li>
      </ul>
    </header>

    <div class="shell mt-12 md:mt-16">
      <ProjectCover :project="meta" eager class="!aspect-[16/9] md:!aspect-[21/9]" />
    </div>

    <div class="shell mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
      <ContentRenderer :value="doc" class="nuxt-content min-w-0" />
      <aside class="hidden lg:block">
        <PostToc :links="doc.body?.toc?.links || []" class="sticky top-28" />
      </aside>
    </div>

    <footer class="shell mt-24">
      <NuxtLink :to="localePath(next.url)" class="group grid gap-8 border-t border-line/15 pt-10 md:grid-cols-12 md:items-center">
        <div class="md:col-span-5">
          <p class="text-sm text-muted">{{ t("project.next") }}</p>
          <p class="wide mt-3 text-display-md font-black transition-colors group-hover:text-sun-ink">{{ next.name }}</p>
          <p class="mt-2 text-muted">{{ next.tagline }}</p>
        </div>
        <ProjectCover :project="next" class="md:col-span-7" />
      </NuxtLink>
    </footer>
  </article>
</template>
