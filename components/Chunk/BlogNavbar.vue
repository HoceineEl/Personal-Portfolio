<script setup>
import { logo, linkedin, github } from "../assets";
import { ref } from "vue";

const onScroll = ref(false);
const handleScroll = () => {
  if (window.scrollY != 0) {
    onScroll.value = true;
  } else {
    onScroll.value = false;
  }
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
</script>
<template>
  <nav class="w-full flex items-center py-5 fixed top-0 z-20 bg-primary">
    <div class="w-full flex justify-between items-center max-w-7xl mx-auto px-2">
      <a
        href="/"
        class="flex items-center gap-1 font-semibold text-[16px] xs:gap-3 xs:font-bold xs:text-[18px] text-white"
        @click="
          () => {
            window.scrollTo(0, 0);
          }
        "
      >
        <img :src="logo" alt="Hoceine" width="60" loading="lazy" />
        <p>Hoceine EL IDRISSI</p>
      </a>
      <ul class="justify-between gap-3 flex items-center">
        <li class="font-semibold text-lg">
          <NuxtLink to="/blog">Blog</NuxtLink>
        </li>
        <li class="flex gap-3">
          <div>
            <a href="https://github.com/hoceineel" target="_blank"
              ><img
                :src="github"
                alt="hoceine EL IDRISSI github profile"
                width="30"
                loading="lazy"
            /></a>
          </div>

          <div>
            <a href="https://www.linkedin.com/in/elidrissihoceine/" target="_blank">
              <img
                :src="linkedin"
                alt="hoceine EL IDRISSI linkedin profile"
                width="30"
                loading="lazy"
            /></a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped></style>
