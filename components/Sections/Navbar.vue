<script setup>
import { logo, close, menu } from "../assets";
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
</script>
<template>
  <nav class="px-6 sm:px-16 py-3">
    <div class="flex justify-between w-full items-center mx-auto max-w-7xl">
      <a
        href="/"
        class="flex items-center gap-3 font-bold text-[18px] text-white"
        @click="
          () => {
            setActive('');
            window.scrollTo(0, 0);
          }
        "
      >
        <img :src="logo" alt="Hoceine" width="60" />
        <p>Hoceine EL IDRISSI</p>
      </a>
      <ul class="justify-between gap-10 hidden sm:flex">
        <li
          :class="[active == link.title ? 'text-white' : 'text-secondary']"
          v-for="link in navLinks"
          :key="link.title"
          @click="setActive(link.title)"
        >
          <a
            ref="'#' + link.id"
            class="flex items-center gap-3 font-semibold text-[18px]"
            >{{ link.title }}</a
          >
        </li>
      </ul>
      <div @click="setToggle" class="sm:hidden">
        <img :src="!toggle ? menu : close" alt="menu" class="cursor-pointer w-7 h-7" />
        <div
          class="mt-10 sm:hidden absolute top-10 right-10 black-gradient p-6 rounded-xl transition-all duration-500"
          :class="{ hidden: !toggle }"
        >
          <ul class="justify-start flex-col gap-3 flex">
            <li
              :class="[active == link.title ? 'text-white' : 'text-secondary']"
              v-for="link in navLinks"
              :key="link.title"
              @click="setActive(link.title)"
            >
              <a
                :href="'#' + link.id"
                class="flex items-center gap-3 font-semibold text-[18px]"
                >{{ link.title }}</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped></style>
