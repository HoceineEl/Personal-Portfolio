<script setup>
import { devosoft, a2st, sosipo } from "~/assets";
import { experiences } from "~/assets/constants";
</script>
<template>
  <section id="work" class="relative section">
    <div class="text-center mb-16">
      <p class="header">What I have done so far</p>
      <h3 class="header-secondary">Work Experience.</h3>
    </div>
    <div class="flex lg:block gap-20 px-1">
      <div class="timeline" aria-hidden="true" role="presentation">
        <div class="timeline-img translate-y-[10rem]">
          <NuxtImg
            format="webp"
            quality="70"
            :src="devosoft"
            alt="devosoft"
            class="mt-1"
            loading="lazy"
            height="60"
          />
        </div>
        <div
          class="timeline-img translate-y-[36rem] sm:translate-y-[35rem] md:translate-y-[36rem]"
        >
          <NuxtImg
            format="webp"
            quality="70"
            :src="sosipo"
            alt="sosipo"
            class="mt-1"
            loading="lazy"
            width="80"
            height="80"
          />
        </div>
        <div
          class="timeline-img translate-y-[59rem] sm:translate-y-[54rem] md:translate-y-[59rem]"
        >
          <NuxtImg
            format="webp"
            quality="70"
            :src="a2st"
            alt="a2st"
            class="rounded-sm mt-1"
            loading="lazy"
            width="80"
            height="40"
          />
        </div>
      </div>
      <div class="">
        <div
          class="lg:w-[900px] flex mx-auto justify-between mb-6"
          v-for="(exp, index) in experiences"
          :key="exp.title"
          v-motion-slide-visible-once-left="index % 2 === 0"
          v-motion-slide-visible-once-right="index % 2 !== 0"
        >
          <div
            class="relative p-[1px] bg-white rounded-lg green-pink-gradient"
            :class="[index % 2 ? 'order-3' : '-order-1']"
          >
            <div
              class="lg:w-96 w-full bg-tertiary py-4 rounded-lg min-h-[20rem]"
              role="region"
            >
              <div class="w-full flex justify-center items-center mb-3 sm:hidden">
                <div
                  class="w-16 h-16 rounded-full bg-[#261D56] flex items-center justify-center p-3"
                >
                  <NuxtImg
                    format="webp"
                    quality="70"
                    :src="exp.icon"
                    :alt="exp.company_name"
                    class="p-1 h-fit w-8"
                    loading="lazy"
                  />
                </div>
              </div>
              <div class="px-8 w-full">
                <h3 class="font-bold text-xl">{{ exp.title }}</h3>
                <p class="text-secondary">{{ exp.company_name }}</p>
              </div>
              <ul
                class="mt-5 text-[13px] text-gray-200 flex flex-col gap-2 list-disc ms-8 px-8 mb-6"
              >
                <li v-for="point in exp.points" role="listitem">{{ point }}</li>
              </ul>
              <p class="text-secondary mt-2 px-8 lg:hidden">{{ exp.date }}</p>
            </div>
          </div>
          <div
            class="mt-40 w-96 text-center text-secondary hidden lg:flex"
            :class="[index % 2 ? 'justify-end' : 'justify-start']"
            role="contentinfo"
          >
            <p class="max-w-[300px]">{{ exp.date }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.timeline {
  @apply z-[2] w-1 bg-secondary lg:mx-auto h-[1300px] sm:flex flex-col lg:justify-start items-center mt-0 lg:absolute relative lg:left-1/2 left-5 transform lg:-translate-x-1/2 hidden;
}

.timeline-img {
  @apply w-12 h-12 rounded-full border bg-primary border-white-100 flex items-center justify-center p-2;
}
</style>
