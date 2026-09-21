export default defineEventHandler(async (event) => {
  const articles = await queryCollection(event, 'blog')
    .select('title', 'path', 'description', 'createdAt', 'tags')
    .order('createdAt', 'DESC')
    .all()
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return llmsFull(articles)
})
