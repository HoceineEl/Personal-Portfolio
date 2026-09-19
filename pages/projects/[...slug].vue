<script setup>
import { findProject, projects, profile } from "~/assets/constants";

const route = useRoute();
const path = route.path.replace(/\/$/, "");

const { data: doc } = await useAsyncData(`project-${path}`, () => queryContent(path).findOne());

if (!doc.value) {
  throw createError({ statusCode: 404, statusMessage: "Project not found", fatal: true });
}

const meta = findProject(path) || { name: doc.value.title, tagline: doc.value.description, url: path, image: doc.value.image };
const index = projects.indexOf(meta);
const next = projects[(index + 1) % projects.length];

const links = [
  meta.demo && { label: meta.demo.includes("youtu") ? "Watch the demo" : "Visit the live site", href: meta.demo, primary: true },
  meta.chrome && { label: "Chrome Web Store", href: meta.chrome },
  meta.firefox && { label: "Firefox Add-ons", href: meta.firefox },
  meta.source && { label: "Source code", href: meta.source },
].filter(Boolean);

const url = absoluteUrl(path);

usePageSeo({
  title: `${meta.name}: ${meta.tagline}`,
  description: meta.description || doc.value.description,
  path,
  image: meta.image || doc.value.image,
});

useJsonLd([
  {
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: meta.name,
    headline: `${meta.name}: ${meta.tagline}`,
    description: meta.description || doc.value.description,
    url,
    dateCreated: doc.value.createdAt,
    keywords: (meta.stack || doc.value.tags || []).join(", "),
    creator: { "@id": `${absoluteUrl("/")}#person`, "@type": "Person", name: profile.name },
    ...(meta.demo && !meta.demo.includes("youtu") ? { sameAs: meta.demo } : {}),
  },
  breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: meta.name, path },
  ]),
]);
</script>

<template>
  <article class="pb-24 pt-28 md:pt-36">
    <header class="shell">
      <nav class="text-sm text-muted" aria-label="Breadcrumb">
        <NuxtLink to="/projects" class="transition-colors hover:text-ink">Projects</NuxtLink>
      </nav>
      <div class="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
        <div class="lg:col-span-8">
          <h1 class="wide text-display-xl font-black">{{ meta.name }}</h1>
          <p class="mt-5 max-w-2xl text-xl leading-relaxed text-muted">{{ meta.description || doc.description }}</p>
        </div>
        <dl class="grid grid-cols-2 gap-x-6 gap-y-4 text-[0.95rem] lg:col-span-4">
          <div v-if="meta.year">
            <dt class="text-muted">Year</dt>
            <dd class="mt-1 font-semibold tabular-nums">{{ meta.year }}</dd>
          </div>
          <div v-if="meta.role">
            <dt class="text-muted">Role</dt>
            <dd class="mt-1 font-semibold">{{ meta.role }}</dd>
          </div>
          <div v-if="meta.stack" class="col-span-2">
            <dt class="text-muted">Built with</dt>
            <dd class="mt-1 font-semibold">{{ meta.stack.join(", ") }}</dd>
          </div>
        </dl>
      </div>

      <ul v-if="links.length" class="mt-8 flex flex-wrap gap-3">
        <li v-for="link in links" :key="link.href">
          <a :href="link.href" target="_blank" rel="noopener" :class="link.primary ? 'btn-sun' : 'btn-ghost'">
            {{ link.label }} <UiIcon name="arrow-up-right" />
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
      <NuxtLink :to="next.url" class="group grid gap-8 border-t border-line/15 pt-10 md:grid-cols-12 md:items-center">
        <div class="md:col-span-5">
          <p class="text-sm text-muted">Next project</p>
          <p class="wide mt-3 text-display-md font-black transition-colors group-hover:text-sun-ink">{{ next.name }}</p>
          <p class="mt-2 text-muted">{{ next.tagline }}</p>
        </div>
        <ProjectCover :project="next" class="md:col-span-7" />
      </NuxtLink>
    </footer>
  </article>
</template>
