---
title: "إتقان الموارد المتداخلة في FilamentPHP v4"
description: تعلّم استخدام الميزة الأكثر طلبًا في FilamentPHP v4، الموارد المتداخلة. ابنِ لوحات إدارة هرمية بعلاقات أب وابن ومسار تنقل (breadcrumbs) واضح.
tags:
  - FilamentPHP
  - Laravel
  - Admin Panel
  - PHP
  - TALL Stack
noImage: true
createdAt: 2024-12-19T14:00:00.000Z
updatedAt: 2024-12-19T14:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# إتقان الموارد المتداخلة في FilamentPHP v4

صدر FilamentPHP v4 في 12 أغسطس 2025، وجاء أخيرًا بالميزة الأكثر طلبًا في تاريخ Filament: **الموارد المتداخلة (nested resources)**. هذه الإضافة الكبيرة تتيح لك إدارة بيانات هرمية معقدة بتنقل واضح وبنية URL سليمة.

## ما الموارد المتداخلة؟

تتيح لك الموارد المتداخلة العمل على مورد (Resource) في Filament ضمن سياق مورد أب. تخيّلها هكذا:

- **الدورات** ← **الدروس** ← **الاختبارات القصيرة**
- **الشركات** ← **الأقسام** ← **الموظفون**
- **المشاريع** ← **المهام** ← **المهام الفرعية**

في السابق كنت تستخدم مديري العلاقات (relation managers) لهذا، لكنهم كانوا محصورين في التعديل داخل نافذة منبثقة (modal). أما الموارد المتداخلة فتمنح كل سجل ابن صفحة كاملة خاصة به، مع الحفاظ على سياق الأب.

## متى تستخدم الموارد المتداخلة ومتى تستخدم مديري العلاقات

| الميزة | مدير العلاقات | المورد المتداخل |
|---------|-----------------|-----------------|
| التعديل | داخل نافذة منبثقة | صفحة كاملة |
| التعقيد | سجلات بسيطة | سجلات معقدة |
| النماذج | مساحة محدودة | مساحة غير محدودة |
| التنقل | الصفحة نفسها | صفحات مخصصة |
| بنية URL | رابط الأب فقط | روابط هرمية |

## إنشاء أول مورد متداخل

لنبنِ تسلسلًا هرميًا: الدورة ← الدرس.

### الخطوة 1: أنشئ المورد الأب

```bash
php artisan make:filament-resource Course
```

### الخطوة 2: أنشئ المورد المتداخل

```bash
php artisan make:filament-resource Lesson --nested
```

الخيار `--nested` ضروري، فهو يخبر Filament أن هذا المورد يجب أن يكون متداخلًا داخل مورد آخر.

### الخطوة 3: اضبط المورد الأب

في ملف `CourseResource.php`:

```php
use App\Filament\Resources\LessonResource;

class CourseResource extends Resource
{
    protected static ?string $model = Course::class;

    public static function getRelations(): array
    {
        return [
            // Traditional relation managers still work
        ];
    }

    public static function getNestedResources(): array
    {
        return [
            'lessons' => LessonResource::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCourses::route('/'),
            'create' => Pages\CreateCourse::route('/create'),
            'edit' => Pages\EditCourse::route('/{record}/edit'),
            'lessons' => Pages\ManageLessons::route('/{record}/lessons'),
        ];
    }
}
```

### الخطوة 4: اضبط المورد المتداخل

في ملف `LessonResource.php`:

```php
class LessonResource extends Resource
{
    protected static ?string $model = Lesson::class;

    protected static bool $isNested = true;

    protected static ?string $parentResource = CourseResource::class;

    protected static ?string $parentRelationship = 'lessons';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\RichEditor::make('content')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('duration_minutes')
                    ->numeric()
                    ->required(),
                Forms\Components\Toggle::make('is_published')
                    ->default(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),
                Tables\Columns\TextColumn::make('duration_minutes')
                    ->suffix(' min'),
                Tables\Columns\IconColumn::make('is_published')
                    ->boolean(),
            ])
            ->defaultSort('order_column');
    }
}
```

## بنية URL ومسار التنقل

من أفضل ما في الموارد المتداخلة أن بنية URL تُبنى تلقائيًا:

```
/admin/courses                      → List all courses
/admin/courses/1/edit               → Edit course #1
/admin/courses/1/lessons            → List lessons for course #1
/admin/courses/1/lessons/create     → Create lesson for course #1
/admin/courses/1/lessons/5/edit     → Edit lesson #5 of course #1
```

ويعكس مسار التنقل (breadcrumbs) هذا التسلسل تلقائيًا:

```
Courses > Introduction to Laravel > Lessons > Getting Started
```

## التداخل العميق

يمكنك تداخل الموارد على عدة مستويات:

```php
// In LessonResource
public static function getNestedResources(): array
{
    return [
        'quizzes' => QuizResource::class,
    ];
}
```

وهذا ينتج روابط مثل:
```
/admin/courses/1/lessons/5/quizzes/3/edit
```

## الوصول إلى بيانات الأب

داخل المورد المتداخل، يمكنك الوصول إلى سجل الأب:

```php
// In a nested resource's form
public static function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\Placeholder::make('course_name')
                ->content(fn ($livewire) => $livewire->getOwnerRecord()->name),
            // ... other fields
        ]);
}
```

## التنقل داخل الأب

أضف عنصر تنقل في صفحة تعديل الأب:

```php
// In EditCourse.php
protected function getHeaderActions(): array
{
    return [
        Actions\Action::make('manage_lessons')
            ->label('Manage Lessons')
            ->url(fn () => CourseResource::getUrl('lessons', ['record' => $this->record])),
    ];
}
```

## أفضل الممارسات

### 1. اجعل التداخل سطحيًا

التداخل العميق مدعوم، لكن 2-3 مستويات غالبًا هو الحد المناسب. بعد ذلك قد يتوه المستخدمون.

### 2. استخدم مديري العلاقات للبيانات البسيطة

إذا كانت السجلات الأبناء بسيطة (اسم وبضعة حقول فقط)، فقد يظل مدير العلاقات خيارًا أفضل.

### 3. استفد من مسار التنقل

خصّص مسار التنقل ليكون التنقل واضحًا تمامًا:

```php
public static function getBreadcrumb(): string
{
    return 'Lessons';
}
```

### 4. انتبه للصلاحيات

ترث الموارد المتداخلة صلاحيات الأب افتراضيًا. خصّصها عند الحاجة:

```php
public static function canViewAny(): bool
{
    $parent = request()->route('record');
    return auth()->user()->can('viewLessons', $parent);
}
```

## الانتقال من مديري العلاقات

إذا كنت تحوّل مديري علاقات قائمين إلى موارد متداخلة:

1. أنشئ المورد المتداخل مع `--nested`
2. انقل تعريفات الجدول والنموذج
3. حدّث `getNestedResources()` في المورد الأب
4. احذف مدير العلاقات القديم
5. حدّث أي تنقل أو إجراءات تشير إلى الإعداد القديم

## الخلاصة

تحل الموارد المتداخلة في FilamentPHP v4 مشكلة قديمة عانى منها المطورون الذين يبنون لوحات إدارة معقدة. بنية URL التلقائية، ومسار التنقل، والتعديل في صفحة كاملة، كلها تجعل إدارة البيانات الهرمية سهلة.

سواء كنت تبني نظام إدارة تعلّم (LMS)، أو أداة لإدارة المشاريع، أو أي تطبيق فيه علاقات أب وابن، فستحسّن الموارد المتداخلة تجربة المطور وسهولة الاستخدام للمستخدم النهائي تحسينًا ملحوظًا.

---

## مصادر

- [توثيق الموارد المتداخلة في FilamentPHP](https://filamentphp.com/docs/4.x/resources/nesting)
- [ملاحظات إصدار Filament v4](https://filamentphp.com/content)
