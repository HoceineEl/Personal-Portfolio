<script setup>
import { SITE_URL, profile, projects } from "~/assets/constants";

useHead({ titleTemplate: null });

usePageSeo({
  title: `Laravel & Filament Developer for Hire · ${profile.name}`,
  description:
    "Freelance Laravel and Filament developer in Morocco. I build web platforms, admin panels, PWAs and Arabic/RTL apps for clients in Saudi Arabia, the Gulf and the UK.",
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
