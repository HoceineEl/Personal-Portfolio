<template>


    <!-- File Uploader Section -->
    <div class="flex flex-col justify-center items-center w-full h-screen bg-gradient-to-r from-blue-200 to-indigo-200">
      <div class="text-center ">
        <div v-if="ayahText" class="ayah text-center px-4 py-2 bg-slate-800 rounded-lg ">
          <p class="text-sm sm:text-lg ">{{ ayahText }}</p>
          <p class="text-xs sm:text-sm">  {{ ayahSurah }}, الاية {{ ayahNumber }}</p>
        </div>
        <h1 class="text-4xl font-bold text-indigo-900 mb-2">مُحمِّل الملفات</h1>
        <p class="text-indigo-700">قم برفع ملفك لمعالجة المحتوى</p>
      </div>
      <div class=" bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div class="">
          <input type="file" @change="uploadFile" class="  
            file:py-4 file:px-6
            file:rounded file:border-0 
            file:text-sm file:font-semibold 
            file:bg-violet-50 file:text-violet-700 
            hover:file:bg-violet-100 
            cursor-pointer" />
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

// Call the function on component mount
onMounted(fetchRandomAyah)

// File upload logic
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
