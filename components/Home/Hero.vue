<script setup>
const { t } = useI18n();
const localePath = useLocalePath();
const { profile, projects, section } = useSiteData();
const current = computed(() => projects.value[0]);
const ticker = computed(() => projects.value.filter((project) => project.featured).map((project) => project.name));
const localTime = useLocalTime(() => profile.value.timezone);
const hero = ref(null);
let frame = 0;

const setPointer = (px, py) => {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    hero.value.style.setProperty("--px", px);
    hero.value.style.setProperty("--py", py);
  });
};

const track = (event) => {
  if (event.pointerType !== "mouse") return;
  const box = hero.value.getBoundingClientRect();
  setPointer(((event.clientX - box.left) / box.width - 0.5) * 2, ((event.clientY - box.top) / box.height - 0.5) * 2);
};

const release = () => setPointer(0, 0);

onUnmounted(() => cancelAnimationFrame(frame));
</script>

<template>
  <section
    ref="hero"
    class="hero relative isolate mx-2 mt-16 overflow-clip rounded-[2.5rem] bg-deep text-on-deep sm:mx-4 md:mt-20"
    aria-labelledby="hero-title"
    @pointermove="track"
    @pointerleave="release"
  >
    <div class="hero-light absolute inset-0 -z-10" aria-hidden="true" />

    <div class="shell grid gap-12 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-8">
      <div class="min-w-0 pb-12 lg:col-span-7 lg:pb-14">
        <p class="rise inline-flex items-center gap-2.5 rounded-2xl bg-on-deep/10 py-1.5 sm:rounded-full pe-4 ps-3 text-[0.95rem] text-on-deep/90" style="--d: 0ms">
          <span class="relative flex h-2.5 w-2.5">
            <span class="pulse absolute inline-flex h-full w-full rounded-full bg-sun" />
            <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-sun" />
          </span>
          {{ t("hero.status") }}
        </p>

        <h1 id="hero-title" class="wide mt-7 text-display-xl font-black">
          <span class="line"><span class="rise" style="--d: 80ms">{{ t("hero.line1") }}</span></span>
          <span class="line"><span class="rise" style="--d: 160ms">{{ t("hero.line2") }}</span></span>
          <span class="line">
            <span class="rise" style="--d: 240ms"><span class="stamp">{{ t("hero.line3") }}</span></span>
          </span>
        </h1>

        <p class="rise mt-7 max-w-[34rem] text-lg leading-relaxed text-on-deep/80 sm:text-xl" style="--d: 420ms">
          <i18n-t keypath="hero.intro" tag="span" scope="global">
            <template #name><strong class="font-semibold text-on-deep">{{ profile.name }}</strong></template>
          </i18n-t>
        </p>

        <div class="rise mt-10 flex flex-wrap items-center gap-3" style="--d: 500ms">
          <NuxtLink :to="section('#contact')" class="btn group bg-sun text-on-sun hover:bg-on-deep hover:text-deep">
            {{ t("hero.cta") }}
            <UiIcon name="arrow-right" class="flip-rtl transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </NuxtLink>
          <NuxtLink :to="section('#work')" class="btn text-on-deep ring-1 ring-inset ring-on-deep/30 hover:bg-on-deep hover:text-deep">
            {{ t("hero.work") }}
          </NuxtLink>
        </div>

        <NuxtLink
          :to="localePath(current.url)"
          class="rise group mt-10 flex max-w-[34rem] items-center gap-4 border-t border-on-deep/20 pt-5 text-[0.95rem]"
          style="--d: 620ms"
        >
          <span class="shrink-0 text-on-deep/70">{{ t("hero.now") }}</span>
          <span class="min-w-0 flex-1 sm:truncate">
            <strong class="font-semibold underline decoration-sun decoration-2 underline-offset-4">{{ current.name }}</strong>
            <span class="text-on-deep/70"> · {{ current.tagline }}</span>
          </span>
          <UiIcon name="arrow-right" class="flip-rtl shrink-0 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </NuxtLink>
      </div>

      <div class="rise relative mx-auto flex w-full max-w-[24rem] items-end self-end lg:col-span-5 lg:max-w-[30rem]" style="--d: 200ms">
        <div class="sun-disc follow-far absolute -end-6 top-0 -z-10 aspect-square w-[62%] rounded-full bg-sun" aria-hidden="true" />
        <figure class="follow-near relative w-full overflow-hidden rounded-t-[999px] bg-on-deep/10">
          <NuxtImg
            :src="profile.photo"
            :alt="t('hero.photoAlt', { name: profile.name })"
            width="768"
            height="1115"
            sizes="xs:100vw md:420px xl:520px"
            class="aspect-[4/5] w-full object-cover object-[50%_18%]"
            loading="eager"
            fetchpriority="high"
            preload
          />
          <figcaption
            class="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-full bg-deep/80 px-5 py-3 text-sm text-on-deep backdrop-blur-md"
          >
            <span class="flex items-center gap-2 text-on-deep/75">
              <UiIcon name="clock" class="text-base text-on-deep" />
              <span>
                <span class="font-mono font-medium tabular-nums text-on-deep" dir="ltr">{{ localTime || "GMT+1" }}</span>
                {{ t("hero.inPlace", { place: profile.location }) }}
              </span>
            </span>
            <a :href="`mailto:${profile.email}`" class="font-semibold underline decoration-sun decoration-2 underline-offset-4">
              {{ t("hero.sayHi") }}
            </a>
          </figcaption>
        </figure>
      </div>
    </div>

    <div class="ticker relative bg-sun py-4 text-on-sun" aria-hidden="true">
      <div class="ticker-track flex w-max">
        <ul v-for="copy in 2" :key="copy" class="wide flex shrink-0 items-center text-2xl font-extrabold uppercase md:text-3xl">
          <li v-for="name in ticker" :key="name" class="flex items-center">
            <span class="px-6">{{ name }}</span>
            <span class="text-on-sun/40">✳</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.line {
  display: block;
  overflow: clip;
  padding-bottom: 0.04em;
}

.line > .rise {
  display: inline-block;
}

.stamp {
  display: inline-block;
  margin-top: 0.08em;
  padding: 0.1em 0.16em 0.02em;
  border-radius: 0.12em;
  background: oklch(var(--sun));
  color: oklch(var(--on-sun));
  rotate: -2deg;
  animation: stamp 0.9s var(--ease-out) 0.6s both;
}

@keyframes stamp {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

[dir="rtl"] .stamp {
  rotate: 2deg;
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

.hero {
  --px: 0;
  --py: 0;
}

.follow-near,
.follow-far {
  transition: translate 0.9s var(--ease-out);
}

.follow-near {
  translate: calc(var(--px) * -10px) calc(var(--py) * -8px);
}

.follow-far {
  translate: calc(var(--px) * 22px) calc(var(--py) * 16px);
}

.hero-light {
  background-image: repeating-linear-gradient(-32deg, oklch(var(--on-deep) / 0.05) 0 16px, transparent 16px 40px);
  mask-image: radial-gradient(90% 80% at 80% 20%, black, transparent 75%);
  animation: drift 24s ease-in-out infinite alternate;
}

[dir="rtl"] .hero-light {
  mask-image: radial-gradient(90% 80% at 20% 20%, black, transparent 75%);
}

@keyframes drift {
  to {
    background-position: 80px 0;
  }
}

.sun-disc {
  animation: sunrise 1.6s var(--ease-out) 0.3s both;
}

@keyframes sunrise {
  from {
    transform: translateY(40%);
    opacity: 0;
  }
}

.ticker-track {
  animation: ticker 40s linear infinite;
}

.ticker:hover .ticker-track {
  animation-play-state: paused;
}

[dir="rtl"] .ticker-track {
  animation-direction: reverse;
}

@keyframes ticker {
  to {
    transform: translateX(-50%);
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
