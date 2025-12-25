<template>
  <section class="section relative overflow-hidden">
    <!-- Section header -->
    <div class="text-center mb-12">
      <span class="section-label">Technologies</span>
      <h2 class="header-secondary">
        Tech
        <span class="relative inline-block">
          <span class="relative z-10">Stack</span>
          <span class="absolute -bottom-1 left-0 w-full h-3 bg-neo-secondary -z-0 rotate-1" />
        </span>
      </h2>
      <p class="description mx-auto text-center mt-4">
        The tools and technologies I use to bring ideas to life
      </p>
    </div>

    <!-- Bento Grid -->
    <div class="max-w-4xl mx-auto px-4">
      <div class="bento-grid">
        <!-- Row 1: Laravel (2x2) + Filament (1x2) + Livewire + Inertia -->
        <!-- Laravel - Large featured (2x2) -->
        <div class="bento-item bento-large neo-card group">
          <div class="w-20 h-20 mb-4 flex items-center justify-center">
            <img src="/images/tech/laravel.svg" alt="Laravel" class="w-full h-full object-contain" />
          </div>
          <span class="text-lg font-mono text-text-primary font-bold">Laravel</span>
          <span class="text-xs text-text-secondary mt-1">Backend Framework</span>
        </div>

        <!-- Filament - Tall (1x2) -->
        <div class="bento-item bento-tall neo-card group">
          <div class="w-14 h-14 mb-3 flex items-center justify-center">
            <img src="/images/tech/filament.png" alt="FilamentPHP" class="w-full h-full object-contain" />
          </div>
          <span class="text-sm font-mono text-text-primary font-bold">Filament</span>
          <span class="text-[10px] text-text-secondary mt-1">Admin Panel</span>
        </div>

        <!-- Livewire - Regular -->
        <div class="bento-item neo-card group">
          <div class="w-12 h-12 mb-2 flex items-center justify-center">
            <img src="/images/tech/livewire.png" alt="Livewire" class="w-full h-full object-contain" />
          </div>
          <span class="text-xs font-mono text-text-primary font-bold">Livewire</span>
        </div>

        <!-- Inertia - Regular -->
        <div class="bento-item neo-card group">
          <div class="w-12 h-12 mb-2 flex items-center justify-center">
            <img src="/images/tech/inertia.png" alt="Inertia.js" class="w-full h-full object-contain" />
          </div>
          <span class="text-xs font-mono text-text-primary font-bold">Inertia.js</span>
        </div>

        <!-- Row 2: Tailwind (2x1) + Alpine + Vue -->
        <!-- Tailwind - Wide (2x1) -->
        <div class="bento-item bento-wide neo-card group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <img src="/images/tech/tailwind.svg" alt="TailwindCSS" class="w-full h-full object-contain" />
            </div>
            <div>
              <span class="text-sm font-mono text-text-primary font-bold block">TailwindCSS</span>
              <span class="text-xs text-text-secondary">Utility-First CSS</span>
            </div>
          </div>
        </div>

        <!-- Alpine - Tall on mobile -->
        <div class="bento-item bento-tall-mobile neo-card group">
          <div class="w-10 h-10 sm:w-10 sm:h-10 mb-2 flex items-center justify-center">
            <img src="/images/tech/alpine.png" alt="AlpineJs" class="w-full h-full object-contain" />
          </div>
          <span class="text-[10px] font-mono text-text-primary font-bold">Alpine.js</span>
        </div>

        <!-- Row 3: Vue (tall) + Claude Code (2x1) + Nuxt + Forge -->
        <!-- Vue - Tall -->
        <div class="bento-item bento-tall neo-card group">
          <div class="w-12 h-12 mb-2 flex items-center justify-center">
            <img src="/images/tech/vue.svg" alt="VueJS" class="w-full h-full object-contain" />
          </div>
          <span class="text-sm font-mono text-text-primary font-bold">Vue.js</span>
          <span class="text-[10px] text-text-secondary mt-1">Frontend</span>
        </div>

        <!-- Claude Code - Wide (2x1) -->
        <div class="bento-item bento-wide neo-card group">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <img src="/images/tech/claude.png" alt="Claude Code" class="w-full h-full object-contain" />
            </div>
            <div>
              <span class="text-sm font-mono text-text-primary font-bold block">Claude Code</span>
              <span class="text-xs text-text-secondary">AI-Powered Dev</span>
            </div>
          </div>
        </div>

        <!-- Nuxt - Regular on desktop, wide on mobile -->
        <div class="bento-item bento-wide-mobile neo-card group">
          <div class="w-10 h-10 mb-2 flex items-center justify-center">
            <img src="/images/tech/nuxt.svg" alt="NuxtJs" class="w-full h-full object-contain" />
          </div>
          <span class="text-[10px] font-mono text-text-primary font-bold">Nuxt.js</span>
        </div>

        <!-- Row 4: PHP (2x1) + Forge + MySQL -->
        <!-- PHP - Wide -->
        <div class="bento-item bento-wide neo-card group bg-[#777BB4]/10 border-[#777BB4]">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <img src="/images/tech/php.svg" alt="PHP" class="w-full h-full object-contain" />
            </div>
            <div>
              <span class="text-sm font-mono text-text-primary font-bold block">PHP</span>
              <span class="text-xs text-text-secondary">Backend Language</span>
            </div>
          </div>
        </div>

        <!-- Forge - Regular -->
        <div class="bento-item neo-card group">
          <div class="w-10 h-10 mb-2 flex items-center justify-center">
            <img src="/images/tech/forge.svg" alt="Laravel Forge" class="w-full h-full object-contain" />
          </div>
          <span class="text-[10px] font-mono text-text-primary font-bold">Forge</span>
        </div>

        <!-- Row 5: JS + TS + Github + GitLab -->
        <!-- JavaScript - Regular -->
        <div class="bento-item neo-card group">
          <div class="w-10 h-10 mb-2 flex items-center justify-center">
            <img src="/images/tech/js.svg" alt="JavaScript" class="w-full h-full object-contain" />
          </div>
          <span class="text-[10px] font-mono text-text-primary font-bold">JavaScript</span>
        </div>

        <!-- TypeScript - Regular -->
        <div class="bento-item neo-card group">
          <div class="w-10 h-10 mb-2 flex items-center justify-center">
            <img src="/images/tech/ts.svg" alt="TypeScript" class="w-full h-full object-contain" />
          </div>
          <span class="text-[10px] font-mono text-text-primary font-bold">TypeScript</span>
        </div>

        <!-- Github - Regular -->
        <div class="bento-item neo-card group">
          <div class="w-10 h-10 mb-2 flex items-center justify-center">
            <img src="/images/tech/github.svg" alt="Github" class="w-full h-full object-contain dark:invert" />
          </div>
          <span class="text-[10px] font-mono text-text-primary font-bold">Github</span>
        </div>

        <!-- Bitbucket - Regular -->
        <div class="bento-item neo-card group">
          <div class="w-10 h-10 mb-2 flex items-center justify-center">
            <img src="/images/tech/bitbucket.svg" alt="Bitbucket" class="w-full h-full object-contain" />
          </div>
          <span class="text-[10px] font-mono text-text-primary font-bold">Bitbucket</span>
        </div>

        <!-- VS Code - Regular -->
        <div class="bento-item neo-card group">
          <div class="w-10 h-10 mb-2 flex items-center justify-center">
            <img src="/images/tech/vscode.svg" alt="VS Code" class="w-full h-full object-contain" />
          </div>
          <span class="text-[10px] font-mono text-text-primary font-bold">VS Code</span>
        </div>

        <!-- Row 6: MySQL (2x1) + Vite + Figma -->
        <!-- MySQL - Wide -->
        <div class="bento-item bento-wide neo-card group">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center flex-shrink-0">
              <img src="/images/tech/mysql.svg" alt="MySQL" class="w-full h-full object-contain" />
            </div>
            <div>
              <span class="text-sm font-mono text-text-primary font-bold block">MySQL</span>
              <span class="text-xs text-text-secondary">Database</span>
            </div>
          </div>
        </div>

        <!-- Vite - Regular -->
        <div class="bento-item neo-card group">
          <div class="w-10 h-10 mb-2 flex items-center justify-center">
            <img src="/images/tech/vite.svg" alt="Vite" class="w-full h-full object-contain" />
          </div>
          <span class="text-[10px] font-mono text-text-primary font-bold">Vite</span>
        </div>

        <!-- Figma - Regular -->
        <div class="bento-item neo-card group">
          <div class="w-10 h-10 mb-2 flex items-center justify-center">
            <img src="/images/tech/figma.svg" alt="Figma" class="w-full h-full object-contain" />
          </div>
          <span class="text-[10px] font-mono text-text-primary font-bold">Figma</span>
        </div>
      </div>
    </div>

    <!-- Marquee of skills -->
    <div class="mt-16 border-y-3 border-border py-4 bg-neo-primary overflow-hidden">
      <div class="marquee-container">
        <div class="flex gap-8 animate-marquee whitespace-nowrap">
          <span v-for="i in 2" :key="i" class="flex gap-8">
            <span v-for="tech in technologies" :key="`${i}-${tech.name}`" class="font-display font-bold text-white text-lg uppercase">
              {{ tech.name }} *
            </span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { technologies } from "~/assets/constants";
</script>

<style scoped>
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(90px, auto);
  gap: 12px;
}

.bento-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  transition: all 0.3s ease;
}

.bento-item:hover {
  transform: translateY(-2px);
}

/* Large item - 2x2 */
.bento-large {
  grid-column: span 2;
  grid-row: span 2;
}

/* Tall item - 1x2 */
.bento-tall {
  grid-row: span 2;
}

/* Wide item - 2x1 */
.bento-wide {
  grid-column: span 2;
  flex-direction: row;
}

/* Mobile responsive - 2 columns */
@media (max-width: 640px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .bento-large {
    grid-column: span 2;
    grid-row: span 2;
  }

  .bento-wide {
    grid-column: span 2;
  }

  .bento-tall {
    grid-row: span 2;
  }

  .bento-tall-mobile {
    grid-row: span 2;
  }

  .bento-wide-mobile {
    grid-column: span 2;
  }

  .bento-item {
    padding: 12px;
  }
}

/* Tablet - 4 columns same as desktop for clean grid */
@media (min-width: 641px) and (max-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.marquee-container {
  display: flex;
  overflow: hidden;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}
</style>
