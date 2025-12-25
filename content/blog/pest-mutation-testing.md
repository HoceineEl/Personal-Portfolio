---
title: "Pest Mutation Testing: Find Untested Code Paths"
description: Master mutation testing with Pest PHP. Learn how mutations work, configure coverage, interpret results, and improve test quality beyond code coverage.
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

# Pest Mutation Testing: Find Untested Code Paths

**Mutation testing** goes beyond code coverage to test the quality of your tests. Pest introduces small changes (mutations) to your code and checks if your tests catch them.

## Why Mutation Testing?

Code coverage tells you which lines are executed, but not if they're actually tested:

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

Mutation testing would catch this—if we mutate `*` to `+`, the test still passes, revealing it's not actually testing the calculation.

## Getting Started

### Requirements

- Pest 3.0+
- XDebug 3.0+ or PCOV

### Enable Mutation Testing

```bash
./vendor/bin/pest --mutate
```

## How It Works

Pest applies mutations to your code:

| Mutation | Original | Mutated |
|----------|----------|---------|
| Arithmetic | `$a + $b` | `$a - $b` |
| Comparison | `$a > $b` | `$a >= $b` |
| Logical | `$a && $b` | `$a \|\| $b` |
| Return | `return $value` | `return null` |
| Removal | `$array[] = $item` | (removed) |

### Example

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

If your test doesn't fail with this mutation, it means you're not testing the boundary condition (age = 18).

## Configuring Coverage

### Using covers()

Tell Pest what each test covers:

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

### Covering Specific Methods

```php
covers(OrderService::class, 'calculateTotal');

test('applies tax correctly', function () {
    $service = new OrderService();
    $total = $service->calculateTotal(100, taxRate: 0.1);

    expect($total)->toBe(110.0);
});
```

### File-Level Coverage

```php
// At the top of your test file
covers(App\Services\PaymentService::class);
covers(App\Services\InvoiceService::class);

// All tests in this file cover these classes
```

## Running Mutation Tests

### Basic Run

```bash
./vendor/bin/pest --mutate
```

### Target Specific Tests

```bash
./vendor/bin/pest --mutate --filter="OrderTest"
```

### Parallel Execution

```bash
./vendor/bin/pest --mutate --parallel
```

### With Minimum Score

```bash
./vendor/bin/pest --mutate --min=80
```

## Understanding Results

```
Mutations: 45 total
├── 38 killed (84%)
├── 4 escaped (9%)
├── 2 not covered (4%)
└── 1 timeout (2%)

Mutation Score: 84%
```

- **Killed** - Test caught the mutation (good!)
- **Escaped** - Mutation wasn't caught (needs better tests)
- **Not Covered** - No tests cover this code
- **Timeout** - Mutation caused infinite loop

## Improving Test Quality

### Before: Weak Test

```php
test('applies discount', function () {
    $calculator = new PriceCalculator();
    $result = $calculator->applyDiscount(100, 20);

    expect($result)->toBeNumeric();
});
```

### After: Strong Test

```php
test('applies percentage discount correctly', function () {
    $calculator = new PriceCalculator();

    expect($calculator->applyDiscount(100, 20))->toBe(80.0);
    expect($calculator->applyDiscount(100, 0))->toBe(100.0);
    expect($calculator->applyDiscount(100, 100))->toBe(0.0);
    expect($calculator->applyDiscount(50, 10))->toBe(45.0);
});
```

## Common Mutation Escapes

### 1. Missing Boundary Tests

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

### 2. Missing Return Value Assertions

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

### 3. Side Effects Not Tested

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

## Configuration in pest.php

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

## CI Integration

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

## Best Practices

### 1. Start with Critical Code

```php
// Focus on business logic first
covers(App\Services\PaymentService::class);
covers(App\Services\OrderService::class);
covers(App\Services\PricingService::class);
```

### 2. Use Datasets for Boundaries

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

### 3. Incremental Adoption

```php
// Start with 60%, increase over time
pest()->mutate()->min(60);

// Then 70%, 80%, 90%...
```

## Conclusion

Mutation testing reveals the true quality of your test suite. A test that only achieves code coverage without catching mutations is giving false confidence. Use Pest's mutation testing to find and fix these gaps.

---

## Resources

- [Pest Mutation Testing](https://pestphp.com/docs/mutation-testing)
- [Pest Documentation](https://pestphp.com)

