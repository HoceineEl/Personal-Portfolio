<script setup>
const { data } = await useAsyncData("home-writing", async () => {
  const [posts, count] = await Promise.all([
    queryContent("blog")
      .only(["title", "_path", "description", "createdAt", "tags", "minutes"])
      .sort({ createdAt: -1 })
      .limit(5)
      .find(),
    queryContent("blog").count(),
  ]);
  return { posts, count };
});
</script>

<template>
  <section class="shell py-20 md:py-32" aria-labelledby="writing-title">
    <div class="grid gap-6 md:grid-cols-12 md:items-end">
      <h2 id="writing-title" class="wide text-display-lg font-black md:col-span-7">Writing on Laravel &amp; Filament</h2>
      <p class="max-w-md text-lg text-muted md:col-span-5 md:justify-self-end">
        {{ data?.count }} articles on Laravel, Filament and Livewire. Long, practical, and written from real projects.
      </p>
    </div>

    <div class="mt-12 border-t border-line/15">
      <PostRow v-for="post in data?.posts" :key="post._path" :post="post" />
    </div>

    <NuxtLink to="/blog" class="btn-ghost group mt-10">
      Read all articles
      <UiIcon name="arrow-right" class="transition-transform duration-300 group-hover:translate-x-1" />
    </NuxtLink>
  </section>
</template>
