export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"')
  return {
    linkset: [
      {
        anchor: `${SITE}/`,
        'service-doc': [{ href: `${SITE}/llms.txt`, type: 'text/plain' }],
        describedby: [{ href: `${SITE}/llms-full.txt`, type: 'text/plain' }],
        alternate: [{ href: `${SITE}/rss.xml`, type: 'application/rss+xml' }],
      },
    ],
  }
})
