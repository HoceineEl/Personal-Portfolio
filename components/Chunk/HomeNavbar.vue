<script setup>
import { logo, close, menu, linkedin, github } from "../assets";
import { navLinks } from "../assets/constants";
import { ref } from "vue";
const active = ref("");
const toggle = ref(false);
const setActive = (link) => {
  active.value = link;
};
const setToggle = () => {
  toggle.value = !toggle.value;
};
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
  <nav
    class="w-full flex items-center py-5 fixed top-0 z-[10]"
    :class="[onScroll ? 'bg-primary' : 'bg-transparent']"
  >
    <div class="w-full flex justify-between items-center max-w-7xl mx-auto px-2">
      <a
        href="/"
        class="flex items-center gap-1 font-semibold text-[16px] xs:gap-3 xs:font-bold xs:text-[18px] text-white"
        @click="
          () => {
            setActive('');
            onBeforeMount(()=>{
              window.scrollTo(0, 0);
            })
          }
        "
      >
        <img :src="logo" alt="Hoceine" width="60" loading="lazy" />
        <p>Hoceine EL IDRISSI</p>
      </a>
      <ul class="justify-between gap-10 hidden md:flex">
        <li
          :class="[active == link.title ? 'text-white' : 'text-secondary']"
          class="hover:text-white"
          v-for="link in navLinks"
          :key="link.title"
          @click="setActive(link.title)"
        >
          <NuxtLink
            :to="link.id"
            class="flex items-center gap-3 font-semibold text-[18px]"
            >{{ link.title }}</NuxtLink
          >
        </li>
        <li>
          <a href="https://github.com/hoceineel" target="_blank"
            ><img
              :src="github"
              alt="hoceine el idrissi github profile"
              width="30"
              loading="lazy"
          /></a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/elidrissihoceine/" target="_blank">
            <img
              :src="linkedin"
              alt="hoceine el idrissi linkedin profile"
              width="30"
              loading="lazy"
          /></a>
        </li>
      </ul>
      <div @click="setToggle" class="md:hidden">
        <img
          :src="!toggle ? menu : close"
          alt="menu"
          class="cursor-pointer w-7 h-7"
          width="100"
          loading="lazy"
        />
        <div
          class="mt-10 sm:hidden absolute top-10 right-10 black-gradient p-6 rounded-xl transition-all duration-500"
          :class="{ hidden: !toggle }"
        >
          <ul class="justify-start flex-col gap-3 flex">
            <li
              :class="[active == link.title ? 'text-white' : 'text-secondary']"
              v-for="link in navLinks"
              class="hover:text-white"
              :key="link.title"
              @click="setActive(link.title)"
            >
              <NuxtLink
                :to="link.id"
                class="flex items-center gap-3 font-semibold text-[18px]"
                >{{ link.title }}</NuxtLink
              >
            </li>
            <li>
              <a href="https://github.com/hoceineel" target="_blank"
                ><img
                  :src="github"
                  alt="hoceine el idrissi github profile"
                  width="30"
                  loading="lazy"
              /></a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/elidrissihoceine/" target="_blank">
                <img
                  :src="linkedin"
                  alt="hoceine el idrissi linkedin profile"
                  width="30"
                  loading="lazy"
              /></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped></style>
