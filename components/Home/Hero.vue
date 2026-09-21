<script setup>
import { profile } from "~/assets/constants";

const localTime = ref("");
let timer;

const tick = () => {
  localTime.value = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: profile.timezone,
  }).format(new Date());
};

onMounted(() => {
  tick();
  timer = setInterval(tick, 15000);
});

onUnmounted(() => clearInterval(timer));
</script>

<template>
  <section class="shell relative pb-16 pt-28 md:pb-24 md:pt-36 lg:pt-40" aria-labelledby="hero-title">
    <div class="grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
      <div class="lg:col-span-7">
        <p class="rise flex items-center gap-2.5 text-[0.95rem] text-muted" style="--d: 0ms">
          <span class="relative flex h-2.5 w-2.5">
            <span class="pulse absolute inline-flex h-full w-full rounded-full bg-live" />
            <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-live" />
          </span>
          Taking on new projects
        </p>

        <h1
          id="hero-title"
          class="hero-title mt-6 text-display-xl font-black"
        >
          <span class="line"><span class="rise" style="--d: 80ms">I build apps</span></span>
          <span class="line"><span class="rise" style="--d: 160ms">people open</span></span>
          <span class="line"><span class="rise" style="--d: 240ms"><span class="sun-mark">every day.</span></span></span>
        </h1>

        <p class="rise mt-8 max-w-[34rem] text-lg leading-relaxed text-muted sm:text-xl" style="--d: 420ms">
          I'm <strong class="font-semibold text-ink">{{ profile.name }}</strong>, a full-stack developer in Morocco.
          Web platforms, installable web apps and admin panels that teams in Saudi Arabia, the UK
          and Palestine rely on, often in Arabic.
        </p>

        <div class="rise mt-10 flex flex-wrap items-center gap-3" style="--d: 500ms">
          <NuxtLink to="/#contact" class="btn-sun group">
            Start a project
            <UiIcon name="arrow-right" class="transition-transform duration-300 group-hover:translate-x-1" />
          </NuxtLink>
          <NuxtLink to="/#work" class="btn-ghost">See the work</NuxtLink>
        </div>
      </div>

      <div class="rise relative mx-auto w-full max-w-[26rem] lg:col-span-5 lg:max-w-none" style="--d: 200ms">
        <div class="portrait-light blinds absolute -right-4 top-10 -z-10 h-[88%] w-[92%] rounded-[2rem] sm:-right-8" aria-hidden="true" />
        <figure class="relative overflow-hidden rounded-[2rem] bg-raised">
          <NuxtImg
            :src="profile.photo"
            :alt="`${profile.name} sitting backwards on a wooden chair, sunlight falling through window blinds`"
            width="768"
            height="1115"
            sizes="xs:100vw md:420px xl:560px"
            class="aspect-[4/5] w-full object-cover object-[50%_20%]"
            loading="eager"
            fetchpriority="high"
            preload
          />
          <figcaption
            class="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl bg-bg/85 px-4 py-3 text-sm backdrop-blur-md"
          >
            <span class="flex items-center gap-2 text-muted">
              <UiIcon name="clock" class="text-base text-ink" />
              <span>
                <span class="font-mono font-medium tabular-nums text-ink">{{ localTime || "GMT+1" }}</span>
                in {{ profile.location }}
              </span>
            </span>
            <a :href="`mailto:${profile.email}`" class="font-medium text-ink underline decoration-sun decoration-2 underline-offset-4">
              Say salaam
            </a>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-title {
  font-variation-settings: 'wdth' 118;
  font-stretch: 118%;
}

@media (min-width: 640px) {
  .hero-title {
    font-variation-settings: 'wdth' 125;
    font-stretch: 125%;
  }
}

.line {
  display: block;
  overflow: clip;
  padding-bottom: 0.06em;
}

.line > .rise {
  display: inline-block;
}

.sun-mark {
  color: oklch(var(--sun-ink));
}

.rise {
  animation: rise 1.1s var(--ease-out) both;
  animation-delay: var(--d, 0ms);
}

.line .rise {
  animation-name: rise-line;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(1.5rem);
  }
}

@keyframes rise-line {
  from {
    transform: translateY(105%);
  }
}

.portrait-light {
  mask-image: linear-gradient(200deg, black 10%, transparent 85%);
  animation: drift 14s ease-in-out infinite alternate;
}

@keyframes drift {
  to {
    background-position: 68px 0;
  }
}

.pulse {
  animation: pulse 2.4s var(--ease-out) infinite;
}

@keyframes pulse {
  from {
    opacity: 0.7;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(2.6);
  }
}
</style>
