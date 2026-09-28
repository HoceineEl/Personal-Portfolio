export default defineEventHandler(async (event) => {
  if (event.method !== 'GET' || !getHeader(event, 'accept')?.includes('text/markdown')) return

  const path = event.path.split('?')[0].replace(/\/$/, '') || '/'
  const collection = path.startsWith('/blog/') ? 'blog' : path.startsWith('/ar/projects/') ? 'projects_ar' : path.startsWith('/projects/') ? 'projects' : null

  let markdown: string | undefined
  if (path === '/') {
    markdown = llmsSummary(await queryCollection(event, 'blog').count())
  } else if (collection) {
    const doc = await queryCollection(event, collection).path(path).select('title', 'rawbody').first()
    markdown = doc && `# ${doc.title}\n\n${doc.rawbody.replace(/^---[\s\S]*?---\s*/, '')}`
  }
  if (!markdown) return

  setHeaders(event, {
    'content-type': 'text/markdown; charset=utf-8',
    'x-markdown-tokens': String(Math.ceil(markdown.length / 4)),
    vary: 'Accept',
  })
  return markdown
})
