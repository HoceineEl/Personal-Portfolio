---
title: "Laravel Cashier مع Stripe: دليل شامل لفوترة الاشتراكات"
description: "ابنِ نظام فوترة اشتراكات جاهزًا للإنتاج باستخدام Laravel Cashier و Stripe: الخطط، والفترات التجريبية، والترقيات، والـ webhooks، والفواتير، والتعامل مع الحالات الحدّية."
tags:
  - Laravel
  - Stripe
  - SaaS
  - Payments
  - Cashier
noImage: true
createdAt: 2025-06-15T10:00:00.000Z
updatedAt: 2025-06-15T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel Cashier مع Stripe: دليل شامل لفوترة الاشتراكات

يوفّر **Laravel Cashier** واجهة أنيقة لخدمات فوترة الاشتراكات في Stripe. يغطي هذا الدليل كل شيء، من الإعداد الأساسي حتى التعامل مع سيناريوهات الفوترة المعقدة في بيئة الإنتاج.

## التثبيت والإعداد

### تثبيت Cashier

```bash
composer require laravel/cashier
php artisan migrate
```

### إعداد النموذج القابل للفوترة (Billable Model)

```php
// app/Models/Team.php (or User.php)
use Laravel\Cashier\Billable;

class Team extends Model
{
    use Billable;

    protected $casts = [
        'trial_ends_at' => 'datetime',
    ];
}
```

### متغيرات البيئة

```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CASHIER_CURRENCY=usd
```

## إنشاء خطط الاشتراك

### تعريف الخطط في Stripe

أنشئ أولًا المنتجات والأسعار من لوحة تحكم Stripe أو عبر الـ API:

```php
// database/seeders/StripePlanSeeder.php
use Stripe\StripeClient;

class StripePlanSeeder extends Seeder
{
    public function run()
    {
        $stripe = new StripeClient(config('cashier.secret'));

        // Create product
        $product = $stripe->products->create([
            'name' => 'SaaS Pro Plan',
            'description' => 'Full access to all features',
        ]);

        // Create monthly price
        $stripe->prices->create([
            'product' => $product->id,
            'unit_amount' => 2900, // $29.00
            'currency' => 'usd',
            'recurring' => ['interval' => 'month'],
            'lookup_key' => 'pro_monthly',
        ]);

        // Create yearly price (2 months free)
        $stripe->prices->create([
            'product' => $product->id,
            'unit_amount' => 29000, // $290.00
            'currency' => 'usd',
            'recurring' => ['interval' => 'year'],
            'lookup_key' => 'pro_yearly',
        ]);
    }
}
```

### إعداد الخطط محليًا

```php
// config/plans.php
return [
    'starter' => [
        'name' => 'Starter',
        'stripe_price_monthly' => 'price_starter_monthly',
        'stripe_price_yearly' => 'price_starter_yearly',
        'features' => [
            'projects' => 5,
            'storage_gb' => 10,
            'team_members' => 3,
        ],
    ],
    'pro' => [
        'name' => 'Professional',
        'stripe_price_monthly' => 'price_pro_monthly',
        'stripe_price_yearly' => 'price_pro_yearly',
        'features' => [
            'projects' => 50,
            'storage_gb' => 100,
            'team_members' => 10,
        ],
    ],
    'enterprise' => [
        'name' => 'Enterprise',
        'stripe_price_monthly' => 'price_enterprise_monthly',
        'stripe_price_yearly' => 'price_enterprise_yearly',
        'features' => [
            'projects' => -1, // Unlimited
            'storage_gb' => 1000,
            'team_members' => -1,
        ],
    ],
];
```

## إدارة الاشتراكات

### إنشاء الاشتراكات

```php
// Subscription with trial
$team->newSubscription('default', 'price_pro_monthly')
    ->trialDays(14)
    ->create($paymentMethodId);

// Subscription without trial
$team->newSubscription('default', 'price_pro_monthly')
    ->create($paymentMethodId);

// Multiple prices (addons)
$team->newSubscription('default', [
    'price_pro_monthly',
    'price_extra_storage',
])->create($paymentMethodId);
```

### التحقق من حالة الاشتراك

```php
// Basic checks
$team->subscribed('default');           // Has active subscription
$team->subscribedToProduct('prod_xxx'); // Subscribed to specific product
$team->subscribedToPrice('price_pro');  // Subscribed to specific price

// Status checks
$team->subscription('default')->active();
$team->subscription('default')->onTrial();
$team->subscription('default')->canceled();
$team->subscription('default')->onGracePeriod();
$team->subscription('default')->ended();

// Middleware protection
Route::middleware(['subscribed:default'])->group(function () {
    // Only accessible to subscribers
});
```

### تغيير الخطة

```php
// Upgrade/downgrade (immediate)
$team->subscription('default')->swap('price_enterprise_monthly');

// Swap at end of billing period
$team->subscription('default')->noProrate()->swap('price_starter_monthly');

// Swap with prorating
$team->subscription('default')
    ->swapAndInvoice('price_pro_monthly');
```

### إلغاء الاشتراكات

```php
// Cancel at period end (grace period)
$team->subscription('default')->cancel();

// Cancel immediately
$team->subscription('default')->cancelNow();

// Resume canceled subscription (during grace period)
$team->subscription('default')->resume();
```

## التعامل مع المدفوعات

### جلسات الدفع (Checkout Sessions)

```php
// Create checkout session
public function checkout(Request $request)
{
    return $request->user()->currentTeam
        ->newSubscription('default', 'price_pro_monthly')
        ->trialDays(14)
        ->checkout([
            'success_url' => route('billing.success'),
            'cancel_url' => route('billing.cancel'),
        ]);
}
```

### وسائل الدفع

```php
// Get default payment method
$paymentMethod = $team->defaultPaymentMethod();

// Update payment method
$team->updateDefaultPaymentMethod($paymentMethodId);

// Delete payment method
$team->deletePaymentMethod($paymentMethodId);

// List all payment methods
$paymentMethods = $team->paymentMethods();
```

### التعامل مع المدفوعات الفاشلة

```php
// In webhook handler
protected function handleInvoicePaymentFailed($payload)
{
    $team = Team::where('stripe_id', $payload['data']['object']['customer'])->first();

    if ($team) {
        // Notify team owner
        $team->owner->notify(new PaymentFailed(
            $payload['data']['object']['amount_due'] / 100
        ));

        // Downgrade to free after X failures
        if ($team->failedPaymentCount() >= 3) {
            $team->subscription('default')->cancelNow();
            $team->update(['plan' => 'free']);
        }
    }
}
```

## الـ Webhooks

### تسجيل مسارات الـ Webhook

```php
// routes/web.php
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook'])
    ->name('cashier.webhook');
```

### معالج Webhook مخصص

```php
// app/Http/Controllers/WebhookController.php
use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;

class WebhookController extends CashierController
{
    protected function handleCustomerSubscriptionCreated(array $payload): Response
    {
        parent::handleCustomerSubscriptionCreated($payload);

        $team = $this->getUserByStripeId($payload['data']['object']['customer']);

        // Send welcome email
        $team->owner->notify(new SubscriptionActivated());

        // Provision resources
        ProvisionTeamResources::dispatch($team);

        return $this->successMethod();
    }

    protected function handleCustomerSubscriptionDeleted(array $payload): Response
    {
        $team = $this->getUserByStripeId($payload['data']['object']['customer']);

        // Cleanup resources
        CleanupTeamResources::dispatch($team);

        // Notify user
        $team->owner->notify(new SubscriptionCanceled());

        return parent::handleCustomerSubscriptionDeleted($payload);
    }

    protected function handleInvoicePaid(array $payload): Response
    {
        $team = $this->getUserByStripeId($payload['data']['object']['customer']);

        // Record payment
        Payment::create([
            'team_id' => $team->id,
            'stripe_invoice_id' => $payload['data']['object']['id'],
            'amount' => $payload['data']['object']['amount_paid'],
            'status' => 'paid',
        ]);

        return $this->successMethod();
    }
}
```

## الفواتير والإيصالات

### عرض قائمة الفواتير

```php
// Get all invoices
$invoices = $team->invoices();

// Include pending invoices
$invoices = $team->invoicesIncludingPending();

// Get specific invoice
$invoice = $team->findInvoice($invoiceId);
```

### توليد فواتير PDF

```php
// Download invoice
return $team->downloadInvoice($invoiceId, [
    'vendor' => 'Your Company',
    'product' => 'SaaS Subscription',
    'street' => '123 Main St',
    'location' => 'City, ST 12345',
    'phone' => '+1 (555) 123-4567',
]);
```

### صفحة الفواتير

```php
// Controller
public function invoices(Request $request)
{
    return view('billing.invoices', [
        'invoices' => $request->user()->currentTeam->invoices(),
    ]);
}
```

```blade
{{-- resources/views/billing/invoices.blade.php --}}
<table>
    <thead>
        <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Download</th>
        </tr>
    </thead>
    <tbody>
        @foreach($invoices as $invoice)
            <tr>
                <td>{{ $invoice->date()->toFormattedDateString() }}</td>
                <td>{{ $invoice->total() }}</td>
                <td>
                    @if($invoice->paid)
                        <span class="text-green-600">Paid</span>
                    @else
                        <span class="text-red-600">Unpaid</span>
                    @endif
                </td>
                <td>
                    <a href="{{ route('billing.invoice.download', $invoice->id) }}">
                        Download
                    </a>
                </td>
            </tr>
        @endforeach
    </tbody>
</table>
```

## الفترات التجريبية والباقات المجانية

### إعداد الفترة التجريبية

```php
// Global trial days
// In Team model
public function trialDays(): int
{
    return 14;
}

// Per-plan trial
$team->newSubscription('default', 'price_pro_monthly')
    ->trialDays(30)
    ->create($paymentMethodId);

// Trial without payment method
$team->newSubscription('default', 'price_pro_monthly')
    ->trialDays(14)
    ->create();
```

### التحقق من حالة الفترة التجريبية

```php
// On trial?
$team->onTrial('default');

// Trial ends at
$team->subscription('default')->trial_ends_at;

// Days remaining
$team->subscription('default')->trial_ends_at->diffInDays(now());
```

### فترات تجريبية عامة (دون اشتراك)

```php
// Set trial without subscription
$team->createAsStripeCustomer([
    'trial_ends_at' => now()->addDays(14),
]);

// Check generic trial
if ($team->onGenericTrial()) {
    // Full access during trial
}
```

## الفوترة حسب الاستخدام

### الفوترة المقيسة (Metered Billing)

```php
// Report usage
$team->subscription('default')
    ->reportUsage(150); // 150 API calls

// Report with timestamp
$team->subscription('default')
    ->reportUsage(
        quantity: 150,
        timestamp: now()->timestamp
    );

// Report for specific price
$team->subscription('default')
    ->reportUsageFor('price_api_calls', 150);
```

### تتبّع الاستخدام

```php
// Middleware to track API usage
class TrackApiUsage
{
    public function handle($request, $next)
    {
        $response = $next($request);

        if ($request->user()->currentTeam->subscribed('default')) {
            $request->user()->currentTeam
                ->subscription('default')
                ->reportUsage(1);
        }

        return $response;
    }
}
```

## أفضل الممارسات

### 1. تعامل مع الـ Webhooks دائمًا

```php
// Never rely solely on success URL redirects
// Webhooks are the source of truth

// Bad
public function success()
{
    auth()->user()->currentTeam->update(['plan' => 'pro']);
}

// Good
protected function handleCustomerSubscriptionCreated(array $payload)
{
    $team = $this->getUserByStripeId($payload['data']['object']['customer']);
    $team->update(['plan' => 'pro']);
}
```

### 2. اختبر باستخدام Stripe CLI

```bash
# Install Stripe CLI
stripe listen --forward-to localhost/stripe/webhook

# Trigger test events
stripe trigger customer.subscription.created
```

### 3. تعامل مع الحالات الحدّية

```php
// Subscription with incomplete payment
if ($team->hasIncompletePayment('default')) {
    return redirect()->route('billing.complete-payment');
}

// Past due subscriptions
if ($team->subscription('default')->pastDue()) {
    return redirect()->route('billing.update-payment');
}
```

## الخلاصة

يبسّط Laravel Cashier الربط مع Stripe، لكن الفوترة في بيئة الإنتاج تحتاج انتباهًا دقيقًا للـ webhooks والمدفوعات الفاشلة والحالات الحدّية. اختبر كل شيء جيدًا بوضع الاختبار في Stripe وأداة CLI قبل الإطلاق.

---

## مصادر

- [توثيق Laravel Cashier](https://laravel.com/docs/billing)
- [توثيق Stripe API](https://stripe.com/docs/api)
- [الاختبار في Stripe](https://stripe.com/docs/testing)

