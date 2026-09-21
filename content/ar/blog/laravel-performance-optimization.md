---
title: "تحسين أداء Laravel: من البطء إلى سرعة البرق"
description: "دليل شامل لتحسين أداء تطبيقات Laravel: قاعدة البيانات، واستراتيجيات التخزين المؤقت، ومعالجة طوابير المهام، وتحسين الأصول (assets)، وأدوات تحليل الأداء (profiling)."
tags:
  - Laravel
  - Performance
  - Optimization
  - Database
  - Caching
noImage: true
createdAt: 2025-03-25T10:00:00.000Z
updatedAt: 2025-03-25T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# تحسين أداء Laravel: من البطء إلى سرعة البرق

التطبيق البطيء يخسر مستخدميه. يشرح هذا الدليل أساليب مجرَّبة تجعل تطبيق Laravel سريعًا جدًا، من استعلامات قاعدة البيانات حتى تسليم الواجهة الأمامية (frontend).

## تحسين قاعدة البيانات

### استراتيجية الفهارس (Indexing)

```php
// Migration with proper indexes
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained();
    $table->foreignId('product_id')->constrained();
    $table->string('status');
    $table->decimal('total', 10, 2);
    $table->timestamps();

    // Single column indexes
    $table->index('status');
    $table->index('created_at');

    // Composite index for common queries
    $table->index(['user_id', 'status']);
    $table->index(['status', 'created_at']);
});
```

### تحسين الاستعلامات

```php
// Bad: N+1 problem
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // Query for each post
}

// Good: Eager loading
$posts = Post::with('author')->get();

// Better: Select only needed columns
$posts = Post::with('author:id,name')
    ->select(['id', 'title', 'author_id'])
    ->get();

// Best: Use query-specific loading
$posts = Post::query()
    ->select(['id', 'title', 'author_id', 'created_at'])
    ->with(['author:id,name,avatar'])
    ->withCount('comments')
    ->latest()
    ->limit(20)
    ->get();
```

### المعالجة على دفعات (Chunk)

```php
// Bad: Loading all records into memory
$users = User::all();
foreach ($users as $user) {
    $user->sendNewsletter();
}

// Good: Chunked processing
User::query()
    ->where('subscribed', true)
    ->chunkById(1000, function ($users) {
        foreach ($users as $user) {
            SendNewsletter::dispatch($user);
        }
    });

// Better: Lazy collection for memory efficiency
User::query()
    ->where('subscribed', true)
    ->lazy()
    ->each(fn ($user) => SendNewsletter::dispatch($user));
```

### التخزين المؤقت للاستعلامات

```php
// Cache expensive queries
$categories = Cache::remember('categories', 3600, function () {
    return Category::with('subcategories')
        ->withCount('products')
        ->get();
});

// Cache with tags for easy invalidation
$products = Cache::tags(['products', 'category-' . $categoryId])
    ->remember("products:{$categoryId}", 3600, function () use ($categoryId) {
        return Product::where('category_id', $categoryId)->get();
    });

// Invalidate when category changes
Cache::tags(['category-' . $categoryId])->flush();
```

## استراتيجيات التخزين المؤقت (Caching)

### تخزين الإعدادات والمسارات مؤقتًا

```bash
# Production optimization
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### التخزين المؤقت على مستوى التطبيق

```php
// Cache full page responses
Route::get('/pricing', [PricingController::class, 'index'])
    ->middleware('cache.headers:public;max_age=3600');

// Cache expensive computations
public function getAnalytics(Team $team): array
{
    return Cache::remember(
        "analytics:{$team->id}:" . now()->format('Y-m-d'),
        now()->addHours(6),
        fn () => $this->computeAnalytics($team)
    );
}
```

### التخزين المؤقت للنماذج (Models)

```php
// In your model
class Product extends Model
{
    protected static function booted()
    {
        static::saved(fn ($product) => Cache::forget("product:{$product->id}"));
        static::deleted(fn ($product) => Cache::forget("product:{$product->id}"));
    }

    public static function findCached(int $id): ?self
    {
        return Cache::remember("product:{$id}", 3600, fn () => self::find($id));
    }
}
```

## تحسين طوابير المهام (Queues)

### انقل المهام الثقيلة إلى الخلفية

```php
// Instead of synchronous processing
public function store(Request $request)
{
    $order = Order::create($request->validated());

    // These block the response
    $this->generateInvoice($order);
    $this->sendConfirmationEmail($order);
    $this->updateInventory($order);
    $this->notifyWarehouse($order);

    return redirect()->route('orders.show', $order);
}

// Use jobs for background processing
public function store(Request $request)
{
    $order = Order::create($request->validated());

    // Dispatch jobs - response returns immediately
    ProcessOrder::dispatch($order);

    return redirect()->route('orders.show', $order);
}
```

### تجميع المهام (Job Batching) للعمليات الثقيلة

```php
use Illuminate\Bus\Batch;

public function processMonthlyReports()
{
    $jobs = Team::all()->map(fn ($team) => new GenerateReport($team));

    Bus::batch($jobs)
        ->name('Monthly Reports')
        ->allowFailures()
        ->onQueue('reports')
        ->dispatch();
}
```

## التحميل الكسول والمؤجَّل (Lazy و Deferred)

### المجموعات الكسولة (Lazy Collections)

```php
// Process large CSV without memory issues
LazyCollection::make(function () {
    $handle = fopen('large-file.csv', 'r');
    while ($line = fgetcsv($handle)) {
        yield $line;
    }
    fclose($handle);
})->chunk(1000)->each(function ($chunk) {
    // Process 1000 rows at a time
    DB::table('imports')->insert($chunk->toArray());
});
```

### التحميل المؤجَّل في الواجهات (Views)

```php
// In controller - don't load everything upfront
public function dashboard()
{
    return view('dashboard', [
        'user' => auth()->user(),
        // Heavy data loaded via Livewire components
    ]);
}
```

```blade
{{-- In view - load heavy components separately --}}
<div>
    <livewire:dashboard.quick-stats />

    <livewire:dashboard.revenue-chart lazy />
    <livewire:dashboard.activity-feed lazy />
</div>
```

## تحسين الأصول (Assets)

### إعداد Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['alpinejs', 'axios'],
                },
            },
        },
    },
});
```

### تحسين الصور

```php
// Use responsive images
<picture>
    <source srcset="{{ $post->getMedia('images')->first()->getUrl('webp') }}" type="image/webp">
    <img src="{{ $post->getMedia('images')->first()->getUrl('optimized') }}"
         loading="lazy"
         alt="{{ $post->title }}">
</picture>
```

## تحليل الأداء والمراقبة

### Laravel Debugbar

```bash
composer require barryvdh/laravel-debugbar --dev
```

### مراقبة الاستعلامات

```php
// In AppServiceProvider
public function boot()
{
    if (app()->isLocal()) {
        DB::listen(function ($query) {
            if ($query->time > 100) {
                Log::warning('Slow query detected', [
                    'sql' => $query->sql,
                    'time' => $query->time . 'ms',
                    'bindings' => $query->bindings,
                ]);
            }
        });
    }
}
```

### كشف مشكلة N+1

```php
// In AppServiceProvider
public function boot()
{
    Model::preventLazyLoading(!app()->isProduction());
}
```

## التحسين على الخادم

### إعداد OPcache

```ini
; php.ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0  ; Disable in production
opcache.jit=1255
opcache.jit_buffer_size=128M
```

### ضبط PHP-FPM

```ini
; www.conf
pm = dynamic
pm.max_children = 50
pm.start_servers = 10
pm.min_spare_servers = 5
pm.max_spare_servers = 20
pm.max_requests = 500
```

## تحسين الاستجابات

### الضغط

```php
// In middleware or server config
public function handle($request, Closure $next)
{
    $response = $next($request);

    if ($this->shouldCompress($response)) {
        $content = gzencode($response->getContent(), 9);
        $response->setContent($content);
        $response->headers->set('Content-Encoding', 'gzip');
    }

    return $response;
}
```

### ترويسات التخزين المؤقت في HTTP

```php
return response($content)
    ->header('Cache-Control', 'public, max-age=3600')
    ->header('ETag', md5($content));
```

## قائمة تحسينات سريعة

### تحسينات فورية

- [ ] فعّل OPcache مع JIT
- [ ] شغّل `php artisan optimize` في بيئة الإنتاج
- [ ] استخدم Redis للجلسات والتخزين المؤقت
- [ ] فعّل HTTP/2 على الخادم
- [ ] استخدم CDN للأصول الثابتة
- [ ] اضغط الاستجابات (gzip/brotli)

### إصلاحات سريعة لقاعدة البيانات

- [ ] أضف فهارس للمفاتيح الأجنبية وللأعمدة التي تستعلم عنها كثيرًا
- [ ] استخدم `select()` لتجلب الأعمدة التي تحتاجها فقط
- [ ] فعّل التخزين المؤقت للاستعلامات
- [ ] استخدم التحميل المسبق (eager loading) في كل مكان

### إصلاحات سريعة للتطبيق

- [ ] انقل إرسال البريد إلى طابور المهام
- [ ] خزّن نتائج الحسابات المكلفة مؤقتًا
- [ ] استخدم التحميل الكسول مع مجموعات البيانات الكبيرة
- [ ] طبّق التخزين المؤقت للاستجابات

## الخلاصة

تحسين الأداء عمل متكرر: ابدأ بالقياس، وحدّد مواضع الاختناق، وأصلحها، ثم قِس من جديد. ركّز أولًا على ما له الأثر الأكبر، وغالبًا ما يكون استعلامات قاعدة البيانات والتخزين المؤقت، قبل التحسينات الصغيرة.

---

## مصادر

- [نصائح أداء Laravel](https://laravel.com/docs/deployment#optimization)
- [Debugbar](https://github.com/barryvdh/laravel-debugbar)

