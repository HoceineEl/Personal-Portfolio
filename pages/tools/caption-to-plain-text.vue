<template>
    <div class="flex flex-col justify-center items-center w-full h-screen bg-gradient-to-r from-blue-200 to-indigo-200 transition-all duration-500 ease-in-out">
      <div class="text-center transition-all duration-500 ease-in-out">
        <div v-if="ayahText" class="ayah text-center px-4 py-2 bg-slate-800 rounded-lg transition-all duration-500 ease-in-out mb-7">
          <p class="text-lg  lg:text-xl">" {{ ayahText }} "</p>
          <p class="text-xs sm:text-xs md:text-sm lg:text-md">  {{ ayahSurah }}, الاية {{ ayahNumber }}</p>
        </div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-900 mb-2 transition-all duration-500 ease-in-out">مُحمِّل الملفات</h1>
        <p class="text-indigo-700 transition-all duration-500 ease-in-out">قم برفع ملفك لمعالجة المحتوى</p>
      </div>
      <div class="bg-white rounded-xl shadow-md flex items-center space-x-4 transition-all duration-500 ease-in-out">
        <div class="transition-all duration-500 ease-in-out">
          <input type="file" @change="uploadFile" class="  
            py-2 sm:py-3 md:py-4 lg:py-5 px-3 sm:px-4 md:px-5 lg:px-6
            rounded border-0 
            text-xs sm:text-sm md:text-md lg:text-lg font-semibold 
            bg-violet-50 text-violet-700 
            hover:bg-violet-100 
            cursor-pointer transition-all duration-500 ease-in-out" />
        </div>
      </div>
  </div>
</template>

<script setup lang="js">

// Reactive state for Ayah data
const ayahText = ref('')
const ayahSurah = ref('')
const ayahNumber = ref(0)

// Function to fetch a random Ayah
const fetchRandomAyah = async () => {
  try {
    const randomAyahNumber = Math.floor(Math.random() * 6236) + 1;
    const response = await fetch(`http://api.alquran.cloud/v1/ayah/${randomAyahNumber}/ar.alafasy`);
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
