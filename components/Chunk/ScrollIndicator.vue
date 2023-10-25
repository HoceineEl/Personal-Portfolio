<template>
  <div class="w-full h-2 fixed top-0 left-0 z-[60] bg-transparent">
    <div class="w-0 h-2 bg-gr-scroll" id="myBar"></div>
  </div>
</template>

<script setup>
onBeforeMount(() => {
  window.onscroll = function () {
    myFunction();
  };
});
function myFunction() {
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  var winHeight =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (scrollTop / winHeight) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
}
</script>
