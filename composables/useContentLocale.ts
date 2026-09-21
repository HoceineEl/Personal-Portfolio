export const useContentLocale = () => {
  const { locale } = useI18n()
  const isAr = computed(() => locale.value === 'ar')

  return {
    blogCollection: computed(() => (isAr.value ? 'blog_ar' : 'blog') as 'blog' | 'blog_ar'),
    projectsCollection: computed(() => (isAr.value ? 'projects_ar' : 'projects') as 'projects' | 'projects_ar'),
    basePath: (path: string) => path.replace(/^\/ar(?=\/|$)/, '') || '/',
  }
}
