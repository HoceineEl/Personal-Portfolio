import { SITE_URL, profile, socials } from '~/assets/constants'

type PageSeo = {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
}

export const absoluteUrl = (path = '/') => (path.startsWith('http') ? path : `${SITE_URL}${path}`)

export const personSchema = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: profile.name,
  url: SITE_URL,
  image: absoluteUrl(profile.photo),
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  description: profile.description,
  address: { '@type': 'PostalAddress', addressCountry: 'MA' },
  sameAs: socials.map((social) => social.url),
  knowsAbout: ['Laravel', 'FilamentPHP', 'Livewire', 'Alpine.js', 'Tailwind CSS', 'PHP', 'Multi-tenant SaaS', 'Vue.js', 'Nuxt'],
}

export const usePageSeo = (seo: PageSeo) => {
  const url = absoluteUrl(seo.path)
  const image = absoluteUrl(seo.image || '/images/og.png')

  useSeoMeta({
    title: seo.title,
    description: seo.description,
    ogTitle: seo.title,
    ogDescription: seo.description,
    ogUrl: url,
    ogType: seo.type || 'website',
    ogImage: image,
    ogImageAlt: seo.title,
    ogSiteName: profile.name,
    ogLocale: 'en_US',
    twitterCard: 'summary_large_image',
    twitterCreator: profile.twitter,
    twitterTitle: seo.title,
    twitterDescription: seo.description,
    twitterImage: image,
    articlePublishedTime: seo.publishedTime,
    articleModifiedTime: seo.modifiedTime,
    articleAuthor: seo.type === 'article' ? [SITE_URL] : undefined,
    articleTag: seo.tags,
  })
}

export const useJsonLd = (graph: Record<string, unknown>[]) => {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      },
    ],
  })
}

export const breadcrumbSchema = (items: { name: string, path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})
