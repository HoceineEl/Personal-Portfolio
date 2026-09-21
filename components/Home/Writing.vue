<script setup>
const { t } = useI18n();
const { data } = await useAsyncData("home-writing", async () => {
  const [posts, count] = await Promise.all([
    queryCollection("blog")
      .select("title", "path", "description", "createdAt", "tags", "minutes")
      .order("createdAt", "DESC")
      .limit(5)
      .all(),
    queryCollection("blog").count(),
  ]);
  return { posts, count };
});
</script>

<template>
  <section class="shell py-20 md:py-32" aria-labelledby="writing-title">
    <div class="grid gap-6 md:grid-cols-12 md:items-end">
      <h2 id="writing-title" class="wide text-display-lg font-black md:col-span-7">{{ t("writing.title") }}</h2>
      <p class="max-w-md text-lg text-muted md:col-span-5 md:justify-self-end">
        {{ t("writing.intro", { count: data?.count }) }}
      </p>
    </div>

    <div class="mt-12 border-t border-line/15" lang="en" dir="ltr">
      <PostRow v-for="post in data?.posts" :key="post.path" :post="post" />
    </div>

    <NuxtLink to="/blog" class="btn-ghost group mt-10">
      {{ t("writing.all") }}
      <UiIcon name="arrow-right" class="flip-rtl transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
    </NuxtLink>
  </section>
</template>
