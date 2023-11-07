<template>
  <img :src="imgSrc()" :alt="alt" />
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: false,
    },
  },
  methods: {
    imgSrc() {
      try {
        return require(`~/assets/blog/${this.src}`);
      } catch (error) {
        return null;
      }
    },
  },
};
</script>
