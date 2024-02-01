<template>
  <div class="img-cont" ref="imageContainer">
    <NuxtImg
      v-if="!imageType"
      :src="text"
      loading="lazy"
      class="w-full"
      :alt="helperText ? helperText : 'Image in Hoceine El Idrissi blog'"
      @click="isMobile ? null : toggleZoom()"
      :class="{ zoomed: isZoomed }"
      format="webp"
    />
    <NuxtImg
      v-else
      :src="text"
      loading="lazy"
      class="w-full"
      :alt="helperText ? helperText : 'Gif in Hoceine El Idrissi blog '"
      @click="isMobile ? null : toggleZoom()"
      :class="{ zoomed: isZoomed }"
    />
  </div>
</template>

<script setup>
defineProps({
  text: String,
  helperText: String,
  imageType: String,
});
const isZoomed = ref(false);
const isMobile = ref(false);

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value;
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.img-cont {
  position: relative;
  cursor: zoom-in;
}
img {
  transition: transform 0.3s ease-in-out;
}
.zoomed {
  transform: scale(1.3);
  cursor: zoom-out;
  position: relative;
  z-index: 20;
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: white;
  cursor: pointer;
}

@media (max-width: 1200px) {
  .zoomed {
    transform: scale(1.1);
  }
}
/* Apply styles only for screens with a minimum width of 768 pixels (adjust as needed) */
@media (max-width: 768px) {
  .zoomed {
    transform: none;
    /* Remove scaling on mobile screens */
  }

  .close-icon {
    display: none;
    /* Hide close icon on mobile screens */
  }
}
</style>
