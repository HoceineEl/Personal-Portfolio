<script setup>
definePageMeta({
  layout: "blog",
});
</script>
<template>
  <main>
    <section class="section pt-32 flex flex-col items-center gap-10">
      <div>
        <h1 class="font-bold font-serif text-3xl sm:text-5xl md:text-7xl mb-7">
          Hey there , <br class="hidden sm:block" />Step into my blog.
        </h1>
        <p class="max-w-4xl text-xl font-sans text-gray-300">
          Your source for tips, technologies, tools, and everything you need to level up
          your development skills. Explore, learn, and enhance your journey as a
          developer.
        </p>
      </div>

      <CustomContentList />
    </section>
  </main>
</template>

<style></style>
