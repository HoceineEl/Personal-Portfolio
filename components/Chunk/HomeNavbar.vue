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
        aria-label="Hoceine EL IDRISSI"
        class="flex items-center gap-1 font-semibold text-[16px] xs:gap-3 xs:font-bold xs:text-[18px] text-white"
        @click="
          () => {
            setActive('');
            onBeforeMount(() => {
              window.scrollTo(0, 0);
            });
          }
        "
      >
        <NuxtImg
          :src="logo"
          alt="Hoceine el idrissi logo"
          width="66"
          height="41"
          format="webp"
          quality="90"
          loading="lazy"
        />
        <p>Hoceine EL IDRISSI</p>
      </a>
      <ul class="justify-between gap-10 hidden lg:flex">
        <li
          :class="[active == link.title ? 'text-white' : 'text-secondary']"
          class="hover:text-white"
          v-for="link in navLinks"
          :key="link.title"
          @click="setActive(link.title)"
        >
          <NuxtLink
            :prefetch="false"
            :to="link.id"
            class="flex items-center gap-3 font-semibold text-[18px]"
            >{{ link.title }}</NuxtLink
          >
        </li>
      </ul>
      <div @click="setToggle" class="lg:hidden">
        <NuxtImg
          :src="!toggle ? menu : close"
          alt="menu"
          format="webp"
          quality="90"
          class="cursor-pointer"
          width="24"
          height="24"
          loading="lazy"
        />
        <div
          class="mt-10 lg:hidden absolute top-10 right-10 black-gradient p-6 rounded-xl transition-all duration-500"
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
                :prefetch="false"
                class="flex items-center gap-3 font-semibold text-[18px]"
                >{{ link.title }}</NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped></style>
