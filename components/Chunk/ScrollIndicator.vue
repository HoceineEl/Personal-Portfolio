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
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var winHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (scrollTop / winHeight) * 100;
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
  z-index: 400;
}
#myBar {
  width: 0;
  height: 8px;
}
</style>
