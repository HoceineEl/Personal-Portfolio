<script setup>
const roles = [
  'Full Stack Developer',
  'Laravel Specialist',
  'Vue & Nuxt Expert',
  'TALL Stack Architect',
  'SaaS Builder'
];

const currentRole = ref(0);
const isLoaded = ref(false);

const techStack = [
  { name: 'Laravel', color: 'bg-neo-secondary' },
  { name: 'Vue.js', color: 'bg-neo-primary' },
  { name: 'Nuxt', color: 'bg-neo-primary' },
  { name: 'Filament', color: 'bg-neo-secondary' },
  { name: 'Livewire', color: 'bg-neo-primary' }
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
        <!-- Availability badge -->
        <div
          class="mb-6 transition-all duration-500"
          :class="isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'"
        >
          <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-neo-primary border-2 border-border shadow-neo-sm">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span class="font-mono text-xs font-bold text-white uppercase tracking-wide">
              Available for Hire
            </span>
          </div>
        </div>

        <!-- Main heading -->
        <div
          class="mb-6 transition-all duration-700 delay-100"
          :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          <span class="block font-mono text-xs text-text-secondary uppercase tracking-widest mb-2">
            Hello, I'm
          </span>

          <h1 class="font-display leading-none">
            <span class="relative inline-block">
              <span class="relative z-10 text-4xl xs:text-5xl font-black text-text-primary">Hoceine</span>
              <span class="absolute -bottom-1 left-0 w-full h-3 bg-neo-primary -z-0" />
            </span>
            <span class="block text-3xl xs:text-4xl font-bold text-text-primary mt-1">
              El Idrissi
              <span class="inline-block w-3 h-3 bg-neo-secondary border-2 border-border ml-1 align-middle" />
            </span>
          </h1>
        </div>

        <!-- Role - simplified -->
        <div
          class="mb-6 transition-all duration-700 delay-200"
          :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          <div class="h-7 overflow-hidden relative">
            <TransitionGroup name="role-slide" tag="div" class="relative">
              <p
                v-for="(role, index) in roles"
                :key="role"
                v-show="currentRole === index"
                class="font-display font-bold text-lg text-neo-secondary absolute top-0 left-0 whitespace-nowrap"
              >
                {{ role }}
              </p>
            </TransitionGroup>
          </div>
        </div>

        <!-- Description -->
        <p
          class="text-sm text-text-secondary mb-6 leading-relaxed font-body transition-all duration-700 delay-300"
          :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          Crafting <span class="font-semibold text-text-primary">robust SaaS applications</span>
          and <span class="font-semibold text-text-primary">elegant web solutions</span>
          from Morocco. Specialized in the TALL stack.
        </p>

        <!-- Tech stack pills - alternating colors -->
        <div
          class="flex flex-wrap gap-2 mb-6 transition-all duration-700 delay-400"
          :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          <span
            v-for="(tech, i) in techStack"
            :key="tech.name"
            class="px-2.5 py-1 font-mono text-xs font-bold border-2 border-border"
            :class="i % 2 === 0 ? 'bg-neo-primary text-white' : 'bg-neo-secondary text-neo-black'"
          >
            {{ tech.name }}
          </span>
        </div>

        <!-- CTA Buttons -->
        <div
          class="flex flex-col xs:flex-row gap-3 mb-8 transition-all duration-700 delay-500"
          :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          <a href="mailto:contact@hoceine.com" class="group neo-btn-primary text-sm py-3 px-5 justify-center">
            <span>Let's Work Together</span>
            <svg class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a href="#projects" class="group neo-btn text-sm py-3 px-5 justify-center">
            <span>View My Work</span>
            <svg class="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>

        <!-- Mobile Stats Grid -->
        <div
          class="grid grid-cols-3 gap-3 transition-all duration-700 delay-600"
          :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
        >
          <div class="neo-card p-4 text-center">
            <span class="font-display text-2xl font-black text-neo-secondary block">3+</span>
            <span class="font-mono text-[10px] text-text-secondary uppercase">Years</span>
          </div>
          <div class="neo-card p-4 text-center">
            <span class="font-display text-2xl font-black text-neo-primary block">20+</span>
            <span class="font-mono text-[10px] text-text-secondary uppercase">Projects</span>
          </div>
          <div class="neo-card p-4 text-center">
            <span class="font-display text-2xl font-black text-neo-secondary block">15+</span>
            <span class="font-mono text-[10px] text-text-secondary uppercase">Tech</span>
          </div>
        </div>
      </div>

      <!-- Desktop Layout (grid) -->
      <div class="hidden lg:grid lg:grid-cols-12 gap-12 items-center">
        <!-- Left content -->
        <div class="lg:col-span-7 xl:col-span-8">
          <!-- Availability badge -->
          <div
            class="inline-block mb-8 transition-all duration-500"
            :class="isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'"
          >
            <div class="relative inline-flex items-center gap-2 px-4 py-2 bg-neo-primary border-3 border-border shadow-neo -rotate-2">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span class="font-mono text-sm font-bold text-white uppercase tracking-wide">
                Available for Hire
              </span>
            </div>
          </div>

          <!-- Main heading with stacked blocks effect -->
          <div
            class="mb-8 transition-all duration-700 delay-100"
            :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <span class="block font-mono text-base text-text-secondary uppercase tracking-widest mb-3">
              Hello, I'm
            </span>

            <h1 class="font-display leading-none">
              <!-- First name with highlight -->
              <span class="relative inline-block">
                <span class="relative z-10 text-display-xl text-text-primary">Hoceine</span>
                <span class="absolute -bottom-2 left-0 w-full h-6 bg-neo-primary -z-0" />
              </span>

              <!-- Last name -->
              <span class="block text-display-lg text-text-primary mt-2">
                El Idrissi
                <span class="inline-block w-6 h-6 bg-neo-secondary border-2 border-border ml-2 align-middle" />
              </span>
            </h1>
          </div>

          <!-- Role ticker -->
          <div
            class="mb-8 transition-all duration-700 delay-200"
            :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <div class="inline-flex items-center gap-3 px-5 py-3 bg-surface-alt border-3 border-border shadow-neo">
              <span class="font-mono text-text-secondary text-sm">{"role":</span>
              <div class="h-8 overflow-hidden relative min-w-[200px]">
                <TransitionGroup name="role-slide" tag="div" class="relative">
                  <p
                    v-for="(role, index) in roles"
                    :key="role"
                    v-show="currentRole === index"
                    class="font-display font-bold text-xl text-neo-secondary absolute top-0 left-0 whitespace-nowrap"
                  >
                    "{{ role }}"
                  </p>
                </TransitionGroup>
              </div>
              <span class="font-mono text-text-secondary text-sm">}</span>
            </div>
          </div>

          <!-- Description -->
          <p
            class="text-xl text-text-secondary max-w-xl mb-10 leading-relaxed font-body transition-all duration-700 delay-300"
            :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            Crafting <span class="font-bold text-text-primary border-b-3 border-neo-primary">robust SaaS applications</span>
            and <span class="font-bold text-text-primary border-b-3 border-neo-secondary">elegant web solutions</span>
            from Morocco. Specialized in the TALL stack with 3+ years of professional experience.
          </p>

          <!-- Tech stack pills -->
          <div
            class="flex flex-wrap gap-2 mb-10 transition-all duration-700 delay-400"
            :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <span
              v-for="(tech, index) in techStack"
              :key="tech.name"
              class="px-3 py-1.5 font-mono text-sm font-bold border-3 border-border shadow-neo-sm"
              :class="[
                tech.color,
                tech.color.includes('secondary') ? 'text-neo-black' : 'text-white'
              ]"
              :style="{ transitionDelay: `${500 + index * 50}ms` }"
            >
              {{ tech.name }}
            </span>
          </div>

          <!-- CTA Buttons -->
          <div
            class="flex flex-wrap gap-4 transition-all duration-700 delay-500"
            :class="isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'"
          >
            <a href="mailto:contact@hoceine.com" class="group neo-btn-primary">
              <span>Let's Work Together</span>
              <svg class="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="#projects" class="group neo-btn">
              <span>View My Work</span>
              <svg class="w-5 h-5 ml-2 transition-transform duration-200 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Right side - Stats & Visual (Desktop only) -->
        <div class="lg:col-span-5 xl:col-span-4">
          <div
            class="relative transition-all duration-700 delay-300"
            :class="isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'"
          >
            <!-- Stats cards stack -->
            <div class="space-y-4">
              <!-- Main stat card -->
              <div class="neo-card p-6 -rotate-1 relative">
                <div class="absolute -top-3 -right-3 w-8 h-8 bg-neo-primary border-3 border-border rotate-12" />
                <div class="flex items-center justify-between mb-4">
                  <span class="font-mono text-sm text-text-secondary uppercase">Experience</span>
                  <span class="w-2 h-2 bg-neo-primary rounded-full animate-pulse" />
                </div>
                <div class="flex items-baseline gap-2">
                  <span class="font-display text-5xl font-black text-neo-secondary">3+</span>
                  <span class="font-body text-text-secondary">years</span>
                </div>
                <div class="mt-3 flex gap-1">
                  <div class="h-2 flex-1 bg-neo-secondary border border-border" />
                  <div class="h-2 flex-1 bg-neo-secondary border border-border" />
                  <div class="h-2 flex-1 bg-neo-secondary border border-border" />
                  <div class="h-2 flex-1 bg-surface-alt border border-border" />
                  <div class="h-2 flex-1 bg-surface-alt border border-border" />
                </div>
              </div>

              <!-- Secondary stats row -->
              <div class="grid grid-cols-2 gap-4">
                <div class="neo-card p-4 rotate-1">
                  <span class="font-display text-3xl font-black text-neo-primary block">20+</span>
                  <span class="font-mono text-xs text-text-secondary uppercase">Projects</span>
                </div>
                <div class="neo-card p-4 -rotate-1">
                  <span class="font-display text-3xl font-black text-neo-secondary block">15+</span>
                  <span class="font-mono text-xs text-text-secondary uppercase">Technologies</span>
                </div>
              </div>

              <!-- Featured badge -->
              <div class="neo-card p-4 bg-neo-secondary border-3 border-border rotate-2">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white border-2 border-neo-black flex items-center justify-center -rotate-6">
                    <svg class="w-6 h-6 text-neo-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <span class="font-display font-bold text-neo-black block text-sm">SaaS Specialist</span>
                    <span class="font-mono text-xs text-neo-black/70">Multi-tenant Apps</span>
                  </div>
                </div>
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
              <span class="font-display font-bold text-sm lg:text-lg text-text-primary whitespace-nowrap">VUE.JS SPECIALIST</span>
              <span class="w-2 h-2 lg:w-3 lg:h-3 bg-neo-primary rotate-45 flex-shrink-0" />
              <span class="font-display font-bold text-sm lg:text-lg text-text-primary whitespace-nowrap">SAAS ARCHITECT</span>
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
