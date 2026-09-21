import { SitemapStream, streamToPromise } from 'sitemap'

const BASE_URL = 'https://hoceine.com'

const bilingual = (path: string) => [
  { lang: 'en', url: `${BASE_URL}${path || '/'}` },
  { lang: 'ar', url: `${BASE_URL}/ar${path}` },
  { lang: 'x-default', url: `${BASE_URL}${path || '/'}` },
]

export default defineEventHandler(async (event) => {
  const sitemap = new SitemapStream({ hostname: BASE_URL })
  const now = new Date()

  for (const path of ['', '/projects']) {
    const links = bilingual(path)
    sitemap.write({ url: path || '/', changefreq: 'weekly', priority: 1, lastmod: now, links })
    sitemap.write({ url: `/ar${path}`, changefreq: 'weekly', priority: 0.9, lastmod: now, links })
  }

  sitemap.write({ url: '/blog', changefreq: 'weekly', priority: 0.9, lastmod: now })

  const docs = (
    await Promise.all(
      (['blog', 'projects'] as const).map((collection) =>
        queryCollection(event, collection).select('path', 'createdAt', 'updatedAt').all()
      )
    )
  ).flat()

  for (const doc of docs) {
    sitemap.write({
      url: doc.path,
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: doc.updatedAt || doc.createdAt || now,
    })
  }

  sitemap.end()
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return (await streamToPromise(sitemap)).toString()
})
