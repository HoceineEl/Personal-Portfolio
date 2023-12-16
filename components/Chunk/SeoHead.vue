<script setup>
const { page } = defineProps(["page"]);
let keywords = "";

for (let i = 0; i < page.tags.length; i++) {
  keywords += page.tags[i];

  // Add a comma between keywords, excluding the last one
  if (i < page.tags.length - 1) {
    keywords += ", ";
  }
}
useSeoMeta({
  title: page.title,
  description: page.description,
  ogTitle: page.title,
  ogDescription: page.description,
  ogType: "page",
  ogImageAlt: page.title,
  ogUrl: `https://hoceine.com${page._path}`,
  ogImage: "https://hoceine.com" + page.image,
  twitterCard: "summary_large_image",
  twitterCreator: "@HoceineElidrisi",
  twitterDescription: page.description,
  twitterTitle: page.title,
  twitterImage: "https://hoceine.com" + page.image,
  keywords: keywords,
  pageSection: "Technology",
  pagePublishedTime: page.createdAt,
  pageAuthor: "Hoceine EL IDRISSI",
});
</script>
<template></template>
