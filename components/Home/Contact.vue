<script setup>
import { profile } from "~/assets/constants";

const fields = reactive({ name: "", message: "" });
const copied = ref(false);

const openWhatsApp = () => {
  const text = `Salaam Hoceine, I'm ${fields.name.trim()}.\n\n${fields.message.trim()}`;
  window.open(`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
};

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(profile.email);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    window.location.href = `mailto:${profile.email}`;
  }
};
</script>

<template>
  <section
    id="contact"
    class="relative isolate mx-2 overflow-hidden rounded-[2.5rem] bg-sun py-20 text-on-sun sm:mx-4 md:py-28"
    aria-labelledby="contact-title"
  >
    <div class="contact-light absolute -right-24 -top-24 -z-10 h-[34rem] w-[34rem]" aria-hidden="true" />

    <div class="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
      <div class="lg:col-span-6">
        <h2 id="contact-title" class="wide text-display-lg font-black">
          Have a product in mind? Let's build it.
        </h2>
        <p class="mt-6 max-w-md text-lg leading-relaxed text-on-sun/80">
          Tell me what you're building and where it's stuck. I read and reply to every message myself.
        </p>

        <div class="mt-10 flex flex-wrap items-center gap-3">
          <a
            :href="`mailto:${profile.email}`"
            class="wide break-all text-2xl font-extrabold underline decoration-on-sun/30 decoration-2 underline-offset-8 transition-colors hover:decoration-on-sun sm:text-3xl"
          >
            {{ profile.email }}
          </a>
          <button
            type="button"
            class="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 ring-inset ring-on-sun/25 transition-colors hover:bg-on-sun hover:text-sun"
            @click="copyEmail"
          >
            <UiIcon :name="copied ? 'check' : 'copy'" />
            <span aria-live="polite">{{ copied ? "Copied" : "Copy" }}</span>
          </button>
        </div>

        <dl class="mt-12 grid max-w-md grid-cols-2 gap-6 text-[0.95rem]">
          <div>
            <dt class="text-on-sun/70">Based in</dt>
            <dd class="mt-1 font-semibold">{{ profile.location }}, GMT+1</dd>
          </div>
          <div>
            <dt class="text-on-sun/70">Works with</dt>
            <dd class="mt-1 font-semibold">Founders, agencies, product teams</dd>
          </div>
        </dl>
      </div>

      <form
        class="self-start rounded-[2rem] bg-bg p-6 text-ink shadow-[0_30px_60px_-30px_oklch(0_0_0/0.45)] sm:p-8 lg:col-span-6"
        @submit.prevent="openWhatsApp"
      >
        <label class="block">
          <span class="text-sm font-semibold">Your name</span>
          <input v-model="fields.name" name="name" type="text" autocomplete="name" required class="field mt-2" />
        </label>
        <label class="mt-5 block">
          <span class="text-sm font-semibold">What are you building?</span>
          <textarea
            v-model="fields.message"
            name="message"
            rows="6"
            required
            placeholder="A few lines about the product, the timeline, and what help you need."
            class="field mt-2 resize-y"
          />
        </label>
        <div class="mt-6 flex flex-wrap items-center gap-4">
          <button type="submit" class="btn-sun">
            <UiIcon name="WhatsApp" />
            Continue on WhatsApp
          </button>
          <p class="text-[0.95rem] text-muted">Opens WhatsApp with your message ready to send.</p>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.contact-light {
  background-image: repeating-linear-gradient(-32deg, oklch(var(--on-sun) / 0.07) 0 14px, transparent 14px 34px);
  mask-image: radial-gradient(closest-side, black, transparent);
}
</style>
