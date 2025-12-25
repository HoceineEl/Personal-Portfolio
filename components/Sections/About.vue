<template>
  <section class="section relative" id="about">
    <!-- Decorative element -->
    <div class="absolute -top-10 right-0 w-20 h-20 bg-neo-secondary border-3 border-border rotate-12 hidden md:block" />

    <div class="max-w-4xl">
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
      <div class="grid md:grid-cols-2 gap-8 mt-10">
        <!-- Text content -->
        <div class="space-y-6">
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

        <!-- Services cards -->
        <div class="grid grid-cols-2 gap-4">
          <div class="neo-card p-5 group">
            <div class="w-12 h-12 bg-neo-primary border-3 border-border flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-sm uppercase mb-2">Web Developer</h3>
            <p class="text-xs text-text-secondary">Building modern, responsive websites</p>
          </div>

          <div class="neo-card p-5 group">
            <div class="w-12 h-12 bg-neo-secondary border-3 border-border flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-neo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-sm uppercase mb-2">Vue & Nuxt</h3>
            <p class="text-xs text-text-secondary">Expert in Vue.js ecosystem</p>
          </div>

          <div class="neo-card p-5 group">
            <div class="w-12 h-12 bg-neo-primary border-3 border-border flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-sm uppercase mb-2">Laravel Dev</h3>
            <p class="text-xs text-text-secondary">Backend with Laravel & PHP</p>
          </div>

          <div class="neo-card p-5 group">
            <div class="w-12 h-12 bg-neo-secondary border-3 border-border flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-neo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="font-display font-bold text-sm uppercase mb-2">Content Creator</h3>
            <p class="text-xs text-text-secondary">Sharing knowledge online</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped></style>
