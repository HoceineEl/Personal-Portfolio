<template>
  <div class="scroll">
    <div class="bg-gr-scroll" id="myBar"></div>
  </div>
</template>

<script setup>
onBeforeMount(() => {
  window.onscroll = function () {
    updateScrollIndicator();
  };

  function updateScrollIndicator() {
    let scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;
    let pageHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollPercentage = (scrollPosition / pageHeight) * 100;
    document.getElementById("myBar").style.width = scrollPercentage + "%";
  }
});
</script>

<style>
.scroll {
  width: 100%;
  height: 8px;
  position: fixed;
  top: 0;
  background: transparent;
  z-index: 200;
}

#myBar {
  width: 0;
  height: 8px;
}
</style>
