<template>
  <section class="section relative" id="about">
    <!-- Decorative element -->
    <div class="absolute -top-10 right-0 w-20 h-20 bg-neo-secondary border-3 border-border rotate-12 hidden md:block" />

    <div>
      <!-- Section label -->
      <span class="section-label">About Me</span>

      <!-- Heading -->
      <h2 class="header-secondary mb-8">
        Building Digital<br />
        <span class="relative inline-block">
          <span class="relative z-10">Experiences</span>
          <span class="absolute -bottom-1 left-0 w-full h-3 bg-neo-primary -z-0 -rotate-1" />
        </span>
      </h2>

      <!-- Content grid -->
      <div class="grid lg:grid-cols-5 gap-8 mt-10">
        <!-- Text content -->
        <div class="lg:col-span-2 space-y-6">
          <p class="text-lg text-text-secondary leading-relaxed">
            <span class="font-bold text-text-primary">Salaam Alaikum!</span> I'm
            <span class="font-bold text-neo-secondary">Hoceine EL Idrissi</span>, a versatile
            Full Stack Web Developer based in Morocco.
          </p>

          <p class="text-lg text-text-secondary leading-relaxed">
            My tech arsenal includes <span class="font-bold text-text-primary">Laravel, PHP, Nuxt.js, Vue.js,</span>
            and I have a particular soft spot for <span class="font-bold text-neo-primary">Tailwind CSS</span>.
          </p>

          <p class="text-lg text-text-secondary leading-relaxed">
            As a quick learner, I'm always up for acquiring new skills that prove useful in the
            ever-evolving web development landscape. My passion for creating elegant and functional
            web solutions drives me forward.
          </p>

          <a href="mailto:contact@hoceine.com" class="neo-btn-primary inline-flex mt-4">
            Let's Collaborate
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <!-- Services cards - full width on right -->
        <div class="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          <div class="neo-card p-5 group">
            <div class="w-12 h-12 bg-neo-primary border-3 border-border flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-sm uppercase mb-2">SaaS Products</h3>
            <p class="text-xs text-text-secondary">Building scalable web applications</p>
          </div>

          <div class="neo-card p-5 group">
            <div class="w-12 h-12 bg-neo-secondary border-3 border-border flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-neo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-sm uppercase mb-2">Admin Panels</h3>
            <p class="text-xs text-text-secondary">Powerful dashboards with Filament</p>
          </div>

          <div class="neo-card p-5 group">
            <div class="w-12 h-12 bg-neo-primary border-3 border-border flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-sm uppercase mb-2">Real-time Apps</h3>
            <p class="text-xs text-text-secondary">Interactive UIs with Livewire</p>
          </div>

          <div class="neo-card p-5 group">
            <div class="w-12 h-12 bg-neo-secondary border-3 border-border flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-neo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-sm uppercase mb-2">AI-Powered Dev</h3>
            <p class="text-xs text-text-secondary">Building smarter with Claude</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped></style>
