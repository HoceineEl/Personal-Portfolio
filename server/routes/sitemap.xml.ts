import { SitemapStream, streamToPromise } from 'sitemap'

const BASE_URL = 'https://hoceine.com'

const alternates = (path: string, hasArabic = true) =>
  hasArabic
    ? [
        { lang: 'en', url: `${BASE_URL}${path || '/'}` },
        { lang: 'ar', url: `${BASE_URL}/ar${path}` },
        { lang: 'x-default', url: `${BASE_URL}${path || '/'}` },
      ]
    : []

export default defineEventHandler(async (event) => {
  const sitemap = new SitemapStream({ hostname: BASE_URL })
  const now = new Date()

  const [blog, projects, projectsAr] = await Promise.all(
    (['blog', 'projects', 'projects_ar'] as const).map((collection) =>
      queryCollection(event, collection).select('path', 'createdAt', 'updatedAt').all()
    )
  )
  const arabicPaths = new Set(projectsAr.map((doc) => doc.path.replace(/^\/ar/, '')))

  sitemap.write({ url: '/blog', changefreq: 'weekly', priority: 0.9, lastmod: now })

  for (const path of ['', '/projects']) {
    const links = alternates(path)
    sitemap.write({ url: path || '/', changefreq: 'weekly', priority: 1, lastmod: now, links })
    sitemap.write({ url: `/ar${path}`, changefreq: 'weekly', priority: 0.9, lastmod: now, links })
  }

  for (const doc of [...blog, ...projects]) {
    const links = alternates(doc.path, arabicPaths.has(doc.path))
    const lastmod = doc.updatedAt || doc.createdAt || now
    sitemap.write({ url: doc.path, changefreq: 'monthly', priority: 0.8, lastmod, links })
    if (arabicPaths.has(doc.path)) {
      sitemap.write({ url: `/ar${doc.path}`, changefreq: 'monthly', priority: 0.7, lastmod, links })
    }
  }

  sitemap.end()
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return (await streamToPromise(sitemap)).toString()
})
