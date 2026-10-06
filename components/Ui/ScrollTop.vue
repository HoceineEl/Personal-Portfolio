<script setup>
const { t } = useI18n();
const progress = ref(0);
const visible = ref(false);
const percent = computed(() => Math.round(progress.value * 100));

const update = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  visible.value = window.scrollY > 600;
};

const toTop = () => window.scrollTo({ top: 0 });

onMounted(() => {
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", update);
  window.removeEventListener("resize", update);
});
</script>

<template>
  <button
    type="button"
    class="scroll-top group fixed bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+4.5rem)] end-4 z-sticky grid h-14 w-14 place-items-center rounded-full bg-bg/85 text-ink shadow-[0_12px_30px_-10px_oklch(0_0_0/0.4)] backdrop-blur-md md:bottom-8 md:end-8"
    :class="visible ? 'is-visible' : 'pointer-events-none'"
    :tabindex="visible ? 0 : -1"
    :aria-label="t('footer.top')"
    @click="toTop"
  >
    <svg class="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="28" r="25" fill="none" stroke-width="2.5" class="stroke-line/15" />
      <circle
        cx="28"
        cy="28"
        r="25"
        fill="none"
        stroke-width="2.5"
        stroke-linecap="round"
        pathLength="100"
        stroke-dasharray="100"
        :stroke-dashoffset="100 - percent"
        class="stroke-sun-ink"
      />
    </svg>
    <span class="font-mono text-xs font-semibold tabular-nums transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0" dir="ltr" aria-hidden="true">
      {{ percent }}%
    </span>
    <UiIcon
      name="arrow-right"
      class="absolute -rotate-90 text-lg opacity-0 transition-[opacity,translate] duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
    />
  </button>
</template>

<style scoped>
.scroll-top {
  opacity: 0;
  translate: 0 1rem;
  transition: opacity 0.3s var(--ease-out), translate 0.4s var(--ease-out), background-color 0.2s;
}

.scroll-top.is-visible {
  opacity: 1;
  translate: 0 0;
}
</style>
