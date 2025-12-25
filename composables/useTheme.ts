// Theme composable for dark/light mode
export const useTheme = () => {
  const isDark = useState('theme-dark', () => true)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateDOM()
    saveToStorage()
  }

  const updateDOM = () => {
    if (process.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const saveToStorage = () => {
    if (process.client) {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  }

  const initTheme = () => {
    if (process.client) {
      // Check localStorage first
      const saved = localStorage.getItem('theme')
      if (saved) {
        isDark.value = saved === 'dark'
      } else {
        // Default to dark mode
        isDark.value = true
      }
      updateDOM()
    }
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
}
