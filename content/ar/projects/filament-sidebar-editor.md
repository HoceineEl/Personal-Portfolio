---
title: Sidebar Editor – إضافة لـ Filament
description: إضافة مجانية لـ Filament 5 تضيف صفحة يخفي فيها المستخدمون مجموعات التنقل وصفحاته ويظهرونها ويرتبونها بالسحب والإفلات مع معاينة مباشرة، وتُحفظ لكل مستأجر أو لكل مستخدم أو للوحة كلها.
tags: [Laravel, FilamentPHP, Filament Plugin, Navigation, Multi-tenancy, Open Source]
image: "/images/my_projects/filament-sidebar-editor/cover.webp"
createdAt: 2026-10-19T00:00:00.000Z
updatedAt: 2026-10-19T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## محرر القائمة الجانبية لـ Filament

### ما الذي تفعله

تضيف الإضافة صفحة **Sidebar** إلى لوحة Filament 5. يسحب فيها المستخدمون مجموعات التنقل وصفحاته من مقبضها، ويخفون الصفحات والصفحات الفرعية أو يظهرونها، ويرون المعاينة تتحدث قبل الحفظ. وتتغير القائمة الجانبية الفعلية عند تحميل الصفحة التالية.

تظهر الصفحات والموارد الجديدة تلقائيًا، ولا يمكن إخفاء صفحة المحرر نفسها، فلا يُقفل أحد على نفسه. وإخفاء صفحة يزيلها من القائمة فقط، ولا يغيّر من يستطيع فتحها.

![محرر القائمة الجانبية مع المعاينة المباشرة](/images/my_projects/filament-sidebar-editor/editor.webp)

### أين يُحفظ الترتيب

- **لكل مستأجر**: في عمود JSON لدى المستأجر الحالي، فيكون لكل فريق أو متجر قائمته الخاصة
- **لكل مستخدم**: ترتيب واحد لكل مستخدم ولوحة، في جدول الإضافة
- **للوحة كلها**: ترتيب واحد للجميع (الخيار الافتراضي)
- **تخزين خاص بك**: صنف يطبّق العقد `LayoutStore`، أو دالتان

لكل لوحة إعداداتها: من يحق له فتح المحرر، ورابط الصفحة وأيقونتها ومجموعتها واسمها، والصفحات التي لا يمكن إخفاؤها، وهل تبقى الصفحات غير المصنفة مثبتة في الأعلى.

![المحرر في الوضع الداكن](/images/my_projects/filament-sidebar-editor/dark.webp)

وتدعم الإضافة اللوحات من اليمين إلى اليسار.

![المحرر في لوحة من اليمين إلى اليسار](/images/my_projects/filament-sidebar-editor/rtl.webp)

### التثبيت

```bash
composer require hoceineel/filament-sidebar-editor
php artisan filament:assets
```

```php
use HoceineEl\SidebarEditor\SidebarEditorPlugin;

$panel->plugin(SidebarEditorPlugin::make());
```

تحتاج PHP 8.3 أو أحدث، و Laravel 12 أو 13، و Filament 5. برخصة MIT، على [GitHub](https://github.com/HoceineEl/filament-sidebar-editor) وفي [دليل إضافات Filament](https://filamentphp.com/plugins/hocein-el-idrissi-sidebar-editor).
