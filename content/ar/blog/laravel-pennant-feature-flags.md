---
title: "Laravel Pennant: أعلام الميزات (Feature Flags) للإطلاق التدريجي"
description: "أتقن Laravel Pennant لإدارة أعلام الميزات: الإطلاق التدريجي، واختبارات A/B، والميزات الخاصة بمستخدمين محددين، والنشر الآمن في بيئة الإنتاج."
tags:
  - Laravel
  - Pennant
  - Feature Flags
noImage: true
createdAt: 2025-06-20T10:00:00.000Z
updatedAt: 2025-06-20T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel Pennant: أعلام الميزات (Feature Flags) للإطلاق التدريجي

يوفّر **Laravel Pennant** نظامًا بسيطًا وخفيفًا لأعلام الميزات. تحكّم في من يرى الميزات الجديدة، وأجرِ اختبارات A/B، وانشر بثقة.

## التثبيت

```bash
composer require laravel/pennant
php artisan vendor:publish --provider="Laravel\Pennant\PennantServiceProvider"
php artisan migrate
```

## تعريف الميزات

### ميزات أساسية

```php
// app/Providers/AppServiceProvider.php
use Laravel\Pennant\Feature;

public function boot(): void
{
    Feature::define('new-dashboard', fn () => true);

    Feature::define('dark-mode', fn (User $user) =>
        $user->is_premium
    );
}
```

### ميزات معرَّفة كأصناف (Classes)

```php
// app/Features/NewCheckoutFlow.php
namespace App\Features;

use App\Models\User;

class NewCheckoutFlow
{
    public function resolve(User $user): bool
    {
        return match(true) {
            $user->isEmployee() => true,
            $user->isBetaTester() => true,
            default => false,
        };
    }
}
```

## التحقق من الميزات

### في المتحكمات (Controllers)

```php
use Laravel\Pennant\Feature;

class DashboardController extends Controller
{
    public function index()
    {
        if (Feature::active('new-dashboard')) {
            return view('dashboard.new');
        }

        return view('dashboard.classic');
    }
}
```

### في قوالب Blade

```blade
@feature('new-dashboard')
    <x-new-dashboard />
@else
    <x-classic-dashboard />
@endfeature
```

### لمستخدمين محددين

```php
// Check for current user
Feature::for($user)->active('beta-features');

// Check for team
Feature::for($team)->active('team-analytics');
```

## الإطلاق التدريجي

### حسب النسبة المئوية

```php
Feature::define('new-algorithm', function (User $user) {
    // Roll out to 25% of users
    return $user->id % 100 < 25;
});

// Or use lottery
Feature::define('new-ui', fn () => Lottery::odds(1, 4)->choose());
```

### الإطلاق حسب شريحة المستخدمين

```php
Feature::define('ai-features', function (User $user) {
    return match(true) {
        // Phase 1: Internal team
        $user->isEmployee() => true,

        // Phase 2: Beta testers
        $user->isBetaTester() => true,

        // Phase 3: Premium users
        $user->isPremium() => true,

        // Phase 4: Everyone
        default => false,
    };
});
```

### الإطلاق حسب الوقت

```php
Feature::define('holiday-theme', function () {
    $now = now();
    return $now->month === 12 && $now->day >= 15;
});
```

## قيم أغنى للميزات

أعِد أكثر من مجرد قيم منطقية (booleans):

```php
Feature::define('purchase-limit', function (User $user) {
    return match($user->tier) {
        'free' => 5,
        'basic' => 25,
        'premium' => 100,
        'enterprise' => PHP_INT_MAX,
    };
});

// Usage
$limit = Feature::value('purchase-limit');
$canPurchase = $currentCount < $limit;
```

## اختبارات A/B

```php
Feature::define('checkout-button-color', function (User $user) {
    // Consistent assignment per user
    return match($user->id % 3) {
        0 => 'blue',
        1 => 'green',
        2 => 'orange',
    };
});
```

```blade
<button class="btn-{{ Feature::value('checkout-button-color') }}">
    Checkout
</button>
```

## الوسيط (Middleware)

### اشتراط الوصول إلى الميزة

```php
// routes/web.php
Route::middleware('feature:new-dashboard')->group(function () {
    Route::get('/dashboard/v2', [NewDashboardController::class, 'index']);
});
```

### وسيط مخصص

```php
// app/Http/Middleware/RequireFeature.php
class RequireFeature
{
    public function handle(Request $request, Closure $next, string $feature)
    {
        if (!Feature::active($feature)) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Feature not available'], 403);
            }
            return redirect('/')->with('error', 'This feature is not available for your account.');
        }

        return $next($request);
    }
}
```

## إدارة الميزات

### التفعيل والتعطيل

```php
// Activate for user
Feature::for($user)->activate('beta-features');

// Deactivate
Feature::for($user)->deactivate('beta-features');

// Activate globally
Feature::activateForEveryone('new-feature');

// Deactivate globally
Feature::deactivateForEveryone('old-feature');
```

### نسيان الحالة (إعادة التقييم)

```php
// Re-evaluate feature for user
Feature::for($user)->forget('new-dashboard');

// Purge all stored states
Feature::purge('new-dashboard');
```

## مشغّلات التخزين (Storage Drivers)

### قاعدة البيانات (الافتراضي)

```php
// config/pennant.php
'default' => 'database',
```

### المصفوفة (Array) للاختبارات

```php
// In tests
Feature::define('test-feature', fn () => true);
```

### مشغّل مخصص

```php
Feature::extend('redis', function ($app) {
    return new RedisDriver($app['redis']);
});
```

## الأحداث (Events)

```php
// Listen for feature evaluations
Feature::listen(function (string $feature, $scope, mixed $value) {
    Log::info("Feature {$feature} evaluated", [
        'scope' => $scope?->id,
        'value' => $value,
    ]);
});
```

## التكامل مع لوحة الإدارة

### مفتاح تبديل في Filament

```php
// app/Filament/Resources/UserResource.php
Forms\Components\Toggle::make('has_beta_access')
    ->afterStateUpdated(function ($state, User $record) {
        if ($state) {
            Feature::for($record)->activate('beta-features');
        } else {
            Feature::for($record)->deactivate('beta-features');
        }
    });
```

## الاختبار

```php
use Laravel\Pennant\Feature;

test('premium users see new dashboard', function () {
    // Arrange
    $user = User::factory()->premium()->create();

    // Force feature active
    Feature::for($user)->activate('new-dashboard');

    // Act & Assert
    $this->actingAs($user)
        ->get('/dashboard')
        ->assertViewIs('dashboard.new');
});

test('free users see classic dashboard', function () {
    $user = User::factory()->create();

    Feature::for($user)->deactivate('new-dashboard');

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertViewIs('dashboard.classic');
});
```

## أفضل الممارسات

### 1. احذف الأعلام القديمة

```php
// Remove after full rollout
Feature::purge('old-feature');

// Remove from codebase
// Delete Feature::define('old-feature', ...)
```

### 2. وثّق الميزات

```php
Feature::define('new-pricing-page', function (User $user) {
    // Rollout: Started 2024-01-15
    // Target: 100% by 2024-02-01
    // Owner: @johndoe
    return $user->created_at > now()->subDays(30);
});
```

### 3. راقب الأداء

```php
Feature::define('heavy-feature', function (User $user) {
    return Cache::remember(
        "feature:heavy:{$user->id}",
        now()->addMinutes(5),
        fn () => $this->expensiveCheck($user)
    );
});
```

## الخلاصة

يجعل Laravel Pennant أعلام الميزات بسيطة وقوية في آن واحد. استخدمه للإطلاق التدريجي واختبارات A/B والنشر الآمن. ولا تنسَ حذف الأعلام بعد اكتمال إطلاق الميزة للجميع.

---

## مصادر

- [توثيق Laravel Pennant](https://laravel.com/docs/pennant)
- [أفضل ممارسات أعلام الميزات](https://martinfowler.com/articles/feature-toggles.html)

