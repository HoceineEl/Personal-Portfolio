<script setup>
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
import { SITE_URL, profile } from "~/assets/constants";

defineRobotMeta();

const route = useRoute();
const { initTheme } = useTheme();

useHead({
  titleTemplate: (title) => (title ? `${title} · ${profile.name}` : `${profile.name} · ${profile.role}`),
  htmlAttrs: { lang: "en" },
  meta: [
    { name: "google-site-verification", content: "4AxK4N9GEIAr7luoQ-C4sMlPs-3TtU52SAy-r07bN84" },
    { name: "theme-color", content: "#171512", media: "(prefers-color-scheme: dark)" },
    { name: "theme-color", content: "#fbfbfb", media: "(prefers-color-scheme: light)" },
  ],
  link: [
    { rel: "canonical", href: () => `${SITE_URL}${route.path === "/" ? "" : route.path.replace(/\/$/, "")}` },
    { rel: "alternate", type: "application/rss+xml", title: `${profile.name} · Writing`, href: "/rss.xml" },
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
    <SpeedInsights />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
