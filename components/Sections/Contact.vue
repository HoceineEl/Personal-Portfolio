<template>
  <section
    id="contact"
    class="section flex flex-wrap gap-10 justify-around relative mt-10"
  >
    <div class="absolute -z-10">
      <LazySectionsStarsCanvas />
    </div>

    <div class="sm:w-[500px] w-full bg-black-100 py-8 px-10 rounded-lg order-0">
      <p class="uppercase text-secondary">Get In Touch</p>
      <h2 class="text-3xl md:text-5xl font-bold mt-4 mb-8">Contact Us</h2>

      <form @submit.prevent="sendMail" ref="form" class="flex flex-col gap-5">
        <label for="from_name" class="font-medium">Your Name</label>
        <input
          class="py-2 px-4 rounded-md focus:outline-none bg-tertiary"
          type="text"
          name="from_name"
          v-model="from_name"
          placeholder="What's your good name?"
        />
        <label for="email" class="font-medium">Your Email</label>
        <input
          class="py-2 px-4 rounded-md focus:outline-none bg-tertiary "
          type="email"
          name="email"
          v-model="email"
          placeholder="What's your Email?"
        />
        <label for="message" class="font-medium">Your Message</label>
        <textarea
          name="message"
          v-model="message"
          cols="30"
          rows="10"
          class="py-2 px-4 rounded-md focus:outline-none bg-tertiary"
          placeholder="What you want to say?"
        ></textarea>
        <button
          type="submit"
          class="bg-tertiary rounded-lg w-fit py-3 px-6 font-semibold"
        >
          Send
        </button>
      </form>
    </div>
    <div
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      :class="isPressed ? 'cursor-grabbing' : 'cursor-grab'"
      class="flex justify-center items-center w-[700px] h-[400px] xs:h-[500px] sm:h-[600] md:h-[800px] -order-1 lg:order-2"
    >
      <LazyCanvasObject :object="Earth" :scale="1.5" :speed="10" :type="'planet'" />
    </div>
  </section>
</template>

<script setup>
import { Earth } from "~/assets/constants";
import emailjs from "@emailjs/browser";
const form = ref(null);
const isPressed = ref(false);
const handleMouseDown = () => {
  isPressed.value = true;
};
const handleMouseUp = () => {
  isPressed.value = false;
};
const sendMail = () => {
  emailjs
    .sendForm("service_5arij5h", "template_4wluw72", form.value, "_673j4Vui7FOnZXwS")
    .then(
      (result) => {
        console.log("SUCCESS!", result.text);
      },
      (error) => {
        console.log("FAILED...", error.text);
      }
    );
};
const clearFields = () => {};
</script>

<style lang="scss" scoped></style>
