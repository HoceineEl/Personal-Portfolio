---
title: "How This Site Is Built: Nuxt 4, Nuxt Content v3 and an Arabic Twin"
description: A walk through the code behind hoceine.com, from Nuxt Content v3 collections and a word-count hook to the RSS feed, sitemap, llms.txt and the Arabic right-to-left version.
tags:
  - Nuxt
  - Nuxt Content
  - Vue
  - TailwindCSS
image: /images/blog/nuxt-site/cover.jpg
banner: /images/blog/nuxt-site/cover.jpg
createdAt: 2023-10-30T15:15:53.000Z
updatedAt: 2026-10-17T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

## How This Site Is Built

The first version of this post was a Nuxt 2 and Content v1 tutorial. Both are long gone, and so is
most of what it showed. Instead of updating a generic tutorial, I would rather show the real code
behind the site you are reading: Nuxt 4, `@nuxt/content` v3, Tailwind, and `@nuxtjs/i18n` for the
Arabic version.

Everything below is copied from the repository. Nothing is simplified for the post, so where the
code is a bit opinionated, that is how it actually runs.

### Collections instead of folders

Content v1 treated `content/` as a filesystem you queried by path. Content v3 asks you to declare
collections up front, each with a source glob and a schema. Mine is in `content.config.ts`:

```ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const schema = z.object({
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  banner: z.string().optional(),
  noImage: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  createdBy: z.string().optional(),
  wordCount: z.number().optional(),
  minutes: z.number().optional(),
  rawbody: z.string(),
})

export default defineContentConfig({
  collections: {
    blog: defineCollection({ type: 'page', source: 'blog/*.md', schema }),
    projects: defineCollection({ type: 'page', source: 'projects/*.md', schema }),
    projects_ar: defineCollection({ type: 'page', source: 'ar/projects/*.md', schema }),
  },
})
```

`type: 'page'` gives each file a `path`, `title`, `description` and a parsed `body`, so the schema
only lists what I add on top. Content v3 stores everything in SQLite at build time, and the schema
becomes the table's columns. That is why a typo in front matter now shows up as a validation
problem instead of a silent `undefined` in a template.

The three collections share one schema. Blog posts are English only; project case studies have an
Arabic twin with the same file name under `content/ar/projects/`.

### Reading time from the parsed body

Every post shows a reading time and the JSON-LD has a `wordCount`. I compute both once, at parse
time, with a Content hook in `nuxt.config.js`:

```js
const countWords = (node) =>
  typeof node === 'string'
    ? node.trim().split(/\s+/).filter(Boolean).length
    : node.slice(2).reduce((total, child) => total + countWords(child), 0)

export default defineNuxtConfig({
  hooks: {
    'content:file:afterParse'({ content }) {
      if (content.body?.type !== 'minimark') return
      content.wordCount = content.body.value.reduce((total, node) => total + countWords(node), 0)
      content.minutes = Math.ceil(content.wordCount / 200)
    },
  },
})
```

The parsed body is in minimark format, where each node is an array of `[tag, props, ...children]`.
`slice(2)` skips the tag and props and recurses into the children. Code blocks count too, which
slightly overstates the reading time on code-heavy posts. I have not found that worth fixing.

Because `wordCount` and `minutes` are declared in the schema, they are real columns and I can
`select` them in list queries without loading the body.

### The blog pages

The index page is one query:

```js
queryCollection("blog")
  .select("title", "path", "description", "createdAt", "tags", "minutes")
  .order("createdAt", "DESC")
  .all()
```

Selecting only the fields the list needs matters more in v3 than it did in v1, because the body is
the heaviest column by far.

The article page, `pages/blog/[...slug].vue`, runs three queries in parallel: the post itself, its
neighbours for the previous/next links, and a light pool of every other post to pick related
articles from.

```js
const { data } = await useAsyncData(`post-${path}`, async () => {
  const [post, surround, pool] = await Promise.all([
    queryCollection("blog").path(path).first(),
    queryCollectionItemSurroundings("blog", path, { fields }).order("createdAt", "DESC"),
    queryCollection("blog").select(...fields).where("path", "<>", path).all(),
  ]);
  return { post, surround, pool };
});
```

Related posts are scored by shared tags, in plain JavaScript, rather than by a query. With a few
dozen posts that is cheaper to reason about than anything clever. The body renders through
`<ContentRenderer :value="post" />`, and the table of contents comes from `post.body.toc.links`,
which Content builds from the `##` and `###` headings.

### RSS, sitemap and llms.txt are server routes

None of these use a module. They are Nitro routes in `server/routes/`, prerendered at build time
through `nitro.prerender.routes`. Server code queries the same collections, passing the event as
the first argument:

```ts
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
```

`buildRss` in `server/utils/rss.ts` selects the five fields a feed needs, escapes them and builds
the XML as a template string. A feed is a small, fixed format; a library would be more code than
the string.

The sitemap uses the `sitemap` package because of the `hreflang` alternates. It loads all three
collections and only links an English page to an `/ar` version when an Arabic file actually
exists:

```ts
const [blog, projects, projectsAr] = await Promise.all(
  (['blog', 'projects', 'projects_ar'] as const).map((collection) =>
    queryCollection(event, collection).select('path', 'createdAt', 'updatedAt').all()
  )
)
const arabicPaths = new Set(projectsAr.map((doc) => doc.path.replace(/^\/ar/, '')))
```

`/llms.txt` and `/llms-full.txt` follow the same pattern. `server/utils/llms.ts` builds them from
the same constants file the home page reads (projects, services, experience), plus the blog
collection, so the text a language model sees cannot drift from what a visitor sees.

### Arabic, right to left

The i18n setup is short:

```js
i18n: {
  baseUrl: 'https://hoceine.com',
  strategy: 'prefix_except_default',
  defaultLocale: 'en',
  detectBrowserLanguage: false,
  langDir: 'locales',
  locales: [
    { code: 'en', language: 'en-US', dir: 'ltr', name: 'English', file: 'en.json' },
    { code: 'ar', language: 'ar', dir: 'rtl', name: 'العربية', file: 'ar.json' },
  ],
},
```

English lives at `/` and Arabic at `/ar`. The `dir` on each locale sets the `dir` attribute on the page, which flips the layout; where
spacing depends on direction I use logical utilities like `ps-6` instead of `pl-6`. Browser language
detection is off, so nobody gets redirected based on a browser setting.

UI strings are in `i18n/locales/*.json`. The longer copy (project descriptions, services,
experience) is in `assets/constants/ar.js`, merged over the English data by a composable, so
components never import constants directly:

```ts
const pick = <T>(en: T[], ar: Partial<T>[]) => (isAr.value ? en.map((item, index) => ({ ...item, ...ar[index] })) : en)
```

Anything not translated falls back to English instead of breaking. Project pages pick their
collection with a second small composable:

```ts
projectsCollection: computed(() => (isAr.value ? 'projects_ar' : 'projects') as 'projects' | 'projects_ar'),
```

The blog is the exception. Articles stay in English, the post page declares
`definePageMeta({ i18n: { locales: ["en"] } })`, and `routeRules` sends `/ar/blog/**` to the English
URL with a 301 rather than serving a half-translated page.

### Smaller choices

- Old or merged posts get a 301 in `routeRules` instead of a 404, so links from elsewhere keep
  working.
- `@nuxt/image` serves AVIF and WebP at three breakpoints.
- `nuxt-delay-hydration` delays hydration on first load; most of the site is static text that does
  not need JavaScript to be readable.
- Code highlighting is Shiki through Content's `highlight` option, with an explicit `langs` list so
  only the grammars I use are bundled.

If I started again tomorrow I would make the same core choice: Markdown files in the repo, typed by
a schema, queried like a small database. The rest is a few hundred lines of server routes and
composables that I can read in one sitting.
