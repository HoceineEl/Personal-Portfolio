---
title: "FilamentPHP v4: الدليل الشامل لكل الميزات الجديدة"
description: أتقن ميزات FilamentPHP v4 الثورية، ومنها المخططات (Schemas)، والموارد المتداخلة، والمصادقة متعددة العوامل (MFA)، والجداول غير المرتبطة بنموذج، ومحرر TipTap، وتحسينات أداء ضخمة مع عرض أسرع بـ 2-3 مرات.
tags:
  - FilamentPHP
  - Filament v4
  - Laravel
  - Admin Panel
  - TALL Stack
noImage: true
createdAt: 2025-09-01T10:00:00.000Z
updatedAt: 2025-09-01T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# FilamentPHP v4: الدليل الشامل لكل الميزات الجديدة

صدر FilamentPHP v4 بنسخته **المستقرة في 12 أغسطس 2025**، بعد إطلاق النسخة التجريبية في Laravel Live UK يوم 10 يونيو. يحوّل هذا الإصدار Filament من أداة لبناء لوحات الإدارة إلى إطار تطبيقات متكامل قادر على بناء أنظمة بمستوى المؤسسات.

## تحسينات الأداء (أسرع بـ 2-3 مرات)

أبرز ميزة هي **قفزة كبيرة في الأداء**، خصوصًا مع الجداول الكبيرة:

### تحسين العرض على الخادم

- عرض على الخادم **أسرع بـ 2-3 مرات** للجداول المعقدة
- عبء أقل على قوالب Blade بفضل تحسين عرض كائنات PHP
- ملفات أقل تُحمَّل = زمن استجابة أسرع

### العرض الجزئي للمكوّنات

توابع جديدة تمنع إعادة العرض المكلفة:

```php
TextInput::make('name')
    ->live()
    ->partiallyRenderComponentsAfterStateUpdated(),

Select::make('category')
    ->live()
    ->skipRenderAfterStateUpdated(),
```

## المخططات (Schemas): بنية موحّدة للمكوّنات

توحّد المخططات النماذج وقوائم المعلومات (infolists) والمكوّنات الأساسية (prime components) في نظام واحد قابل للتركيب:

```php
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;

public function schema(Schema $schema): Schema
{
    return $schema->components([
        Section::make('User Details')
            ->schema([
                // Mix form fields and infolist entries!
                TextInput::make('name')
                    ->required(),

                TextEntry::make('created_at')
                    ->dateTime(),

                // Prime components work too
                Actions::make([
                    Action::make('save')->submit(),
                ]),
            ]),
    ]);
}
```

### مزايا المخططات

- **امزج كما تشاء** - اجمع النماذج وقوائم المعلومات والإجراءات في عرض واحد
- **واجهة يقودها الخادم** - ابنِ الواجهات بـ PHP، دون حاجة إلى JavaScript
- **API متّسقة** - الأنماط نفسها في كل أنواع المكوّنات

## الموارد المتداخلة

الميزة الأكثر طلبًا وصلت أخيرًا:

```bash
php artisan make:filament-resource Lesson --nested
```

```php
// CourseResource.php
class CourseResource extends Resource
{
    public static function getNestedResources(): array
    {
        return [
            'lessons' => LessonResource::class,
        ];
    }
}

// LessonResource.php
class LessonResource extends Resource
{
    protected static bool $isNested = true;
    protected static ?string $parentResource = CourseResource::class;
}
```

بنية الرابط:
```
/admin/courses/1/lessons/5/edit
```

يعرض مسار التنقل (breadcrumbs) تلقائيًا: `Courses > Laravel Basics > Lessons > Introduction`

## المصادقة متعددة العوامل (MFA)

مصادقة MFA مدمجة دون حزم خارجية:

```php
// In your PanelProvider
public function panel(Panel $panel): Panel
{
    return $panel
        ->mfa()
        ->mfaMethods([
            EmailMfa::class,
            TotpMfa::class, // Google Authenticator
        ]);
}
```

الميزات:
- **رموز عبر البريد الإلكتروني**
- **تطبيقات TOTP** (Google Authenticator و Authy)
- **رموز الاسترداد**
- خيار **تذكّر الجهاز**

## جداول غير مرتبطة بنموذج

اعرض أي بيانات في الجداول، لا نماذج Eloquent فقط:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->records([
            ['name' => 'John', 'role' => 'Admin', 'status' => 'Active'],
            ['name' => 'Jane', 'role' => 'Editor', 'status' => 'Active'],
            ['name' => 'Bob', 'role' => 'Viewer', 'status' => 'Inactive'],
        ])
        ->columns([
            TextColumn::make('name')->searchable(),
            TextColumn::make('role')->sortable(),
            BadgeColumn::make('status'),
        ])
        ->paginated()
        ->searchable();
}
```

حالات الاستخدام:
- عرض بيانات من API
- إحصاءات مجمّعة
- بيانات من خدمات خارجية
- جداول مرجعية ثابتة في الشيفرة

## محرر TipTap (بديلًا عن Trix)

يستخدم `RichEditor` الجديد محرر TipTap لتحرير محتوى أقوى:

```php
RichEditor::make('content')
    ->toolbarButtons([
        'bold',
        'italic',
        'link',
        'h2',
        'h3',
        'bulletList',
        'orderedList',
        'codeBlock',
        'blockquote',
        'table',
    ])
    ->fileAttachmentsDirectory('attachments')
    ->extraAttributes(['style' => 'min-height: 300px']);
```

إمكانات جديدة:
- **الجداول** - إدراج الجداول وتعديلها
- **كتل الشيفرة** - تلوين الصياغة
- **تعامل أفضل مع الروابط**
- **جاهز للتحرير التعاوني**

## مكوّنات إدخال جديدة

### مكوّن المنزلق (Slider)

```php
Slider::make('price')
    ->min(0)
    ->max(1000)
    ->step(10)
    ->marks([
        0 => '$0',
        500 => '$500',
        1000 => '$1000',
    ]);
```

### محرر الشيفرة

```php
CodeEditor::make('json_config')
    ->language('json')
    ->lineNumbers()
    ->minHeight(200);
```

يدعم: HTML و CSS و JavaScript و PHP و JSON

## Tailwind CSS v4

يستخدم Filament v4 إصدار Tailwind v4 مع:
- **بناء أسرع**
- **إعداد أبسط**
- **إعداد يبدأ من CSS**
- **وضع داكن أفضل**

## الترقية من v3

صُمّمت الترقية لتكون سلسة:

```bash
composer require filament/filament:"^4.0"
php artisan filament:upgrade
```

أغلب التغييرات الكاسرة بسيطة. أهم ما يجب نقله:
- حدّث أي تطبيقات مخصصة لـ Trix إلى TipTap
- راجع تغييرات الوسيط (middleware)
- اختبر MFA إن كنت تستخدم حزمًا لها من قبل

## الخلاصة

FilamentPHP v4 ليس مجرد تحديث، بل إعادة تصوّر لما يمكن أن تكونه لوحات الإدارة. مع مخططات تتيح واجهات يقودها الخادم، وموارد متداخلة تدير الهرميات المعقدة، وأداء أفضل بـ 2-3 مرات، صار Filament جاهزًا لتطبيقات المؤسسات.

سواء كنت تبني نظام إدارة محتوى (CMS) بسيطًا أو منصة SaaS معقدة، يوفّر Filament v4 الأدوات التي تحتاجها.

---

## مصادر

- [إعلان إطلاق Filament v4](https://filamentphp.com/content/alexandersix-filament-v4-is-stable)
- [ما الجديد في Filament v4](https://filamentphp.com/content/leandrocfe-whats-new-in-filament-v4)
- [توثيق Filament v4](https://filamentphp.com/docs/4.x)


---

## البناء على v4 في بيئة الإنتاج

كل ما ورد أعلاه استخدمته في بناء **[FilamentCraft](https://filamentcraft.dev?ref=blog-filament-4)**، منشئ مواقع مرئي تجاري يأتي كإضافة لـ Filament. يعتمد بقوة على أجزاء v4 الواردة في هذا الدليل: المخططات للوحة إعدادات الأقسام، وسلوك الموارد المتداخلة الجديد، وتحسينات الأداء التي تجعل معاينة iframe الحية عملية.

يدعم Filament 4 و 5 من قاعدة شيفرة واحدة، وتبيّن أن ذلك أقل إيلامًا بكثير مما توقعت: v5 مجرد ترقية إلى Livewire 4 دون تغييرات تُذكر في API الخاصة بـ Filament. تستطيع تجربة المحرر في [الموقع التجريبي](https://demo.filamentcraft.dev/launch/admin?ref=blog-filament-4)، دون تسجيل.
