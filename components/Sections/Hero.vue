<script setup>
const roles = [
  'Full Stack Developer',
  'Laravel Specialist',
  'Filament Expert',
  'TALL Stack Architect',
  'SaaS Builder'
];

const currentRole = ref(0);
const isLoaded = ref(false);

const techStack = [
  { name: 'Laravel', color: 'bg-neo-secondary' },
  { name: 'Filament', color: 'bg-neo-primary' },
  { name: 'Livewire', color: 'bg-neo-primary' },
  { name: 'Tailwind', color: 'bg-neo-secondary' },
  { name: 'Claude Code', color: 'bg-neo-primary' }
];

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);

  setInterval(() => {
    currentRole.value = (currentRole.value + 1) % roles.length;
  }, 3000);
});
</script>

<template>
  <section class="relative min-h-screen flex items-center overflow-hidden bg-surface">
    <!-- Grid pattern background -->
    <div class="absolute inset-0 bg-grid-pattern opacity-40 dark:opacity-20" />

    <!-- Decorative geometric shapes - Hidden on mobile, visible on lg+ -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
      <!-- Large corner block -->
      <div
        class="absolute -top-8 -right-8 w-48 h-48 bg-neo-primary border-4 border-border rotate-12 transition-transform duration-700"
        :class="isLoaded ? 'translate-x-0 translate-y-0 opacity-100' : 'translate-x-20 -translate-y-20 opacity-0'"
      />

      <!-- Orange block -->
      <div
        class="absolute top-1/4 right-[15%] w-20 h-20 bg-neo-secondary border-3 border-border -rotate-6 shadow-neo transition-all duration-700 delay-200"
        :class="isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'"
      />

      <!-- Primary block -->
      <div
        class="absolute bottom-1/3 left-[8%] w-16 h-16 bg-neo-primary border-3 border-border rotate-12 shadow-neo transition-all duration-700 delay-300"
        :class="isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'"
      />

      <!-- Small secondary accent -->
      <div
        class="absolute top-[60%] right-[25%] w-10 h-10 bg-neo-secondary border-3 border-border rotate-45 transition-all duration-700 delay-400"
        :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'"
      />

      <!-- Dotted decoration -->
      <div class="absolute bottom-20 right-20">
        <div class="grid grid-cols-4 gap-3">
          <template v-for="i in 16" :key="i">
            <div class="w-2 h-2 bg-border rounded-full" />
          </template>
        </div>
      </div>

      <!-- Lines decoration -->
      <div class="absolute top-40 left-20">
        <div class="space-y-2">
          <div class="w-16 h-1 bg-border" />
          <div class="w-12 h-1 bg-border" />
          <div class="w-8 h-1 bg-border" />
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 lg:pb-16">

      <!-- Mobile Layout (stacked) -->
      <div class="lg:hidden">
        <!-- Hook badge -->
        <div
          class="mb-4 transition-all duration-500"
          :class="isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'"
        >
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-neo-secondary border-2 border-border shadow-neo-sm">
            <span class="font-mono text-xs font-bold text-neo-black uppercase tracking-wide">
              20+ SaaS Products Shipped
            </span>
          </div>
        </div>

        <!-- Main heading - Bold value proposition -->
        <div
          class="mb-4 transition-all duration-700 delay-100"
          :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          <h1 class="font-display leading-tight">
            <span class="block text-2xl xs:text-3xl font-bold text-text-secondary mb-1">
              I Build
            </span>
            <span class="relative inline-block">
              <span class="relative z-10 text-4xl xs:text-5xl font-black text-text-primary">SaaS That</span>
            </span>
            <span class="block text-4xl xs:text-5xl font-black">
              <span class="text-neo-primary">Scale</span>
              <span class="inline-block w-3 h-3 bg-neo-secondary border-2 border-border ml-2 align-middle" />
            </span>
          </h1>
        </div>

        <!-- Name & subtitle -->
        <div
          class="mb-5 transition-all duration-700 delay-200"
          :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          <p class="font-mono text-sm text-text-secondary">
            <span class="text-neo-secondary font-bold">Hoceine El Idrissi</span> · Full Stack Developer from Morocco
          </p>
        </div>

        <!-- Description - Impact focused -->
        <p
          class="text-sm text-text-secondary mb-5 leading-relaxed font-body transition-all duration-700 delay-300"
          :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          I turn complex ideas into <span class="font-semibold text-text-primary">production-ready multi-tenant SaaS</span>
          using Laravel, Filament & Livewire. From concept to deployment in weeks, not months.
        </p>

        <!-- Tech stack pills - compact -->
        <div
          class="flex flex-wrap gap-1.5 mb-5 transition-all duration-700 delay-400"
          :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          <span
            v-for="(tech, i) in techStack"
            :key="tech.name"
            class="px-2 py-0.5 font-mono text-[10px] font-bold border border-border bg-surface-alt text-text-secondary"
          >
            {{ tech.name }}
          </span>
        </div>

        <!-- CTA Buttons -->
        <div
          class="flex flex-col xs:flex-row gap-3 mb-6 transition-all duration-700 delay-500"
          :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          <a href="mailto:contact@hoceine.com" class="group neo-btn-primary text-sm py-3 px-5 justify-center">
            <span>Let's Collaborate</span>
            <svg class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a href="#projects" class="group neo-btn text-sm py-3 px-5 justify-center">
            <span>See My Work</span>
            <svg class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

        <!-- Social proof stats -->
        <div
          class="flex items-center gap-4 text-xs font-mono text-text-secondary transition-all duration-700 delay-600"
          :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          <span><span class="font-bold text-neo-secondary">3+</span> Years</span>
          <span class="w-1 h-1 bg-border rounded-full" />
          <span><span class="font-bold text-neo-primary">20+</span> Projects</span>
          <span class="w-1 h-1 bg-border rounded-full" />
          <span><span class="font-bold text-neo-secondary">100%</span> Remote</span>
        </div>
      </div>

      <!-- Desktop Layout (grid) -->
      <div class="hidden lg:grid lg:grid-cols-12 gap-12 items-center">
        <!-- Left content -->
        <div class="lg:col-span-7 xl:col-span-8">
          <!-- Hook badge -->
          <div
            class="inline-block mb-6 transition-all duration-500"
            :class="isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'"
          >
            <div class="relative inline-flex items-center gap-2 px-4 py-2 bg-neo-secondary border-3 border-border shadow-neo -rotate-1">
              <span class="font-mono text-sm font-bold text-neo-black uppercase tracking-wide">
                20+ SaaS Products Shipped
              </span>
            </div>
          </div>

          <!-- Main heading - Bold value proposition -->
          <div
            class="mb-6 transition-all duration-700 delay-100"
            :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <h1 class="font-display leading-tight">
              <span class="block text-display-md font-bold text-text-secondary mb-2">
                I Build
              </span>
              <span class="relative inline-block">
                <span class="relative z-10 text-display-xl text-text-primary">SaaS That</span>
              </span>
              <span class="block text-display-xl">
                <span class="text-neo-primary">Scale</span>
                <span class="inline-block w-6 h-6 bg-neo-secondary border-3 border-border ml-3 align-middle" />
              </span>
            </h1>
          </div>

          <!-- Name & subtitle -->
          <div
            class="mb-8 transition-all duration-700 delay-200"
            :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <p class="font-mono text-lg text-text-secondary">
              <span class="text-neo-secondary font-bold">Hoceine El Idrissi</span> · Full Stack Developer from Morocco
            </p>
          </div>

          <!-- Description - Impact focused -->
          <p
            class="text-xl text-text-secondary max-w-xl mb-8 leading-relaxed font-body transition-all duration-700 delay-300"
            :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            I turn complex ideas into <span class="font-bold text-text-primary">production-ready multi-tenant SaaS</span>
            using Laravel, Filament & Livewire. From concept to deployment in <span class="font-bold text-neo-primary">weeks, not months</span>.
          </p>

          <!-- Tech stack pills - subtle -->
          <div
            class="flex flex-wrap gap-2 mb-8 transition-all duration-700 delay-400"
            :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <span
              v-for="tech in techStack"
              :key="tech.name"
              class="px-3 py-1 font-mono text-xs font-bold border-2 border-border bg-surface-alt text-text-secondary"
            >
              {{ tech.name }}
            </span>
          </div>

          <!-- CTA Buttons -->
          <div
            class="flex flex-wrap items-center gap-6 transition-all duration-700 delay-500"
            :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <a href="mailto:contact@hoceine.com" class="group neo-btn-primary">
              <span>Let's Collaborate</span>
              <svg class="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#projects" class="group neo-btn">
              <span>See My Work</span>
              <svg class="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <!-- Social proof inline -->
            <div class="flex items-center gap-4 text-sm font-mono text-text-secondary">
              <span><span class="font-bold text-neo-secondary">3+</span> Years</span>
              <span class="w-1 h-1 bg-border rounded-full" />
              <span><span class="font-bold text-neo-primary">100%</span> Remote</span>
            </div>
          </div>
        </div>

        <!-- Right side - Featured work preview -->
        <div class="lg:col-span-5 xl:col-span-4">
          <div
            class="relative transition-all duration-700 delay-300"
            :class="isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'"
          >
            <!-- What I deliver card -->
            <div class="neo-card p-6 -rotate-1 relative">
              <div class="absolute -top-3 -right-3 w-10 h-10 bg-neo-primary border-3 border-border rotate-12 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 class="font-display font-bold text-lg mb-4 text-text-primary">What I Deliver</h3>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <span class="w-5 h-5 bg-neo-primary border-2 border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  <span class="text-sm text-text-secondary"><span class="font-bold text-text-primary">Multi-tenant SaaS</span> with custom domains</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="w-5 h-5 bg-neo-primary border-2 border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  <span class="text-sm text-text-secondary"><span class="font-bold text-text-primary">Admin panels</span> with Filament</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="w-5 h-5 bg-neo-primary border-2 border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  <span class="text-sm text-text-secondary"><span class="font-bold text-text-primary">API integrations</span> & payment systems</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="w-5 h-5 bg-neo-primary border-2 border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  <span class="text-sm text-text-secondary"><span class="font-bold text-text-primary">Modern</span> frontends & PWAs</span>
                </li>
              </ul>
            </div>

            <!-- Floating accent -->
            <div class="absolute -bottom-4 -left-4 neo-card p-3 bg-neo-secondary border-3 border-border rotate-3">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-neo-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span class="font-mono text-xs font-bold text-neo-black">Open for Freelance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom marquee -->
      <div
        class="mt-8 lg:mt-16 -mx-4 sm:-mx-6 lg:-mx-8 border-t-2 lg:border-t-3 border-b-2 lg:border-b-3 border-border bg-surface-alt py-2 lg:py-3 overflow-hidden transition-all duration-700 delay-600"
        :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
      >
        <div class="marquee-container">
          <div class="marquee-content flex items-center gap-4 lg:gap-8 pr-4 lg:pr-8">
            <template v-for="i in 3" :key="i">
              <span class="font-display font-bold text-sm lg:text-lg text-text-primary whitespace-nowrap">FULL STACK DEVELOPER</span>
              <span class="w-2 h-2 lg:w-3 lg:h-3 bg-neo-primary rotate-45 flex-shrink-0" />
              <span class="font-display font-bold text-sm lg:text-lg text-text-primary whitespace-nowrap">LARAVEL EXPERT</span>
              <span class="w-2 h-2 lg:w-3 lg:h-3 bg-neo-secondary rotate-45 flex-shrink-0" />
              <span class="font-display font-bold text-sm lg:text-lg text-text-primary whitespace-nowrap">FILAMENT SPECIALIST</span>
              <span class="w-2 h-2 lg:w-3 lg:h-3 bg-neo-primary rotate-45 flex-shrink-0" />
              <span class="font-display font-bold text-sm lg:text-lg text-text-primary whitespace-nowrap">AI-POWERED DEV</span>
              <span class="w-2 h-2 lg:w-3 lg:h-3 bg-neo-secondary rotate-45 flex-shrink-0" />
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator - Hidden on mobile -->
    <div
      class="absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-700 delay-700 hidden sm:flex"
      :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'"
    >
      <a href="#about" class="flex flex-col items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group">
        <span class="font-mono text-xs uppercase tracking-widest">Scroll Down</span>
        <div class="w-6 h-10 border-2 border-border rounded-full flex justify-center pt-2 bg-surface group-hover:border-neo-primary transition-colors">
          <div class="w-1 h-3 bg-neo-primary rounded-full animate-bounce" />
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
/* Role slide animation */
.role-slide-enter-active,
.role-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.role-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.role-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Marquee animation */
.marquee-content {
  animation: marquee 25s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.33%);
  }
}

/* Pause marquee on hover */
.marquee-container:hover .marquee-content {
  animation-play-state: paused;
}
</style>
