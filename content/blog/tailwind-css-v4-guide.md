---
title: "Tailwind CSS v4: The Future of Utility-First CSS"
description: Explore Tailwind CSS v4's revolutionary changes - new CSS-first configuration, Lightning CSS engine, native cascade layers, and massive performance improvements.
tags:
  - Tailwind CSS
  - CSS
  - Frontend
noImage: true
createdAt: 2025-05-10T10:00:00.000Z
updatedAt: 2025-05-10T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Tailwind CSS v4: The Future of Utility-First CSS

**Tailwind CSS v4** is a ground-up rewrite with a new engine, CSS-first configuration, and massive performance improvements. It's faster, simpler, and more powerful than ever.

## What's New

- 10x faster builds with Lightning CSS
- CSS-first configuration (goodbye `tailwind.config.js`)
- Native cascade layers
- Zero-config content detection
- New color system with P3 colors
- Container queries built-in

## Installation

```bash
npm install tailwindcss@next
```

### CSS Import

```css
/* app.css */
@import "tailwindcss";
```

That's it. No JavaScript config file needed.

## CSS-First Configuration

### Theme Variables

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
  --color-accent: #f59e0b;

  /* Spacing */
  --spacing-18: 4.5rem;
  --spacing-22: 5.5rem;

  /* Font sizes */
  --font-size-xxl: 1.75rem;

  /* Border radius */
  --radius-xl: 1rem;

  /* Shadows */
  --shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07);
}
```

### Usage

```html
<div class="bg-primary text-white p-18 rounded-xl shadow-soft">
    Custom themed component
</div>
```

## Zero-Config Content Detection

Tailwind v4 automatically detects your content files. No more configuring `content` paths:

```css
/* Before (tailwind.config.js) */
module.exports = {
  content: [
    './src/**/*.{html,js,vue}',
    './components/**/*.{html,js,vue}',
  ],
}

/* After (automatic) - just works! */
@import "tailwindcss";
```

### Explicit Paths (when needed)

```css
@import "tailwindcss";

@source "../node_modules/my-ui-library/dist";
```

## Native Cascade Layers

Tailwind v4 uses CSS cascade layers for better specificity control:

```css
@layer theme, base, components, utilities;

@import "tailwindcss";

/* Your custom styles */
@layer components {
  .btn {
    @apply px-4 py-2 rounded font-semibold;
  }
}
```

### Layer Order

1. `theme` - CSS custom properties
2. `base` - Reset and base styles
3. `components` - Component classes
4. `utilities` - Utility classes (highest priority)

## New Utility Classes

### Container Queries

```html
<div class="@container">
    <div class="@lg:flex @lg:gap-4">
        <!-- Flex when container is large -->
    </div>
</div>
```

```css
@theme {
  --container-3xs: 16rem;
  --container-2xs: 18rem;
  --container-xs: 20rem;
}
```

### Gradient Stops

```html
<div class="bg-gradient-to-r from-blue-500 from-10% via-purple-500 via-50% to-pink-500 to-90%">
    Precise gradient control
</div>
```

### Text Balance

```html
<h1 class="text-balance">
    This heading will wrap more evenly across lines
</h1>
```

### Subgrid

```html
<div class="grid grid-cols-3">
    <div class="col-span-2 grid grid-cols-subgrid">
        <!-- Inherits parent grid columns -->
    </div>
</div>
```

## Wide Gamut Colors (P3)

```css
@theme {
  /* P3 color space for vivid displays */
  --color-vivid-blue: oklch(65% 0.3 250);
  --color-vivid-green: oklch(70% 0.25 145);
  --color-vivid-pink: oklch(65% 0.3 0);
}
```

```html
<div class="bg-vivid-blue">
    Vibrant on modern displays
</div>
```

## Arbitrary Variants

More powerful arbitrary syntax:

```html
<!-- Style based on data attributes -->
<div class="data-[state=open]:bg-blue-500">...</div>

<!-- Style based on ARIA attributes -->
<button class="aria-[pressed=true]:bg-gray-800">...</button>

<!-- Child selectors -->
<div class="[&>*]:p-4">...</div>

<!-- Complex selectors -->
<div class="[&:not(:first-child)]:mt-4">...</div>
```

## Dark Mode

### Class Strategy (default)

```html
<html class="dark">
    <body class="bg-white dark:bg-gray-900">
        ...
    </body>
</html>
```

### Media Strategy

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));
/* or for media query */
@variant dark (prefers-color-scheme: dark);
```

## Custom Variants

```css
@import "tailwindcss";

/* Create custom variants */
@variant hocus (&:hover, &:focus);
@variant group-hocus (:merge(.group):hover &, :merge(.group):focus &);
```

```html
<button class="hocus:bg-blue-600">
    Hover or focus
</button>
```

## Plugins in CSS

```css
@import "tailwindcss";

/* Define utilities */
@utility text-shadow-sm {
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.1);
}

@utility text-shadow-md {
  text-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
}

@utility text-shadow-lg {
  text-shadow: 0 4px 8px rgb(0 0 0 / 0.15);
}
```

```html
<h1 class="text-shadow-lg">Shadowed text</h1>
```

### Functional Utilities

```css
@utility scrollbar-* {
  scrollbar-color: value(--color-*) transparent;
}
```

```html
<div class="scrollbar-blue-500 overflow-auto">
    Custom scrollbar color
</div>
```

## Performance

Tailwind v4 uses Lightning CSS, a Rust-based CSS parser:

| Metric | v3 | v4 |
|--------|-----|-----|
| Initial build | ~300ms | ~30ms |
| Incremental | ~50ms | ~5ms |
| Bundle size | Larger | Smaller |

## Migration from v3

### Automatic Migration

```bash
npx @tailwindcss/upgrade
```

### Manual Steps

1. Remove `tailwind.config.js`
2. Move theme to `@theme` in CSS
3. Update imports to `@import "tailwindcss"`
4. Replace plugins with `@utility` definitions

### Config Migration Example

```js
// Before: tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#3b82f6',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
}
```

```css
/* After: app.css */
@import "tailwindcss";

@theme {
  --color-brand: #3b82f6;
  --spacing-18: 4.5rem;
}
```

## Framework Integration

### Vite

```js
// vite.config.js
import tailwindcss from '@tailwindcss/vite'

export default {
  plugins: [tailwindcss()],
}
```

### Next.js

```js
// next.config.js
module.exports = {
  experimental: {
    turbo: {
      rules: {
        '*.css': ['@tailwindcss/postcss'],
      },
    },
  },
}
```

### Nuxt

```js
// nuxt.config.js
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
})
```

## Conclusion

Tailwind CSS v4 is a massive leap forward. CSS-first configuration makes it simpler, Lightning CSS makes it faster, and new features like container queries and P3 colors make it more powerful. The migration is straightforward, and the benefits are immediate.

---

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
- [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Lightning CSS](https://lightningcss.dev)

