<template>
  <div class="code-block-wrapper relative my-6">
    <div v-if="language" class="code-language">{{ language }}</div>
    <div v-if="filename" class="code-filename">{{ filename }}</div>
    <pre :class="[$props.class, `language-${language}`]" :style="style"><slot /></pre>
  </div>
</template>

<script setup lang="ts">
defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array as () => number[],
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  },
  style: {
    type: [String, Object],
    default: null
  }
})
</script>

<style>
.code-block-wrapper {
  position: relative;
}

.code-language {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 1;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  background: oklch(var(--sun));
  color: oklch(var(--on-sun));
}

.code-filename {
  padding: 0.5rem 1.25rem;
  border-radius: 1rem 1rem 0 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  background: oklch(0.25 0.02 270);
  color: oklch(0.8 0.01 270);
}

.code-filename + pre {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}

/* Ensure Shiki styles are applied */
pre code {
  counter-reset: line;
}

pre code .line {
  display: block;
  min-height: 1rem;
}

/* Shiki theme overrides for better visibility */
.shiki {
  background: #1a1b26 !important;
}

.shiki code {
  background: transparent !important;
}
</style>
