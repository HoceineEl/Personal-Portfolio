<script setup>
definePageMeta({
  layout: "blog",
});
</script>

<template>
  <main>
    <section class="section pt-32 flex flex-col items-center gap-10">
      <!-- Header -->
      <div class="text-center max-w-4xl">
        <span class="section-label">Articles</span>
        <h1 class="header-secondary mb-6">
          Welcome to my
          <span class="relative inline-block">
            <span class="relative z-10">Blog</span>
            <span class="absolute -bottom-1 left-0 w-full h-3 bg-neo-pink -z-0 -rotate-1" />
          </span>
        </h1>
        <p class="text-lg text-text-secondary leading-relaxed">
          Your source for tips, technologies, tools, and everything you need to level up
          your development skills. Explore, learn, and enhance your journey as a developer.
        </p>
      </div>

      <CustomContentList />
    </section>
  </main>
</template>

<style></style>
