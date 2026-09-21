---
title: "اختبار الطفرات في Pest: اكتشف مسارات الكود غير المختبرة"
description: أتقن اختبار الطفرات مع Pest PHP. تعلّم كيف تعمل الطفرات، وكيف تضبط التغطية، وتقرأ النتائج، وترفع جودة اختباراتك إلى ما بعد تغطية الكود.
tags:
  - Pest
  - Testing
  - Laravel
  - PHP
  - Mutation Testing
noImage: true
createdAt: 2025-07-15T10:00:00.000Z
updatedAt: 2025-07-15T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# اختبار الطفرات في Pest: اكتشف مسارات الكود غير المختبرة

يتجاوز **اختبار الطفرات** (Mutation testing) تغطية الكود ليختبر جودة اختباراتك نفسها. يُدخل Pest تغييرات صغيرة (طفرات) على الكود، ثم يتحقق هل تكتشفها اختباراتك.

## لماذا اختبار الطفرات؟

تخبرك تغطية الكود (code coverage) بالأسطر التي نُفّذت، لكنها لا تخبرك هل اختُبرت فعلًا:

```php
// 100% code coverage, but is it tested?
function calculateDiscount(int $price, int $percent): int
{
    return $price - ($price * $percent / 100);
}

test('calculates discount', function () {
    $result = calculateDiscount(100, 10);
    // Missing assertion! Just calling the function gives coverage.
    expect(true)->toBeTrue();
});
```

اختبار الطفرات سيكشف هذا: لو غيّرنا `*` إلى `+` سيظل الاختبار ناجحًا، وهذا يعني أنه لا يختبر الحساب أصلًا.

## البداية

### المتطلبات

- Pest 3.0+
- XDebug 3.0+ أو PCOV

### تفعيل اختبار الطفرات

```bash
./vendor/bin/pest --mutate
```

## كيف يعمل

يطبّق Pest طفرات على الكود:

| الطفرة | الأصل | بعد الطفرة |
|----------|----------|---------|
| حسابية | `$a + $b` | `$a - $b` |
| مقارنة | `$a > $b` | `$a >= $b` |
| منطقية | `$a && $b` | `$a \|\| $b` |
| الإرجاع | `return $value` | `return null` |
| الحذف | `$array[] = $item` | (يُحذف) |

### مثال

```php
// Your code
function isAdult(int $age): bool
{
    return $age >= 18;
}

// Mutation: >= becomes >
function isAdult(int $age): bool
{
    return $age > 18;  // Mutated!
}
```

إذا لم يفشل اختبارك مع هذه الطفرة، فأنت لا تختبر الحالة الحدية (age = 18).

## ضبط التغطية

### استخدام covers()

أخبر Pest بما يغطيه كل اختبار:

```php
covers(OrderService::class);

test('calculates order total', function () {
    $order = new Order([
        ['price' => 100, 'quantity' => 2],
        ['price' => 50, 'quantity' => 1],
    ]);

    expect($order->total())->toBe(250);
});
```

### تغطية دوال محددة

```php
covers(OrderService::class, 'calculateTotal');

test('applies tax correctly', function () {
    $service = new OrderService();
    $total = $service->calculateTotal(100, taxRate: 0.1);

    expect($total)->toBe(110.0);
});
```

### التغطية على مستوى الملف

```php
// At the top of your test file
covers(App\Services\PaymentService::class);
covers(App\Services\InvoiceService::class);

// All tests in this file cover these classes
```

## تشغيل اختبارات الطفرات

### تشغيل أساسي

```bash
./vendor/bin/pest --mutate
```

### استهداف اختبارات محددة

```bash
./vendor/bin/pest --mutate --filter="OrderTest"
```

### التنفيذ المتوازي

```bash
./vendor/bin/pest --mutate --parallel
```

### مع حد أدنى للنتيجة

```bash
./vendor/bin/pest --mutate --min=80
```

## فهم النتائج

```
Mutations: 45 total
├── 38 killed (84%)
├── 4 escaped (9%)
├── 2 not covered (4%)
└── 1 timeout (2%)

Mutation Score: 84%
```

- **Killed**: اكتشف الاختبار الطفرة (جيد!)
- **Escaped**: لم تُكتشف الطفرة (تحتاج اختبارات أفضل)
- **Not Covered**: لا توجد اختبارات تغطي هذا الكود
- **Timeout**: تسببت الطفرة في حلقة لا نهائية

## رفع جودة الاختبارات

### قبل: اختبار ضعيف

```php
test('applies discount', function () {
    $calculator = new PriceCalculator();
    $result = $calculator->applyDiscount(100, 20);

    expect($result)->toBeNumeric();
});
```

### بعد: اختبار قوي

```php
test('applies percentage discount correctly', function () {
    $calculator = new PriceCalculator();

    expect($calculator->applyDiscount(100, 20))->toBe(80.0);
    expect($calculator->applyDiscount(100, 0))->toBe(100.0);
    expect($calculator->applyDiscount(100, 100))->toBe(0.0);
    expect($calculator->applyDiscount(50, 10))->toBe(45.0);
});
```

## طفرات تفلت كثيرًا

### 1. غياب اختبارات الحالات الحدية

```php
// Mutant escapes: >= becomes >
function canVote(int $age): bool
{
    return $age >= 18;
}

// Fix: Test the boundary
test('voting age boundary', function () {
    expect(canVote(17))->toBeFalse();
    expect(canVote(18))->toBeTrue();  // Boundary!
    expect(canVote(19))->toBeTrue();
});
```

### 2. غياب التحقق من القيمة المُرجعة

```php
// Mutant escapes: return value not tested
function createUser(array $data): User
{
    return User::create($data);
}

test('creates user', function () {
    createUser(['name' => 'John']);

    expect(User::count())->toBe(1);
    // Missing: assertion on returned user
});

// Fix
test('creates user and returns instance', function () {
    $user = createUser(['name' => 'John']);

    expect($user)->toBeInstanceOf(User::class);
    expect($user->name)->toBe('John');
});
```

### 3. آثار جانبية بلا اختبار

```php
function processOrder(Order $order): void
{
    $order->status = 'processed';
    $order->save();
    Mail::send(new OrderProcessed($order));
}

test('processes order completely', function () {
    Mail::fake();

    $order = Order::factory()->create();
    processOrder($order);

    expect($order->fresh()->status)->toBe('processed');
    Mail::assertSent(OrderProcessed::class);
});
```

## الإعداد في pest.php

```php
pest()
    ->mutate()
    ->min(80)                           // Minimum mutation score
    ->parallel()                        // Run in parallel
    ->ignoreUntestedMutations(false);   // Fail on untested code

// Ignore specific directories
pest()->mutate()->except([
    'app/Console/*',
    'app/Exceptions/*',
]);
```

## التكامل مع CI

```yaml
# .github/workflows/tests.yml
mutation-tests:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: shivammathur/setup-php@v2
      with:
        php-version: '8.3'
        coverage: pcov

    - run: composer install
    - run: ./vendor/bin/pest --mutate --min=80
```

## أفضل الممارسات

### 1. ابدأ بالكود الحرج

```php
// Focus on business logic first
covers(App\Services\PaymentService::class);
covers(App\Services\OrderService::class);
covers(App\Services\PricingService::class);
```

### 2. استخدم Datasets للحالات الحدية

```php
dataset('age boundaries', [
    [17, false],
    [18, true],
    [19, true],
    [0, false],
    [100, true],
]);

test('validates voting age', function (int $age, bool $expected) {
    expect(canVote($age))->toBe($expected);
})->with('age boundaries');
```

### 3. تبنَّه تدريجيًا

```php
// Start with 60%, increase over time
pest()->mutate()->min(60);

// Then 70%, 80%, 90%...
```

## الخلاصة

يكشف اختبار الطفرات الجودة الحقيقية لمجموعة اختباراتك. الاختبار الذي يحقق تغطية الكود ولا يكتشف الطفرات يمنحك ثقة زائفة. استخدم اختبار الطفرات في Pest لتجد هذه الثغرات وتسدّها.

---

## مصادر

- [اختبار الطفرات في Pest](https://pestphp.com/docs/mutation-testing)
- [توثيق Pest](https://pestphp.com)

