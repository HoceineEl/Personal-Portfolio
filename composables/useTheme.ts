export const themeBootScript = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){document.documentElement.classList.add('dark')}})()`

export const useTheme = () => {
  const isDark = useState('theme-dark', () => true)

  const apply = () => {
    const root = document.documentElement
    root.classList.add('theme-switching')
    root.classList.toggle('dark', isDark.value)
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')))
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    apply()
    try {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    } catch {}
  }

  const initTheme = () => {
    isDark.value = document.documentElement.classList.contains('dark')
  }

  return { isDark, toggleTheme, initTheme }
}
