<template>
  <div class="scroll">
    <div class="bg-gr-scroll" id="myBar"></div>
  </div>
</template>

<script setup>
onBeforeMount(() => {
  window.onscroll = function () {
    myFunction();
  };
  function myFunction() {
    var scrollToTop = document.body.scrollTop || document.documentElement.scrollTop;
    var windowHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (scrollToTop / windowHeight) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
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
  z-index: 800;
}
#myBar {
  width: 0;
  height: 8px;
}
</style>
