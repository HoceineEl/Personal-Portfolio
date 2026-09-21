<script setup>
const { t } = useI18n();
const { process, services, section } = useSiteData();
</script>

<template>
  <section id="services" class="mx-2 rounded-[2.5rem] bg-raised py-20 sm:mx-4 md:py-32" aria-labelledby="services-title">
    <div class="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
      <div class="lg:col-span-5">
        <div class="lg:sticky lg:top-32">
          <h2 id="services-title" class="wide text-display-lg font-black">{{ t("services.title") }}</h2>
          <p class="mt-6 max-w-md text-lg leading-relaxed text-muted">
            {{ t("services.intro") }}
          </p>
          <NuxtLink :to="section('#contact')" class="btn-sun group mt-8">
            {{ t("services.cta") }}
            <UiIcon name="arrow-right" class="flip-rtl transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </NuxtLink>
        </div>
      </div>

      <ul class="lg:col-span-7">
        <li
          v-for="service in services"
          :key="service.title"
          class="reveal border-t border-line/15 py-8 first:border-t-0 first:pt-0 md:py-10"
        >
          <h3 class="text-2xl font-bold tracking-tight md:text-[1.75rem]">{{ service.title }}</h3>
          <p class="mt-3 max-w-xl text-lg leading-relaxed text-muted">{{ service.body }}</p>
        </li>
      </ul>
    </div>

    <div class="shell mt-20 md:mt-28">
      <h3 class="text-xl font-semibold">{{ t("services.process") }}</h3>
      <ol class="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
        <li v-for="(step, index) in process" :key="step.title" class="reveal">
          <span class="wide block text-6xl font-black leading-none text-sun-ink" aria-hidden="true">{{ index + 1 }}</span>
          <h4 class="mt-5 text-xl font-bold">{{ step.title }}</h4>
          <p class="mt-2 leading-relaxed text-muted">{{ step.body }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>
