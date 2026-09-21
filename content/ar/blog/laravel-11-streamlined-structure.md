---
title: "هيكل التطبيق المبسّط في Laravel 11: دليل شامل"
description: تعرّف كيف تتخلص معمارية Laravel 11 المختصرة من الكود المتكرر، وتجمع إعدادات الوسطاء في bootstrap/app.php، وتجعل تطبيقاتك أنظف وأسهل في الصيانة.
tags:
  - Laravel
  - Laravel 11
  - PHP
  - Web Development
  - Best Practices
noImage: true
createdAt: 2024-12-20T10:00:00.000Z
updatedAt: 2024-12-20T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# هيكل التطبيق المبسّط في Laravel 11: دليل شامل

صدر Laravel 11 في 12 مارس 2024، وجاء معه أحد أكبر التغييرات المعمارية في تاريخ إطار العمل. يتخلص هيكل التطبيق المبسّط الجديد من الكود المتكرر (boilerplate) غير الضروري، ويجمع الإعدادات بطريقة تجعل تطبيقاتك أنظف وأسهل في الصيانة.

## ما الذي تغيّر في Laravel 11؟

عندما تنشئ مشروع Laravel 11 جديدًا، ستلاحظ الفرق فورًا. هيكل المجلدات أنظف بكثير مقارنةً بـ Laravel 10.

### مجلدات وملفات أُزيلت

اختفت عدة مجلدات كانت موجودة افتراضيًا:

- `app/Console/` - لم تعد هناك حاجة إلى Kernel
- `app/Exceptions/` - انتقلت معالجة الاستثناءات إلى bootstrap
- `app/Http/Middleware/` - الوسطاء (middleware) صاروا داخل إطار العمل نفسه

### ملف bootstrap/app.php الجديد

قلب المعمارية الجديدة في Laravel 11 هو ملف `bootstrap/app.php`. هذا الملف وحده يتولى الآن:

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Customize middleware here
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle exceptions here
    })->create();
```

## تخصيص الوسطاء

انتهى زمن تعديل ملفات وسطاء متعددة. في Laravel 11 تخصّص سلوك الوسطاء مباشرة في `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\CustomMiddleware::class,
    ]);

    $middleware->api(prepend: [
        \App\Http\Middleware\ApiRateLimiter::class,
    ]);

    $middleware->alias([
        'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
    ]);
})
```

### عمليات شائعة على الوسطاء

**تعطيل وسيط افتراضي:**

```php
$middleware->web(remove: [
    \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
]);
```

**إضافة وسيط عام:**

```php
$middleware->use([
    \App\Http\Middleware\LogRequests::class,
]);
```

## API والبث صارا اختياريين

يعترف Laravel 11 بأن بعض التطبيقات لا تحتاج مسارات API ولا البث (broadcasting). لذلك صارت هاتان الميزتان اختياريتين تفعّلهما عند الحاجة.

### تثبيت دعم API

```bash
php artisan install:api
```

هذا الأمر:
1. ينشئ `routes/api.php`
2. يسجّل مسارات API في `bootstrap/app.php`
3. يثبّت Laravel Sanctum لمصادقة API

### تثبيت البث

```bash
php artisan install:broadcasting
```

## نقطة فحص الحالة (Health Check)

يقدّم Laravel 11 نقطة مدمجة لفحص الحالة على `/up`. قيمتها كبيرة لموازنات الأحمال وأنظمة المراقبة:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    health: '/up', // Responds with 200 OK when app is healthy
)
```

تستطيع تخصيص فحوص الحالة بالاستماع إلى الحدث `DiagnosingHealth`:

```php
use Illuminate\Foundation\Events\DiagnosingHealth;

Event::listen(DiagnosingHealth::class, function (DiagnosingHealth $event) {
    // Check database connection
    // Check Redis connection
    // Check external services
});
```

## أوامر Artisan جديدة

يضيف Laravel 11 عدة أوامر make مفيدة:

```bash
# Create an enum
php artisan make:enum Status

# Create an interface
php artisan make:interface PaymentGateway

# Create a class
php artisan make:class Services/PaymentService
```

## SQLite قاعدة البيانات الافتراضية

في بيئة التطوير المحلية صارت SQLite قاعدة البيانات الافتراضية. يعني هذا أنك تبدأ البناء فورًا دون أي إعداد لقاعدة البيانات:

```bash
laravel new my-project
cd my-project
php artisan migrate
```

قاعدة بياناتك جاهزة في `database/database.sqlite`.

## الانتقال إلى Laravel 11

إذا كنت تُرقّي مشروعك من Laravel 10، فأمامك خياران:

### الخيار 1: الإبقاء على هيكلك الحالي

Laravel 11 متوافق تمامًا مع الإصدارات السابقة. وسطاؤك ومعالجات الاستثناءات وهيكل المجلدات الحالي ستظل تعمل كما هي.

### الخيار 2: اعتماد الهيكل الجديد

انتقل تدريجيًا عبر:

1. نقل تخصيصات الوسطاء إلى `bootstrap/app.php`
2. حذف المجلدات الفارغة مثل `app/Console/` و `app/Exceptions/`
3. جمع معالجة الاستثناءات في مكان واحد

## أفضل الممارسات

1. **تقبّل البساطة** - لا تُعد بناء الهيكل القديم بحكم العادة
2. **استخدم bootstrap/app.php** - اجمع إعداداتك في مكان واحد
3. **اترك الوسطاء داخل إطار العمل** - لا تنشئ وسيطًا مخصصًا إلا عند الحاجة الفعلية
4. **استفد من نقطة فحص الحالة** - اربطها بأدوات المراقبة لديك

## الخلاصة

الهيكل المبسّط في Laravel 11 علامة على نضج إطار العمل. بإزالة الكود المتكرر وجمع الإعدادات في مكان واحد، جعل Taylor Otwell وفريق Laravel إطار العمل أسهل على المبتدئين، مع الحفاظ على المرونة التي يحتاجها المستخدمون المتقدمون.

تشجع المعمارية الجديدة على تطبيقات أنظف، وتخفف العبء الذهني في معرفة مكان كل شيء. سواء كنت تبدأ مشروعًا جديدًا أو تصون مشروعًا قائمًا، فهم هذه التغييرات سيساعدك على كتابة تطبيقات Laravel أفضل.

---

## المصادر

- [ملاحظات إصدار Laravel 11](https://laravel.com/docs/11.x/releases)
- [دليل الترقية إلى Laravel 11](https://laravel.com/docs/11.x/upgrade)
