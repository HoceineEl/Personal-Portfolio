---
title: "Laravel Octane: Supercharge Your Application Performance"
description: Boost Laravel performance 10x with Octane. Learn Swoole and FrankenPHP setup, concurrent tasks, caching strategies, and production deployment best practices.
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

# Laravel Octane: Supercharge Your Application Performance

**Laravel Octane** boots your application once and keeps it in memory, serving requests at incredible speeds. With support for Swoole and FrankenPHP, Octane can improve performance by 10x or more.

## How Octane Works

Traditional PHP:
1. Receive request
2. Boot framework
3. Handle request
4. Destroy everything
5. Repeat

Octane:
1. Boot framework once
2. Receive request → Handle → Respond
3. Keep framework in memory
4. Repeat from step 2

## Installation

```bash
composer require laravel/octane

php artisan octane:install
```

Choose your server:
- **FrankenPHP** - Modern, Docker-friendly
- **Swoole** - Battle-tested, feature-rich

### FrankenPHP Setup

```bash
# Install FrankenPHP
php artisan octane:install --server=frankenphp
```

### Swoole Setup

```bash
# Install Swoole extension
pecl install swoole

# Install with Octane
php artisan octane:install --server=swoole
```

## Starting the Server

```bash
# Development
php artisan octane:start

# With file watching
php artisan octane:start --watch

# Production
php artisan octane:start --host=0.0.0.0 --port=8000 --workers=8
```

## Concurrent Tasks

Execute tasks in parallel:

```php
use Laravel\Octane\Facades\Octane;

[$users, $orders, $analytics] = Octane::concurrently([
    fn () => User::count(),
    fn () => Order::sum('total'),
    fn () => Analytics::getMetrics(),
]);
```

### Real-World Example

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

## Octane Cache

Ultra-fast in-memory caching:

```php
use Laravel\Octane\Facades\Octane;

// Store in Octane cache
Octane::cache()->set('key', 'value', 3600);

// Retrieve
$value = Octane::cache()->get('key');

// Or use Cache facade with octane driver
Cache::driver('octane')->put('key', 'value', 3600);
```

### When to Use Octane Cache

```php
// Perfect for: frequently accessed, rarely changed data
$settings = Octane::cache()->get('app_settings', function () {
    return Setting::all()->pluck('value', 'key')->toArray();
});

// Not for: user-specific or session data (use Redis instead)
```

## Tables (Shared Memory)

Share data between workers:

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

## Ticks (Background Tasks)

Run code periodically:

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

## Memory Management

### Avoiding Memory Leaks

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

### Flush After Each Request

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

## Configuration

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

## Docker Deployment

### FrankenPHP Dockerfile

```dockerfile
FROM dunglas/frankenphp:latest

COPY . /app
WORKDIR /app

RUN composer install --no-dev --optimize-autoloader

EXPOSE 8000

CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=8000"]
```

### Swoole Dockerfile

```dockerfile
FROM phpswoole/swoole:php8.3

COPY . /app
WORKDIR /app

RUN composer install --no-dev --optimize-autoloader

EXPOSE 8000

CMD ["php", "artisan", "octane:start", "--server=swoole", "--host=0.0.0.0", "--port=8000"]
```

## Production Tips

### 1. Use Supervisor

```ini
[program:octane]
command=php /var/www/artisan octane:start --server=swoole --host=0.0.0.0 --port=8000 --workers=8
user=www-data
autostart=true
autorestart=true
stopwaitsecs=3600
stdout_logfile=/var/log/supervisor/octane.log
```

### 2. Nginx Configuration

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

### 3. Health Checks

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

## Benchmarks

Typical improvements:

| Metric | Traditional | Octane |
|--------|-------------|--------|
| Requests/sec | ~500 | ~5,000 |
| Response time | ~50ms | ~5ms |
| Memory per request | ~20MB | ~2MB |

## Common Issues

### 1. Session Issues

```php
// Use database or redis sessions
SESSION_DRIVER=redis
```

### 2. Global State

```php
// BAD
app()->singleton('counter', fn () => new Counter());

// GOOD: Reset on each request
Octane::tick('reset-counter', function () {
    app()->forgetInstance('counter');
})->seconds(0);
```

### 3. File Uploads

```php
// Ensure tmp files are cleaned
Octane::on(RequestTerminated::class, function () {
    foreach (request()->allFiles() as $file) {
        @unlink($file->getPathname());
    }
});
```

## Conclusion

Laravel Octane dramatically improves performance by keeping your application in memory. Choose FrankenPHP for modern deployments or Swoole for maximum features. Remember to handle memory carefully and enjoy the speed boost.

---

## Resources

- [Laravel Octane Documentation](https://laravel.com/docs/octane)
- [Swoole Documentation](https://www.swoole.com)
- [FrankenPHP](https://frankenphp.dev)

