<template>
  <div class="flex flex-col gap-3 md:fixed md:top-1/2 md:-translate-y-1/2 md:right-6">
    <span class="hidden md:block font-mono text-xs text-text-secondary uppercase tracking-wider mb-2">Share</span>
    <SocialShare
      v-for="network in ['facebook', 'twitter', 'linkedin']"
      :key="network"
      :network="network"
      :styled="false"
      :label="false"
      :url="`https://hoceine.com${article._path}`"
      :title="article.title"
      :image="article.image"
      :hashtags="article.tags"
      class="w-10 h-10 flex items-center justify-center bg-surface border-3 border-border transition-all duration-200 hover:shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5"
      :class="{
        'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]': network === 'facebook',
        'hover:bg-neo-black hover:text-white dark:hover:bg-white dark:hover:text-neo-black': network === 'twitter',
        'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]': network === 'linkedin'
      }"
    />
  </div>
</template>

<script setup>
defineProps(["article"]);
</script>

<style scoped></style>
