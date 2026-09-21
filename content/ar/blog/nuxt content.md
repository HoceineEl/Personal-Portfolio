---
title: إنشاء مدونة باستخدام Nuxt و Nuxt Content مع TailwindCSS
description: في هذا الدرس ستتعلم إنشاء مدونة شخصية باستخدام نظام إدارة محتوى قائم على Git هو Nuxt Content
tags:
  - Nuxt
  - Nuxt Content
  - Vue
  - TailwindCSS
image: /images/blog/nuxt-content/thumbnail.svg
banner: /images/blog/nuxt-content/banner.svg
createdAt: 2023-10-30T15:15:53.000Z
updatedAt: 2023-10-30T15:15:53.000Z
createdBy: Hoceine EL IDRISSI
---

## ما الذي سنبنيه

سنبني موقع مدونة بسيطًا باستخدام [Nuxt](https://nuxtjs.org/)، وهو إطار عمل شائع للتصيير من جهة الخادم (server side rendering) وتوليد المواقع الثابتة (Static Site Generation) مع Vue.

وسنستخدم أيضًا [Nuxt Content](https://content.nuxtjs.org/)، وهي وحدة (module) تعمل كـ **Git-based Headless CMS**، أي نظام إدارة محتوى بلا واجهة عرض قائم على Git، يجلب ملفات Markdown و JSON و YAML و XML و CSV عبر واجهة برمجية (API) تشبه واجهة MongoDB. فيها ميزات قوية تتيح لك كتابة المدونات والتوثيق وغير ذلك.

## المتطلبات المسبقة

قبل أن نبدأ، تحتاج إلى:

- فهم أساسي لـ HTML و CSS و JS و Vue، و[صياغة Markdown](https://www.markdownguide.org/basic-syntax/)
- تثبيت [Node](https://nodejs.org/en/) على جهازك
- محرر نصوص، ونوصي بـ VS Code مع إضافة Vetur، أو WebStorm
- طرفية (terminal)، وأنصح بالطرفية المدمجة في VS Code

## البداية

لنثبّت كل ما نحتاجه للمشروع.

### تثبيت Nuxt باستخدام create-nuxt-app

للبدء بسرعة، يمكنك استخدام create-nuxt-app.

تأكد من تثبيت npx (يأتي npx افتراضيًا منذ npm 5.2.0) أو npm v6.1 أو yarn.

```bash
npx create-nuxt-app <project-name>
```

اختر خيار \_Content - Git-based Headless CMS\_ من وحدات Nuxt.js

ثم تابع اختيار بقية الخيارات، وهذه إعداداتي:

<!-- ![blog-with-nuxt-content-create-nuxt-app-installation-Annotation 2021-07-11 015118.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625966762066/IvOhoXl96.png) -->

اكتمل التثبيت! 🎉

<!-- ![blog-with-nuxt-content-create-nuxt-app-installation-complete-Annotation 2021-07-11 021302.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625966789225/4LY2jIog5.png) -->

### تثبيت Nuxt Content منفصلًا

**إذا كان لديك مشروع Nuxt جاهز من قبل، فثبّت وحدة المحتوى بتشغيل الأمر التالي**

```bash
#install nuxt content

npm install @nuxt/content
```

بعدها نضيفها إلى خاصية modules داخل ملف nuxt.config.

```js
//nuxt.config.js
export default {
  modules: ["@nuxt/content"],
};
```

### تثبيت Tailwind و Tailwindcss typography عبر npm

Tailwindcss إطار CSS يقوم على الأصناف المساعدة أولًا (utility-first)، ويوفر لنا أصنافًا مخصصة نصمم بها التطبيق.

أما Tailwindcss Typography فهي بحسب وصفها: "إضافة توفر مجموعة من أصناف `prose` تستطيع استخدامها لإضافة تنسيقات طباعية افتراضية جميلة إلى أي HTML عادي لا تتحكم فيه (مثل HTML المولَّد من Markdown، أو المجلوب من CMS)."

ثبّت @nuxtjs/tailwindcss، وهي وحدة Nuxt لدمج Tailwind، ومعها Tailwind واعتمادياته المرافقة (peer-dependencies) باستخدام npm:

```bash
npm install -D @nuxtjs/tailwindcss tailwindcss@latest postcss@latest autoprefixer@latest
```

أضف وحدة @nuxtjs/tailwindcss إلى قسم buildModules في ملف nuxt.config.js:

```js
// nuxt.config.js
export default {
  buildModules: ["@nuxtjs/tailwindcss"],
};
```

### إنشاء ملف الإعدادات

بعد ذلك، أنشئ ملف tailwind.config.js:

```bash
npx tailwindcss init
```

سينشئ هذا الأمر ملف tailwind.config.js بأبسط صورة في جذر مشروعك:

```js
//tailwind.config.js
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
```

أنشئ ملف `tailwind.css` في `assets/css.tailwind.css`، واستخدم الموجّه `@tailwind` لحقن أنماط Tailwind الأساسية (base) والمكوّنات (components) والأدوات المساعدة (utilities):

```css
/*assets/css/tailwind.css*/
@tailwind base;
@tailwind components;
@tailwind utilities;
```

تستطيع استيراد ملف CSS داخل مكوّناتك، أو جعله متاحًا في الموقع كله بتعريف ملفات CSS أو الوحدات أو المكتبات التي تريدها عامة \_(مضمّنة في كل صفحة).\_

```js
  /* nuxt.config.js*/
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // CSS file in the project
    '@/assets/css/tailwind.css',
  ],

```

### تثبيت Tailwind typography

```bash
# Using npm
npm install @tailwindcss/typography
```

ثم أضف الإضافة إلى ملف tailwind.config.js:

```js
// tailwind.config.js
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
```

### إعداد Tailwind لحذف الأنماط غير المستخدمة في الإنتاج

في ملف tailwind.config.js، اضبط خيار purge بمسارات كل صفحاتك ومكوّناتك، حتى يتخلص Tailwind من الأنماط غير المستخدمة (tree-shake) عند البناء للإنتاج:

```js
// tailwind.config.js
module.exports = {
  purge: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
```

الآن شغّل

```bash
npm run dev
```

### ملاحظة سريعة

أثناء تنفيذ هذه الخطوات، واجهت **مشكلة عدم تطابق في إصدارات الحزم** عند تشغيل `npm run dev`

<!-- ![blog-with-nuxt-content-version-mismatch-error-Annotation 2021-07-11 031752.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625975242485/YCqCkt50g.png) -->

**وهكذا حللتها:**

حدّث الحزمة أو الحزم غير المتطابقة، وكانت في حالتي `vue-server-renderer`

```bash
npm i vue-server-renderer@latest --save
```

![blog-with-nuxt-content-update-vue-renderer-version-Annotation 2021-07-11 032705.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625975276642/JYoReAgk2.png)

بهذا انحلت المشكلة عندي حين شغّلت `npm run dev`

<!-- ![blog-with-nuxt-content-run-dev-succesfull-Annotation 2021-07-11 032953.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625975289781/wtKSJLTIf.png) -->

<!--
<!-- ![blog-with-nuxt-content-site-preview-Annotation 2021-07-11 032953.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625975335704/mi9b73FR9.png) -->

\-->

_رائع! 🎉 الآن ننتقل إلى الجزء الممتع_

## أنشئ أول تدوينة

تعمل وحدة المحتوى بقراءة الملفات الموجودة في مجلد `content/`.

لذلك، انتقل إلى `content/` وأنشئ مجلد `articles/`. ثم أنشئ ملف `first-blog-post.md` وضع فيه ما يلي

```md
content/articles/first-blog-post.md

---

<!--- YAML Front matter section in-between triple dashes '---' -->

title: First Blog Post
description: Learning how to create my blog using nuxt content

---

# My first blog post

Hey there! 👋🏾

This is my first blog post learning nuxt content.
```

<!-- ![blog-with-nuxt-content-create-content-md-file-Annotation 2021-07-11 034837.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625975435117/_58aEjwEA.png) -->

::info-box
#default{#info-box=""}
لاحظ قسم YAML front matter، سنستخدمه لاحقًا لإدراج متغيرات مخصصة مثل العنوان والوصف، ونصل إليها عبر \`$content\`.
::

بعد ذلك، سننشئ [صفحة ديناميكية](https://nuxtjs.org/docs/2.x/directory-structure/pages#dynamic-pages) نستخدمها من أجل:

- جلب محتوى المقال باستخدام `asyncData` قبل تصيير الصفحة. نصل إلى المحتوى عبر السياق (context) باستخدام المتغير `$content`. ولأننا نستخدم صفحة ديناميكية، نعرف أي ملف مقال نجلبه من المتغير `params.slug` الذي يوفره vue router، فنحصل منه على اسم كل مقال
- عرض المقال في القالب باستخدام `<nuxt-content>`

حسنًا، انتقل إلى `pages/` وأنشئ مجلد `blog/`. ثم أنشئ ملف `_slug.vue` (صفحتنا الديناميكية) وضع فيه ما يلي

```html
pages/blog/_slug.vue

<template>
  <article>
    <!-- this is where we will render the article contents -->
    <nuxt-content :document="article" />
  </article>
</template>

<script>
  export default {
    async asyncData({ $content, params }) {
      //here, we will fetch the article from the article/ folder based on the name provided in the 'params.slug`
      const article = await $content("articles", params.slug).fetch();

      return { article };
    },
  };
</script>
```

لعرض المحتوى نستخدم المكوّن \<nuxt-content /> ونمرر المتغير الذي أرجعناه إلى خاصية document في `:document="article"`.

اذهب إلى موقعك، وسترى شيئًا كهذا

![blog-with-nuxt-content-render-first-article-Annotation 2021-07-11 123202.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626008969368/_V0QIMEyB.png)

## الوصول إلى المتغيرات المحقونة افتراضيًا

توفر وحدة المحتوى متغيرات محقونة كثيرة نستطيع استخدامها في القالب. هذه بعض ما سنستخدمه:

- body: نص المحتوى
- dir: المجلد
- extension: امتداد الملف (.md في هذا المثال)
- path: مسار الملف
- slug: الاسم المختصر للملف في الرابط (slug)
- toc: مصفوفة تحتوي فهرس المحتويات
- createdAt: تاريخ إنشاء الملف
- updatedAt: تاريخ آخر تحديث للملف

نصل إلى هذه البيانات عبر المتغير `article` الذي أنشأناه. لنطّلع عليها بطباعتها داخل وسم `<pre>` في القالب

```html
<pre> {{ article }} </pre>
```

سنرى في الصفحة شيئًا كهذا

```js
{
  "slug": "first-blog-post",
  "toc": [],
  "body": {
    "type": "root",
    "children": [
    // article content
    ]
  },
  "dir": "/articles",
  "path": "/articles/first-blog-post",
  "extension": ".md",
  "createdAt": "2021-07-11T02:34:43.695Z",
  "updatedAt": "2021-07-11T03:33:33.608Z"
}
```

### المتغيرات المحقونة المخصصة

سنستخدم هذا أيضًا لعرض المتغيرات المحقونة المخصصة المحددة في YAML front matter، ويجب أن تكون YAML صالحًا في أعلى الملف. هذا مفيد لإضافة متغيرات SEO مثل عنوان المقال ووصفه وصورته.

```html
<template>
  <article class="article">
      <!-- Our custom injected variables specified with the The YAML front matter goes here  -->
      <header class="article-header">
          <h1>{{article.title}}</h1>
          <p>{{article.description}}</p>

          <!-- container for article details -->
          <div class="details-cont">
              <!-- the format date function converts the default date to a readable form -->
              <span>{{formatDate(article.updatedAt)}}</span>
          </div>
      </header>

      <!-- this is where we will render the article contents -->
      <nuxt-content :document="article" />
  </article>
</template>

<script>
export default {
    async asyncData({ $content, params }) {
    //here, we will fetch the article from the article/ folder based on the name provided in the 'params.slug`
        const article = await $content('articles', params.slug).fetch();

        return {article}
    },
    methods: {
        // format the date to be displayed in a readable format
        formatDate(date){
            return new Date(date).toLocaleDateString('en', {year: 'numeric', month: 'long', day: 'numeric'})
        }
    }
}
```

لاحظ الدالة `formatDate` التي نستخدمها لتحويل قيمة `article.updatedAt` إلى تاريخ أسهل في القراءة.

سيظهر لدينا شيء كهذا:

<!-- ![blog-with-nuxt-content-article-with-injected-variables-Annotation 2021-07-11 135032.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626009001772/l5eXbp4f5.png) -->

الآن لدينا عنصرا عنوان `<h1>`: واحد من YAML front matter وآخر من محتوى markdown الرئيسي. نستطيع حذف الموجود في markdown الرئيسي، ونستطيع أيضًا إضافة محتوى أكثر لتجربة الأنماط:

```md
## <!--- content/articles/first-blog-post -->

title: My First Blog Post
description: Learning how to create my blog using nuxt, the nuxt content module and tailwindcss

---

Hey there! 👋🏾
This is my first blog post learning nuxt content.

I'm currently building it using the following:

- Nuxt.js
- Nuxt Content module
- Tailwindcss
- Tailwindcss typography

> Sweet huh?
```

رائع! 😎 لنحسّن الشكل قليلًا ببعض التنسيق.

## التنسيق باستخدام Tailwindcss و Tailwindcss typography

يظهر محتوى المقال مع بعض البيانات المخصصة عندما نزور الـ slug الخاص به. لكن شكله قبيح، فلنصلح ذلك.

أولًا، نطبّق صنف `.prose` من Tailwindcss typography على عنصر `<article>` لنحصل على أنماط أساسية:

```html
<article class="article prose lg:prose-xl"></article>
```

الآن ننشئ أنماطنا المخصصة في `pages/blog/_slug.vue`

```css
<style scoped>
@layer components {
  .article {
      @apply prose lg:prose-xl;
      @apply p-4 mt-6 lg:mt-8 m-auto lg:max-w-3xl;
  }

  .article-header{
      @apply mb-12 pb-8 lg:mb-16 border-gray-200 border-b-2;
  }

  .article-header h1{
      @apply mb-0;
  }

  .article-header .details-cont span{
      @apply text-opacity-50 text-sm;
  }
}
</style>
```

صارت صفحتنا تبدو هكذا:

<!-- ![blog-with-nuxt-content-configure-blog-with-styling-Annotation 2021-07-11 162500.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626249266836/ut6jai8_v.png) -->

::img-cont
---
alt: Our page with some styling
src: Creating-a-blog-using-Nuxt-and-Nuxt-Content---with-TailwindCSS/blog-with-nuxt-content-configure-blog-with-styling-Annotation
  2021-07-11 162500.png
---
::

رائع فعلًا 😍

## إضافة وسوم HTML ومكوّنات Vue داخل markdown المقال

نستطيع إضافة شيفرة html صالحة داخل ملف markdown. لننشئ صندوق معلومات مع بعض التنسيق

```md
<!--
    content/articles/first-blog-post.md

    ...rest of file

    HTML in markdown
    Info box with svg icon
 -->
<div class="flex gap-4 items-start p-6 bg-blue-200 text-gray-800 border-blue-700 border-l-4 rounded-md">
<span><svg class="text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" height="24" preserveAspectRatio="xMinYMin" class="icon jam jam-info"><path class="text-blue-700" d='M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-10a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z'/></svg></span>
<span class="text-gray-800" style="line-height: initial">Here we have important information we would love to share with you!</span>
</div>
```

سيظهر لك شيء كهذا:

<!-- ![blog-with-nuxt-content-configure-blog-with-html-markup-Annotation 2021-07-11 175231.png](Upload failed. Please re-upload the image) -->

::img-cont
---
alt: Add information box using HTML
src: Creating-a-blog-using-Nuxt-and-Nuxt-Content---with-TailwindCSS/blog-with-nuxt-content-configure-blog-with-html-markup-Annotation
  2021-07-11 175231.png
---
::

جميل، الآن نستطيع تحويل هذا إلى مكوّن vue قابل لإعادة الاستخدام

أنشئ ملف `infoBox.vue` في `components/global`.

```html
<!-- components/global/infoBox.vue-->
<template>
  <div class="info-box">
    <span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-2 -2 24 24"
        width="24"
        height="24"
        preserveAspectRatio="xMinYMin"
        class="icon jam jam-info"
      >
        <path
          d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-10a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
        />
      </svg>
    </span>
    <span>
      <slot name="info-box"> Some information gets diaplayed here </slot>
    </span>
  </div>
</template>

<script>
  export default {
    name: "infoBox",
  };
</script>

<style scoped>
  @layer components {
    .icon {
      @apply text-gray-800;
    }

    .info-box {
      @apply flex gap-4 items-start p-6 bg-blue-200 text-gray-800 border-blue-500 border-l-4 rounded-md;
    }

    .info-box span {
      @apply text-gray-800 leading-none;
    }
  }
</style>
```

::info-box
#default{#info-box=""}
ننشئه داخل مجلد `components/global` لتسجيل المكوّن على مستوى التطبيق كله، حتى يستطيع nuxt استيراده تلقائيًا داخل `<nuxt-content>`
::

الآن، استبدل وسوم html بمكوّن `infoBox` الجديد

```html
<!-- infoBox component automatically imported as global component  -->
<info-box>
  <!-- insert into slot -->
  <template #info-box>
    Here we have important information we would love to share with you!
  </template>
</info-box>
```

عندما نعرض الصفحة، سنرى صندوق المعلومات كما هو

<!-- ![blog-with-nuxt-content-configure-blog-with-html-markup-Annotation 2021-07-11 175231.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626249270340/Z-M_a581s.png) -->

::img-cont
---
alt: Add information box using Vue components
src: Creating-a-blog-using-Nuxt-and-Nuxt-Content---with-TailwindCSS/blog-with-nuxt-content-configure-blog-with-html-markup-Annotation
  2021-07-11 175231.png
---
::

## واجهة المحتوى البرمجية (content API)

من الرائع أن وحدة المحتوى توفر واجهة برمجية (API) نصل إليها عبر المسار `http://localhost:3000/_content/`. نستطيع جلب بيانات كل المقالات عبر المسار `http://localhost:3000/_content/articles`.\:brونستطيع الوصول إلى مقال واحد باستخدام الـ slug الخاص به، أي `http://localhost:3000/_content/articles/first-blog-post` للوصول إلى بيانات `http://localhost:3000/blog/first-blog-post`.

## ما الذي سنبنيه

سنبني موقع مدونة بسيطًا باستخدام [Nuxt](https://nuxtjs.org/)، وهو إطار عمل شائع للتصيير من جهة الخادم (server side rendering) وتوليد المواقع الثابتة (Static Site Generation) مع Vue.

وسنستخدم أيضًا [Nuxt Content](https://content.nuxtjs.org/)، وهي وحدة (module) تعمل كـ **Git-based Headless CMS**، أي نظام إدارة محتوى بلا واجهة عرض قائم على Git، يجلب ملفات Markdown و JSON و YAML و XML و CSV عبر واجهة برمجية (API) تشبه واجهة MongoDB. فيها ميزات قوية تتيح لك كتابة المدونات والتوثيق وغير ذلك.

## المتطلبات المسبقة

قبل أن نبدأ، تحتاج إلى:

- فهم أساسي لـ HTML و CSS و JS و Vue، و[صياغة Markdown](https://www.markdownguide.org/basic-syntax/)
- تثبيت [Node](https://nodejs.org/en/) على جهازك
- محرر نصوص، ونوصي بـ VS Code مع إضافة Vetur، أو WebStorm
- طرفية (terminal)، وأنصح بالطرفية المدمجة في VS Code

## البداية

لنثبّت كل ما نحتاجه للمشروع.

### تثبيت Nuxt باستخدام create-nuxt-app

للبدء بسرعة، يمكنك استخدام create-nuxt-app.

تأكد من تثبيت npx (يأتي npx افتراضيًا منذ npm 5.2.0) أو npm v6.1 أو yarn.

```bash
npx create-nuxt-app <project-name>
```

اختر خيار \_Content - Git-based Headless CMS\_ من وحدات Nuxt.js

ثم تابع اختيار بقية الخيارات، وهذه إعداداتي:

<!-- ![blog-with-nuxt-content-create-nuxt-app-installation-Annotation 2021-07-11 015118.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625966762066/IvOhoXl96.png) -->

اكتمل التثبيت! 🎉

<!-- ![blog-with-nuxt-content-create-nuxt-app-installation-complete-Annotation 2021-07-11 021302.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625966789225/4LY2jIog5.png) -->

### تثبيت Nuxt Content منفصلًا

**إذا كان لديك مشروع Nuxt جاهز من قبل، فثبّت وحدة المحتوى بتشغيل الأمر التالي**

```bash
#install nuxt content

npm install @nuxt/content
```

بعدها نضيفها إلى خاصية modules داخل ملف nuxt.config.

```js
//nuxt.config.js
export default {
  modules: ["@nuxt/content"],
};
```

### تثبيت Tailwind و Tailwindcss typography عبر npm

Tailwindcss إطار CSS يقوم على الأصناف المساعدة أولًا (utility-first)، ويوفر لنا أصنافًا مخصصة نصمم بها التطبيق.

أما Tailwindcss Typography فهي بحسب وصفها: "إضافة توفر مجموعة من أصناف `prose` تستطيع استخدامها لإضافة تنسيقات طباعية افتراضية جميلة إلى أي HTML عادي لا تتحكم فيه (مثل HTML المولَّد من Markdown، أو المجلوب من CMS)."

ثبّت @nuxtjs/tailwindcss، وهي وحدة Nuxt لدمج Tailwind، ومعها Tailwind واعتمادياته المرافقة (peer-dependencies) باستخدام npm:

```bash
npm install -D @nuxtjs/tailwindcss tailwindcss@latest postcss@latest autoprefixer@latest
```

أضف وحدة @nuxtjs/tailwindcss إلى قسم buildModules في ملف nuxt.config.js:

```js
// nuxt.config.js
export default {
  buildModules: ["@nuxtjs/tailwindcss"],
};
```

### إنشاء ملف الإعدادات

بعد ذلك، أنشئ ملف tailwind.config.js:

```bash
npx tailwindcss init
```

سينشئ هذا الأمر ملف tailwind.config.js بأبسط صورة في جذر مشروعك:

```js
//tailwind.config.js
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
```

أنشئ ملف `tailwind.css` في `assets/css.tailwind.css`، واستخدم الموجّه `@tailwind` لحقن أنماط Tailwind الأساسية (base) والمكوّنات (components) والأدوات المساعدة (utilities):

```css
/*assets/css/tailwind.css*/
@tailwind base;
@tailwind components;
@tailwind utilities;
```

تستطيع استيراد ملف CSS داخل مكوّناتك، أو جعله متاحًا في الموقع كله بتعريف ملفات CSS أو الوحدات أو المكتبات التي تريدها عامة \_(مضمّنة في كل صفحة).\_

```js
  /* nuxt.config.js*/
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // CSS file in the project
    '@/assets/css/tailwind.css',
  ],

```

### تثبيت Tailwind typography

```bash
# Using npm
npm install @tailwindcss/typography
```

ثم أضف الإضافة إلى ملف tailwind.config.js:

```js
// tailwind.config.js
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
```

### إعداد Tailwind لحذف الأنماط غير المستخدمة في الإنتاج

في ملف tailwind.config.js، اضبط خيار purge بمسارات كل صفحاتك ومكوّناتك، حتى يتخلص Tailwind من الأنماط غير المستخدمة (tree-shake) عند البناء للإنتاج:

```js
// tailwind.config.js
module.exports = {
  purge: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
```

الآن شغّل

```bash
npm run dev
```

### ملاحظة سريعة

أثناء تنفيذ هذه الخطوات، واجهت **مشكلة عدم تطابق في إصدارات الحزم** عند تشغيل `npm run dev`

<!-- ![blog-with-nuxt-content-version-mismatch-error-Annotation 2021-07-11 031752.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625975242485/YCqCkt50g.png) -->

**وهكذا حللتها:**

حدّث الحزمة أو الحزم غير المتطابقة، وكانت في حالتي `vue-server-renderer`

```bash
npm i vue-server-renderer@latest --save
```

![blog-with-nuxt-content-update-vue-renderer-version-Annotation 2021-07-11 032705.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625975276642/JYoReAgk2.png)

بهذا انحلت المشكلة عندي حين شغّلت `npm run dev`

<!-- ![blog-with-nuxt-content-run-dev-succesfull-Annotation 2021-07-11 032953.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625975289781/wtKSJLTIf.png) -->

<!--
<!-- ![blog-with-nuxt-content-site-preview-Annotation 2021-07-11 032953.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625975335704/mi9b73FR9.png) -->

\-->

_رائع! 🎉 الآن ننتقل إلى الجزء الممتع_

## أنشئ أول تدوينة

تعمل وحدة المحتوى بقراءة الملفات الموجودة في مجلد `content/`.

لذلك، انتقل إلى `content/` وأنشئ مجلد `articles/`. ثم أنشئ ملف `first-blog-post.md` وضع فيه ما يلي

```md
content/articles/first-blog-post.md

---

<!--- YAML Front matter section in-between triple dashes '---' -->

title: First Blog Post
description: Learning how to create my blog using nuxt content

---

# My first blog post

Hey there! 👋🏾

This is my first blog post learning nuxt content.
```

<!-- ![blog-with-nuxt-content-create-content-md-file-Annotation 2021-07-11 034837.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1625975435117/_58aEjwEA.png) -->

::info-box
#default{#info-box=""}
لاحظ قسم YAML front matter، سنستخدمه لاحقًا لإدراج متغيرات مخصصة مثل العنوان والوصف، ونصل إليها عبر \`$content\`.
::

بعد ذلك، سننشئ [صفحة ديناميكية](https://nuxtjs.org/docs/2.x/directory-structure/pages#dynamic-pages) نستخدمها من أجل:

- جلب محتوى المقال باستخدام `asyncData` قبل تصيير الصفحة. نصل إلى المحتوى عبر السياق (context) باستخدام المتغير `$content`. ولأننا نستخدم صفحة ديناميكية، نعرف أي ملف مقال نجلبه من المتغير `params.slug` الذي يوفره vue router، فنحصل منه على اسم كل مقال
- عرض المقال في القالب باستخدام `<nuxt-content>`

حسنًا، انتقل إلى `pages/` وأنشئ مجلد `blog/`. ثم أنشئ ملف `_slug.vue` (صفحتنا الديناميكية) وضع فيه ما يلي

```html
pages/blog/_slug.vue

<template>
  <article>
    <!-- this is where we will render the article contents -->
    <nuxt-content :document="article" />
  </article>
</template>

<script>
  export default {
    async asyncData({ $content, params }) {
      //here, we will fetch the article from the article/ folder based on the name provided in the 'params.slug`
      const article = await $content("articles", params.slug).fetch();

      return { article };
    },
  };
</script>
```

لعرض المحتوى نستخدم المكوّن \<nuxt-content /> ونمرر المتغير الذي أرجعناه إلى خاصية document في `:document="article"`.

اذهب إلى موقعك، وسترى شيئًا كهذا

![blog-with-nuxt-content-render-first-article-Annotation 2021-07-11 123202.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626008969368/_V0QIMEyB.png)

## الوصول إلى المتغيرات المحقونة افتراضيًا

توفر وحدة المحتوى متغيرات محقونة كثيرة نستطيع استخدامها في القالب. هذه بعض ما سنستخدمه:

- body: نص المحتوى
- dir: المجلد
- extension: امتداد الملف (.md في هذا المثال)
- path: مسار الملف
- slug: الاسم المختصر للملف في الرابط (slug)
- toc: مصفوفة تحتوي فهرس المحتويات
- createdAt: تاريخ إنشاء الملف
- updatedAt: تاريخ آخر تحديث للملف

نصل إلى هذه البيانات عبر المتغير `article` الذي أنشأناه. لنطّلع عليها بطباعتها داخل وسم `<pre>` في القالب

```html
<pre> {{ article }} </pre>
```

سنرى في الصفحة شيئًا كهذا

```js
{
  "slug": "first-blog-post",
  "toc": [],
  "body": {
    "type": "root",
    "children": [
    // article content
    ]
  },
  "dir": "/articles",
  "path": "/articles/first-blog-post",
  "extension": ".md",
  "createdAt": "2021-07-11T02:34:43.695Z",
  "updatedAt": "2021-07-11T03:33:33.608Z"
}
```

### المتغيرات المحقونة المخصصة

سنستخدم هذا أيضًا لعرض المتغيرات المحقونة المخصصة المحددة في YAML front matter، ويجب أن تكون YAML صالحًا في أعلى الملف. هذا مفيد لإضافة متغيرات SEO مثل عنوان المقال ووصفه وصورته.

```html
<template>
  <article class="article">
      <!-- Our custom injected variables specified with the The YAML front matter goes here  -->
      <header class="article-header">
          <h1>{{article.title}}</h1>
          <p>{{article.description}}</p>

          <!-- container for article details -->
          <div class="details-cont">
              <!-- the format date function converts the default date to a readable form -->
              <span>{{formatDate(article.updatedAt)}}</span>
          </div>
      </header>

      <!-- this is where we will render the article contents -->
      <nuxt-content :document="article" />
  </article>
</template>

<script>
export default {
    async asyncData({ $content, params }) {
    //here, we will fetch the article from the article/ folder based on the name provided in the 'params.slug`
        const article = await $content('articles', params.slug).fetch();

        return {article}
    },
    methods: {
        // format the date to be displayed in a readable format
        formatDate(date){
            return new Date(date).toLocaleDateString('en', {year: 'numeric', month: 'long', day: 'numeric'})
        }
    }
}
```

لاحظ الدالة `formatDate` التي نستخدمها لتحويل قيمة `article.updatedAt` إلى تاريخ أسهل في القراءة.

سيظهر لدينا شيء كهذا:

<!-- ![blog-with-nuxt-content-article-with-injected-variables-Annotation 2021-07-11 135032.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626009001772/l5eXbp4f5.png) -->

الآن لدينا عنصرا عنوان `<h1>`: واحد من YAML front matter وآخر من محتوى markdown الرئيسي. نستطيع حذف الموجود في markdown الرئيسي، ونستطيع أيضًا إضافة محتوى أكثر لتجربة الأنماط:

```md
## <!--- content/articles/first-blog-post -->

title: My First Blog Post
description: Learning how to create my blog using nuxt, the nuxt content module and tailwindcss

---

Hey there! 👋🏾
This is my first blog post learning nuxt content.

I'm currently building it using the following:

- Nuxt.js
- Nuxt Content module
- Tailwindcss
- Tailwindcss typography

> Sweet huh?
```

رائع! 😎 لنحسّن الشكل قليلًا ببعض التنسيق.

## التنسيق باستخدام Tailwindcss و Tailwindcss typography

يظهر محتوى المقال مع بعض البيانات المخصصة عندما نزور الـ slug الخاص به. لكن شكله قبيح، فلنصلح ذلك.

أولًا، نطبّق صنف `.prose` من Tailwindcss typography على عنصر `<article>` لنحصل على أنماط أساسية:

```html
<article class="article prose lg:prose-xl"></article>
```

الآن ننشئ أنماطنا المخصصة في `pages/blog/_slug.vue`

```css
<style scoped>
@layer components {
  .article {
      @apply prose lg:prose-xl;
      @apply p-4 mt-6 lg:mt-8 m-auto lg:max-w-3xl;
  }

  .article-header{
      @apply mb-12 pb-8 lg:mb-16 border-gray-200 border-b-2;
  }

  .article-header h1{
      @apply mb-0;
  }

  .article-header .details-cont span{
      @apply text-opacity-50 text-sm;
  }
}
</style>
```

صارت صفحتنا تبدو هكذا:

<!-- ![blog-with-nuxt-content-configure-blog-with-styling-Annotation 2021-07-11 162500.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626249266836/ut6jai8_v.png) -->

::img-cont
---
alt: Our page with some styling
src: Creating-a-blog-using-Nuxt-and-Nuxt-Content---with-TailwindCSS/blog-with-nuxt-content-configure-blog-with-styling-Annotation
  2021-07-11 162500.png
---
::

رائع فعلًا 😍

## إضافة وسوم HTML ومكوّنات Vue داخل markdown المقال

نستطيع إضافة شيفرة html صالحة داخل ملف markdown. لننشئ صندوق معلومات مع بعض التنسيق

```md
<!--
    content/articles/first-blog-post.md

    ...rest of file

    HTML in markdown
    Info box with svg icon
 -->
<div class="flex gap-4 items-start p-6 bg-blue-200 text-gray-800 border-blue-700 border-l-4 rounded-md">
<span><svg class="text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" height="24" preserveAspectRatio="xMinYMin" class="icon jam jam-info"><path class="text-blue-700" d='M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-10a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z'/></svg></span>
<span class="text-gray-800" style="line-height: initial">Here we have important information we would love to share with you!</span>
</div>
```

سيظهر لك شيء كهذا:

<!-- ![blog-with-nuxt-content-configure-blog-with-html-markup-Annotation 2021-07-11 175231.png](Upload failed. Please re-upload the image) -->

::img-cont
---
alt: Add information box using HTML
src: Creating-a-blog-using-Nuxt-and-Nuxt-Content---with-TailwindCSS/blog-with-nuxt-content-configure-blog-with-html-markup-Annotation
  2021-07-11 175231.png
---
::

جميل، الآن نستطيع تحويل هذا إلى مكوّن vue قابل لإعادة الاستخدام

أنشئ ملف `infoBox.vue` في `components/global`.

```html
<!-- components/global/infoBox.vue-->
<template>
  <div class="info-box">
    <span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-2 -2 24 24"
        width="24"
        height="24"
        preserveAspectRatio="xMinYMin"
        class="icon jam jam-info"
      >
        <path
          d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-10a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm0-1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
        />
      </svg>
    </span>
    <span>
      <slot name="info-box"> Some information gets diaplayed here </slot>
    </span>
  </div>
</template>

<script>
  export default {
    name: "infoBox",
  };
</script>

<style scoped>
  @layer components {
    .icon {
      @apply text-gray-800;
    }

    .info-box {
      @apply flex gap-4 items-start p-6 bg-blue-200 text-gray-800 border-blue-500 border-l-4 rounded-md;
    }

    .info-box span {
      @apply text-gray-800 leading-none;
    }
  }
</style>
```

::info-box
#default{#info-box=""}
ننشئه داخل مجلد `components/global` لتسجيل المكوّن على مستوى التطبيق كله، حتى يستطيع nuxt استيراده تلقائيًا داخل `<nuxt-content>`
::

الآن، استبدل وسوم html بمكوّن `infoBox` الجديد

```html
<!-- infoBox component automatically imported as global component  -->
<info-box>
  <!-- insert into slot -->
  <template #info-box>
    Here we have important information we would love to share with you!
  </template>
</info-box>
```

عندما نعرض الصفحة، سنرى صندوق المعلومات كما هو

<!-- ![blog-with-nuxt-content-configure-blog-with-html-markup-Annotation 2021-07-11 175231.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626249270340/Z-M_a581s.png) -->

::img-cont
---
alt: Add information box using Vue components
src: Creating-a-blog-using-Nuxt-and-Nuxt-Content---with-TailwindCSS/blog-with-nuxt-content-configure-blog-with-html-markup-Annotation
  2021-07-11 175231.png
---
::

## واجهة المحتوى البرمجية (content API)

من الرائع أن وحدة المحتوى توفر واجهة برمجية (API) نصل إليها عبر المسار `http://localhost:3000/_content/`. نستطيع جلب بيانات كل المقالات عبر المسار `http://localhost:3000/_content/articles`.\:brونستطيع الوصول إلى مقال واحد باستخدام الـ slug الخاص به، أي `http://localhost:3000/_content/articles/first-blog-post` للوصول إلى بيانات `http://localhost:3000/blog/first-blog-post`.

## إضافة التنقل إلى المقال السابق والتالي

سنضيف إلى المدونة ميزة الانتقال إلى المقال السابق والتالي، للتنقل بين التدوينات الأخرى في الموقع. لذلك، لننشئ نحو ثلاث نسخ من ملف `content/articles/first-blog-post.md` حتى تكون لدينا تدوينات أكثر نتنقل بينها.

<!-- ![blog-with-nuxt-content-duplicate-article-Annotation 2021-07-11 190022.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626249304972/EHwwhvNxxo.png) -->

::img-cont
---
alt: Duplicates of article
src: Creating-a-blog-using-Nuxt-and-Nuxt-Content---with-TailwindCSS/blog-with-nuxt-content-duplicate-article-Annotation
  2021-07-11 190022.png
---
::

لننشئ مكوّن `prevNext.vue` في مجلد `components/`

هنا لدينا مكوّن `nuxt-link` يصل إلى `slug` و `title` الخاصين بالمقال السابق أو التالي.

```html
<!-- components/prevNext -->

<template>
<!-- ...rest of file -->

<nuxt-link v-if="prev" :to="{ name: 'blog-slug', params: { slug: prev.slug } }" class="prev">
      <span class="icon-cont"><svg</svg></span>
      <span>{{ prev.title }}</span>
</nuxt-link>

<!-- nuxt-link for "next" -->
<!-- ...rest of file -->
</template>
```

هذه البيانات هي ما سنمرره كخصائص (props) إلى المكوّن، وقد عرّفناها هنا:

```html
<!-- components/prevNext -->

<script>
  export default {
    // create props for prev and next data that will be passed to the component
    props: {
      prev: {
        type: Object,
        default: () => null,
      },
      next: {
        type: Object,
        default: () => null,
      },
    },
  };
</script>
```

يجب أن يبدو المكوّن الجديد تقريبًا هكذا:

```html
<!-- components/prevNext -->
<template>
  <section id="prev-next" class="prev-next">
    <!-- if prev data is available display the link -->
    <nuxt-link
      v-if="prev"
      :to="{ name: 'blog-slug', params: { slug: prev.slug } }"
      class="prev"
    >
      <span class="icon-cont"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-5 -5 24 24"
          width="24"
          height="24"
          preserveAspectRatio="xMinYMin"
          class="icon jam jam-arrow-left"
        >
          <path
            d="M3.414 7.657l3.95 3.95A1 1 0 0 1 5.95 13.02L.293 7.364a.997.997 0 0 1 0-1.414L5.95.293a1 1 0 1 1 1.414 1.414l-3.95 3.95H13a1 1 0 0 1 0 2H3.414z"
          /></svg
      ></span>
      <span> {{ prev.title }} </span>
    </nuxt-link>
    <!-- else display empty span for styling purposes -->
    <span class="prev" v-else></span>

    <!-- if prev data is available display the link -->
    <nuxt-link
      v-if="next"
      :to="{ name: 'blog-slug', params: { slug: next.slug } }"
      class="next"
    >
      <span>{{ next.title }}</span>
      <span class="icon-cont">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-5 -5 24 24"
          width="24"
          height="24"
          preserveAspectRatio="xMinYMin"
          class="icon jam jam-arrow-right"
        >
          <path
            d="M10.586 5.657l-3.95-3.95A1 1 0 0 1 8.05.293l5.657 5.657a.997.997 0 0 1 0 1.414L8.05 13.021a1 1 0 1 1-1.414-1.414l3.95-3.95H1a1 1 0 1 1 0-2h9.586z"
          />
        </svg>
      </span>
    </nuxt-link>
    <!-- else display empty span for styling purposes -->
    <span class="next" v-else> </span>
  </section>
</template>

<script>
  export default {
    // create props for prev and next data that will be passed to the component
    props: {
      prev: {
        type: Object,
        default: () => null,
      },
      next: {
        type: Object,
        default: () => null,
      },
    },
  };
</script>

<style scoped>
  @layer components {
    /* styling for the components */
    .prev-next {
      @apply flex gap-12 py-8 items-center justify-between m-auto max-w-xl lg: max-w-4xl;
    }

    .prev-next a {
      @apply flex gap-2;
    }
  }
</style>
```

لنعد الآن إلى `components/blog/_slug.vue`.

```javascript
// components/blog/_slug.vue

export default {
  async asyncData({ $content, params }) {
    const article = await $content('articles', params.slug).fetch()

    // assign the first two objects in returned array to prev & next constant variables
    const [prev, next] = await $content('articles')
      // fetch only the title and slug from the articles
      .only(['title', 'slug', 'updatedAt'])
      // sortby time updated, in ascending order
      .sortBy('updatedAt', 'asc')
      // get the correct slug
      .surround(params.slug)
      // fetch data
      .fetch()

    // return the data to be vailable for use in the file
    return { article, prev, next }

// rest of <script>
```

صارت لدينا الآن بيانات أول مقالين بعد الترتيب، كلٌّ منهما في متغير: `prev` و `next`. سنمررهما الآن إلى مكوّن `prevNext` بعد `<article>`

```html
<!-- components/blog/_slug.vue -->

<!-- rest of file -->

<!-- Pass the data to the component props-->
<prev-next :prev="prev" :next="next"></prev-next>
```

ها هو ذا:

<!-- ![blog-with-nuxt-content-prevVext-component-Annotation 2021-07-12 003740.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626249332207/9joodc1yS.png) -->

::img-cont
---
alt: Previous and Next compnont
src: Creating-a-blog-using-Nuxt-and-Nuxt-Content---with-TailwindCSS/blog-with-nuxt-content-prevVext-component-Annotation
  2021-07-12 003740.png
---
::

رائع!

## عرض قائمة بكل المقالات

سيكون جميلًا لو عرضنا مقالاتنا في صفحة المدونة.\:brلننشئ صفحة جديدة في مجلد `blogs/`؛ `pages/blogs/index.vue`:brثم في `<script>` نمرر `$content` و `params` إلى الدالة `asyncData`. داخل الدالة نمرر إلى `$content` القيمة `aritcles`، وهو المجلد الذي نخزّن فيه مقالاتنا، ثم نسلسل `.only(['title', 'slug', 'updatedAt', 'description'])` لجلب هذه الخصائص فقط من المقالات،\:br`.sortBy('createdAt', 'asc')` لترتيبها\:brوأخيرًا `fetch()` لجلب البيانات وإسنادها إلى `const articles`

```html
<!-- pages/blog/index.vue -->

<script>
  export default {
    async asyncData({ $content }) {
      const articles = await $content('articles')
        .only(['title', 'slug', 'updatedAt', 'description'])
        .sortBy('createdAt', 'asc')
        .fetch()

      return { articles }
    },

    methods: {
      formatDate(date) {
        // format the date to be displayed in a readable format
        })
      },
    },
  }
</script>
```

الآن نستطيع استخدام الموجّه `v-for` لعرض المقالات من بيانات `articles`

```html
<!-- pages/blog/index.vue -->

<template>
  <section class="blog">
    <header class="blog-header">
      <h1>It's nice you're here. Welcome.</h1>
      <p>
        Have a look what I've been spending hours behind the screen writing
        about
      </p>
    </header>

    <ul class="articles">
      <li class="article" v-for="article of articles" :key="article.slug">
        <nuxt-link :to="{ name: 'blog-slug', params: { slug: article.slug } }">
          <h2>{{ article.title }}</h2>
          <p>{{ article.description }}</p>

          <div class="details-cont">
            <span>{{ formatDate(article.updatedAt) }}</span>
          </div>
        </nuxt-link>
      </li>
    </ul>
  </section>
</template>

<!--- Styling the page -->
<style scoped>
  @layer base {
    .blog {
      @apply p-4 mt-6 lg:mt-8 m-auto lg:max-w-3xl;
    }

    .blog-header {
      @apply prose lg:prose-xl;
      @apply mb-12 pb-8 lg:mb-16;
    }

    .blog-header h1 {
      @apply mb-0;
    }

    .articles .article {
      @apply prose lg:prose-lg;
      @apply pl-0 py-2 list-none;
    }

    .articles .article h2 {
      @apply mb-0;
    }
  }
</style>
```

لنزُر <http://localhost:3000/blog>، وسنرى صفحة المدونة

<!-- ![blog-with-nuxt-content-blog-list-index-page-Annotation 2021-07-14 061942.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626249390189/c6DL-LK47.png) -->

::img-cont
---
alt: Blog page, list out all blog posts
src: Creating-a-blog-using-Nuxt-and-Nuxt-Content---with-TailwindCSS/blog-with-nuxt-content-blog-list-index-page-Annotation
  2021-07-14 061942.png
---
::

## إنشاء قائمة تنقل للموقع

آخر ما سنفعله هو إنشاء قائمة تنقل بسيطة تأخذنا إلى الصفحة الرئيسية وصفحة المدونة.

لننشئ مكوّن `siteHeader.vue` في `components/` مع بعض التنسيق الأساسي.

```html
<!-- components/siteHeader.vue -->

<template>
  <header id="site-header" class="site-header">
    <div class="wrapper">
      <nuxt-link to="/">
        <figure class="site-logo">
          <h1>PortfolioX</h1>
        </figure>
      </nuxt-link>

      <nav class="site-nav">
        <ul class="links">
          <li class="link">
            <nuxt-link to="/blog">Blog</nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
  export default {};
</script>

<style scoped>
  @layer components {
    .site-header {
      @apply w-auto p-4 py-8 sticky top-0 bg-white bg-opacity-70 backdrop-filter backdrop-blur-md z-10;
    }

    .site-header .wrapper {
      @apply m-auto max-w-5xl flex items-center justify-between;
    }
  }
</style>
```

بعد ذلك، نضيفه إلى تخطيط الموقع الافتراضي (layout) في `layouts/default.vue`

```html
<!-- layouts/default.vue -->

<template>
  <div>
    <site-header />
    <Nuxt />
  </div>
</template>
```

صار مكوّن `siteHeader.vue` يُستورد تلقائيًا في التخطيط. ألقِ نظرة على الصفحة

<!-- ![blog-with-nuxt-content-blog-with-site-header-Annotation 2021-07-14 075929.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1626249427110/1v-qmk4z0.png) -->

::img-cont
---
alt: Blog with Site Header
src: Creating-a-blog-using-Nuxt-and-Nuxt-Content---with-TailwindCSS/blog-with-nuxt-content-blog-with-site-header-Annotation
  2021-07-14 075929.png
---
::

جميل 😘

## الخلاصة

بنينا موقع مدونة بسيطًا فيه ميزات مهمة باستخدام وحدة واحدة فقط: nuxt/content. ركّز هذا المقال على وحدة المحتوى، لذلك سأضع روابط لمزيد من القراءة عن tailwindcss.\:brأرى أنها ميزة رائعة ومفيدة في Nuxt.js. وأظنك ستستمتع بتجربتها أكثر، لأن هناك وظائف كثيرة أخرى تستطيع إضافتها إلى مشروعك ولم نتناولها هنا.

أتمنى أن تجد هذا مفيدًا. سأفكر في الكتابة عن النشر مستقبلًا، وإلى ذلك الحين سأضع بعض الروابط التي أراها مفيدة.

شكرًا للقراءة. برمجة ممتعة 😎.

## قراءات إضافية

### روابط مفيدة

- توثيق وحدة المحتوى: <https://content.nuxtjs.org/>
- توثيق NuxtJs: <https://nuxtjs.org/docs/2.x/get-started/installation>
- توثيق Tailwindcss: <https://tailwindcss.com/docs/>

### مقالات تستحق القراءة

- مقال عن إنشاء مدونة باستخدام Nuxt content: <https://nuxtjs.org/blog/creating-blog-with-nuxt-content#add-a-search-field>
- مقال عن بناء موقع أعمال شخصي (portfolio) باستخدام NuxtJs: <https://itnext.io/building-the-ultimate-portfolio-site-with-nuxt-js-and-netlify-beautiful-blazing-fast-100-seod-102913a60cfd>
