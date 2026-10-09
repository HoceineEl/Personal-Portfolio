---
title: Quick Action Dock – إضافة لـ Filament
description: إضافة مجانية لـ Filament 4 و 5 تضيف شريطًا عائمًا قابلًا للسحب لأكثر الإجراءات استخدامًا في كل صفحة من اللوحة.
tags: [Laravel, FilamentPHP, Filament Plugin, Actions, UX, Open Source]
image: "/images/my_projects/filament-quick-action-dock/cover.webp"
createdAt: 2026-10-09T00:00:00.000Z
updatedAt: 2026-10-09T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## شريط الإجراءات السريعة لـ Filament

### لماذا بنيتها

في أغلب اللوحات التي أبنيها، يكرر المستخدمون ثلاثة أو أربعة أشياء طوال اليوم: إنشاء طلب، وإضافة زبون، وفتح تقرير اليوم. وهذه الإجراءات موزعة على صفحات مختلفة، فيتنقلون فقط ليضغطوا زرًا واحدًا. الشريط يضعها في كل صفحة.

### ماذا تفعل

- **شريط عائم** على شكل قائمة دائرية أو شريط، بأربعة أنماط: Native و Outline و Contrast و Tinted
- **اسحبه إلى أي مكان**، ويُحفظ موضعه لكل لوحة ولكل مستخدم
- **إجراءات مجمّعة** بعناوين وشارات حية وتلميحات للاختصارات
- **اعرض الإجراءات لمن يحتاجها** حسب المستخدم أو الصلاحية أو الدور أو الصفحة أو المورد أو المسار أو الجهاز
- **يعرف السياق**: يخبر `DockContext` الإجراء بالصفحة والسجل الحاليين
- **إجراءات Filament حقيقية**، فالنوافذ والتأكيد والأيقونات والألوان والصلاحيات تعمل كالمعتاد

تعمل مع عدة لوحات ومستأجرين، وتناسب الهواتف، وتدعم العربية و 23 لغة، وتأتي مع أدوات للاختبار.

### التثبيت

```bash
composer require hoceineel/filament-quick-action-dock
```

تدعم Filament 4 و 5. الشيفرة على [GitHub](https://github.com/HoceineEl/filament-quick-action-dock)، والإضافة مدرجة في [دليل إضافات Filament](https://filamentphp.com/plugins/hocein-el-idrissi-quick-action-dock).
