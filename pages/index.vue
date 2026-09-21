<script setup>
import { SITE_URL } from "~/assets/constants";

const { t, locale } = useI18n();
const localePath = useLocalePath();
const { profile, projects } = useSiteData();

useHead({ titleTemplate: null });

usePageSeo({
  title: t("seo.homeTitle", { name: profile.value.name }),
  description: t("seo.homeDescription"),
  path: localePath("/"),
  type: "profile",
  locale: locale.value,
});

useJsonLd([
  personSchema,
  {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: profile.value.name,
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: locale.value,
  },
  {
    "@type": "ProfilePage",
    "@id": `${absoluteUrl(localePath("/"))}#profile`,
    url: absoluteUrl(localePath("/")),
    mainEntity: { "@id": `${SITE_URL}/#person` },
    hasPart: projects.value
      .filter((project) => project.featured)
      .map((project) => ({ "@type": "CreativeWork", name: project.name, url: `${SITE_URL}${project.url}` })),
  },
]);
</script>

<template>
  <div>
    <HomeHero />
    <HomeWork />
    <HomeServices />
    <HomeAbout />
    <HomeWriting />
    <HomeContact />
    <div class="h-16 md:h-24" />
  </div>
</template>
