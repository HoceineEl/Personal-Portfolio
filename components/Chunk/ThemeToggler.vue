<script>

const isDark = ref(true);
const toggleTheme = () => {
  isDark.value = !isDark.value;
};
</script>
<template>

  <button
    @click="toggleTheme"
    class="w-9 h-9 flex justify-center items-center rounded-full border fixed bottom-5 left-5"
  >
    <Transition name="fade">
      <IconsSun v-if="!isDark" class="w-6 h-6" />
    </Transition>
    <Transition name="fade">
      <IconsMoon v-if="isDark" class="w-6 h-6" />
    </Transition>
  </button>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: scale(1.2);
  transition: all 0.5s ease;
}
</style>
