<template>
  <div
    class="fixed bottom-7 right-7 z-[54] border-2 border-coral-red bg-main-violet shadow-lg shadow-main-violet rounded-full cursor-pointer"
    @click="scrollToBottom"
  >
    <IconsArrow :class="classRotate" class="w-7 h-7 transition duration-500" />
  </div>
</template>

<script setup>
const to = ref(false);
const classRotate = ref("");

const scrollToBottom = () => {
  window.scrollTo({
    top: to.value ? 0 : document.body.scrollHeight,
    behavior: "smooth",
  });
  to.value = !to.value;
};

watch(to, () => {
  classRotate.value = to.value == true ? "rotate-180" : "";
});
onMounted(() => {
  window.addEventListener("scroll", () => {
    if (window.scrollY == 0) {
      to.value = false;
    } else {
      to.value = true;
    }
  });
});
</script>
