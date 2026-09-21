export default defineEventHandler((event) =>
  buildRss(event, {
    collection: 'blog_ar',
    title: 'حسين الإدريسي · المقالات',
    blogPath: '/ar/blog',
    feedPath: '/ar/rss.xml',
    description: 'مقالات عملية عن لارافيل و Filament و Livewire وبناء تطبيقات الويب.',
    language: 'ar',
  })
)
