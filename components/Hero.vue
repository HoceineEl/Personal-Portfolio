<script setup></script>
<template>
  <section class="mt-16 h-screen w-full max-w-7xl mx-auto">
    <div class="flex gap-5 px-6">
      <div class="flex flex-col items-center justify-center">
        <div class="w-4 h-4 rounded-full bg-main-violet" />
        <div class="w-1 h-40 sm:h-80 bg-gradient-to-b from-main-violet" />
      </div>
      <div>
        <h1
          class="lg:text-7xl sm:text-6xl xs:text-5xl text-4xl font-black lg:leading-[96px] mt-4 text-white-100"
        >
          Hi ,I'm <span class="text-main-violet">Hoceine</span>
        </h1>
        <p class="text-md sm:text-lg lg:text-2xl mt-2 font-semibold text-white-100">
          Passionate coder crafting digital<br class="hidden sm:block" />
          solutions with creativity and precision. Explore more!
        </p>
      </div>
    </div>

    <div
      class="absolute z-30 h-72 top-72 xs:h-96 xs:top-52 w-full md:top-44 md:h-[600px] lg:top-32 lg:h-[800px] xl:h-[1000px] lg:right-24"
    >
      <ClientOnly>
        <CanvasDesktop />
      </ClientOnly>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
