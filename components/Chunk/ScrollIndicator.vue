<script setup>
const scrollProgress = ref(0);

const updateProgress = () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.value = (winScroll / height) * 100;
};

onMounted(() => {
  window.addEventListener('scroll', updateProgress);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress);
});
</script>

<template>
  <div class="fixed top-0 left-0 w-full h-1 z-[100] bg-surface-alt">
    <div
      class="h-full bg-neo-lime transition-all duration-100 ease-out"
      :style="{ width: `${scrollProgress}%` }"
    />
  </div>
</template>

<style scoped></style>
