---
title: "Laravel 12: الدليل الشامل لأحدث الميزات (2025)"
description: تعرّف إلى ميزات Laravel 12 اللافتة، ومنها التحميل المسبق التلقائي للعلاقات، وذاكرة الجلسة المؤقتة، وطوابير المهام الاحتياطية، والحزم المدعومة بالذكاء الاصطناعي، وحزم البداية الجديدة المتكاملة مع WorkOS AuthKit.
tags:
  - Laravel
  - Laravel 12
  - PHP
  - Web Development
noImage: true
createdAt: 2025-03-15T10:00:00.000Z
updatedAt: 2025-03-15T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel 12: الدليل الشامل لأحدث الميزات (2025)

صدر Laravel 12 رسميًا في **24 فبراير 2025**، ليكون محطة جديدة في تطور إطار العمل. ورغم وصفه بأنه "إصدار صيانة"، جاء بعدة ميزات قوية ترفع إنتاجية المطور وأداء التطبيق.

## ما الجديد في Laravel 12

### حزم بداية جديدة مع WorkOS AuthKit

يقدّم Laravel 12 حزم بداية (starter kits) أعيد تصميمها لكل من **React** و **Vue** و **Livewire**. والإضافة الأبرز هي التكامل مع **WorkOS AuthKit**، الذي يوفّر:

- **تسجيل الدخول عبر الشبكات الاجتماعية** - Google و GitHub و Microsoft وغيرها
- **دعم مفاتيح المرور (Passkeys)** - مصادقة دون كلمة مرور
- **تسجيل الدخول الموحّد (SSO)** - مصادقة جاهزة للمؤسسات
- **مكوّنات Shadcn** - مكوّنات واجهة حديثة وسهلة الوصول
- **مكوّنات Flux** - نسخة مجانية متاحة لـ Livewire

```bash
# Create a new Laravel 12 project with React starter kit
laravel new my-app --kit=react

# With WorkOS AuthKit
laravel new my-app --kit=react --auth=workos
```

### التحميل المسبق التلقائي (Laravel 12.8)

الميزة الأكثر أثرًا هي **التحميل المسبق التلقائي (automatic eager loading)**، التي تحل مشكلة استعلامات N+1 الشهيرة دون استدعاءات `with()` يدوية:

```php
// In AppServiceProvider
use Illuminate\Database\Eloquent\Model;

public function boot()
{
    Model::automaticallyEagerLoadRelationships();
}
```

**قبل التحميل المسبق التلقائي:**
```php
// 302 queries for 100 posts with authors and comments
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name;
    echo $post->comments->count();
}
```

**بعد التحميل المسبق التلقائي:**
```php
// Just 5 queries - Laravel detects and loads relationships automatically
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // Auto-loaded!
    echo $post->comments->count(); // Auto-loaded!
}
```

تستطيع أيضًا تفعيله لكل استعلام أو لكل نموذج:

```php
// Per-query
$users = User::all()->withRelationshipAutoloading();

// Per-model
class Invoice extends Model
{
    protected $autoLoadRelations = true;
}
```

### ذاكرة الجلسة المؤقتة

آلية تخزين مؤقت جديدة مرتبطة بالجلسة تعزل البيانات لكل مستخدم تلقائيًا:

```php
// Cache data for the current user session
session()->cache()->put('user_preferences', $preferences, now()->addHours(24));

// Retrieve session-cached data
$preferences = session()->cache()->get('user_preferences');

// Automatically cleaned up when session expires
```

مثالية لـ:
- الحسابات الخاصة بكل مستخدم
- سلال التسوق المؤقتة
- تقدّم معالجات النماذج متعددة الخطوات
- إحصاءات لوحة المستخدم

### مشغّل الطابور الاحتياطي (Failover)

يقدّم Laravel 12 تحويلًا تلقائيًا بين طوابير المهام للتطبيقات عالية التوفر:

```php
// config/queue.php
'connections' => [
    'failover' => [
        'driver' => 'failover',
        'connections' => [
            'redis',
            'sqs',
            'database',
        ],
    ],
],
```

إذا تعطّل Redis، يدفع Laravel المهام تلقائيًا إلى SQS، ثم إلى قاعدة البيانات. لا مهام ضائعة بعد اليوم أثناء أعطال البنية التحتية.

### سمات المسارات (Route Attributes)

عرّف المسارات مباشرة باستخدام سمات PHP 8:

```php
use Illuminate\Routing\Attributes\Get;
use Illuminate\Routing\Attributes\Post;
use Illuminate\Routing\Attributes\Middleware;

#[Middleware('auth')]
class UserController extends Controller
{
    #[Get('/users', name: 'users.index')]
    public function index()
    {
        return view('users.index');
    }

    #[Post('/users', name: 'users.store')]
    public function store(Request $request)
    {
        // Create user
    }

    #[Get('/users/{user}', name: 'users.show')]
    public function show(User $user)
    {
        return view('users.show', compact('user'));
    }
}
```

### Laravel Boost (مساعد تطوير بالذكاء الاصطناعي)

أول حزمة ذكاء اصطناعي رسمية من Laravel، تعمل ببروتوكول Model Context Protocol (MCP):

```bash
composer require laravel/boost
```

الميزات:
- **توثيق حسب الإصدار** - يعرف الذكاء الاصطناعي إصدار Laravel لديك
- **قواعد يختارها فريق Laravel** - أفضل الممارسات مدمجة
- **إعداد خادم MCP** - تكامل سهل للذكاء الاصطناعي في تطبيقك

### تحسينات فحص السلامة

مراقبة محسّنة لسلامة النظام:

```php
// bootstrap/app.php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    health: '/up',
)

// Custom health checks
use Illuminate\Foundation\Events\DiagnosingHealth;

Event::listen(DiagnosingHealth::class, function () {
    // Check database
    DB::connection()->getPdo();

    // Check Redis
    Redis::ping();

    // Check external services
    Http::get('https://api.example.com/health')->throw();
});
```

## متطلبات PHP

يتطلب Laravel 12 إصدار **PHP 8.2** أو أحدث. ويُنصح بـ PHP 8.4 لأفضل أداء وللاستفادة من property hooks.

## الترقية من Laravel 11

تستطيع أغلب التطبيقات الترقية دون تغيير في الشيفرة:

```bash
# Update composer.json
"laravel/framework": "^12.0"

# Run update
composer update

# Clear caches
php artisan optimize:clear
```

## الخلاصة

قد يُسمّى Laravel 12 "إصدار صيانة"، لكن ميزات مثل التحميل المسبق التلقائي وذاكرة الجلسة المؤقتة تغيّر قواعد اللعبة. ومع حزم البداية المدعومة بـ WorkOS AuthKit والأدوات المدعومة بالذكاء الاصطناعي، يبقى Laravel أكثر أطر PHP راحةً للمطورين.

---

## مصادر

- [ملاحظات إصدار Laravel 12](https://laravel.com/docs/12.x/releases)
- [Laravel News - Laravel 12](https://laravel-news.com/laravel-12)
- [إعلانات Laracon US 2025](https://laravel.com/blog/everything-we-announced-at-laracon-us-2025)
