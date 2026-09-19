<script setup>
import { profile } from "~/assets/constants";
</script>

<template>
  <a
    :href="`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent('Salaam Hoceine, ')}`"
    target="_blank"
    rel="noopener"
    class="fab fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-sticky grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-[1.75rem] text-white shadow-[0_12px_30px_-8px_oklch(0_0_0/0.45)] transition-transform duration-300 active:translate-y-0.5 md:hidden"
    aria-label="Message Hoceine on WhatsApp"
  >
    <UiIcon name="WhatsApp" />
  </a>
</template>

<style scoped>
.fab {
  animation: fab-in 0.6s var(--ease-out) 1.2s both;
}

@keyframes fab-in {
  from {
    opacity: 0;
    transform: translateY(1.5rem);
  }
}
</style>
