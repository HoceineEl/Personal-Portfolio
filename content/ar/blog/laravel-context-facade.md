---
title: "Laravel Context: مشاركة البيانات في كل أجزاء تطبيقك"
description: أتقن واجهة Context في Laravel لمشاركة البيانات طوال دورة حياة الطلب. تعرّف على مكدسات السياق، والسياق المخفي، والتجفيف (dehydration)، والتكامل مع السجلات.
tags:
  - Laravel
  - Context
  - Logging
noImage: true
createdAt: 2025-04-10T10:00:00.000Z
updatedAt: 2025-04-10T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel Context: مشاركة البيانات في كل أجزاء تطبيقك

يوفّر **Laravel Context** طريقة نظيفة لمشاركة البيانات طوال دورة حياة الطلب في تطبيقك. من المتحكمات (Controllers) إلى المهام (Jobs)، ومن الوسطاء (middleware) إلى السجلات، ينتقل السياق مع الكود أينما ذهب.

## الاستخدام الأساسي

```php
use Illuminate\Support\Facades\Context;

// Add context
Context::add('user_id', auth()->id());
Context::add('request_id', Str::uuid()->toString());

// Retrieve context
$userId = Context::get('user_id');

// Check existence
if (Context::has('tenant_id')) {
    // ...
}

// Get all context
$all = Context::all();
```

## إضافة السياق داخل وسيط (middleware)

```php
// app/Http/Middleware/AddRequestContext.php
namespace App\Http\Middleware;

use Illuminate\Support\Facades\Context;
use Illuminate\Support\Str;

class AddRequestContext
{
    public function handle(Request $request, Closure $next)
    {
        Context::add([
            'request_id' => Str::uuid()->toString(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'url' => $request->fullUrl(),
        ]);

        if ($request->user()) {
            Context::add([
                'user_id' => $request->user()->id,
                'user_email' => $request->user()->email,
            ]);
        }

        return $next($request);
    }
}
```

سجّله في `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->append(AddRequestContext::class);
})
```

## السياق في السجلات

يدخل السياق تلقائيًا في رسائل السجل:

```php
// Add context
Context::add('order_id', $order->id);
Context::add('customer_id', $order->customer_id);

// All logs include context
Log::info('Processing order');
// Output: [2024-01-15 10:30:00] local.INFO: Processing order {"order_id":123,"customer_id":456}

Log::error('Payment failed', ['reason' => 'Insufficient funds']);
// Output: [2024-01-15 10:30:01] local.ERROR: Payment failed {"reason":"Insufficient funds","order_id":123,"customer_id":456}
```

## مكدسات السياق (Context Stacks)

للبيانات الهرمية مثل مسار التنقل (breadcrumbs):

```php
// Push to stack
Context::push('breadcrumbs', 'Home');
Context::push('breadcrumbs', 'Products');
Context::push('breadcrumbs', 'Electronics');

// Get stack
Context::get('breadcrumbs'); // ['Home', 'Products', 'Electronics']

// Check if stack contains value
Context::stackContains('breadcrumbs', 'Products'); // true
```

### تتبّع استدعاءات الدوال

```php
class OrderProcessor
{
    public function process(Order $order): void
    {
        Context::push('trace', 'OrderProcessor::process');

        $this->validateOrder($order);
        $this->chargePayment($order);
        $this->updateInventory($order);
        $this->sendNotifications($order);
    }

    private function validateOrder(Order $order): void
    {
        Context::push('trace', 'OrderProcessor::validateOrder');
        // ...
    }

    private function chargePayment(Order $order): void
    {
        Context::push('trace', 'OrderProcessor::chargePayment');
        // If error occurs, logs show full trace
    }
}
```

## السياق المخفي (Hidden Context)

بيانات يجب ألا تظهر في السجلات، لكن يجب أن تنتقل مع الطلب:

```php
// Add hidden context
Context::addHidden('api_key', $apiKey);
Context::addHidden('session_token', $token);

// Retrieve hidden context
$apiKey = Context::getHidden('api_key');

// Won't appear in logs
Log::info('API call made'); // api_key NOT included

// But propagates to jobs
dispatch(new ProcessWebhook($data)); // Hidden context travels with job
```

## السياق مع المهام (Jobs)

ينتقل السياق تلقائيًا إلى المهام في طابور المهام (queue):

```php
// In controller
Context::add('tenant_id', $tenant->id);
Context::add('user_id', auth()->id());

dispatch(new ProcessOrder($order));

// In job - context is available
class ProcessOrder implements ShouldQueue
{
    public function handle()
    {
        $tenantId = Context::get('tenant_id');
        $userId = Context::get('user_id');

        Log::info('Processing order in job');
        // Includes: tenant_id, user_id
    }
}
```

### التحكم في الانتقال

```php
// Don't propagate specific keys
Context::add('temporary_data', $data);
Context::forget('temporary_data'); // Remove before job dispatch

// Or use dehydrating callbacks
Context::dehydrating(function (Context $context) {
    $context->forget('temporary_data');
});
```

## السياق المحدود بنطاق (Scoped Context)

أضف سياقًا مؤقتًا:

```php
$result = Context::scope(function () use ($order) {
    Context::add('processing_order', $order->id);

    // This context only exists within this scope
    $this->processOrder($order);

    return $order->fresh();
});

// 'processing_order' is automatically removed
Context::has('processing_order'); // false
```

## السياق في التطبيقات متعددة المستأجرين (Multi-Tenancy)

```php
// app/Http/Middleware/TenantContext.php
class TenantContext
{
    public function handle(Request $request, Closure $next)
    {
        $tenant = $request->route('tenant') ?? $this->resolveTenant($request);

        Context::add([
            'tenant_id' => $tenant->id,
            'tenant_slug' => $tenant->slug,
            'tenant_plan' => $tenant->plan,
        ]);

        // Hidden - for internal use only
        Context::addHidden('tenant_database', $tenant->database);

        return $next($request);
    }
}
```

```php
// Anywhere in application
class ReportService
{
    public function generate()
    {
        $tenantId = Context::get('tenant_id');

        // Logs automatically include tenant context
        Log::info('Generating report');
    }
}
```

## تتبّع طلبات API

```php
// Middleware for API tracing
class ApiTracing
{
    public function handle(Request $request, Closure $next)
    {
        $traceId = $request->header('X-Trace-ID') ?? Str::uuid()->toString();
        $spanId = Str::uuid()->toString();

        Context::add([
            'trace_id' => $traceId,
            'span_id' => $spanId,
            'parent_span_id' => $request->header('X-Span-ID'),
        ]);

        $response = $next($request);

        return $response
            ->header('X-Trace-ID', $traceId)
            ->header('X-Span-ID', $spanId);
    }
}

// All logs include trace_id for correlation
Log::info('API request received');
Log::info('Database query executed');
Log::info('Response sent');
// All three logs share the same trace_id
```

## التجفيف والترطيب (Dehydration و Hydration)

تحكّم في ما ينتقل من السياق إلى المهام:

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    // Before serializing for job
    Context::dehydrating(function (Context $context) {
        // Remove large or sensitive data
        $context->forget('large_payload');
        $context->forgetHidden('temporary_token');
    });

    // After deserializing in job
    Context::hydrated(function (Context $context) {
        // Add job-specific context
        $context->add('job_started_at', now()->toIso8601String());
    });
}
```

## الاختبار مع السياق

```php
use Illuminate\Support\Facades\Context;

test('order processing adds context', function () {
    Context::add('user_id', 1);

    $order = Order::factory()->create();
    app(OrderProcessor::class)->process($order);

    expect(Context::get('order_id'))->toBe($order->id);
    expect(Context::get('order_status'))->toBe('processed');
});

test('context propagates to jobs', function () {
    Context::add('tenant_id', 5);

    dispatch(new ProcessOrder($order));

    // Assert job received context
    Queue::assertPushed(ProcessOrder::class, function ($job) {
        return $job->context['tenant_id'] === 5;
    });
});

beforeEach(function () {
    Context::flush(); // Clear context between tests
});
```

## سياق الاستثناءات

أضف سياقًا عند وقوع الاستثناءات:

```php
class OrderProcessor
{
    public function process(Order $order): void
    {
        Context::add('order_id', $order->id);
        Context::add('order_total', $order->total);

        try {
            $this->charge($order);
        } catch (PaymentException $e) {
            // Context included in exception report
            report($e);
            throw $e;
        }
    }
}

// In exception handler
class Handler extends ExceptionHandler
{
    public function report(Throwable $e): void
    {
        // Context automatically included
        Log::error($e->getMessage(), [
            'exception' => $e,
            // context: order_id, order_total included
        ]);
    }
}
```

## أفضل الممارسات

1. **أضف السياق مبكرًا**: داخل الوسيط قبل منطق العمل
2. **استخدم السياق المخفي للبيانات الحساسة**: مفاتيح API والرموز (tokens)
3. **نظّف السياق المؤقت**: استخدم `forget()` أو `scope()`
4. **تسمية موحدة**: `user_id` وليس `userId` أو `user-id`
5. **لا تُثقله**: اجعل السياق مركّزًا وذا صلة

## الخلاصة

يقدّم Laravel Context طريقة نظيفة ومدمجة في إطار العمل لمشاركة البيانات في كل أجزاء تطبيقك. استخدمه لتتبّع الطلبات، وللتطبيقات متعددة المستأجرين، ولإثراء السجلات، وفي أي موضع تحتاج فيه أن تنتقل البيانات دون تمريرها صراحةً.

---

## مصادر

- [توثيق Laravel Context](https://laravel.com/docs/context)
- [السجلات في Laravel](https://laravel.com/docs/logging)

