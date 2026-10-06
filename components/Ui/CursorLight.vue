<script setup>
const root = ref(null);
const active = ref(false);
const hovering = ref(false);
const pressed = ref(false);
const target = { x: 0, y: 0 };
const ring = { x: 0, y: 0 };
let frame = 0;
let finePointer;
let reducedMotion;

const interactive = "a, button, input, textarea, select, label, summary, [role='button']";

const loop = () => {
  const ease = reducedMotion.matches ? 1 : 0.18;
  ring.x += (target.x - ring.x) * ease;
  ring.y += (target.y - ring.y) * ease;
  const style = root.value.style;
  style.setProperty("--cx", `${target.x}px`);
  style.setProperty("--cy", `${target.y}px`);
  style.setProperty("--rx", `${ring.x}px`);
  style.setProperty("--ry", `${ring.y}px`);
  frame = Math.abs(target.x - ring.x) + Math.abs(target.y - ring.y) > 0.2 ? requestAnimationFrame(loop) : 0;
};

const move = (event) => {
  if (event.pointerType !== "mouse") return;
  target.x = event.clientX;
  target.y = event.clientY;
  if (!active.value) {
    ring.x = target.x;
    ring.y = target.y;
    active.value = true;
  }
  hovering.value = Boolean(event.target.closest?.(interactive));
  if (!frame) frame = requestAnimationFrame(loop);
};

const leave = () => (active.value = false);
const down = () => (pressed.value = true);
const up = () => (pressed.value = false);

onMounted(() => {
  finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (!finePointer.matches) return;
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointerdown", down, { passive: true });
  window.addEventListener("pointerup", up, { passive: true });
  document.documentElement.addEventListener("pointerleave", leave);
});

onUnmounted(() => {
  cancelAnimationFrame(frame);
  window.removeEventListener("pointermove", move);
  window.removeEventListener("pointerdown", down);
  window.removeEventListener("pointerup", up);
  document.documentElement.removeEventListener("pointerleave", leave);
});
</script>

<template>
  <div ref="root" class="cursor contents" :class="{ 'is-active': active, 'is-hovering': hovering, 'is-pressed': pressed }" aria-hidden="true">
    <div class="light pointer-events-none fixed inset-0 z-toast" />
    <div class="ring pointer-events-none fixed left-0 top-0 z-toast" />
  </div>
</template>

<style scoped>
.cursor {
  --cx: -100vw;
  --cy: -100vh;
  --rx: -100vw;
  --ry: -100vh;
}

.light,
.ring {
  opacity: 0;
}

.is-active .ring {
  opacity: 1;
}

.light {
  background-image: repeating-linear-gradient(-32deg, oklch(var(--sun) / 0.55) 0 14px, transparent 14px 36px);
  mask-image: radial-gradient(18rem 18rem at var(--cx) var(--cy), black, transparent 70%);
  mix-blend-mode: multiply;
  transition: opacity 0.4s var(--ease-out);
}

.is-active .light {
  opacity: 0.35;
}

:global(.dark .cursor.is-active .light) {
  mix-blend-mode: screen;
  opacity: 0.32;
}

.ring {
  width: 2.25rem;
  height: 2.25rem;
  border: 1.5px solid white;
  border-radius: 999px;
  mix-blend-mode: difference;
  translate: calc(var(--rx) - 50%) calc(var(--ry) - 50%);
  transition: opacity 0.4s var(--ease-out), scale 0.35s var(--ease-out), background-color 0.25s;
}

.is-hovering .ring {
  scale: 1.75;
  background-color: white;
}

.is-pressed .ring {
  scale: 0.8;
}

.is-hovering.is-pressed .ring {
  scale: 1.45;
}

@media (prefers-reduced-motion: reduce) {
  .light {
    display: none;
  }
}
</style>
