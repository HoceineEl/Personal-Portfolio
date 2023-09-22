<script setup>
import { meta, tesla, shopify } from "../../assets";
</script>
<template>
  <div class="relative section">
    <div class="text-center mb-16">
      <p class="header">What I have done so far</p>
      <h3 class="header-secondary">Work Experience.</h3>
    </div>
    <div>
      <div class="timeline">
        <div
          class="w-10 h-10 rounded-full translate-y-20 border-4 bg-[#17132b] border-[#17132b] p-1"
        >
          <img loading="lazy" :src="meta" alt="Arcade" />
        </div>
        <div
          class="w-10 h-10 rounded-full translate-y-[25rem] border-4 bg-[#17132b] border-[#17132b] p-1"
        >
          <img loading="lazy" :src="shopify" alt="GoogleCloud" />
        </div>
      </div>
      <div class="lg:w-[900px] flex justify-end mx-auto">
        <div class="w-96 bg-gray-800 mt-24 py-4 rounded-lg relative">
          <div class="px-8 w-full">
            <h3 class="font-bold text-xl">Windows Forms .NET Developer</h3>
            <p class="text-secondary">A2 Services Et Technologies</p>
          </div>
          <ul class="mt-5 text-[13px] flex flex-col gap-2 list-disc ms-8 px-8 mb-6">
            <li>
              Created a library management system using Windows Forms, SQL Server, and C#
              during my internship.
            </li>
            <li>Gained valuable hands-on experience in application programming.</li>
            <li>Collaborated with the CEO to understand project requirements.</li>
            <li>Contributed to my skill set as a developer.</li>
          </ul>
          <span class="absolute bottom-0 w-full h-2 bg-slate-50 rounded-b-lg"></span>
        </div>
      </div>
      <div class="lg:w-[900px] flex justify-start mx-auto">
        <div class="w-96 h-[400px] bg-gray-800"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  @apply z-30 w-1 bg-secondary sm:mx-auto sm:h-[57rem] lg:flex flex-col justify-start items-center mt-0 absolute left-1/2 transform -translate-x-1/2;
}
</style>
