import { experiences, openSource, process, profile, projects, services } from '~/assets/constants'
import { aboutAr, experiencesAr, openSourceAr, processAr, profileAr, projectsAr, servicesAr } from '~/assets/constants/ar'

export const useSiteData = () => {
  const { locale, t } = useI18n()
  const localePath = useLocalePath()
  const isAr = computed(() => locale.value === 'ar')
  const section = (hash: string) => `${localePath('/')}${hash}`

  const pick = <T>(en: T[], ar: Partial<T>[]) => (isAr.value ? en.map((item, index) => ({ ...item, ...ar[index] })) : en)

  return {
    isAr,
    section,
    navLinks: computed(() => [
      { to: section('#work'), title: t('nav.work') },
      { to: section('#services'), title: t('nav.services') },
      { to: section('#about'), title: t('nav.about') },
      { to: '/blog', title: t('nav.writing') },
    ]),
    profile: computed(() => (isAr.value ? { ...profile, ...profileAr } : profile)),
    services: computed(() => pick(services, servicesAr)),
    process: computed(() => pick(process, processAr)),
    about: computed(() => (isAr.value ? aboutAr : null)),
    experiences: computed(() =>
      isAr.value ? experiences.map((item) => ({ ...item, ...experiencesAr[item.company_name] })) : experiences
    ),
    projects: computed(() => (isAr.value ? projects.map((item) => ({ ...item, ...projectsAr[item.url] })) : projects)),
    openSource: computed(() =>
      isAr.value ? openSource.map((item) => ({ ...item, body: openSourceAr[item.name] || item.body })) : openSource
    ),
  }
}
