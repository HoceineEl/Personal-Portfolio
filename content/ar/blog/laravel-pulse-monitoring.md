---
title: "Laravel Pulse: مراقبة التطبيق لحظيًا"
description: راقب تطبيق Laravel لحظيًا مع Pulse. تتبّع الاستعلامات البطيئة، والاستثناءات، ومهام الطوابير، وأداء التخزين المؤقت، ونشاط المستخدمين من لوحة معلومات أنيقة.
tags:
  - Laravel
  - Pulse
  - Monitoring
  - Performance
noImage: true
createdAt: 2025-06-15T10:00:00.000Z
updatedAt: 2025-06-15T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel Pulse: مراقبة التطبيق لحظيًا

يقدّم **Laravel Pulse** مراقبة لحظية لتطبيقك عبر لوحة معلومات أنيقة. تتبّع الأداء، واكتشف نقاط الاختناق، وافهم كيف يتفاعل المستخدمون مع تطبيقك.

## التثبيت

```bash
composer require laravel/pulse
php artisan vendor:publish --provider="Laravel\Pulse\PulseServiceProvider"
php artisan migrate
```

أضف وسيط (middleware) Pulse لتتبّع الطلبات:

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \Laravel\Pulse\Http\Middleware\Pulse::class,
    ]);
})
```

## الوصول إلى لوحة المعلومات

```php
// routes/web.php
Route::get('/pulse', function () {
    return view('pulse::dashboard');
})->middleware(['auth', 'can:viewPulse']);
```

### الصلاحيات

```php
// app/Providers/AppServiceProvider.php
use Laravel\Pulse\Facades\Pulse;

public function boot(): void
{
    Pulse::authorize(function (Request $request) {
        return $request->user()?->isAdmin();
    });
}
```

## المسجِّلات الافتراضية (Recorders)

### الاستعلامات البطيئة

يتتبّع تلقائيًا الاستعلامات التي تتجاوز الحد المضبوط:

```php
// config/pulse.php
'recorders' => [
    \Laravel\Pulse\Recorders\SlowQueries::class => [
        'threshold' => 1000, // ms
        'sample_rate' => 1.0,
    ],
],
```

### الاستثناءات

تتبّع كل الاستثناءات مع مسار الاستدعاء (stack trace):

```php
\Laravel\Pulse\Recorders\Exceptions::class => [
    'sample_rate' => 1.0,
    'ignore' => [
        ValidationException::class,
        AuthenticationException::class,
    ],
],
```

### الطلبات البطيئة

راقب أداء نقاط النهاية (endpoints):

```php
\Laravel\Pulse\Recorders\SlowRequests::class => [
    'threshold' => 1000, // ms
    'sample_rate' => 1.0,
],
```

### مهام الطوابير

تتبّع معالجة المهام (jobs):

```php
\Laravel\Pulse\Recorders\SlowJobs::class => [
    'threshold' => 1000, // ms
],
```

### عمليات التخزين المؤقت

راقب نسبة الإصابة في التخزين المؤقت (cache hit rate):

```php
\Laravel\Pulse\Recorders\CacheInteractions::class => [
    'sample_rate' => 1.0,
],
```

### طلبات المستخدمين

اعرف المستخدمين الأكثر نشاطًا:

```php
\Laravel\Pulse\Recorders\UserRequests::class => [
    'sample_rate' => 1.0,
],
```

## بطاقات لوحة المعلومات

### البطاقات المدمجة

```php
// resources/views/vendor/pulse/dashboard.blade.php
<x-pulse>
    <livewire:pulse.servers cols="full" />

    <livewire:pulse.usage cols="4" rows="2" />

    <livewire:pulse.queues cols="4" />

    <livewire:pulse.cache cols="4" />

    <livewire:pulse.slow-queries cols="8" />

    <livewire:pulse.exceptions cols="6" />

    <livewire:pulse.slow-requests cols="6" />

    <livewire:pulse.slow-jobs cols="6" />

    <livewire:pulse.slow-outgoing-requests cols="6" />
</x-pulse>
```

### تخطيط مخصص

```php
<x-pulse>
    {{-- Full-width server stats at top --}}
    <livewire:pulse.servers cols="full" />

    <div class="grid grid-cols-12 gap-6">
        {{-- Left column: Performance --}}
        <div class="col-span-8 space-y-6">
            <livewire:pulse.slow-queries />
            <livewire:pulse.slow-requests />
        </div>

        {{-- Right column: Activity --}}
        <div class="col-span-4 space-y-6">
            <livewire:pulse.usage />
            <livewire:pulse.exceptions />
        </div>
    </div>
</x-pulse>
```

## مسجِّلات مخصصة

### تتبّع أحداث مخصصة

```php
// app/Pulse/Recorders/PaymentRecorder.php
namespace App\Pulse\Recorders;

use Laravel\Pulse\Facades\Pulse;
use App\Events\PaymentProcessed;

class PaymentRecorder
{
    public function record(PaymentProcessed $event): void
    {
        Pulse::record(
            type: 'payment',
            key: $event->payment->gateway,
            value: $event->payment->amount
        )->count()->sum();
    }
}
```

سجّله في ملف الإعدادات:

```php
// config/pulse.php
'recorders' => [
    App\Pulse\Recorders\PaymentRecorder::class => [
        'events' => [
            \App\Events\PaymentProcessed::class,
        ],
    ],
],
```

### تتبّع استدعاءات API

```php
class ExternalApiRecorder
{
    public function record($event): void
    {
        Pulse::record(
            type: 'external_api',
            key: $event->service,
            value: $event->duration
        )->avg()->max();
    }
}
```

## بطاقات مخصصة

### إنشاء بطاقة

```php
// app/Livewire/Pulse/PaymentStats.php
namespace App\Livewire\Pulse;

use Laravel\Pulse\Livewire\Card;
use Livewire\Attributes\Lazy;

#[Lazy]
class PaymentStats extends Card
{
    public function render()
    {
        $payments = $this->aggregate('payment', ['count', 'sum']);

        return view('livewire.pulse.payment-stats', [
            'payments' => $payments,
        ]);
    }
}
```

```blade
{{-- resources/views/livewire/pulse/payment-stats.blade.php --}}
<x-pulse::card :cols="$cols" :rows="$rows">
    <x-pulse::card-header name="Payment Stats">
        <x-slot:icon>
            <x-heroicon-o-currency-dollar class="w-6 h-6" />
        </x-slot:icon>
    </x-pulse::card-header>

    <x-pulse::scroll :expand="$expand">
        @foreach ($payments as $gateway => $stats)
            <div class="flex justify-between p-4">
                <span>{{ $gateway }}</span>
                <span>{{ number_format($stats->sum / 100, 2) }}</span>
            </div>
        @endforeach
    </x-pulse::scroll>
</x-pulse::card>
```

## مراقبة الخوادم

### تثبيت وكيل الخادم

```bash
php artisan pulse:check
```

اضبط الخوادم:

```php
// config/pulse.php
'recorders' => [
    \Laravel\Pulse\Recorders\Servers::class => [
        'server_name' => env('PULSE_SERVER_NAME', gethostname()),
        'directories' => explode(':', env('PULSE_SERVER_DIRECTORIES', '/')),
    ],
],
```

## أخذ العيّنات (Sampling)

تحكّم في معدّل التسجيل:

```php
// Record 10% of requests
\Laravel\Pulse\Recorders\SlowRequests::class => [
    'sample_rate' => 0.1,
],

// Record all exceptions
\Laravel\Pulse\Recorders\Exceptions::class => [
    'sample_rate' => 1.0,
],
```

## الاحتفاظ بالبيانات

```php
// config/pulse.php
'ingest' => [
    'trim' => [
        'lottery' => [1, 1000],
        'keep' => '7 days',
    ],
],
```

### التنظيف اليدوي

```bash
php artisan pulse:clear
php artisan pulse:clear --type=slow_query
```

## تجاهل مسارات معيّنة

```php
// config/pulse.php
'recorders' => [
    \Laravel\Pulse\Recorders\SlowRequests::class => [
        'ignore' => [
            '#^/health#',
            '#^/livewire#',
            '#^/_debugbar#',
        ],
    ],
],
```

## قواعد بيانات متعددة

```php
// config/pulse.php
'database' => [
    'connection' => 'pulse',
],
```

```php
// config/database.php
'pulse' => [
    'driver' => 'mysql',
    'host' => env('PULSE_DB_HOST', '127.0.0.1'),
    'database' => env('PULSE_DB_DATABASE', 'pulse'),
    // ...
],
```

## التنبيهات

اجمعه مع Laravel Notifications:

```php
// app/Console/Commands/PulseAlerts.php
class PulseAlerts extends Command
{
    protected $signature = 'pulse:alerts';

    public function handle()
    {
        $slowQueries = Pulse::aggregate('slow_query', 'count', now()->subHour());

        if ($slowQueries > 100) {
            Notification::route('slack', config('services.slack.alerts'))
                ->notify(new SlowQueryAlert($slowQueries));
        }
    }
}
```

## الخلاصة

يوفّر Laravel Pulse المراقبة الأساسية التي تحتاجها دون خدمات خارجية. استخدمه لاكتشاف الاستعلامات البطيئة، وتتبّع الاستثناءات، ومراقبة سلامة طوابير المهام، وفهم سلوك المستخدمين، وكل ذلك من لوحة معلومات أنيقة.

---

## مصادر

- [توثيق Laravel Pulse](https://laravel.com/docs/pulse)
- [مستودع Pulse على GitHub](https://github.com/laravel/pulse)
