const SITE_URL = 'https://hoceine.com'

const escape = (value: string = '') =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'blog')
    .select('title', 'path', 'description', 'createdAt', 'tags')
    .order('createdAt', 'DESC')
    .all()

  const items = posts
    .map((post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${SITE_URL}${post.path}</link>
      <guid isPermaLink="true">${SITE_URL}${post.path}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <description>${escape(post.description)}</description>
${(post.tags || []).map((tag: string) => `      <category>${escape(tag)}</category>`).join('\n')}
    </item>`)
    .join('\n')

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hoceine El Idrissi · Writing</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Practical articles on Laravel, Filament, Livewire and building web and mobile apps.</description>
    <language>en</language>
    <lastBuildDate>${new Date(posts[0]?.createdAt || Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`
})
