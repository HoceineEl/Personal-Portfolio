<script setup>
definePageMeta({
  layout: "blog",
});
</script>
<template>
  <main class="bg-primary">
    <ChunkBlogNavbar />
    <div class="section max-w-4xl content mt-20 prose md:prose-lg lg:prose-lg">
      <ContentDoc v-slot="{ doc }">
        <article>
          <h1 class="text-[30px]">{{ doc.title }}</h1>
          <img :src="doc.image" alt="" class="w-full object-cover max-h-80 rounded-xl" />
          <ContentRenderer :value="doc" />
        </article>
      </ContentDoc>
    </div>
  </main>
</template>

<style scoped>
::v-deep .content h1 {
  @apply font-bold text-xl my-5;
}
::v-deep .content h2 {
  @apply font-bold text-lg my-3;
}
::v-deep .content h3 {
  @apply font-semibold text-[16px] my-3;
}
::v-deep .content p,
::v-deep .content ul,
::v-deep .content pre {
  @apply ms-5;
}
::v-deep .content pre {
  @apply px-7 py-5 border border-slate-400 rounded-lg bg-gray-800;
}
</style>
