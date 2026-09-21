export default defineEventHandler((event) =>
  buildRss(event, {
    collection: 'blog',
    title: 'Hoceine El Idrissi · Writing',
    blogPath: '/blog',
    feedPath: '/rss.xml',
    description: 'Practical articles on Laravel, Filament, Livewire and building web apps.',
    language: 'en',
  })
)
