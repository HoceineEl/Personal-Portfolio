---
title: "Tailwind CSS v4: مستقبل CSS القائم على الأصناف المساعدة"
description: تعرّف على التغييرات الكبيرة في Tailwind CSS v4، من الإعداد عبر CSS مباشرة ومحرك Lightning CSS، إلى طبقات التتالي الأصلية وتحسينات الأداء الضخمة.
tags:
  - Tailwind CSS
  - CSS
  - Frontend
noImage: true
createdAt: 2025-05-10T10:00:00.000Z
updatedAt: 2025-05-10T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Tailwind CSS v4: مستقبل CSS القائم على الأصناف المساعدة

**Tailwind CSS v4** إعادة كتابة من الصفر، بمحرك جديد، وإعداد يعتمد على CSS أولًا، وتحسينات ضخمة في الأداء. صار أسرع وأبسط وأقوى من أي وقت مضى.

## ما الجديد

- بناء أسرع 10x مع Lightning CSS
- إعداد يعتمد على CSS أولًا (وداعًا `tailwind.config.js`)
- طبقات تتالٍ أصلية (cascade layers)
- اكتشاف ملفات المحتوى دون أي إعداد
- نظام ألوان جديد يدعم ألوان P3
- استعلامات الحاوية (container queries) مدمجة

## التثبيت

```bash
npm install tailwindcss@next
```

### الاستيراد في CSS

```css
/* app.css */
@import "tailwindcss";
```

هذا كل شيء. لا حاجة إلى ملف إعداد JavaScript.

## الإعداد عبر CSS أولًا

### متغيرات السمة (Theme)

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

### الاستخدام

```html
<div class="bg-primary text-white p-18 rounded-xl shadow-soft">
    Custom themed component
</div>
```

## اكتشاف المحتوى دون إعداد

يكتشف Tailwind v4 ملفات المحتوى تلقائيًا. لم تعد بحاجة إلى ضبط مسارات `content`:

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

### تحديد المسارات صراحةً (عند الحاجة)

```css
@import "tailwindcss";

@source "../node_modules/my-ui-library/dist";
```

## طبقات التتالي الأصلية

يستخدم Tailwind v4 طبقات التتالي في CSS للتحكم في الأولوية (specificity) بطريقة أفضل:

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

### ترتيب الطبقات

1. `theme`: خصائص CSS المخصصة
2. `base`: إعادة الضبط والأنماط الأساسية
3. `components`: أصناف المكوّنات
4. `utilities`: الأصناف المساعدة (الأولوية الأعلى)

## أصناف مساعدة جديدة

### استعلامات الحاوية (Container Queries)

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

### نقاط التدرج (Gradient Stops)

```html
<div class="bg-gradient-to-r from-blue-500 from-10% via-purple-500 via-50% to-pink-500 to-90%">
    Precise gradient control
</div>
```

### موازنة النص (Text Balance)

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

## ألوان النطاق الواسع (P3)

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

## المتغيرات الاعتباطية (Arbitrary Variants)

صيغة اعتباطية أقوى:

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

## الوضع الداكن

### استراتيجية الصنف (الافتراضية)

```html
<html class="dark">
    <body class="bg-white dark:bg-gray-900">
        ...
    </body>
</html>
```

### استراتيجية Media

```css
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));
/* or for media query */
@variant dark (prefers-color-scheme: dark);
```

## متغيرات مخصصة (Custom Variants)

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

## الإضافات داخل CSS

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

### الأصناف المساعدة الوظيفية (Functional Utilities)

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

## الأداء

يستخدم Tailwind v4 محرك Lightning CSS، وهو محلل CSS مكتوب بلغة Rust:

| المقياس | v3 | v4 |
|--------|-----|-----|
| البناء الأول | ~300ms | ~30ms |
| البناء التزايدي | ~50ms | ~5ms |
| حجم الحزمة | أكبر | أصغر |

## الترحيل من v3

### الترحيل التلقائي

```bash
npx @tailwindcss/upgrade
```

### خطوات يدوية

1. احذف `tailwind.config.js`
2. انقل السمة إلى `@theme` داخل CSS
3. حدّث الاستيرادات إلى `@import "tailwindcss"`
4. استبدل الإضافات بتعريفات `@utility`

### مثال على ترحيل الإعداد

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

## التكامل مع أطر العمل

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

## الخلاصة

Tailwind CSS v4 قفزة كبيرة إلى الأمام. الإعداد عبر CSS أولًا يجعله أبسط، و Lightning CSS يجعله أسرع، والميزات الجديدة مثل استعلامات الحاوية وألوان P3 تجعله أقوى. الترحيل مباشر، والفوائد فورية.

---

## مصادر

- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
- [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Lightning CSS](https://lightningcss.dev)

