<template>
  <div class="code-block-wrapper relative my-6">
    <!-- Language label -->
    <div v-if="language" class="code-language">
      {{ language }}
    </div>
    <!-- Filename if provided -->
    <div v-if="filename" class="code-filename">
      {{ filename }}
    </div>
    <slot />
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
  }
})
</script>

<style>
.code-block-wrapper {
  position: relative;
}

.code-language {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  text-transform: uppercase;
  background: #CCFF00;
  color: #0D0D0D;
  border-left: 3px solid var(--color-border, #0D0D0D);
  border-bottom: 3px solid var(--color-border, #0D0D0D);
  z-index: 10;
}

.code-filename {
  padding: 8px 16px;
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  background: #1a1a2e;
  color: #a0a0a0;
  border-bottom: 1px solid #333;
}

/* Code block styling */
.code-block-wrapper pre {
  margin: 0 !important;
  padding: 1rem !important;
  overflow-x: auto;
  background: #0d1117 !important;
  border: 3px solid var(--color-border, #FFFEF0);
  box-shadow: 4px 4px 0px var(--color-border, #FFFEF0);
}

.code-block-wrapper pre code {
  font-family: 'JetBrains Mono', ui-monospace, monospace !important;
  font-size: 0.875rem !important;
  line-height: 1.7 !important;
  background: transparent !important;
}

/* Line styling */
.code-block-wrapper pre code .line {
  display: block;
  min-height: 1.5rem;
}

/* Highlighted lines */
.code-block-wrapper pre code .line.highlight {
  background: rgba(204, 255, 0, 0.1);
  border-left: 3px solid #CCFF00;
  margin-left: -1rem;
  padding-left: calc(1rem - 3px);
}
</style>
