<template>
  <div class="md:fixed flex md:flex-col gap-2 md:top-1/2 md:right-5">
    <SocialShare
      v-for="network in ['facebook', 'twitter', 'linkedin']"
      :key="network"
      :network="network"
      :styled="true"
      :label="false"
      :url="`https://hoceine.vercel.app${article._path}`"
      :title="article.title"
      :image="article.image"
      :hashtags="article.tags"
      class="p-2 rounded-full"
    />
  </div>
</template>

<script setup>
defineProps(["article"]);
</script>

<style scoped></style>
