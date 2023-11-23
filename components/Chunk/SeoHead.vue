<script setup>
const { article } = defineProps(["article"]);
useSeoMeta({
  title: article.title,
  description: article.description,
  ogTitle: article.title,
  ogDescription: article.description,
  ogType: "article",
  ogImageAlt: article.title,
  ogUrl: `https://hoceine.vercel.app${article._path}`,
  ogImage: article.image,
  twitterCard: "summary_large_image",
  twitterCreator: "@HoceineElidrisi",
  twitterDescription: article.description,
  twitterTitle: article.title,
  twitterImage: article.image,
  keywords: article.tags,
  articleSection: "Technology",
  articlePublishedTime: article.createdAt,
  articleAuthor: "Hoceine EL IDRISSI",
});
console.log(article.createdAt);
</script>
<template></template>
