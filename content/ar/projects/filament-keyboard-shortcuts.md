---
title: Keyboard Shortcuts – إضافة لـ Filament
description: إضافة مجانية لـ Filament 4 و 5 تضيف قائمة اختصارات قابلة للبحث، وتنقلًا بين الصفحات بالحروف، ومفاتيح للتنقل بين صفوف الجداول.
tags: [Laravel, FilamentPHP, Filament Plugin, Keyboard Shortcuts, Accessibility, Open Source]
image: "/images/my_projects/filament-keyboard-shortcuts/cover.webp"
createdAt: 2026-10-09T00:00:00.000Z
updatedAt: 2026-10-09T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## اختصارات لوحة المفاتيح لـ Filament

### لماذا بنيتها

أقضي أغلب يومي داخل لوحات Filament، وكنت أمدّ يدي إلى الفأرة لأشياء يتيح لي Gmail و GitHub فعلها من لوحة المفاتيح. هذه الإضافة تنقل تلك العادات إلى أي لوحة Filament.

### ماذا تفعل

- **اضغط `?`** (أو `mod+/`) لتفتح قائمة قابلة للبحث بكل اختصارات الصفحة الحالية، ومنها اختصارات الإجراءات التي عرّفتها أنت
- **اضغط `g` ثم حرفًا** لتنتقل إلى صفحة. تظهر شارة بالحرف بجانب كل عنصر في القائمة، وتحصل القوائم الطويلة على اختصارات من حرفين
- **تنقّل في الجداول** بالمفتاحين `j` و `k`، وحدّد الصف بـ `x`، وغيّر الصفحة بـ `[` و `]`
- **اضغط `/`** للانتقال إلى البحث العام
- **أضف اختصاراتك** لفتح رابط، أو إطلاق حدث، أو تشغيل JavaScript

كل ميزة مفعّلة افتراضيًا ويمكن إيقافها وحدها. تدعم الوضع الداكن والعربية من اليمين إلى اليسار، وفيها 23 ترجمة، وتُبقي التركيز داخل القائمة، وتعمل جيدًا مع قارئ الشاشة.

### التثبيت

```bash
composer require hoceineel/filament-keyboard-shortcuts
```

تدعم Filament 4 و 5. الشيفرة على [GitHub](https://github.com/HoceineEl/filament-keyboard-shortcuts)، والإضافة مدرجة في [دليل إضافات Filament](https://filamentphp.com/plugins/hocein-el-idrissi-keyboard-shortcuts).
