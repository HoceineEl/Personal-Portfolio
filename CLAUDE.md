# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and blog for Hoceine El Idrissi, a Full Stack Web Developer specializing in the TALL Stack (Tailwind, Alpine.js, Laravel, Livewire) and Vue/Nuxt ecosystem.

## Tech Stack

- **Framework**: Nuxt 3 (Vue.js)
- **Styling**: Tailwind CSS with Neo-Brutalism design system
- **Content**: @nuxt/content for blog posts (Markdown in `/content/blog/`)
- **3D**: TresJS/Three.js for 3D elements
- **Modules**: @nuxtjs/tailwindcss, @vueuse/motion, nuxt-delay-hydration, @nuxt/image

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview
```

## Project Structure

```
├── assets/
│   ├── constants/index.js    # Projects, experiences, technologies, socials
│   └── css/tailwind.css      # CSS variables & Neo-Brutalism components
├── components/
│   ├── Sections/             # Main page sections (Hero, About, Tech, Works, etc.)
│   ├── Chunk/                # Reusable UI components (Navbar, ScrollIndicator)
│   ├── blog/                 # Blog-specific components (Navbar)
│   └── content/              # Content components (Article, Toc, CustomContentList)
├── composables/
│   └── useTheme.ts           # Dark/light mode toggle
├── content/blog/             # Blog posts in Markdown
├── layouts/
│   ├── default.vue           # Main layout
│   └── blog.vue              # Blog layout
├── pages/
│   ├── index.vue             # Home page
│   └── blog/                 # Blog pages
└── public/images/            # Static images
```

## Design System

**Neo-Brutalism Theme** with CSS variables for dark/light mode:
- Colors: `neo-lime` (#CCFF00), `neo-pink` (#FF2E63), `neo-cyan` (#00D4FF), `neo-purple` (#8B5CF6)
- Borders: 3px solid (`border-3`)
- Shadows: Hard offset shadows (`shadow-neo`)
- Fonts: Display font for headings, mono for code/labels

## Key Files

- `assets/constants/index.js` - All project data, experiences, and technologies
- `composables/useTheme.ts` - Theme toggle logic with localStorage persistence
- `tailwind.config.js` - Tailwind configuration with custom design tokens
- `nuxt.config.js` - Nuxt configuration and modules

## Adding Content

**New Blog Post**: Create `.md` file in `content/blog/` with frontmatter:
```yaml
---
title: "Post Title"
description: "Description"
image: "/images/blog/image.webp"
banner: "/images/blog/banner.webp"
tags: ["tag1", "tag2"]
createdAt: "2024-01-01"
minutes: 5
---
```

**New Project**: Add to `projects` array in `assets/constants/index.js`

## User Preferences (from CLAUDE.md)

- No scale-on-hover animations
- Reuse existing code/helpers - avoid duplication
- Use contextual translations (not word-for-word)
- Git commits without Claude attribution
- Use `@js()` for PHP-to-JavaScript in Blade templates
- Communication in English
