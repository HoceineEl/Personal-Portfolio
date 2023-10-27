<template>
  <footer class="w-full flex">
    <p>Hoceine El idrissi &copy 2023</p>
    <div class="flex gap-10">
      <a href="https://github.com/hoceineel"
        ><img :src="github" alt="hoceine el idrissi github account" width="50"
      /></a>
      <a href="https://linkedin.com/in/elidrissihoceine"
        ><img :src="linkedin" alt="hoceine el idrissi linkedin account" width="50"
      /></a>
    </div>
  </footer>
</template>

<script setup>
import { github, linkedin } from "~/assets";
</script>

<style></style>
