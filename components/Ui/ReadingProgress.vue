<script setup>
const progress = ref(0);

const update = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
};

onMounted(() => {
  update();
  window.addEventListener("scroll", update, { passive: true });
});

onUnmounted(() => window.removeEventListener("scroll", update));
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-0 z-toast h-[3px]" aria-hidden="true">
    <div class="h-full origin-left bg-sun" :style="{ transform: `scaleX(${progress})` }" />
  </div>
</template>
