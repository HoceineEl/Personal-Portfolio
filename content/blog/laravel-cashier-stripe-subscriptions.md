---
title: "Laravel Cashier Stripe: Complete Subscription Billing Guide"
description: Build production-ready subscription billing with Laravel Cashier and Stripe. Cover plans, trials, upgrades, webhooks, invoices, and handling edge cases.
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

# Laravel Cashier Stripe: Complete Subscription Billing Guide

**Laravel Cashier** provides an elegant interface to Stripe's subscription billing services. This guide covers everything from basic setup to handling complex billing scenarios in production.

## Installation and Setup

### Install Cashier

```bash
composer require laravel/cashier
php artisan migrate
```

### Configure the Billable Model

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

### Environment Variables

```env
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CASHIER_CURRENCY=usd
```

## Creating Subscription Plans

### Define Plans in Stripe

First, create products and prices in Stripe Dashboard or via API:

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

### Local Plan Configuration

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

## Subscription Management

### Creating Subscriptions

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

### Checking Subscription Status

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

### Changing Plans

```php
// Upgrade/downgrade (immediate)
$team->subscription('default')->swap('price_enterprise_monthly');

// Swap at end of billing period
$team->subscription('default')->noProrate()->swap('price_starter_monthly');

// Swap with prorating
$team->subscription('default')
    ->swapAndInvoice('price_pro_monthly');
```

### Canceling Subscriptions

```php
// Cancel at period end (grace period)
$team->subscription('default')->cancel();

// Cancel immediately
$team->subscription('default')->cancelNow();

// Resume canceled subscription (during grace period)
$team->subscription('default')->resume();
```

## Handling Payments

### Checkout Sessions

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

### Payment Methods

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

### Handling Failed Payments

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

## Webhooks

### Register Webhook Routes

```php
// routes/web.php
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook'])
    ->name('cashier.webhook');
```

### Custom Webhook Handler

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

## Invoices and Receipts

### Listing Invoices

```php
// Get all invoices
$invoices = $team->invoices();

// Include pending invoices
$invoices = $team->invoicesIncludingPending();

// Get specific invoice
$invoice = $team->findInvoice($invoiceId);
```

### Generating Invoice PDFs

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

### Invoice Page

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

## Trials and Free Tiers

### Trial Configuration

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

### Checking Trial Status

```php
// On trial?
$team->onTrial('default');

// Trial ends at
$team->subscription('default')->trial_ends_at;

// Days remaining
$team->subscription('default')->trial_ends_at->diffInDays(now());
```

### Generic Trials (No Subscription)

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

## Usage-Based Billing

### Metered Billing

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

### Usage Tracking

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

## Best Practices

### 1. Always Handle Webhooks

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

### 2. Test with Stripe CLI

```bash
# Install Stripe CLI
stripe listen --forward-to localhost/stripe/webhook

# Trigger test events
stripe trigger customer.subscription.created
```

### 3. Handle Edge Cases

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

## Conclusion

Laravel Cashier simplifies Stripe integration, but production billing requires careful attention to webhooks, failed payments, and edge cases. Always test thoroughly with Stripe's test mode and CLI before going live.

---

## Resources

- [Laravel Cashier Documentation](https://laravel.com/docs/billing)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Testing](https://stripe.com/docs/testing)

