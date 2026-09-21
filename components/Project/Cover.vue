<script setup>
const props = defineProps({
  project: { type: Object, required: true },
  eager: { type: Boolean, default: false },
});

const variant = computed(() => props.project.cover || "table");
const hasSidebar = computed(() => ["chart", "calendar", "table"].includes(variant.value));
const isPhone = computed(() => ["phone", "voice"].includes(variant.value));
const bars = [10, 18, 26, 14, 30, 22, 12, 24, 16, 28, 20, 10, 18, 26, 14, 8];
const content = computed(() => (hasSidebar.value ? { x: 92, w: 288 } : { x: 20, w: 360 }));
</script>

<template>
  <div class="cover relative isolate aspect-[3/2] overflow-hidden rounded-[1.75rem] bg-raised">
    <template v-if="project.phones">
      <div class="cover-light blinds absolute inset-0 -z-10" aria-hidden="true" />
      <div class="cover-window absolute inset-x-0 top-[10%] flex items-start justify-center gap-[3%]">
        <figure
          v-for="(phone, index) in project.phones"
          :key="phone.light"
          class="w-[27%] overflow-hidden rounded-[1.4rem] bg-ink p-[0.35rem] shadow-[0_24px_40px_oklch(0_0_0/0.3)]"
          :class="index !== 1 && 'mt-[8%]'"
        >
          <NuxtImg :src="phone.light" :alt="phone.alt" width="300" height="650" class="w-full rounded-[1.1rem] dark:hidden" sizes="xs:30vw md:15vw xl:200px" :loading="eager ? 'eager' : 'lazy'" />
          <NuxtImg :src="phone.dark" :alt="phone.alt" width="300" height="650" class="hidden w-full rounded-[1.1rem] dark:block" sizes="xs:30vw md:15vw xl:200px" loading="lazy" />
        </figure>
      </div>
    </template>

    <template v-else-if="project.image && project.screenshot">
      <div class="cover-light blinds absolute inset-0 -z-10" aria-hidden="true" />
      <div class="cover-window absolute bottom-0 left-[8%] right-0 top-[12%] flex flex-col overflow-hidden rounded-tl-[14px] bg-bg shadow-[0_24px_40px_oklch(0_0_0/0.28)]">
        <div class="flex h-6 shrink-0 items-center gap-1.5 bg-ink/5 px-4 sm:h-7" aria-hidden="true">
          <span class="h-2 w-2 rounded-full bg-ink/25" />
          <span class="h-2 w-2 rounded-full bg-ink/15" />
          <span class="h-2 w-2 rounded-full bg-ink/15" />
        </div>
        <NuxtImg
          :src="project.image"
          :alt="`Screenshot of ${project.name}: ${project.tagline}`"
          class="min-h-0 w-full flex-1 object-cover object-left-top"
          :class="project.imageDark && 'dark:hidden'"
          sizes="xs:100vw md:50vw xl:800px"
          :loading="eager ? 'eager' : 'lazy'"
        />
        <NuxtImg
          v-if="project.imageDark"
          :src="project.imageDark"
          :alt="`Screenshot of ${project.name}: ${project.tagline}`"
          class="hidden min-h-0 w-full flex-1 object-cover object-left-top dark:block"
          sizes="xs:100vw md:50vw xl:800px"
          loading="lazy"
        />
      </div>
    </template>

    <template v-else-if="project.image">
      <NuxtImg
        :src="project.image"
        :alt="`${project.name}: ${project.tagline}`"
        class="h-full w-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover:-translate-y-2"
        sizes="xs:100vw md:50vw xl:640px"
        :loading="eager ? 'eager' : 'lazy'"
      />
    </template>

    <template v-else>
      <div class="cover-light blinds absolute inset-0 -z-10" aria-hidden="true" />

      <svg
        v-if="isPhone"
        viewBox="0 0 400 260"
        class="cover-window absolute inset-x-0 top-[9%] w-full drop-shadow-[0_24px_40px_oklch(0_0_0/0.28)]"
        role="img"
        :aria-label="`Illustration of the ${project.name} app`"
      >
        <g v-if="variant === 'phone'">
          <rect x="40" y="36" width="230" height="260" rx="12" class="fill-bg/70" />
          <rect x="40" y="36" width="230" height="20" rx="0" class="fill-ink/5" />
          <rect x="56" y="70" width="80" height="8" rx="4" class="fill-ink/25" />
          <path d="M56 170 C 90 150, 110 120, 140 132 S 190 90, 250 96" class="fill-none stroke-sun" stroke-width="3" />
          <rect v-for="i in 3" :key="i" x="56" :y="186 + i * 16" :width="120 - i * 18" height="6" rx="3" class="fill-ink/15" />
        </g>
        <g v-else>
          <rect x="44" y="60" width="96" height="44" rx="14" class="fill-bg/80" />
          <rect x="58" y="76" width="56" height="6" rx="3" class="fill-ink/25" />
          <rect x="58" y="88" width="36" height="5" rx="2.5" class="fill-ink/15" />
          <rect x="262" y="118" width="100" height="40" rx="14" class="fill-bg/80" />
          <rect x="276" y="133" width="60" height="6" rx="3" class="fill-ink/25" />
        </g>

        <g class="drag">
          <rect x="150" y="18" width="128" height="262" rx="24" class="fill-ink" />
          <rect x="156" y="24" width="116" height="256" rx="19" class="fill-bg" />
          <rect x="196" y="30" width="36" height="9" rx="4.5" class="fill-ink" />

          <template v-if="variant === 'phone'">
            <rect x="168" y="52" width="54" height="6" rx="3" class="fill-ink/30" />
            <rect x="168" y="64" width="80" height="14" rx="4" class="fill-ink/80" />
            <rect x="168" y="90" width="92" height="52" rx="10" class="fill-sun" />
            <path d="M176 128 C 190 120, 200 104, 214 110 S 236 96, 252 100" class="fill-none stroke-on-sun/70" stroke-width="2.5" />
            <g v-for="i in 3" :key="i">
              <circle cx="178" :cy="146 + i * 26" r="8" class="fill-ink/10" />
              <rect x="192" :y="141 + i * 26" width="40" height="5" rx="2.5" class="fill-ink/30" />
              <rect x="192" :y="150 + i * 26" width="24" height="4" rx="2" class="fill-ink/15" />
              <rect x="238" :y="143 + i * 26" width="22" height="6" rx="3" class="fill-ink/40" />
            </g>
            <circle cx="214" cy="256" r="14" class="fill-sun" />
            <rect x="211" y="248" width="6" height="11" rx="3" class="fill-on-sun" />
          </template>

          <template v-else>
            <rect x="168" y="52" width="92" height="42" rx="8" class="fill-ink/[0.06]" />
            <path d="M178 60 h72 M178 68 h60 M178 76 h72 M178 84 h44" class="stroke-sun" stroke-width="3" stroke-linecap="round" />
            <rect x="182" y="106" width="78" height="30" rx="12" class="fill-sun" />
            <rect
              v-for="(h, i) in bars.slice(0, 11)"
              :key="`s${i}`"
              :x="196 + i * 5"
              :y="121 - h / 3"
              width="2.5"
              :height="h / 1.5"
              rx="1.25"
              class="fill-on-sun"
            />
            <circle cx="191" cy="121" r="4" class="fill-on-sun" />
            <rect x="168" y="146" width="78" height="30" rx="12" class="fill-ink/10" />
            <rect
              v-for="(h, i) in bars.slice(3, 14)"
              :key="`t${i}`"
              :x="182 + i * 5"
              :y="161 - h / 3"
              width="2.5"
              :height="h / 1.5"
              rx="1.25"
              class="fill-ink/50"
            />
            <rect x="222" y="184" width="38" height="16" rx="8" class="fill-ink/80" />
            <rect x="230" y="190" width="22" height="4" rx="2" class="fill-bg" />
            <g v-for="i in 7" :key="`d${i}`">
              <circle :cx="172 + (i - 1) * 14" cy="222" r="5" :class="i < 6 ? 'fill-sun' : 'fill-ink/15'" />
            </g>
          </template>
        </g>
      </svg>

      <svg
        v-else
        viewBox="0 0 400 260"
        class="cover-window absolute left-[8%] top-[12%] w-[92%] drop-shadow-[0_24px_40px_oklch(0_0_0/0.28)]"
        role="img"
        :aria-label="`Illustration of the ${project.name} interface`"
      >
        <rect width="400" height="300" rx="14" class="fill-bg" />
        <rect width="400" height="26" rx="0" class="fill-ink/5" />
        <circle cx="16" cy="13" r="3.5" class="fill-ink/25" />
        <circle cx="28" cy="13" r="3.5" class="fill-ink/15" />
        <circle cx="40" cy="13" r="3.5" class="fill-ink/15" />
        <rect x="150" y="8" width="100" height="10" rx="5" class="fill-ink/10" />

        <g v-if="hasSidebar">
          <rect x="0" y="26" width="76" height="274" class="fill-ink/[0.04]" />
          <rect x="12" y="40" width="30" height="8" rx="4" class="fill-sun" />
          <rect v-for="i in 6" :key="i" x="12" :y="56 + i * 18" :width="i === 2 ? 50 : 40" height="6" rx="3" :class="i === 2 ? 'fill-ink/40' : 'fill-ink/15'" />
        </g>

        <g v-if="variant === 'builder'">
          <rect x="20" y="40" width="240" height="72" rx="8" class="fill-sun" />
          <rect x="36" y="58" width="120" height="10" rx="5" class="fill-on-sun/80" />
          <rect x="36" y="74" width="80" height="6" rx="3" class="fill-on-sun/40" />
          <rect x="36" y="90" width="44" height="12" rx="6" class="fill-on-sun" />
          <rect x="20" y="122" width="116" height="62" rx="8" class="fill-ink/10" />
          <rect x="144" y="122" width="116" height="62" rx="8" class="fill-ink/10" />
          <rect x="20" y="194" width="240" height="50" rx="8" class="fill-none stroke-sun" stroke-width="2" stroke-dasharray="6 5" />
          <rect x="112" y="214" width="56" height="8" rx="4" class="fill-ink/20" />
          <rect x="274" y="40" width="108" height="204" rx="8" class="fill-ink/[0.04]" />
          <rect v-for="i in 5" :key="i" x="286" :y="44 + i * 32" width="84" height="18" rx="5" class="fill-none stroke-ink/15" stroke-width="1.5" />
          <rect x="286" y="52" width="40" height="6" rx="3" class="fill-ink/30" />
          <g class="drag">
            <rect x="150" y="150" width="96" height="34" rx="8" class="fill-bg stroke-sun" stroke-width="2" />
            <rect x="162" y="163" width="56" height="8" rx="4" class="fill-ink/40" />
          </g>
        </g>

        <g v-else-if="variant === 'store'">
          <rect x="20" y="38" width="90" height="10" rx="5" class="fill-ink/40" />
          <rect x="336" y="36" width="44" height="14" rx="7" class="fill-sun" />
          <g v-for="i in 6" :key="i">
            <rect :x="20 + ((i - 1) % 3) * 122" :y="60 + Math.floor((i - 1) / 3) * 98" width="112" height="60" rx="8" :class="i === 2 ? 'fill-sun' : 'fill-ink/10'" />
            <rect :x="20 + ((i - 1) % 3) * 122" :y="126 + Math.floor((i - 1) / 3) * 98" width="70" height="6" rx="3" class="fill-ink/30" />
            <rect :x="20 + ((i - 1) % 3) * 122" :y="138 + Math.floor((i - 1) / 3) * 98" width="36" height="6" rx="3" class="fill-ink/60" />
          </g>
        </g>

        <g v-else-if="variant === 'gallery'">
          <rect x="20" y="38" width="360" height="150" rx="10" class="fill-ink/10" />
          <path d="M20 188 L20 130 L110 90 L200 130 L200 188 Z" class="fill-ink/15" />
          <rect x="200" y="38" width="180" height="150" class="fill-sun" />
          <path d="M200 188 L200 130 L290 90 L380 130 L380 178 Q380 188 370 188 Z" class="fill-on-sun/25" />
          <rect x="198" y="38" width="4" height="150" class="fill-bg" />
          <circle cx="200" cy="113" r="12" class="fill-bg" />
          <rect v-for="i in 5" :key="i" :x="20 + (i - 1) * 74" y="200" width="64" height="44" rx="8" :class="i === 3 ? 'fill-sun/70' : 'fill-ink/10'" />
        </g>

        <g v-else-if="variant === 'chart'">
          <rect v-for="i in 3" :key="i" :x="content.x + (i - 1) * 98" y="40" width="88" height="46" rx="8" class="fill-ink/[0.06]" />
          <rect v-for="i in 3" :key="`v${i}`" :x="content.x + 10 + (i - 1) * 98" y="64" :width="i === 1 ? 50 : 36" height="10" rx="5" :class="i === 1 ? 'fill-sun' : 'fill-ink/40'" />
          <rect :x="content.x" y="96" width="288" height="148" rx="8" class="fill-ink/[0.04]" />
          <path :d="`M${content.x} 220 C ${content.x + 50} 200, ${content.x + 80} 150, ${content.x + 130} 170 S ${content.x + 210} 110, ${content.x + 288} 120 L ${content.x + 288} 244 L ${content.x} 244 Z`" class="fill-sun/30" />
          <path :d="`M${content.x} 220 C ${content.x + 50} 200, ${content.x + 80} 150, ${content.x + 130} 170 S ${content.x + 210} 110, ${content.x + 288} 120`" class="fill-none stroke-sun" stroke-width="3" />
        </g>

        <g v-else-if="variant === 'kanban'">
          <g v-for="col in 3" :key="col">
            <rect :x="20 + (col - 1) * 122" y="38" width="112" height="210" rx="8" class="fill-ink/[0.05]" />
            <rect :x="30 + (col - 1) * 122" y="48" width="50" height="7" rx="3.5" class="fill-ink/40" />
            <rect
              v-for="card in 4 - col + 1"
              :key="card"
              :x="30 + (col - 1) * 122"
              :y="64 + (card - 1) * 44"
              width="92"
              height="36"
              rx="6"
              class="fill-bg stroke-ink/10"
              stroke-width="1"
            />
          </g>
          <g class="drag">
            <rect x="170" y="150" width="96" height="38" rx="6" class="fill-sun" />
            <rect x="180" y="162" width="54" height="6" rx="3" class="fill-on-sun/70" />
            <rect x="180" y="174" width="30" height="5" rx="2.5" class="fill-on-sun/40" />
          </g>
        </g>

        <g v-else-if="variant === 'panels'">
          <g v-for="i in 6" :key="`p${i}`">
            <rect :x="20 + ((i - 1) % 3) * 122" :y="40 + Math.floor((i - 1) / 3) * 108" width="112" height="98" rx="10" :class="i === 1 ? 'fill-sun' : 'fill-ink/[0.06]'" />
            <circle :cx="38 + ((i - 1) % 3) * 122" :cy="60 + Math.floor((i - 1) / 3) * 108" r="8" :class="i === 1 ? 'fill-on-sun/80' : 'fill-ink/25'" />
            <rect :x="52 + ((i - 1) % 3) * 122" :y="56 + Math.floor((i - 1) / 3) * 108" width="48" height="7" rx="3.5" :class="i === 1 ? 'fill-on-sun/70' : 'fill-ink/30'" />
            <rect
              v-for="r in 3"
              :key="r"
              :x="32 + ((i - 1) % 3) * 122"
              :y="80 + Math.floor((i - 1) / 3) * 108 + (r - 1) * 14"
              :width="88 - r * 12"
              height="6"
              rx="3"
              :class="i === 1 ? 'fill-on-sun/30' : 'fill-ink/15'"
            />
          </g>
        </g>

        <g v-else-if="variant === 'calendar'">
          <rect :x="content.x" y="38" width="100" height="10" rx="5" class="fill-ink/40" />
          <g v-for="i in 35" :key="i">
            <rect
              :x="content.x + ((i - 1) % 7) * 41"
              :y="58 + Math.floor((i - 1) / 7) * 38"
              width="36"
              height="32"
              rx="6"
              :class="[9, 10, 17, 24].includes(i) ? 'fill-sun' : [3, 15, 29].includes(i) ? 'fill-ink/25' : 'fill-ink/[0.06]'"
            />
          </g>
        </g>

        <g v-else>
          <rect :x="content.x" y="38" width="96" height="10" rx="5" class="fill-ink/40" />
          <rect :x="content.x + 232" y="36" width="56" height="16" rx="8" class="fill-sun" />
          <rect :x="content.x" y="62" width="288" height="18" rx="4" class="fill-ink/[0.06]" />
          <g v-for="i in 7" :key="i">
            <rect :x="content.x + 8" :y="90 + (i - 1) * 22" width="14" height="14" rx="7" class="fill-ink/15" />
            <rect :x="content.x + 32" :y="95 + (i - 1) * 22" :width="60 + ((i * 23) % 40)" height="5" rx="2.5" class="fill-ink/30" />
            <rect :x="content.x + 150" :y="95 + (i - 1) * 22" width="50" height="5" rx="2.5" class="fill-ink/15" />
            <rect :x="content.x + 232" :y="92 + (i - 1) * 22" width="44" height="11" rx="5.5" :class="i % 3 === 1 ? 'fill-sun' : 'fill-ink/10'" />
          </g>
        </g>
      </svg>
    </template>
  </div>
</template>

<style scoped>
.cover-light {
  mask-image: linear-gradient(115deg, transparent 20%, black 55%, transparent 95%);
  opacity: 0.55;
  transition: transform 1.2s var(--ease-out), opacity 0.6s var(--ease-out);
}

.cover-window {
  transition: transform 0.8s var(--ease-out);
}

.drag {
  transition: transform 0.8s var(--ease-out);
}

.group:hover .cover-light {
  transform: translateX(6%);
  opacity: 0.8;
}

.group:hover .cover-window {
  transform: translateY(-8px);
}

.group:hover .drag {
  transform: translate(-10px, -12px) rotate(-2deg);
}
</style>
