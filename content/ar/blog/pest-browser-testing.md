---
title: "اختبارات المتصفح في Pest: اختبارات E2E مع Playwright"
description: اكتب اختبارات شاملة من طرف إلى طرف (E2E) أنيقة مع Pest و Playwright. تعلّم أتمتة المتصفح، والتفاعل مع الصفحات، والتحققات، ولقطات الشاشة، والاختبار المتوازي.
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

# اختبارات المتصفح في Pest: اختبارات E2E مع Playwright

تجلب **Pest Browser Testing** قوة Playwright إلى Pest عبر واجهة برمجية (API) أنيقة وسهلة القراءة. اكتب اختبارات من طرف إلى طرف (end-to-end) تبدو أنيقة مثل اختبارات الوحدة (unit tests) التي تكتبها.

## التثبيت

```bash
composer require pestphp/pest-plugin-browser --dev

# Install Playwright browsers
./vendor/bin/pest --install-browser chromium
```

## الاستخدام الأساسي

```php
use function Pest\Browser\{browse};

it('can visit homepage', function () {
    browse(function ($browser) {
        $browser->visit('/')
            ->assertSee('Welcome');
    });
});
```

## التنقل

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

## التعامل مع النماذج

### حقول النص

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

### القوائم المنسدلة

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

### مربعات الاختيار وأزرار الاختيار

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

### رفع الملفات

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

## التحققات (Assertions)

### التحقق من المحتوى

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

### التحقق من الروابط

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

### التحقق من العناصر

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

### التحقق من القيم

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

## الانتظار

### انتظار العناصر

```php
it('waits for dynamic content', function () {
    browse(function ($browser) {
        $browser->visit('/dashboard')
            ->waitFor('.stats-loaded')
            ->assertSee('Total Users: 1,234');
    });
});
```

### انتظار النص

```php
it('waits for text to appear', function () {
    browse(function ($browser) {
        $browser->visit('/processing')
            ->waitForText('Processing complete')
            ->assertSee('Download your file');
    });
});
```

### الانتظار بمهلة محددة

```php
it('waits with custom timeout', function () {
    browse(function ($browser) {
        $browser->visit('/slow-page')
            ->waitFor('.content', 10) // 10 seconds
            ->assertSee('Loaded');
    });
});
```

### انتظار شرط في JavaScript

```php
it('waits for JavaScript condition', function () {
    browse(function ($browser) {
        $browser->visit('/app')
            ->waitUntil('window.appReady === true')
            ->assertSee('Application Ready');
    });
});
```

## تنفيذ JavaScript

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

## المصادقة

### دالة مساعدة لتسجيل الدخول

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

### تسجيل الدخول يدويًا

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

## لقطات الشاشة

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

## اختبار التصميم المتجاوب

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

## عدة متصفحات في وقت واحد

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

## كائنات الصفحات (Page Objects)

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

## الاختبار المتوازي

```bash
# Run browser tests in parallel
./vendor/bin/pest --parallel --processes=4
```

```php
// Configure in pest.php
uses()->group('browser')->in('tests/Browser');
```

## الإعداد

```php
// tests/Pest.php
uses()
    ->beforeEach(function () {
        // Reset database before each test
        $this->artisan('migrate:fresh');
    })
    ->in('tests/Browser');
```

## أفضل الممارسات

### 1. استخدم سمات data لتحديد العناصر

```html
<button data-testid="submit-btn">Submit</button>
```

```php
$browser->click('[data-testid="submit-btn"]');
```

### 2. انتظر بدل التوقف لمدة ثابتة

```php
// Good
$browser->waitFor('.loaded');

// Avoid
$browser->pause(2000);
```

### 3. اجعل كل اختبار مستقلًا عن غيره

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

## الخلاصة

تجمع Pest Browser Testing بين صياغة Pest الأنيقة وقوة الأتمتة في Playwright. اكتب اختبارات E2E تُقرأ بسهولة اختبارات الوحدة، وتعتمد عليها بقدر ما تعتمد على أتمتة Playwright للمتصفح.

---

## مصادر

- [Pest Browser Testing](https://pestphp.com/docs/browser-testing)
- [توثيق Playwright](https://playwright.dev)
