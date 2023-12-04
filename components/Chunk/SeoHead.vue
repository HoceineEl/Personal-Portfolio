<script setup>
const { page } = defineProps(["page"]);
useSeoMeta({
  title: page.title,
  description: page.description,
  ogTitle: page.title,
  ogDescription: page.description,
  ogType: "page",
  ogImageAlt: page.title,
  ogUrl: `https://hoceine.vercel.app${page._path}`,
  ogImage: page.image,
  twitterCard: "summary_large_image",
  twitterCreator: "@HoceineElidrisi",
  twitterDescription: page.description,
  twitterTitle: page.title,
  twitterImage: page.image,
  keywords: page.tags,
  pageSection: "Technology",
  pagePublishedTime: page.createdAt,
  pageAuthor: "Hoceine EL IDRISSI",
});
</script>
<template></template>
