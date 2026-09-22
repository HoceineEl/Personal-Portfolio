export const useContentLocale = () => {
  const { locale } = useI18n()
  const isAr = computed(() => locale.value === 'ar')

  return {
    projectsCollection: computed(() => (isAr.value ? 'projects_ar' : 'projects') as 'projects' | 'projects_ar'),
    basePath: (path: string) => path.replace(/^\/ar(?=\/|$)/, '') || '/',
  }
}
