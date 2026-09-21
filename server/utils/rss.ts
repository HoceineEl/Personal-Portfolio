import type { H3Event } from 'h3'

const SITE_URL = 'https://hoceine.com'

const escape = (value: string = '') =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

type Feed = {
  collection: 'blog' | 'blog_ar'
  title: string
  blogPath: string
  feedPath: string
  description: string
  language: string
}

export const buildRss = async (event: H3Event, feed: Feed) => {
  const posts = await queryCollection(event, feed.collection)
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
    <title>${escape(feed.title)}</title>
    <link>${SITE_URL}${feed.blogPath}</link>
    <atom:link href="${SITE_URL}${feed.feedPath}" rel="self" type="application/rss+xml" />
    <description>${escape(feed.description)}</description>
    <language>${feed.language}</language>
    <lastBuildDate>${new Date(posts[0]?.createdAt || Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`
}
