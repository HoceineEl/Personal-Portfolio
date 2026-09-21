export default defineEventHandler(async (event) => {
  const articleCount = await queryCollection(event, 'blog').count()
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return llmsSummary(articleCount)
})
