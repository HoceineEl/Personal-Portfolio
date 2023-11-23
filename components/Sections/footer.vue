<script setup>
import { github, linkedin } from "~/assets";
</script>

<template>
  <footer class="w-full flex justify-around items-center py-10 mt-10" role="contentinfo">
    <p>Hoceine El Idrissi &copy; 2023</p>
    <div class="flex gap-10">
      <a
        href="https://github.com/hoceineel"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Hoceine El Idrissi's GitHub account"
      >
        <NuxtImg
          format="webp"
          quality="70"
          :src="github"
          alt="GitHub"
          width="35"
          loading="lazy"
        />
      </a>
      <a
        href="https://linkedin.com/in/elidrissihoceine"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Hoceine El Idrissi's LinkedIn account"
      >
        <NuxtImg
          format="webp"
          quality="70"
          :src="linkedin"
          alt="LinkedIn"
          width="35"
          loading="lazy"
        />
      </a>
    </div>
  </footer>
</template>

<style></style>
