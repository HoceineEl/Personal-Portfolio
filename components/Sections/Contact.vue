<template>
  <section
    id="contact"
    class="section relative"
    role="region"
    aria-labelledby="contact-heading"
  >
    <!-- Decorative elements -->
    <div class="absolute top-20 right-10 w-24 h-24 bg-neo-pink border-3 border-border rotate-12 hidden lg:block" />
    <div class="absolute bottom-20 left-10 w-16 h-16 bg-neo-cyan border-3 border-border -rotate-6 hidden lg:block" />

    <div class="grid lg:grid-cols-2 gap-12 items-start">
      <!-- Left side - Info -->
      <div>
        <span class="section-label">Contact</span>
        <h2 id="contact-heading" class="header-secondary mb-6">
          Let's Work
          <span class="relative inline-block">
            <span class="relative z-10">Together</span>
            <span class="absolute -bottom-1 left-0 w-full h-3 bg-neo-lime -z-0 rotate-1" />
          </span>
        </h2>

        <p class="text-lg text-text-secondary mb-8 leading-relaxed max-w-lg">
          Have a project in mind or want to collaborate? I'm always open to discussing
          new opportunities and interesting ideas.
        </p>

        <!-- Contact info cards -->
        <div class="space-y-4 mb-8">
          <div class="neo-card p-4 flex items-center gap-4">
            <div class="w-12 h-12 bg-neo-pink border-3 border-border flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span class="text-xs font-mono uppercase text-text-secondary">Email</span>
              <p class="font-display font-bold text-text-primary">contact@hoceine.com</p>
            </div>
          </div>

          <div class="neo-card p-4 flex items-center gap-4">
            <div class="w-12 h-12 bg-neo-cyan border-3 border-border flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-neo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span class="text-xs font-mono uppercase text-text-secondary">Location</span>
              <p class="font-display font-bold text-text-primary">Morocco</p>
            </div>
          </div>

          <div class="neo-card p-4 flex items-center gap-4">
            <div class="w-12 h-12 bg-neo-lime border-3 border-border flex items-center justify-center shrink-0">
              <svg class="w-6 h-6 text-neo-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span class="text-xs font-mono uppercase text-text-secondary">Availability</span>
              <p class="font-display font-bold text-neo-lime">Open for Freelance</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side - Form -->
      <div class="neo-card p-6 sm:p-8">
        <h3 class="font-display font-bold text-xl mb-6">Send a Message</h3>

        <form @submit.prevent="sendMail" ref="form" class="space-y-5">
          <div>
            <label for="from_name" class="block text-sm font-mono uppercase text-text-secondary mb-2">
              Your Name
            </label>
            <input
              id="from_name"
              type="text"
              name="from_name"
              v-model="from_name"
              placeholder="John Doe"
              class="neo-input"
              required
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-mono uppercase text-text-secondary mb-2">
              Your Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              v-model="email"
              placeholder="john@example.com"
              class="neo-input"
              required
            />
          </div>

          <div>
            <label for="message" class="block text-sm font-mono uppercase text-text-secondary mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              v-model="message"
              rows="5"
              placeholder="Tell me about your project..."
              class="neo-input resize-none"
              required
            ></textarea>
          </div>

          <button type="submit" class="neo-btn-primary w-full justify-center">
            <span>Send Message</span>
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>

          <!-- Status message -->
          <Transition name="fade">
            <p v-if="statusMessage" :class="statusClass" class="text-center font-mono text-sm py-2">
              {{ statusMessage }}
            </p>
          </Transition>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import emailjs from "@emailjs/browser";

const form = ref(null);
const from_name = ref("");
const email = ref("");
const message = ref("");
const statusMessage = ref("");
const statusClass = ref("");

const sendMail = () => {
  if (from_name.value && email.value && message.value) {
    emailjs
      .sendForm("service_5arij5h", "template_4wluw72", form.value, "_673j4Vui7FOnZXwS")
      .then(
        () => {
          statusMessage.value = "Message sent successfully!";
          statusClass.value = "text-neo-lime";
          from_name.value = "";
          email.value = "";
          message.value = "";
          setTimeout(() => {
            statusMessage.value = "";
          }, 3000);
        },
        () => {
          statusMessage.value = "Failed to send. Please try again.";
          statusClass.value = "text-neo-pink";
          setTimeout(() => {
            statusMessage.value = "";
          }, 3000);
        }
      );
  } else {
    statusMessage.value = "Please fill all fields.";
    statusClass.value = "text-neo-orange";
    setTimeout(() => {
      statusMessage.value = "";
    }, 3000);
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
