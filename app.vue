<template>
  <div>
    <div class="progress-container">
      <div class="w-0 h-2 bg-gr-scroll" id="myBar"></div>
    </div>
    <NuxtLayout>
      <div>
        <NuxtLoadingIndicator class="z-[300] h-2 bg-gr-scroll" :height="8" />
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>
<script setup>
useHead({
  meta: [
    {
      name: "google-site-verification",
      content: "1-6g_gEt8lfYyb7CwGwQ5b2sDuF1eYzKTc0BxdkmviE",
    },
  ],
});
onBeforeMount(() => {
  window.onscroll = function () {
    myFunction();
  };
});
function myFunction() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
}
</script>
<style scoped>
.progress-container {
  position: fixed;
  z-index: 11;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: transparent;
}

/* The progress bar (scroll indicator) */
</style>
