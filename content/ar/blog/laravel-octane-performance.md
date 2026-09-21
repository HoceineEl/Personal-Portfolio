---
title: "Laravel Octane: ارفع أداء تطبيقك إلى أقصاه"
description: "ارفع أداء Laravel إلى 10x مع Octane: إعداد Swoole و FrankenPHP، والمهام المتزامنة، واستراتيجيات التخزين المؤقت، وأفضل ممارسات النشر في بيئة الإنتاج."
tags:
  - Laravel
  - Octane
  - Performance
  - Swoole
noImage: true
createdAt: 2025-06-05T10:00:00.000Z
updatedAt: 2025-06-05T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel Octane: ارفع أداء تطبيقك إلى أقصاه

يشغّل **Laravel Octane** تطبيقك مرة واحدة ويبقيه في الذاكرة، فيخدم الطلبات بسرعة كبيرة جدًا. وبفضل دعمه لـ Swoole و FrankenPHP، يستطيع Octane تحسين الأداء 10x أو أكثر.

## كيف يعمل Octane

PHP التقليدي:
1. استقبال الطلب
2. إقلاع إطار العمل
3. معالجة الطلب
4. هدم كل شيء
5. التكرار

Octane:
1. إقلاع إطار العمل مرة واحدة
2. استقبال الطلب ← معالجته ← الرد
3. إبقاء إطار العمل في الذاكرة
4. التكرار بدءًا من الخطوة 2

## التثبيت

```bash
composer require laravel/octane

php artisan octane:install
```

اختر الخادم:
- **FrankenPHP**: حديث ومناسب لـ Docker
- **Swoole**: مجرَّب في بيئات الإنتاج وغني بالميزات

### إعداد FrankenPHP

```bash
# Install FrankenPHP
php artisan octane:install --server=frankenphp
```

### إعداد Swoole

```bash
# Install Swoole extension
pecl install swoole

# Install with Octane
php artisan octane:install --server=swoole
```

## تشغيل الخادم

```bash
# Development
php artisan octane:start

# With file watching
php artisan octane:start --watch

# Production
php artisan octane:start --host=0.0.0.0 --port=8000 --workers=8
```

## المهام المتزامنة

نفّذ المهام بالتوازي:

```php
use Laravel\Octane\Facades\Octane;

[$users, $orders, $analytics] = Octane::concurrently([
    fn () => User::count(),
    fn () => Order::sum('total'),
    fn () => Analytics::getMetrics(),
]);
```

### مثال واقعي

```php
class DashboardController extends Controller
{
    public function index()
    {
        [$stats, $recentOrders, $topProducts, $notifications] = Octane::concurrently([
            fn () => $this->getStats(),
            fn () => Order::with('customer')->latest()->limit(10)->get(),
            fn () => Product::withCount('orders')->orderByDesc('orders_count')->limit(5)->get(),
            fn () => auth()->user()->unreadNotifications()->limit(5)->get(),
        ]);

        return view('dashboard', compact('stats', 'recentOrders', 'topProducts', 'notifications'));
    }
}
```

## التخزين المؤقت في Octane (Octane Cache)

تخزين مؤقت في الذاكرة فائق السرعة:

```php
use Laravel\Octane\Facades\Octane;

// Store in Octane cache
Octane::cache()->set('key', 'value', 3600);

// Retrieve
$value = Octane::cache()->get('key');

// Or use Cache facade with octane driver
Cache::driver('octane')->put('key', 'value', 3600);
```

### متى تستخدم Octane Cache

```php
// Perfect for: frequently accessed, rarely changed data
$settings = Octane::cache()->get('app_settings', function () {
    return Setting::all()->pluck('value', 'key')->toArray();
});

// Not for: user-specific or session data (use Redis instead)
```

## الجداول (ذاكرة مشتركة)

شارك البيانات بين العمّال (workers):

```php
// config/octane.php
'tables' => [
    'example' => [
        'rows' => 1000,
        'columns' => [
            ['name' => 'name', 'type' => 'string', 'size' => 256],
            ['name' => 'count', 'type' => 'int'],
        ],
    ],
],
```

```php
// Usage
Octane::table('example')->set('key', [
    'name' => 'Example',
    'count' => 1,
]);

$row = Octane::table('example')->get('key');
```

## Ticks (مهام في الخلفية)

شغّل كودًا على فترات منتظمة:

```php
// app/Providers/AppServiceProvider.php
use Laravel\Octane\Facades\Octane;

public function boot(): void
{
    Octane::tick('metrics', fn () => Metrics::record())
        ->seconds(10);

    Octane::tick('heartbeat', fn () => HealthCheck::ping())
        ->seconds(30);
}
```

## إدارة الذاكرة

### تجنّب تسرّب الذاكرة

```php
// BAD: Static property that grows
class BadService
{
    public static array $cache = [];

    public function process($data)
    {
        self::$cache[] = $data; // Memory leak!
    }
}

// GOOD: Use Octane cache or reset
class GoodService
{
    public function process($data)
    {
        Octane::cache()->set("data:{$data->id}", $data, 300);
    }
}
```

### التفريغ بعد كل طلب

```php
// config/octane.php
'flush' => [
    // Singletons to flush
],

'listeners' => [
    RequestReceived::class => [
        ...Octane::prepareApplicationForNextRequest(),
    ],

    RequestTerminated::class => [
        FlushTemporaryData::class,
    ],
],
```

## الإعداد

```php
// config/octane.php
return [
    'server' => env('OCTANE_SERVER', 'swoole'),

    'https' => env('OCTANE_HTTPS', false),

    'workers' => env('OCTANE_WORKERS', 'auto'),

    'task_workers' => env('OCTANE_TASK_WORKERS', 'auto'),

    'max_requests' => env('OCTANE_MAX_REQUESTS', 500),

    'tables' => [],

    'cache' => [
        'rows' => 1000,
        'bytes' => 10000,
    ],
];
```

## النشر باستخدام Docker

### ملف Dockerfile لـ FrankenPHP

```dockerfile
FROM dunglas/frankenphp:latest

COPY . /app
WORKDIR /app

RUN composer install --no-dev --optimize-autoloader

EXPOSE 8000

CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=8000"]
```

### ملف Dockerfile لـ Swoole

```dockerfile
FROM phpswoole/swoole:php8.3

COPY . /app
WORKDIR /app

RUN composer install --no-dev --optimize-autoloader

EXPOSE 8000

CMD ["php", "artisan", "octane:start", "--server=swoole", "--host=0.0.0.0", "--port=8000"]
```

## نصائح لبيئة الإنتاج

### 1. استخدم Supervisor

```ini
[program:octane]
command=php /var/www/artisan octane:start --server=swoole --host=0.0.0.0 --port=8000 --workers=8
user=www-data
autostart=true
autorestart=true
stopwaitsecs=3600
stdout_logfile=/var/log/supervisor/octane.log
```

### 2. إعداد Nginx

```nginx
upstream octane {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://octane;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. فحوصات السلامة (Health Checks)

```php
// routes/web.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'workers' => Octane::server()->getWorkerCount(),
        'memory' => memory_get_usage(true),
    ]);
});
```

## قياسات الأداء

تحسينات معتادة:

| المقياس | الطريقة التقليدية | Octane |
|--------|-------------|--------|
| الطلبات في الثانية | ~500 | ~5,000 |
| زمن الاستجابة | ~50ms | ~5ms |
| الذاكرة لكل طلب | ~20MB | ~2MB |

## مشكلات شائعة

### 1. مشكلات الجلسات

```php
// Use database or redis sessions
SESSION_DRIVER=redis
```

### 2. الحالة العامة (Global State)

```php
// BAD
app()->singleton('counter', fn () => new Counter());

// GOOD: Reset on each request
Octane::tick('reset-counter', function () {
    app()->forgetInstance('counter');
})->seconds(0);
```

### 3. رفع الملفات

```php
// Ensure tmp files are cleaned
Octane::on(RequestTerminated::class, function () {
    foreach (request()->allFiles() as $file) {
        @unlink($file->getPathname());
    }
});
```

## الخلاصة

يحسّن Laravel Octane الأداء كثيرًا لأنه يبقي تطبيقك في الذاكرة. اختر FrankenPHP لعمليات النشر الحديثة، أو Swoole إن أردت أكبر قدر من الميزات. تعامل مع الذاكرة بحذر، واستمتع بالسرعة.

---

## مصادر

- [توثيق Laravel Octane](https://laravel.com/docs/octane)
- [توثيق Swoole](https://www.swoole.com)
- [FrankenPHP](https://frankenphp.dev)

