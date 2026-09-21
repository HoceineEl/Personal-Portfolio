const FORM_ENDPOINT = 'https://formsubmit.co/ajax/contact@hoceine.com'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string, message?: string }>(event)
  const name = String(body?.name ?? '').trim().slice(0, 120)
  const message = String(body?.message ?? '').trim().slice(0, 5000)

  if (!name || !message) {
    throw createError({ statusCode: 422, statusMessage: 'Name and message are required' })
  }

  const response = await $fetch<{ success: string | boolean, message?: string }>(FORM_ENDPOINT, {
    method: 'POST',
    responseType: 'json',
    headers: { Accept: 'application/json', Origin: 'https://hoceine.com', Referer: 'https://hoceine.com/' },
    body: { name, message, _subject: `New project enquiry from ${name}`, _template: 'table', _captcha: 'false' },
  })

  if (String(response?.success) !== 'true') {
    throw createError({ statusCode: 502, statusMessage: response?.message || 'Could not send the message' })
  }

  return { sent: true }
})
