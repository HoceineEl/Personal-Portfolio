---
title: "Pest 4 Testing: Browser Testing and Modern Laravel Testing"
description: Master Pest 4's revolutionary features including Playwright-powered browser testing, parallel execution, mutation testing, and architectural testing for Laravel applications.
tags:
  - Laravel
  - Testing
  - Pest
  - Browser Testing
  - Playwright
noImage: true
createdAt: 2025-04-01T10:00:00.000Z
updatedAt: 2025-04-01T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Pest 4 Testing: Browser Testing and Modern Laravel Testing

**Pest 4** is the biggest update yet, introducing Playwright-powered browser testing that feels as good as writing unit tests. Combined with parallel execution and Laravel integration, it's the complete testing solution.

## Installing Pest 4

```bash
composer require pestphp/pest --dev
./vendor/bin/pest --init
```

### Installing Browser Testing Plugin

```bash
composer require pestphp/pest-plugin-browser --dev
./vendor/bin/pest browser:install
```

This installs Playwright and the necessary browser binaries.

## Browser Testing Basics

### Your First Browser Test

```php
use function Pest\Browser\visit;

test('homepage loads correctly', function () {
    visit('/')
        ->assertSee('Welcome')
        ->assertTitle('My App');
});

test('user can login', function () {
    visit('/login')
        ->type('#email', 'user@example.com')
        ->type('#password', 'password')
        ->click('button[type="submit"]')
        ->waitForNavigation()
        ->assertPath('/dashboard')
        ->assertSee('Welcome back');
});
```

### Form Interactions

```php
test('user can submit contact form', function () {
    visit('/contact')
        ->type('input[name="name"]', 'John Doe')
        ->type('input[name="email"]', 'john@example.com')
        ->type('textarea[name="message"]', 'Hello, this is a test message')
        ->select('select[name="subject"]', 'support')
        ->check('input[name="newsletter"]')
        ->click('button[type="submit"]')
        ->waitForText('Thank you')
        ->assertSee('Message sent successfully');
});
```

### Navigation and Waiting

```php
test('dashboard loads data', function () {
    visit('/dashboard')
        ->waitForSelector('.data-table')
        ->waitForText('Loading complete')
        ->assertVisible('.chart-container')
        ->assertElementCount('.table-row', 10);
});

test('navigation works correctly', function () {
    visit('/')
        ->click('a[href="/about"]')
        ->waitForNavigation()
        ->assertPath('/about')
        ->back()
        ->assertPath('/')
        ->forward()
        ->assertPath('/about');
});
```

## Visual Regression Testing

Pest 4 includes built-in screenshot comparison:

```php
test('homepage matches baseline', function () {
    visit('/')
        ->assertScreenshotMatches('homepage');
});

test('dashboard layout is consistent', function () {
    login(User::factory()->create());

    visit('/dashboard')
        ->waitForSelector('.loaded')
        ->assertScreenshotMatches('dashboard', [
            'fullPage' => true,
            'threshold' => 0.1, // 10% tolerance
        ]);
});
```

### Updating Baselines

```bash
# Update all baseline screenshots
./vendor/bin/pest --update-snapshots

# Update specific test
./vendor/bin/pest --filter="homepage matches baseline" --update-snapshots
```

## Mobile and Viewport Testing

```php
test('mobile menu works', function () {
    visit('/')
        ->onMobile()
        ->assertNotVisible('.desktop-nav')
        ->assertVisible('.mobile-menu-button')
        ->click('.mobile-menu-button')
        ->assertVisible('.mobile-nav');
});

test('responsive layout adapts', function () {
    visit('/products')
        ->resize(1920, 1080) // Desktop
        ->assertElementCount('.product-grid > *', 4) // 4 columns

        ->resize(768, 1024) // Tablet
        ->assertElementCount('.product-grid > *', 2) // 2 columns

        ->resize(375, 667) // Mobile
        ->assertElementCount('.product-grid > *', 1); // 1 column
});
```

## Authentication in Browser Tests

```php
test('authenticated user sees dashboard', function () {
    $user = User::factory()->create();

    login($user);

    visit('/dashboard')
        ->assertSee("Welcome, {$user->name}")
        ->assertPath('/dashboard');
});

test('guest is redirected to login', function () {
    visit('/dashboard')
        ->assertPath('/login');
});
```

## JavaScript and Console Testing

```php
test('page has no JavaScript errors', function () {
    visit('/')
        ->assertNoConsoleErrors();
});

test('analytics script loads', function () {
    visit('/')
        ->assertConsoleLogContains('Analytics initialized');
});

test('JavaScript interaction works', function () {
    visit('/interactive-page')
        ->click('#toggle-button')
        ->waitForText('Panel is open')
        ->assertVisible('.panel-content')
        ->evaluate('window.appState.isOpen')
        ->toBe(true);
});
```

## iFrame Testing

```php
test('embedded content loads', function () {
    visit('/embed-page')
        ->withinFrame('#payment-iframe', function () {
            $this->type('#card-number', '4242424242424242')
                 ->type('#expiry', '12/25')
                 ->type('#cvc', '123')
                 ->click('#pay-button');
        })
        ->assertSee('Payment successful');
});
```

## Parallel Browser Testing

Pest 4 supports parallel execution for browser tests:

```bash
# Run browser tests in parallel
./vendor/bin/pest --parallel

# With specific number of processes
./vendor/bin/pest --parallel --processes=4
```

### Test Sharding for CI

Split tests across multiple CI jobs:

```yaml
# GitHub Actions example
jobs:
  browser-tests:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: ./vendor/bin/pest --shard=${{ matrix.shard }}/4
```

## Unit and Feature Tests

### Basic Test Structure

```php
test('can create post', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post('/posts', [
            'title' => 'My Post',
            'content' => 'Content here',
        ]);

    $response->assertRedirect('/posts');
    $this->assertDatabaseHas('posts', ['title' => 'My Post']);
});
```

### Expectations and Assertions

```php
test('user model works correctly', function () {
    $user = User::factory()->create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);

    expect($user)
        ->name->toBe('John Doe')
        ->email->toBe('john@example.com')
        ->email_verified_at->toBeNull()
        ->created_at->toBeInstanceOf(Carbon::class);
});

test('collection operations', function () {
    $items = collect([1, 2, 3, 4, 5]);

    expect($items)
        ->toHaveCount(5)
        ->first()->toBe(1)
        ->last()->toBe(5)
        ->sum()->toBe(15);
});
```

### Higher Order Tests

```php
test('user')
    ->expect(User::class)
    ->toHaveMethod('posts')
    ->toHaveMethod('teams');

it('has correct fillable fields')
    ->expect(fn () => (new Post)->getFillable())
    ->toBe(['title', 'content', 'user_id']);
```

## Architectural Testing

```php
arch('controllers use dependency injection')
    ->expect('App\Http\Controllers')
    ->toUseStrictTypes()
    ->not->toUse(['request', 'session']);

arch('models extend base model')
    ->expect('App\Models')
    ->toExtend('Illuminate\Database\Eloquent\Model');

arch('no debugging statements')
    ->expect(['dd', 'dump', 'ray', 'var_dump'])
    ->not->toBeUsed();

arch('services are final')
    ->expect('App\Services')
    ->toBeFinal();
```

### Preset Rules

```php
arch()->preset()->php();
arch()->preset()->laravel();
arch()->preset()->security();
arch()->preset()->strict();
```

## Mutation Testing

Find untested code paths:

```bash
./vendor/bin/pest --mutate
```

```php
test('price calculation is correct', function () {
    $order = new Order(['quantity' => 3, 'unit_price' => 10]);

    expect($order->total())->toBe(30.0);
});

// Pest will mutate operators: 3 * 10 → 3 + 10, 3 - 10, etc.
// And verify your tests catch the mutations
```

### Coverage Thresholds

```php
// pest.php
pest()
    ->mutate()
    ->min(90); // Require 90% mutation score
```

## Test Organization

### Grouping with Describe

```php
describe('PostController', function () {
    describe('index', function () {
        test('lists published posts', function () {
            $posts = Post::factory()->published()->count(3)->create();

            $this->get('/posts')
                ->assertOk()
                ->assertViewHas('posts');
        });

        test('paginates results', function () {
            Post::factory()->published()->count(30)->create();

            $this->get('/posts')
                ->assertOk()
                ->assertViewHas('posts', fn ($posts) => $posts->count() === 15);
        });
    });

    describe('store', function () {
        test('creates post', function () { });
        test('validates input', function () { });
    });
});
```

### Shared Setup

```php
beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

afterEach(function () {
    // Cleanup
});

test('first test', function () {
    // $this->user is available
});
```

### Datasets

```php
dataset('invalid emails', [
    'missing @' => ['invalidemail.com'],
    'missing domain' => ['test@'],
    'spaces' => ['test @example.com'],
]);

test('rejects invalid email', function (string $email) {
    $response = $this->post('/register', [
        'email' => $email,
        'password' => 'password123',
    ]);

    $response->assertSessionHasErrors('email');
})->with('invalid emails');
```

## Mocking and Faking

```php
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;

test('sends notification to external service', function () {
    Http::fake([
        'api.notification.com/*' => Http::response(['status' => 'sent']),
    ]);

    Queue::fake();

    $user = User::factory()->create();
    $user->notify(new WelcomeNotification());

    Queue::assertPushed(SendNotification::class);
    Http::assertSent(fn ($request) =>
        $request->url() === 'https://api.notification.com/send'
    );
});
```

## Configuration

```php
// pest.php
pest()
    ->extend(Tests\TestCase::class)
    ->in('Feature', 'Unit')
    ->mutate()
    ->parallel();

// Browser test configuration
pest()
    ->browser()
    ->timeout(10000) // 10 seconds
    ->headless()
    ->screenshot('failures');
```

## CI Integration

```yaml
# .github/workflows/tests.yml
name: Tests

on: [push, pull_request]

jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'

      - name: Install dependencies
        run: composer install

      - name: Install browsers
        run: ./vendor/bin/pest browser:install

      - name: Run tests
        run: ./vendor/bin/pest --parallel --coverage
```

## Conclusion

Pest 4 brings browser testing into the same elegant testing experience we love. With Playwright under the hood, parallel execution, and seamless Laravel integration, it's the complete testing solution for modern PHP applications.

---

## Resources

- [Pest Documentation](https://pestphp.com)
- [Pest Browser Testing](https://pestphp.com/docs/browser-testing)
- [Pest v4 Announcement](https://pestphp.com/docs/pest-v4-is-here-now-with-browser-testing)

