<script setup>
import { SITE_URL, profile, projects } from "~/assets/constants";

useHead({ titleTemplate: null });

usePageSeo({
  title: `${profile.name} · Full-stack web developer`,
  description:
    "Hoceine El Idrissi is a full-stack web developer in Morocco building web platforms, installable web apps and Filament admin panels. See selected work, services and writing.",
  path: "/",
  type: "profile",
});

useJsonLd([
  personSchema,
  {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: profile.name,
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en",
  },
  {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile`,
    url: SITE_URL,
    mainEntity: { "@id": `${SITE_URL}/#person` },
    hasPart: projects
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
