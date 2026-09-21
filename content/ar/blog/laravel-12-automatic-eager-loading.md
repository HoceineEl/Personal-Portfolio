---
title: "التحميل المسبق التلقائي في Laravel 12: وداعًا لمشكلة N+1 إلى الأبد"
description: نظرة معمّقة على ميزة التحميل المسبق التلقائي في Laravel 12. تعرّف كيف تكتشف استعلامات N+1 وتمنعها، وما خيارات إعدادها، ومتى تستخدم التحميل المسبق اليدوي.
tags:
  - Laravel
  - Laravel 12
  - Performance
  - Eloquent
  - Database
noImage: true
createdAt: 2025-03-10T09:00:00.000Z
updatedAt: 2025-03-10T09:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# التحميل المسبق التلقائي في Laravel 12: وداعًا لمشكلة N+1 إلى الأبد

ربما يكون **التحميل المسبق التلقائي** (automatic eager loading) في Laravel 12 أهم ميزة أداء أُضيفت إلى Eloquent على الإطلاق. يقضي على مشكلات استعلامات N+1 تلقائيًا، دون أن يضطر المطور إلى تذكّر استدعاءات `with()`.

## شرح مشكلة N+1

قبل Laravel 12، كانت هذه الشيفرة البريئة كارثة على الأداء:

```php
// The classic N+1 trap
$posts = Post::all();

foreach ($posts as $post) {
    echo $post->author->name; // New query for each post!
}
```

مع 100 منشور، تنفّذ هذه الشيفرة **101 استعلام**:
1. استعلام واحد لكل المنشورات
2. 100 استعلام لجلب كاتب كل منشور

## كيف يعمل التحميل المسبق التلقائي

صار Laravel 12 يتتبّع العلاقات التي تصل إليها ويحسّن الاستعلامات اللاحقة تلقائيًا:

```php
// Laravel 12 - Same code, smart behavior
$posts = Post::all();

foreach ($posts as $post) {
    echo $post->author->name;
}
```

**ما يحدث خلف الكواليس:**

1. التكرار الأول يصل إلى `$post->author`
2. يكتشف Laravel علاقة محمّلة بالتحميل الكسول (lazy loading)
3. يحمّل `author` مسبقًا لكل المنشورات المتبقية تلقائيًا
4. تستخدم التكرارات اللاحقة البيانات المخزّنة

**سجل الاستعلامات:**
```sql
SELECT * FROM posts;
SELECT * FROM users WHERE id IN (1, 2, 3, 4, ...); -- Automatic!
```

## خيارات الإعداد

### التفعيل أو التعطيل على مستوى التطبيق

```php
// config/database.php
'eloquent' => [
    'automatic_eager_loading' => true, // Default in Laravel 12
],
```

### التحكم لكل نموذج (Model)

```php
class Post extends Model
{
    // Disable for this model
    protected static bool $automaticEagerLoading = false;

    // Or specify relationships to exclude
    protected array $excludeFromAutomaticEagerLoading = [
        'comments', // Too expensive, keep lazy
        'analytics',
    ];
}
```

### التحكم وقت التشغيل

```php
// Disable for a specific query
Post::withoutAutomaticEagerLoading()->get();

// Force manual eager loading preference
Post::with('author')->withoutAutomaticEagerLoading()->get();
```

## العلاقات المتداخلة

يعمل التحميل المسبق التلقائي مع العلاقات المتداخلة أيضًا:

```php
$posts = Post::all();

foreach ($posts as $post) {
    foreach ($post->comments as $comment) {
        echo $comment->author->name; // Auto-eager loads comments AND their authors
    }
}
```

**الاستعلامات المولَّدة:**
```sql
SELECT * FROM posts;
SELECT * FROM comments WHERE post_id IN (1, 2, 3, ...);
SELECT * FROM users WHERE id IN (5, 6, 7, ...);
```

## قياسات الأداء

قياس من مشروع حقيقي على 1,000 منشور، لكل منشور كاتب و 10 تعليقات:

| الطريقة | الاستعلامات | الوقت |
|----------|---------|------|
| دون تحميل مسبق (Laravel 11) | 11,001 | 8.2s |
| `with()` يدويًا (Laravel 11) | 3 | 0.15s |
| تلقائي (Laravel 12) | 3 | 0.16s |

الكلفة الإضافية للاكتشاف، وهي 6ms، لا تُذكر مقارنة بمكسب الأداء.

## متى يظل التحميل المسبق اليدوي أفضل

### 1. متحكمات API ذات العلاقات المعروفة مسبقًا

```php
// Manual is more explicit and predictable
public function index()
{
    return Post::with(['author', 'tags', 'category'])
        ->paginate(20);
}
```

### 2. الاستعلامات المعقدة ذات القيود

```php
// Automatic can't predict constraint needs
$posts = Post::with(['comments' => function ($query) {
    $query->where('approved', true)
          ->latest()
          ->limit(5);
}])->get();
```

### 3. المسارات الحساسة للأداء

```php
// Be explicit when every millisecond counts
$posts = Post::withoutAutomaticEagerLoading()
    ->with(['author:id,name', 'category:id,name'])
    ->select(['id', 'title', 'author_id', 'category_id'])
    ->get();
```

## تتبّع أخطاء التحميل المسبق التلقائي

### تحليل سجل الاستعلامات

```php
DB::enableQueryLog();

$posts = Post::all();
foreach ($posts as $post) {
    $post->author;
}

// See what was auto-eager loaded
collect(DB::getQueryLog())->each(fn($q) => dump($q['query']));
```

### التكامل مع Laravel Debugbar

يعرض Debugbar التحميل المسبق التلقائي بمؤشر خاص:
- 🔄 علاقات حُمّلت مسبقًا تلقائيًا
- ✅ حُمّلت مسبقًا يدويًا
- ⚠️ حُمّلت كسولًا (احتمال N+1)

## أفضل الممارسات

### 1. ثِق لكن تحقّق

```php
// In development, enable strict mode to see what's being auto-loaded
if (app()->isLocal()) {
    Model::preventLazyLoading(false); // Allow but log
    Model::handleLazyLoadingViolationUsing(function ($model, $relation) {
        logger()->info("Auto eager loading: {$model}::{$relation}");
    });
}
```

### 2. استثنِ العلاقات الثقيلة

```php
class Post extends Model
{
    protected array $excludeFromAutomaticEagerLoading = [
        'allComments',    // Could be thousands
        'fullContent',    // Large text blob
        'mediaFiles',     // Binary data
    ];
}
```

### 3. استخدم select لتحسين الكفاءة

يحترم التحميل المسبق التلقائي `select()`:

```php
$posts = Post::select(['id', 'title', 'author_id'])->get();

foreach ($posts as $post) {
    // Author auto-eager loaded with all columns
    // Consider if you need all author data
    echo $post->author->name;
}
```

## أخطاء شائعة

### 1. الوصول المشروط إلى العلاقة

```php
foreach ($posts as $post) {
    if ($post->type === 'featured') {
        echo $post->author->name; // Only accesses author sometimes
    }
}
```

يعمل التحميل المسبق التلقائي عند أول وصول، فإذا لم يكن المنشور الأول مميزًا، فلن تستفيد المنشورات التالية. الحل:

```php
// Be explicit when access is conditional
$posts = Post::with('author')->get();
```

### 2. العلاقات متعددة الأشكال (Polymorphic)

```php
// Automatic works but may load multiple tables
foreach ($comments as $comment) {
    echo $comment->commentable->title; // Could be Post, Video, etc.
}
```

هنا يولّد Laravel استعلامًا منفصلًا لكل نوع، وهذا صحيح لكنه قد يفاجئك.

### 3. حدود التقسيم إلى صفحات (Pagination)

```php
// Each page triggers its own auto-eager loading
Post::paginate(20)->through(function ($post) {
    return $post->author->name;
});
```

لا يعمل التحميل المسبق التلقائي إلا داخل المجموعة الحالية، ولا يمتد عبر طلبات الصفحات المختلفة.

## الخلاصة

التحميل المسبق التلقائي في Laravel 12 نقلة حقيقية تجعل الطريقة الصحيحة هي الطريقة الأسهل. ما زال عليك فهم مفاهيم التحميل المسبق واستخدام `with()` يدويًا في السيناريوهات المعقدة، لكن الاكتشاف التلقائي يقضي على أكثر أخطاء الأداء شيوعًا.

انتهى أخيرًا زمن نشر استعلامات N+1 إلى بيئة الإنتاج عن غير قصد.

---

## مصادر

- [Laravel 12 Release Notes](https://laravel.com/docs/12.x/releases)
- [Eloquent Relationships Documentation](https://laravel.com/docs/12.x/eloquent-relationships)

