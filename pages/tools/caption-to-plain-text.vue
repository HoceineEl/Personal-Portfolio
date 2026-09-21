<template>
  <section dir="rtl" lang="ar" class="shell flex min-h-[80vh] flex-col items-center justify-center gap-10 pb-20 pt-32 text-center">
    <figure v-if="ayahText" class="max-w-2xl rounded-[2rem] bg-raised px-8 py-6">
      <blockquote class="text-xl leading-loose lg:text-2xl">" {{ ayahText }} "</blockquote>
      <figcaption class="mt-3 text-sm text-muted">{{ ayahSurah }}، الاية {{ ayahNumber }}</figcaption>
    </figure>
    <div>
      <h1 class="wide text-display-lg font-black">مُحمِّل الملفات</h1>
      <p class="mt-4 text-lg text-muted">قم برفع ملفك لمعالجة المحتوى</p>
    </div>
    <label class="btn-sun cursor-pointer px-8 py-4 text-base">
      <input type="file" accept=".srt,.vtt,.txt" class="sr-only" @change="uploadFile" />
      <UiIcon name="arrow-down" class="rotate-180" />
      .srt
    </label>
  </section>
</template>

<script setup lang="js">
definePageMeta({ i18n: { locales: ["en"] } });

useSeoMeta({
  title: "Caption to Plain Text Converter ",
  description: "Convert caption(.srt) files to plain text files",
  ogTitle: "Caption to Plain Text Converter",
  ogDescription: "Convert caption(.srt) files to plain text files",
  ogType: "page",
  ogImageAlt: "Caption to Plain Text Converter",
  ogUrl: `https://hoceine.com/tools/caption-to-plain-text`,
  ogImage: "https://hoceine.com/images/tools/caption-to-plain-text.png",
  twitterCard: "summary_large_image",
  twitterCreator: "@HoceineElidrisi",
  twitterDescription: "Convert caption(.srt) files to plain text files",
  twitterTitle: "Caption to Plain Text Converter",
  twitterImage: "https://hoceine.com/images/tools/caption-to-plain-text.png",
  pageSection: "Technology",
  pagePublishedTime: new Date(),
  pageAuthor: "Hoceine EL IDRISSI",
});
// Reactive state for Ayah data
const ayahText = ref('')
const ayahSurah = ref('')
const ayahNumber = ref(0)

// Function to fetch a random Ayah
const fetchRandomAyah = async () => {
  try {
    const randomAyahNumber = Math.floor(Math.random() * 6236) + 1;
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/ar.alafasy`);
    const ayahData = await response.json();

    if (ayahData.data && ayahData.data.text) {
      ayahText.value = ayahData.data.text;
      ayahSurah.value = ayahData.data.surah.name;
      ayahNumber.value = ayahData.data.numberInSurah;
    }
  } catch (error) {
    console.error("Error fetching random ayah:", error);
  }
}

onMounted(fetchRandomAyah)

const uploadFile = (event) => {
  const file = event.target.files[0]
  const reader = new FileReader()

  reader.onload = function (e) {
    const content = e.target.result
    const regex = /^\d+\s*\n|^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\s*\n/gm
    let newContent = content.replace(regex, '')
    newContent = newContent.replace(/^\s*[\r\n]/gm, '')

    const blob = new Blob([newContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'newFile.txt'
    link.click()
  }

  reader.readAsText(file)
}
</script>

<style scoped>
/* Add more styles as needed */
</style>
