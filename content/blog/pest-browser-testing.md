---
title: "Pest Browser Testing: E2E Tests with Playwright"
description: Write elegant end-to-end tests with Pest and Playwright. Learn browser automation, page interactions, assertions, screenshots, and parallel testing.
tags:
  - Pest
  - Testing
  - Playwright
  - E2E
noImage: true
createdAt: 2025-04-25T10:00:00.000Z
updatedAt: 2025-04-25T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Pest Browser Testing: E2E Tests with Playwright

**Pest Browser Testing** brings Playwright's power to Pest with a beautiful, expressive API. Write end-to-end tests that look as elegant as your unit tests.

## Installation

```bash
composer require pestphp/pest-plugin-browser --dev

# Install Playwright browsers
./vendor/bin/pest --install-browser chromium
```

## Basic Usage

```php
use function Pest\Browser\{browse};

it('can visit homepage', function () {
    browse(function ($browser) {
        $browser->visit('/')
            ->assertSee('Welcome');
    });
});
```

## Navigation

```php
it('navigates between pages', function () {
    browse(function ($browser) {
        $browser->visit('/')
            ->clickLink('About')
            ->assertUrlIs('/about')
            ->assertSee('About Us');
    });
});

it('uses back and forward', function () {
    browse(function ($browser) {
        $browser->visit('/')
            ->visit('/about')
            ->back()
            ->assertUrlIs('/')
            ->forward()
            ->assertUrlIs('/about');
    });
});
```

## Interacting with Forms

### Text Inputs

```php
it('fills out contact form', function () {
    browse(function ($browser) {
        $browser->visit('/contact')
            ->type('name', 'John Doe')
            ->type('email', 'john@example.com')
            ->type('message', 'Hello, this is a test message.')
            ->press('Send Message')
            ->assertSee('Thank you for your message');
    });
});
```

### Select Dropdowns

```php
it('selects options', function () {
    browse(function ($browser) {
        $browser->visit('/form')
            ->select('country', 'us')
            ->select('state', 'california')
            ->assertSelected('country', 'us');
    });
});
```

### Checkboxes and Radios

```php
it('handles checkboxes and radios', function () {
    browse(function ($browser) {
        $browser->visit('/preferences')
            // Checkboxes
            ->check('newsletter')
            ->check('notifications')
            ->uncheck('marketing')
            // Radios
            ->radio('theme', 'dark')
            ->press('Save')
            ->assertChecked('newsletter')
            ->assertNotChecked('marketing');
    });
});
```

### File Uploads

```php
it('uploads a file', function () {
    browse(function ($browser) {
        $browser->visit('/upload')
            ->attach('document', __DIR__ . '/fixtures/test.pdf')
            ->press('Upload')
            ->assertSee('File uploaded successfully');
    });
});
```

## Assertions

### Content Assertions

```php
it('asserts page content', function () {
    browse(function ($browser) {
        $browser->visit('/products')
            ->assertSee('Our Products')
            ->assertDontSee('No products found')
            ->assertSeeIn('.product-list', 'Widget')
            ->assertSourceHas('<meta name="description"');
    });
});
```

### URL Assertions

```php
it('asserts URLs', function () {
    browse(function ($browser) {
        $browser->visit('/products/123')
            ->assertUrlIs('/products/123')
            ->assertPathIs('/products/123')
            ->assertPathBeginsWith('/products')
            ->assertQueryStringHas('sort')
            ->assertFragmentIs('details');
    });
});
```

### Element Assertions

```php
it('asserts elements', function () {
    browse(function ($browser) {
        $browser->visit('/dashboard')
            ->assertPresent('.user-avatar')
            ->assertMissing('.guest-banner')
            ->assertVisible('.notifications')
            ->assertEnabled('button[type="submit"]')
            ->assertDisabled('button.loading');
    });
});
```

### Value Assertions

```php
it('asserts form values', function () {
    browse(function ($browser) {
        $browser->visit('/profile')
            ->assertValue('input[name="email"]', 'john@example.com')
            ->assertChecked('input[name="active"]')
            ->assertSelected('select[name="role"]', 'admin');
    });
});
```

## Waiting

### Wait for Elements

```php
it('waits for dynamic content', function () {
    browse(function ($browser) {
        $browser->visit('/dashboard')
            ->waitFor('.stats-loaded')
            ->assertSee('Total Users: 1,234');
    });
});
```

### Wait for Text

```php
it('waits for text to appear', function () {
    browse(function ($browser) {
        $browser->visit('/processing')
            ->waitForText('Processing complete')
            ->assertSee('Download your file');
    });
});
```

### Wait with Timeout

```php
it('waits with custom timeout', function () {
    browse(function ($browser) {
        $browser->visit('/slow-page')
            ->waitFor('.content', 10) // 10 seconds
            ->assertSee('Loaded');
    });
});
```

### Wait for JavaScript

```php
it('waits for JavaScript condition', function () {
    browse(function ($browser) {
        $browser->visit('/app')
            ->waitUntil('window.appReady === true')
            ->assertSee('Application Ready');
    });
});
```

## JavaScript Execution

```php
it('executes JavaScript', function () {
    browse(function ($browser) {
        $browser->visit('/app')
            ->script('window.scrollTo(0, document.body.scrollHeight)')
            ->waitFor('.footer')
            ->assertVisible('.footer');
    });
});

it('gets JavaScript values', function () {
    browse(function ($browser) {
        $browser->visit('/app');

        $title = $browser->script('return document.title');
        expect($title)->toBe('My App');
    });
});
```

## Authentication

### Login Helper

```php
it('tests authenticated pages', function () {
    $user = User::factory()->create();

    browse(function ($browser) use ($user) {
        $browser->loginAs($user)
            ->visit('/dashboard')
            ->assertSee('Welcome back');
    });
});
```

### Manual Login

```php
it('tests login flow', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password'),
    ]);

    browse(function ($browser) use ($user) {
        $browser->visit('/login')
            ->type('email', $user->email)
            ->type('password', 'password')
            ->press('Login')
            ->assertPathIs('/dashboard')
            ->assertAuthenticated();
    });
});
```

## Screenshots

```php
it('captures screenshots', function () {
    browse(function ($browser) {
        $browser->visit('/dashboard')
            ->screenshot('dashboard');
    });
});

it('captures on failure', function () {
    browse(function ($browser) {
        $browser->visit('/checkout')
            ->type('card', '4242424242424242')
            ->press('Pay')
            // Screenshot captured automatically on failure
            ->assertSee('Payment successful');
    });
});
```

## Responsive Testing

```php
it('tests mobile view', function () {
    browse(function ($browser) {
        $browser->resize(375, 812) // iPhone X
            ->visit('/')
            ->assertVisible('.mobile-menu-button')
            ->assertMissing('.desktop-nav');
    });
});

it('tests tablet view', function () {
    browse(function ($browser) {
        $browser->resize(768, 1024) // iPad
            ->visit('/')
            ->assertVisible('.tablet-layout');
    });
});
```

## Multiple Browsers

```php
it('tests real-time collaboration', function () {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    browse(function ($browserA, $browserB) use ($userA, $userB) {
        // User A creates a document
        $browserA->loginAs($userA)
            ->visit('/documents/new')
            ->type('title', 'Shared Doc')
            ->press('Create');

        // User B joins
        $browserB->loginAs($userB)
            ->visit('/documents/1')
            ->assertSee('Shared Doc');

        // User A types
        $browserA->type('content', 'Hello from A');

        // User B sees it in real-time
        $browserB->waitForText('Hello from A')
            ->assertSee('Hello from A');
    });
});
```

## Page Objects

```php
// tests/Browser/Pages/LoginPage.php
class LoginPage
{
    public function url(): string
    {
        return '/login';
    }

    public function login($browser, string $email, string $password): void
    {
        $browser->type('email', $email)
            ->type('password', $password)
            ->press('Login');
    }
}

// Usage
it('uses page objects', function () {
    $page = new LoginPage();

    browse(function ($browser) use ($page) {
        $browser->visit($page->url());
        $page->login($browser, 'john@example.com', 'password');

        $browser->assertPathIs('/dashboard');
    });
});
```

## Parallel Testing

```bash
# Run browser tests in parallel
./vendor/bin/pest --parallel --processes=4
```

```php
// Configure in pest.php
uses()->group('browser')->in('tests/Browser');
```

## Configuration

```php
// tests/Pest.php
uses()
    ->beforeEach(function () {
        // Reset database before each test
        $this->artisan('migrate:fresh');
    })
    ->in('tests/Browser');
```

## Best Practices

### 1. Use Data Attributes for Selectors

```html
<button data-testid="submit-btn">Submit</button>
```

```php
$browser->click('[data-testid="submit-btn"]');
```

### 2. Wait Instead of Sleep

```php
// Good
$browser->waitFor('.loaded');

// Avoid
$browser->pause(2000);
```

### 3. Keep Tests Independent

```php
it('test A', function () {
    // Creates own data
    $user = User::factory()->create();
    // ...
});

it('test B', function () {
    // Doesn't depend on test A
    $user = User::factory()->create();
    // ...
});
```

## Conclusion

Pest Browser Testing combines Pest's elegant syntax with Playwright's powerful automation. Write E2E tests that are as readable as your unit tests and as reliable as Playwright's browser automation.

---

## Resources

- [Pest Browser Testing](https://pestphp.com/docs/browser-testing)
- [Playwright Documentation](https://playwright.dev)

