<script setup>
const { isDark, toggleTheme } = useTheme();
const { t, locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { navLinks, profile, section } = useSiteData();
const otherLocale = computed(() => (locale.value === "ar" ? "en" : "ar"));
const otherLocalePath = computed(() => switchLocalePath(otherLocale.value) || localePath("/", otherLocale.value));
const route = useRoute();
const menuOpen = ref(false);
const scrolled = ref(false);

const isActive = (link) => link.to.endsWith("/blog") && /(^|\/)blog(\/|$)/.test(route.path);

const onScroll = () => {
  scrolled.value = window.scrollY > 24;
};

const onKey = (event) => {
  if (event.key === "Escape") menuOpen.value = false;
};

watch(menuOpen, (open) => {
  document.documentElement.style.overflow = open ? "hidden" : "";
});

watch(() => route.fullPath, () => {
  menuOpen.value = false;
});

onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onKey);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("keydown", onKey);
  document.documentElement.style.overflow = "";
});
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-header transition-shadow duration-300"
    :class="(scrolled || menuOpen) && 'shadow-[0_1px_0_oklch(var(--line)/0.1)]'"
  >
    <div class="absolute inset-0 -z-10 bg-bg/85 backdrop-blur-md" aria-hidden="true" />
    <a
      href="#main"
      class="absolute left-4 top-3 -translate-y-20 rounded-full bg-sun px-4 py-2 text-sm font-semibold text-on-sun focus:translate-y-0"
    >
      {{ t("nav.skip") }}
    </a>

    <nav class="shell flex h-16 items-center justify-between gap-6 md:h-20" :aria-label="t('nav.main')">
      <NuxtLink :to="localePath('/')" class="group flex items-center gap-3" :aria-label="t('nav.home', { name: profile.name })">
        <span class="grid h-9 w-9 place-items-center rounded-full bg-sun text-on-sun">
          <span class="wide text-sm font-black leading-none">H</span>
        </span>
        <span class="hidden text-[0.95rem] font-semibold leading-tight sm:block">
          {{ profile.name }}
        </span>
      </NuxtLink>

      <div class="flex items-center gap-1 md:gap-2">
        <ul class="hidden items-center md:flex">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors duration-200 hover:text-ink"
              :class="isActive(link) ? 'text-ink' : 'text-muted'"
              :aria-current="isActive(link) ? 'page' : undefined"
            >
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>

        <a
          :href="`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(t('whatsappGreeting'))}`"
          target="_blank"
          rel="noopener"
          class="grid h-11 w-11 place-items-center rounded-full text-lg text-muted transition-colors hover:bg-raised hover:text-[#25D366]"
          :aria-label="t('nav.whatsapp')"
        >
          <UiIcon name="WhatsApp" />
        </a>

        <button
          type="button"
          class="grid h-11 w-11 place-items-center rounded-full text-lg text-muted transition-colors hover:bg-raised hover:text-ink"
          :aria-label="t('nav.theme')"
          :aria-pressed="isDark"
          @click="toggleTheme"
        >
          <UiIcon name="sun" class="hidden dark:block" />
          <UiIcon name="moon" class="dark:hidden" />
        </button>

        <NuxtLink
          :to="otherLocalePath"
          class="grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-semibold text-muted transition-colors hover:bg-raised hover:text-ink"
          :lang="otherLocale"
          :hreflang="otherLocale"
          :aria-label="t('nav.switchLangLabel')"
        >
          {{ t("nav.switchLang") }}
        </NuxtLink>

        <NuxtLink :to="section('#contact')" class="btn-sun ms-1 hidden px-5 py-2.5 text-sm md:inline-flex">
          {{ t("nav.start") }}
        </NuxtLink>

        <button
          type="button"
          class="grid h-11 w-11 place-items-center rounded-full text-xl transition-colors hover:bg-raised md:hidden"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          :aria-label="menuOpen ? t('nav.closeMenu') : t('nav.openMenu')"
          @click="menuOpen = !menuOpen"
        >
          <UiIcon :name="menuOpen ? 'close' : 'menu'" />
        </button>
      </div>
    </nav>

    <Transition name="sheet">
      <div
        v-show="menuOpen"
        id="mobile-menu"
        class="fixed inset-x-0 bottom-0 top-16 z-overlay flex flex-col bg-bg px-4 pb-8 pt-6 md:hidden"
      >
        <ul class="flex flex-col">
          <li v-for="link in navLinks" :key="link.to" class="border-b border-line/10">
            <NuxtLink
              :to="link.to"
              class="wide flex items-center justify-between py-5 text-3xl font-extrabold tracking-tight"
              @click="menuOpen = false"
            >
              {{ link.title }}
              <UiIcon name="arrow-right" class="flip-rtl text-xl text-muted" />
            </NuxtLink>
          </li>
        </ul>
        <NuxtLink :to="section('#contact')" class="btn-sun mt-auto w-full py-4 text-base" @click="menuOpen = false">
          {{ t("nav.start") }}
        </NuxtLink>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s var(--ease-out), transform 0.35s var(--ease-out);
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
  transform: translateY(-0.75rem);
}
</style>
