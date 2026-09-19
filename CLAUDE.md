# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and blog for Hoceine El Idrissi, a Full Stack Web Developer specializing in the TALL Stack (Tailwind, Alpine.js, Laravel, Livewire) and Vue/Nuxt ecosystem.

## Tech Stack

- **Framework**: Nuxt 3 (Vue 3), SSR
- **Styling**: Tailwind CSS 3 with OKLCH design tokens (CSS variables in `assets/css/tailwind.css`)
- **Content**: @nuxt/content v2 (Markdown in `content/blog/` and `content/projects/`)
- **Modules**: @nuxtjs/tailwindcss, @nuxt/content, @nuxt/image, nuxt-simple-robots, nuxt-delay-hydration

## Development Commands

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run preview
```

## Project Structure

```
├── assets/constants/index.js  # profile, services, process, projects, experiences, openSource, socials
├── assets/css/tailwind.css    # tokens (light/dark), components (.shell .btn-sun .btn-ghost .chip .field .blinds), prose
├── components/
│   ├── Home/                  # Hero, Work, Services, About, Writing, Contact (home sections)
│   ├── Project/               # Cover (SVG illustrations per `cover` variant), Feature, List
│   ├── Post/                  # Row, Toc
│   ├── Site/                  # Header, Footer
│   └── Ui/                    # Icon, ReadingProgress
├── composables/               # useTheme, useSiteSeo (usePageSeo, useJsonLd, personSchema), useFormatDate
├── pages/                     # index, blog/, projects/, tools/
├── server/routes/             # sitemap.xml, rss.xml
├── middleware/                # lowercase URL redirect
└── public/                    # images, og.png, favicon.svg, llms.txt
```

## Design System

- **Direction**: "sunlight through blinds", taken from the portrait. Dark-first, light theme supported, system preference by default.
- **Color**: tokens `bg`, `raised`, `ink`, `muted`, `line`, `sun` (amber brand), `sun-ink` (sun as text), `on-sun`, `live`. Use them with Tailwind opacity (`text-ink/80`, `ring-line/15`).
- **Type**: Archivo variable (use `.wide` for display headings), JetBrains Mono only for code, dates and repo names. Display sizes: `text-display-xl|lg|md|sm`.
- **Motif**: `.blinds` diagonal stripes, used sparingly (hero, covers, contact, 404).
- **Motion**: CSS only; `.reveal` uses scroll-driven animations as progressive enhancement. Respect reduced motion.
- No neo-brutal hard shadows, no gradient text, no scale-on-hover.

## Adding Content

**New blog post**: `.md` in `content/blog/` with `title`, `description`, `tags`, `createdAt`, `updatedAt`, optional `image`/`banner` (or `noImage: true`).

**New project**: add an entry to `projects` in `assets/constants/index.js` (`url` must match the content path, e.g. `/projects/my-app`; `cover` picks an illustration variant: builder, store, gallery, chart, kanban, calendar, table, panels, phone, voice; or set `image`). Add `content/projects/my-app.md` for the detail page. Order in the array is the display order; `featured: true` puts it in the showcase.

## User Preferences (from CLAUDE.md)

- No scale-on-hover animations
- Reuse existing code/helpers - avoid duplication
- Use contextual translations (not word-for-word)
- Git commits without Claude attribution
- Use `@js()` for PHP-to-JavaScript in Blade templates
- Communication in English
