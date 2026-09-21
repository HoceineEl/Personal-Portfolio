---
title: "طوابير المهام و Horizon في Laravel: مهام خلفية جاهزة للإنتاج"
description: أتقن طوابير المهام في Laravel من الأساسيات إلى الأنماط المتقدمة. تعلّم تصميم المهام، واستراتيجيات إعادة المحاولة، والتجميع في دفعات، ومراقبة Horizon، والتوسّع للتطبيقات ذات الحركة العالية.
tags:
  - Laravel
  - Queues
  - Horizon
  - Performance
  - Background Jobs
noImage: true
createdAt: 2025-05-20T10:00:00.000Z
updatedAt: 2025-05-20T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# طوابير المهام و Horizon في Laravel: مهام خلفية جاهزة للإنتاج

تشغيل المهام في الخلفية ضروري لبناء تطبيقات سريعة الاستجابة وقابلة للتوسّع. نظام طوابير المهام (queues) في Laravel مع Horizon يمنحك إدارة للمهام بمستوى المؤسسات الكبرى.

## أساسيات طوابير المهام

### إنشاء المهام

```bash
php artisan make:job ProcessPodcast
```

```php
// app/Jobs/ProcessPodcast.php
class ProcessPodcast implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Podcast $podcast,
        public User $user
    ) {}

    public function handle(AudioProcessor $processor): void
    {
        $processor->process($this->podcast);

        $this->user->notify(new PodcastProcessed($this->podcast));
    }
}
```

### إرسال المهام إلى الطابور

```php
// Basic dispatch
ProcessPodcast::dispatch($podcast, $user);

// With delay
ProcessPodcast::dispatch($podcast, $user)
    ->delay(now()->addMinutes(10));

// To specific queue
ProcessPodcast::dispatch($podcast, $user)
    ->onQueue('processing');

// To specific connection
ProcessPodcast::dispatch($podcast, $user)
    ->onConnection('redis');

// Chain jobs
ProcessPodcast::withChain([
    new OptimizeAudio($podcast),
    new GenerateTranscript($podcast),
    new NotifySubscribers($podcast),
])->dispatch($podcast, $user);
```

## أنماط تصميم المهام

### مهام آمنة التكرار (Idempotent)

يجب أن تكون إعادة تشغيل المهمة آمنة:

```php
class ChargeSubscription implements ShouldQueue
{
    public function __construct(
        public Subscription $subscription,
        public string $idempotencyKey
    ) {}

    public function handle(): void
    {
        // Check if already processed
        if (Payment::where('idempotency_key', $this->idempotencyKey)->exists()) {
            return;
        }

        // Process payment
        $payment = Stripe::charges()->create([
            'idempotency_key' => $this->idempotencyKey,
            // ...
        ]);

        Payment::create([
            'subscription_id' => $this->subscription->id,
            'idempotency_key' => $this->idempotencyKey,
            'amount' => $payment->amount,
        ]);
    }
}
```

### الوسيط (middleware) في المهام

```php
// app/Jobs/Middleware/RateLimited.php
class RateLimited
{
    public function handle($job, $next)
    {
        Redis::throttle('api-calls')
            ->block(0)
            ->allow(60)
            ->every(60)
            ->then(function () use ($job, $next) {
                $next($job);
            }, function () use ($job) {
                $job->release(30); // Try again in 30 seconds
            });
    }
}

// In job class
public function middleware(): array
{
    return [
        new RateLimited(),
        new WithoutOverlapping($this->podcast->id),
    ];
}
```

### منع التداخل

```php
use Illuminate\Contracts\Queue\ShouldBeUnique;

class GenerateReport implements ShouldQueue, ShouldBeUnique
{
    public function __construct(
        public Team $team
    ) {}

    // Unique for 1 hour
    public int $uniqueFor = 3600;

    // Custom unique ID
    public function uniqueId(): string
    {
        return $this->team->id;
    }
}
```

## استراتيجيات إعادة المحاولة

### ضبط إعادة المحاولة

```php
class ProcessPayment implements ShouldQueue
{
    public int $tries = 5;
    public int $maxExceptions = 3;
    public int $timeout = 120;
    public int $backoff = 60; // Seconds between retries

    // Or exponential backoff
    public function backoff(): array
    {
        return [1, 5, 10, 30, 60]; // Seconds
    }

    public function retryUntil(): DateTime
    {
        return now()->addHours(24);
    }
}
```

### التعامل مع الفشل

```php
class ProcessPayment implements ShouldQueue
{
    public function handle(): void
    {
        // Process payment
    }

    public function failed(\Throwable $exception): void
    {
        // Notify admin
        Notification::route('slack', config('services.slack.webhook'))
            ->notify(new JobFailedNotification($this, $exception));

        // Log for debugging
        Log::error('Payment processing failed', [
            'exception' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
```

### منطق مخصص لإعادة المحاولة

```php
public function handle(): void
{
    try {
        $this->processPayment();
    } catch (TemporaryException $e) {
        // Retry with backoff
        $this->release(
            $this->attempts() * 60 // Exponential delay
        );
    } catch (PermanentException $e) {
        // Don't retry, mark as failed
        $this->fail($e);
    }
}
```

## تجميع المهام في دفعات (Batching)

### إنشاء الدفعات

```php
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;

$batch = Bus::batch([
    new ProcessPodcast($podcast1),
    new ProcessPodcast($podcast2),
    new ProcessPodcast($podcast3),
])
    ->name('Process Podcasts')
    ->allowFailures()
    ->then(function (Batch $batch) {
        // All jobs completed
        Notification::send($batch->name . ' completed');
    })
    ->catch(function (Batch $batch, Throwable $e) {
        // First batch job failure
        Log::error('Batch failed', ['batch' => $batch->id]);
    })
    ->finally(function (Batch $batch) {
        // Batch finished (success or failure)
        Cache::forget("batch:{$batch->id}");
    })
    ->onQueue('podcasts')
    ->dispatch();

// Store batch ID for tracking
session(['batch_id' => $batch->id]);
```

### تتبّع تقدّم الدفعة

```php
// In controller
public function batchStatus(string $batchId)
{
    $batch = Bus::findBatch($batchId);

    return response()->json([
        'id' => $batch->id,
        'name' => $batch->name,
        'total_jobs' => $batch->totalJobs,
        'pending_jobs' => $batch->pendingJobs,
        'processed_jobs' => $batch->processedJobs(),
        'progress' => $batch->progress(),
        'failed_jobs' => $batch->failedJobs,
        'finished' => $batch->finished(),
    ]);
}
```

### إضافة مهام إلى دفعة قائمة

```php
$batch = Bus::findBatch($batchId);

$batch->add([
    new ProcessPodcast($newPodcast),
]);
```

## Laravel Horizon

### التثبيت

```bash
composer require laravel/horizon
php artisan horizon:install
php artisan migrate
```

### الإعداد

```php
// config/horizon.php
'environments' => [
    'production' => [
        'supervisor-1' => [
            'connection' => 'redis',
            'queue' => ['default', 'high'],
            'balance' => 'auto',
            'minProcesses' => 1,
            'maxProcesses' => 10,
            'balanceMaxShift' => 1,
            'balanceCooldown' => 3,
            'tries' => 3,
            'timeout' => 60,
        ],
        'supervisor-emails' => [
            'connection' => 'redis',
            'queue' => ['emails'],
            'balance' => 'simple',
            'processes' => 3,
            'tries' => 2,
            'timeout' => 30,
        ],
        'supervisor-billing' => [
            'connection' => 'redis',
            'queue' => ['billing'],
            'balance' => 'false',
            'processes' => 2,
            'tries' => 5,
            'timeout' => 120,
        ],
    ],
    'local' => [
        'supervisor-1' => [
            'connection' => 'redis',
            'queue' => ['default', 'high', 'emails', 'billing'],
            'balance' => 'simple',
            'processes' => 3,
            'tries' => 3,
        ],
    ],
],
```

### تشغيل Horizon

```bash
# Development
php artisan horizon

# Production (with supervisor)
php artisan horizon:terminate # Graceful restart after deploy
```

### إعداد Supervisor

```ini
[program:horizon]
process_name=%(program_name)s
command=php /var/www/app/artisan horizon
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/app/storage/logs/horizon.log
stopwaitsecs=3600
```

## أولوية الطوابير

### تحديد الأولويات

```php
// High priority jobs
HighPriorityJob::dispatch()->onQueue('high');

// Low priority jobs
LowPriorityJob::dispatch()->onQueue('low');
```

### ترتيب المعالجة

```php
// config/horizon.php
'supervisor-1' => [
    'queue' => ['high', 'default', 'low'], // Priority order
    'balance' => 'auto',
],
```

## المراقبة والمقاييس

### مقاييس المهام في Horizon

```php
// Tag jobs for filtering
class ProcessOrder implements ShouldQueue
{
    public function tags(): array
    {
        return [
            'order:' . $this->order->id,
            'customer:' . $this->order->customer_id,
            'type:' . $this->order->type,
        ];
    }
}
```

### مقاييس مخصصة

```php
// In AppServiceProvider
use Laravel\Horizon\Horizon;

Horizon::routeMailNotificationsTo('admin@example.com');
Horizon::routeSlackNotificationsTo('webhook-url', '#alerts');

Horizon::night(); // Dark mode

// Authorization
Horizon::auth(function ($request) {
    return $request->user()?->isAdmin();
});
```

## تحسين الأداء

### تقسيم البيانات إلى أجزاء

```php
class ProcessLargeDataset implements ShouldQueue
{
    public function handle(): void
    {
        User::query()
            ->where('needs_processing', true)
            ->chunkById(100, function ($users) {
                foreach ($users as $user) {
                    ProcessUser::dispatch($user);
                }
            });
    }
}
```

### إدارة الذاكرة

```php
class MemoryIntensiveJob implements ShouldQueue
{
    public function handle(): void
    {
        // Process in batches to manage memory
        $items = $this->getItems();

        foreach (array_chunk($items, 100) as $chunk) {
            $this->processChunk($chunk);

            // Clear memory
            gc_collect_cycles();
        }
    }
}
```

### تجميع الاتصالات (Connection Pooling)

```php
// config/database.php
'redis' => [
    'client' => 'phpredis', // More efficient than predis

    'default' => [
        'url' => env('REDIS_URL'),
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'port' => env('REDIS_PORT', 6379),
        'persistent' => true, // Persistent connections
    ],
],
```

## أفضل الممارسات

### 1. اجعل المهام صغيرة

```php
// Bad: One massive job
class ProcessEverything implements ShouldQueue
{
    public function handle()
    {
        $this->processOrders();
        $this->sendEmails();
        $this->generateReports();
        $this->syncInventory();
    }
}

// Good: Separate focused jobs
ProcessOrders::dispatch();
SendOrderEmails::dispatch();
GenerateReports::dispatch();
SyncInventory::dispatch();
```

### 2. استخدم طوابير مخصصة

```php
// Separate by criticality and resource needs
SendWelcomeEmail::dispatch($user)->onQueue('emails');
GenerateInvoice::dispatch($order)->onQueue('billing');
ProcessVideo::dispatch($video)->onQueue('media');
```

### 3. انتبه للتسلسل (Serialization)

```php
class ProcessReport implements ShouldQueue
{
    // Don't serialize large data
    public function __construct(
        public int $reportId, // Just the ID
        public array $options
    ) {}

    public function handle(): void
    {
        // Load fresh data in handler
        $report = Report::find($this->reportId);

        if (!$report) {
            // Handle deleted record
            return;
        }
    }
}
```

## الخلاصة

نظام طوابير المهام في Laravel مع Horizon يوفّر كل ما تحتاجه لمعالجة المهام في بيئة الإنتاج. المفتاح هو تصميم المهام بعناية: عمليات آمنة التكرار، واستراتيجيات إعادة محاولة مناسبة، ومراقبة سليمة.

ابدأ ببساطة، وقِس الأداء، ثم توسّع أفقيًا عند الحاجة.

---

## مصادر

- [توثيق طوابير المهام في Laravel](https://laravel.com/docs/queues)
- [توثيق Laravel Horizon](https://laravel.com/docs/horizon)
