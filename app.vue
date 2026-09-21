<script setup>
import { SITE_URL, profile } from "~/assets/constants";

const route = useRoute();
const { initTheme } = useTheme();
const { profile: localProfile } = useSiteData();
const localeHead = useLocaleHead({ dir: true, lang: true, seo: true });

useHead({
  titleTemplate: (title) => (title ? `${title} · ${localProfile.value.name}` : `${localProfile.value.name} · ${localProfile.value.role}`),
  htmlAttrs: {
    lang: () => localeHead.value.htmlAttrs?.lang,
    dir: () => localeHead.value.htmlAttrs?.dir,
  },
  meta: [
    { name: "google-site-verification", content: "4AxK4N9GEIAr7luoQ-C4sMlPs-3TtU52SAy-r07bN84" },
    { name: "theme-color", content: "#171512", media: "(prefers-color-scheme: dark)" },
    { name: "theme-color", content: "#fbfbfb", media: "(prefers-color-scheme: light)" },
  ],
  link: () => [
    { rel: "canonical", href: `${SITE_URL}${route.path === "/" ? "" : route.path.replace(/\/$/, "")}` },
    localeHead.value.htmlAttrs?.lang === "ar"
      ? { rel: "alternate", type: "application/rss+xml", title: `${localProfile.value.name} · المقالات`, href: "/ar/rss.xml" }
      : { rel: "alternate", type: "application/rss+xml", title: `${profile.name} · Writing`, href: "/rss.xml" },
    ...(localeHead.value.link || []).filter((link) => link.rel === "alternate"),
  ],
  script: [{ innerHTML: themeBootScript, tagPosition: "head" }],
});

onMounted(() => {
  initTheme();
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="oklch(0.84 0.165 82)" :height="3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
