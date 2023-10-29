<template>
  <footer class="w-full flex justify-around items-center py-10 mt-10">
    <p>Hoceine El idrissi &copy 2023</p>
    <div class="flex gap-10">
      <a href="https://github.com/hoceineel" target="_blank"
        ><img :src="github" alt="hoceine el idrissi github account" width="35"
      /></a>
      <a href="https://linkedin.com/in/elidrissihoceine" target="_blank"
        ><img :src="linkedin" alt="hoceine el idrissi linkedin account" width="35"
      /></a>
    </div>
  </footer>
</template>

<script setup>
import { github, linkedin } from "~/assets";
</script>

<style></style>
