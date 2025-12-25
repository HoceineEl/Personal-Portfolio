---
title: "Laravel Queues and Horizon: Production-Ready Background Jobs"
description: Master Laravel queues from basics to advanced patterns. Learn job design, retry strategies, batching, Horizon monitoring, and scaling for high-traffic applications.
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

# Laravel Queues and Horizon: Production-Ready Background Jobs

Background job processing is essential for building responsive, scalable applications. Laravel's queue system combined with Horizon provides enterprise-grade job management.

## Queue Fundamentals

### Creating Jobs

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

### Dispatching Jobs

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

## Job Design Patterns

### Idempotent Jobs

Jobs should be safe to retry:

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

### Job Middleware

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

### Preventing Overlapping

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

## Retry Strategies

### Configuring Retries

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

### Handling Failures

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

### Custom Retry Logic

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

## Job Batching

### Creating Batches

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

### Tracking Batch Progress

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

### Adding Jobs to Batch

```php
$batch = Bus::findBatch($batchId);

$batch->add([
    new ProcessPodcast($newPodcast),
]);
```

## Laravel Horizon

### Installation

```bash
composer require laravel/horizon
php artisan horizon:install
php artisan migrate
```

### Configuration

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

### Running Horizon

```bash
# Development
php artisan horizon

# Production (with supervisor)
php artisan horizon:terminate # Graceful restart after deploy
```

### Supervisor Configuration

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

## Queue Priority

### Defining Priorities

```php
// High priority jobs
HighPriorityJob::dispatch()->onQueue('high');

// Low priority jobs
LowPriorityJob::dispatch()->onQueue('low');
```

### Processing Order

```php
// config/horizon.php
'supervisor-1' => [
    'queue' => ['high', 'default', 'low'], // Priority order
    'balance' => 'auto',
],
```

## Monitoring and Metrics

### Job Metrics in Horizon

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

### Custom Metrics

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

## Performance Optimization

### Job Chunking

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

### Memory Management

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

### Connection Pooling

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

## Best Practices

### 1. Keep Jobs Small

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

### 2. Use Specific Queues

```php
// Separate by criticality and resource needs
SendWelcomeEmail::dispatch($user)->onQueue('emails');
GenerateInvoice::dispatch($order)->onQueue('billing');
ProcessVideo::dispatch($video)->onQueue('media');
```

### 3. Handle Serialization Carefully

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

## Conclusion

Laravel's queue system with Horizon provides everything needed for production job processing. The key is thoughtful job design—idempotent operations, appropriate retry strategies, and proper monitoring.

Start simple, measure performance, and scale horizontally as needed.

---

## Resources

- [Laravel Queues Documentation](https://laravel.com/docs/queues)
- [Laravel Horizon Documentation](https://laravel.com/docs/horizon)

