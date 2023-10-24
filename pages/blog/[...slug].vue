<script setup>
definePageMeta({
  layout: "blog",
});
</script>
<template>
  <main class="">
    <div
      class="2xl:max-w-7xl xl:max-w-6xl lg:max-w-4xl md:max-w-3xl xs:max-w-xl mx-auto py-6 px-2 xs:px-0 mt-20 prose md:prose-lg lg:prose-lg"
    >
      <ChunkArticle />
    </div>
  </main>
</template>

<style>
.content h1 {
  @apply font-bold lg:text-2xl sm:text-xl my-5 font-serif text-xl;
}
.content h2 {
  @apply font-bold text-lg sm:text-xl my-3;
}
.content h3 {
  @apply font-semibold text-[16px] my-3;
}
.content p,
.content ul {
  @apply ms-1 md:ms-5;
}
.content p,
.content li {
  @apply text-slate-300;
}
.content pre {
  @apply px-7 py-5  font-mono   rounded-lg bg-gray-950  text-sm  sm:text-[16px];
}
.article-hr {
  @apply max-w-5xl w-full h-1 bg-[#1E1E3B];
}
.content aside {
  @apply sticky col-span-full lg:col-span-1 ms-3   w-full  pt-14;
}
.content aside .toc {
  @apply sticky top-24 w-full;
}
</style>
