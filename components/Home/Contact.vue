<script setup>
const { t } = useI18n();
const { profile } = useSiteData();
const fields = reactive({ name: "", message: "" });
const copied = ref(false);
const whatsappNumber = `+${profile.value.whatsapp.replace(/^(\d{3})(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5 $6")}`;

const sent = ref(false);

const submit = () => {
  const name = fields.name.trim();
  const message = fields.message.trim();

  $fetch("/api/contact", { method: "POST", body: { name, message } }).catch(() => {});

  const text = t("contact.whatsappText", { name, message });
  window.open(`https://wa.me/${profile.value.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  sent.value = true;
};

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(profile.value.email);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    window.location.href = `mailto:${profile.value.email}`;
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
          {{ t("contact.title") }}
        </h2>
        <p class="mt-6 max-w-md text-lg leading-relaxed text-on-sun/80">
          {{ t("contact.intro") }}
        </p>

        <div class="mt-10 flex flex-wrap items-center gap-3">
          <a
            :href="`mailto:${profile.email}`"
            dir="ltr"
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
            <span aria-live="polite">{{ copied ? t("contact.copied") : t("contact.copy") }}</span>
          </button>
        </div>

        <a
          :href="`https://wa.me/${profile.whatsapp}`"
          target="_blank"
          rel="noopener"
          class="mt-5 inline-flex items-center gap-3 text-xl font-bold transition-opacity hover:opacity-70 sm:text-2xl"
        >
          <UiIcon name="WhatsApp" />
          <span class="tabular-nums" dir="ltr">{{ whatsappNumber }}</span>
        </a>

        <dl class="mt-12 grid max-w-md grid-cols-2 gap-6 text-[0.95rem]">
          <div>
            <dt class="text-on-sun/70">{{ t("contact.basedIn") }}</dt>
            <dd class="mt-1 font-semibold">{{ t("contact.basedValue", { place: profile.location }) }}</dd>
          </div>
          <div>
            <dt class="text-on-sun/70">{{ t("contact.worksWith") }}</dt>
            <dd class="mt-1 font-semibold">{{ t("contact.worksWithValue") }}</dd>
          </div>
        </dl>
      </div>

      <form
        class="self-start rounded-[2rem] bg-bg p-6 text-ink shadow-[0_30px_60px_-30px_oklch(0_0_0/0.45)] sm:p-8 lg:col-span-6"
        @submit.prevent="submit"
      >
        <label class="block">
          <span class="text-sm font-semibold">{{ t("contact.name") }}</span>
          <input v-model="fields.name" name="name" type="text" autocomplete="name" required class="field mt-2" />
        </label>
        <label class="mt-5 block">
          <span class="text-sm font-semibold">{{ t("contact.message") }}</span>
          <textarea
            v-model="fields.message"
            name="message"
            rows="6"
            required
            :placeholder="t('contact.placeholder')"
            class="field mt-2 resize-y"
          />
        </label>
        <div class="mt-6 flex flex-wrap items-center gap-4">
          <button type="submit" class="btn-sun">
            <UiIcon name="WhatsApp" />
            {{ t("contact.submit") }}
          </button>
          <p class="text-[0.95rem] text-muted" role="status" aria-live="polite">
            {{ sent ? t("contact.sent") : t("contact.helper") }}
          </p>
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
