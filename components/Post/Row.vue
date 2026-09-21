<script setup>
defineProps({
  post: { type: Object, required: true },
  showDescription: { type: Boolean, default: true },
});
</script>

<template>
  <article class="group relative grid gap-x-8 gap-y-2 border-b border-line/15 py-7 md:grid-cols-[9rem_1fr_auto]">
    <time :datetime="post.createdAt" class="font-mono text-sm tabular-nums text-muted md:pt-1.5">
      {{ useFormatDate(post.createdAt, "short") }}
    </time>
    <div class="min-w-0">
      <h3 class="text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-sun-ink md:text-[1.375rem]">
        <NuxtLink :to="post.path" class="after:absolute after:inset-0 after:content-['']">{{ post.title }}</NuxtLink>
      </h3>
      <p v-if="showDescription && post.description" class="mt-2 line-clamp-2 max-w-prose leading-relaxed text-muted">
        {{ post.description }}
      </p>
      <ul v-if="post.tags?.length" class="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted" aria-label="Topics">
        <li v-for="tag in post.tags.slice(0, 3)" :key="tag">#{{ tag.replace(/\s+/g, "") }}</li>
      </ul>
    </div>
    <p v-if="post.minutes" class="hidden whitespace-nowrap text-sm text-muted md:block md:pt-1.5">{{ post.minutes }} min read</p>
  </article>
</template>
