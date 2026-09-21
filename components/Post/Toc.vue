<script setup>
const { t } = useI18n();
const props = defineProps({
  links: { type: Array, default: () => [] },
});

const active = ref("");
let observer;

onMounted(() => {
  const headings = props.links
    .flatMap((link) => [link, ...(link.children || [])])
    .map((link) => document.getElementById(link.id))
    .filter(Boolean);

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length) active.value = visible[0].target.id;
    },
    { rootMargin: "-15% 0px -70% 0px" }
  );
  headings.forEach((heading) => observer.observe(heading));
});

onUnmounted(() => observer?.disconnect());
</script>

<template>
  <nav v-if="links.length" :aria-label="t('post.onThisPage')">
    <p class="text-sm font-semibold">{{ t("post.onThisPage") }}</p>
    <ul class="mt-4 space-y-1 border-s border-line/15 text-[0.9rem]">
      <template v-for="link in links" :key="link.id">
        <li>
          <a
            :href="`#${link.id}`"
            class="-ms-px block border-s py-1.5 ps-4 leading-snug transition-colors"
            :class="active === link.id ? 'border-sun font-medium text-ink' : 'border-transparent text-muted hover:text-ink'"
          >
            {{ link.text }}
          </a>
        </li>
        <li v-for="child in link.children || []" :key="child.id">
          <a
            :href="`#${child.id}`"
            class="-ms-px block border-s py-1 ps-7 text-[0.85rem] leading-snug transition-colors"
            :class="active === child.id ? 'border-sun text-ink' : 'border-transparent text-muted hover:text-ink'"
          >
            {{ child.text }}
          </a>
        </li>
      </template>
    </ul>
  </nav>
</template>
