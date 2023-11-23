<script setup>
definePageMeta({
  layout: "blog",
});
useSeoMeta({
  title: "My Amazing Site",
  ogTitle: "My Amazing Site",
  description: "This is my amazing site, let me tell you all about it.",
  ogDescription: "This is my amazing site, let me tell you all about it.",
  ogImage: "https://example.com/image.png",
  twitterCard: "summary_large_image",
});
</script>
<template>
  <main>
    <div
      class="2xl:max-w-7xl xl:max-w-6xl lg:max-w-4xl md:max-w-3xl xs:max-w-xl mx-auto py-6 px-2 xs:px-0 mt-20"
    >
      <LazyArticle />
    </div>
  </main>
</template>
