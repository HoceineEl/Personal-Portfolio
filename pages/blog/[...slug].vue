<script setup>
definePageMeta({
  layout: "blog",
});
</script>
<template>
  <main>
    <div
      class="2xl:max-w-7xl xl:max-w-6xl lg:max-w-4xl md:max-w-3xl xs:max-w-xl mx-auto py-6 px-2 xs:px-0 mt-20 prose md:prose-lg lg:prose-lg"
    >
      <LazyChunkArticle />
      <LazyChunkSeeMore />
    </div>
  </main>
</template>
