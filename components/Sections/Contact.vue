<template>
  <section
    id="contact"
    class="section flex flex-wrap gap-10 justify-around relative mt-10"
    role="region"
    aria-labelledby="contact-heading"
  >
    <div
      class="sm:w-[500px] w-full bg-tertiary py-8 px-10 rounded-lg order-0"
      v-motion-slide-visible-once-left
    >
      <p class="uppercase text-secondary">Get In Touch</p>
      <h2 id="contact-heading" class="text-3xl md:text-5xl font-bold mt-4 mb-8">
        Contact Us
      </h2>

      <form @submit.prevent="sendMail" ref="form" class="flex flex-col gap-5">
        <label for="from_name" class="form-label">Your Name</label>
        <input
          class="form-input"
          type="text"
          name="from_name"
          v-model="from_name"
          placeholder="What's your good name?"
          aria-label="Your Name"
        />
        <label for="email" class="form-label">Your Email</label>
        <input
          class="form-input"
          type="email"
          name="email"
          v-model="email"
          placeholder="What's your Email?"
          aria-label="Your Email"
        />
        <label for="message" class="form-label">Your Message</label>
        <textarea
          name="message"
          v-model="message"
          cols="30"
          rows="10"
          class="form-input"
          placeholder="What you want to say?"
          aria-label="Your Message"
        ></textarea>
        <button
          type="submit"
          class="bg-tertiary rounded-lg w-fit py-3 px-6 font-semibold"
          aria-label="Send Message"
        >
          Send
        </button>
      </form>
    </div>
    <div
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      :class="isPressed ? 'cursor-grabbing' : 'cursor-grab'"
      class="flex justify-center items-center w-[700px] h-[400px] xs:h-[500px] sm:h-[600] md:h-[800px] -order-1 lg:order-2 p-10 sm:p-4"
      v-motion-slide-visible-once-right
      role="img"
      aria-label="Visual representation of Earth"
    >
      <LazyCanvasObject
        :object="Earth"
        :scale="0.018"
        :speed="10"
        :type="'planet'"
        class="absolute top-20"
      />
    </div>
  </section>
</template>

<script setup>
import { Earth } from "~/assets/constants";
import emailjs from "@emailjs/browser";
const form = ref(null);
const from_name = ref("");
const email = ref("");
const message = ref("");
const isPressed = ref(false);
const handleMouseDown = () => {
  isPressed.value = true;
};
const handleMouseUp = () => {
  isPressed.value = false;
};
const sendMail = () => {
  if (from_name.value != "" && email.value != "" && message.value != "") {
    emailjs
      .sendForm("service_5arij5h", "template_4wluw72", form.value, "_673j4Vui7FOnZXwS")
      .then(
        (result) => {
          setElm("Your message has been sent successfully.", "text-green-400");
          form.value.reset();
        },
        (error) => {
          setElm(
            "There was an error sending your message. Please try again later.",
            "text-yellow-400"
          );
        }
      );
  } else {
    setElm("Please fill all the fields.", "text-red-400");
  }
  function setElm(text, color) {
    const el = document.createElement("p");
    el.classList.add(color);
    el.innerText = text;
    form.value.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 2500);
  }
};
</script>

<style scoped>
.form-label {
  @apply font-normal text-[14px] xs:font-medium xs:text-[16px];
}
.form-input {
  @apply py-1 px-2 sm:py-2 text-[12px] sm:text-[16px] sm:px-4  rounded-md focus:outline-none bg-[#1E1E3B];
}
</style>
