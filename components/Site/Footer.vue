<script setup>
import { socials } from "~/assets/constants";

const { t } = useI18n();
const localePath = useLocalePath();
const { navLinks, profile } = useSiteData();

const year = new Date().getFullYear();
const localTime = useLocalTime(() => profile.value.timezone);

const toTop = () => window.scrollTo({ top: 0 });
</script>

<template>
  <footer class="border-t border-line/10">
    <div class="shell grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-end md:py-16">
      <div>
        <p class="wide text-display-sm font-black">{{ profile.name }}</p>
        <p class="mt-2 max-w-md text-muted">
          {{ t("footer.about", { role: profile.role, place: profile.location }) }}
        </p>
        <a :href="`mailto:${profile.email}`" class="link mt-5 inline-block font-medium" dir="ltr">{{ profile.email }}</a>
      </div>

      <div class="flex flex-col gap-6 md:items-end">
        <ul class="flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem]">
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink :to="link.to" class="text-muted transition-colors hover:text-ink">{{ link.title }}</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('/projects')" class="text-muted transition-colors hover:text-ink">{{ t("footer.allProjects") }}</NuxtLink>
          </li>
        </ul>
        <ul class="flex gap-1">
          <li v-for="social in socials" :key="social.name">
            <a
              :href="social.url"
              target="_blank"
              rel="noopener me"
              class="grid h-11 w-11 place-items-center rounded-full text-lg text-muted transition-colors hover:bg-raised hover:text-ink"
              :aria-label="t('footer.on', { name: profile.firstName, network: social.name })"
            >
              <UiIcon :name="social.name" />
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line/10 py-6 text-sm text-muted">
      <p>&copy; {{ year }} {{ profile.name }}</p>
      <p class="flex items-center gap-2">
        <UiIcon name="clock" />
        {{ t("footer.time") }}
        <span class="font-mono tabular-nums text-ink" dir="ltr">{{ localTime || "GMT+1" }}</span>
      </p>
      <button type="button" class="group inline-flex h-11 items-center gap-2 font-medium transition-colors hover:text-ink" @click="toTop">
        {{ t("footer.top") }}
        <UiIcon name="arrow-right" class="-rotate-90 transition-transform duration-300 group-hover:-translate-y-0.5" />
      </button>
    </div>
  </footer>
</template>
