---
title: "Testing Laravel With Pest 4: Browser Tests, Mutation Testing and Architecture Rules"
description: Testing Laravel apps with Pest 4. Feature tests as the base, Playwright-backed browser tests for the flows that need a real browser, mutation testing to check the tests themselves, and arch() presets to keep the codebase in shape.
tags:
  - Laravel
  - Testing
  - Pest
  - Browser Testing
  - Mutation Testing
image: /images/blog/pest-4-testing/cover.jpg
banner: /images/blog/pest-4-testing/cover.jpg
createdAt: 2025-04-01T10:00:00.000Z
updatedAt: 2026-10-17T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

## Testing Laravel With Pest 4

A green test suite tells you the tests passed. It does not tell you the tests would fail if the
code broke, that the page works in a real browser, or that someone did not leave a `dd()` in a
controller. Pest 4 has a tool for each of those gaps, and all three sit on top of ordinary
feature tests.

This post covers how they fit together in a Laravel 12 app: what each layer catches, what it
costs to run, and where to stop.

### Feature tests are still the base

Most tests in a Laravel app should be HTTP and Livewire feature tests. They boot the app, hit a route or a
component, and check the database. They are fast and they catch most regressions.

```php
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;

it('lets a customer cancel a pending order', function () {
    $user = User::factory()->create();
    $order = Order::factory()->for($user)->pending()->create();

    $this->actingAs($user)
        ->post(route('orders.cancel', $order))
        ->assertRedirect(route('orders.index'));

    expect($order->fresh()->status)->toBe(OrderStatus::Cancelled);
});
```

Two habits keep these useful. Assert on the outcome (the database row, the dispatched job), not
on implementation details. And keep `Model::preventLazyLoading()` enabled outside production, so
an N+1 in the code under test fails the test instead of passing quietly.

Run the suite in parallel. It is the cheapest speed-up there is:

```bash
./vendor/bin/pest --parallel
```

### Browser tests for what needs a browser

Feature tests never run JavaScript. If a flow depends on Alpine, a Livewire interaction, a modal
or a client-side validation message, a feature test can pass while the page is broken. Pest 4's
[browser plugin](https://pestphp.com/docs/browser-testing) runs those flows in a real browser
through Playwright.

```bash
composer require pestphp/pest-plugin-browser --dev
npm install playwright@latest
npx playwright install
```

A browser test reads like any other Pest test. `visit()` is a top-level function that returns a
page you chain actions and assertions on:

```php
it('signs a user in', function () {
    User::factory()->create([
        'email' => 'nuno@laravel.com',
        'password' => 'password',
    ]);

    visit('/login')
        ->fill('email', 'nuno@laravel.com')
        ->fill('password', 'password')
        ->press('Log in')
        ->assertSee('Dashboard')
        ->assertNoJavaScriptErrors();
});
```

The test shares the app and the database with the browser, so factories and `RefreshDatabase`
work the same way they do in feature tests. Other useful calls:

- `click('Save')` and `type('email', '...')` for interaction.
- `visit('/')->on()->mobile()` to run the same flow at a phone viewport.
- `visit(['/', '/about'])` with `assertNoSmoke()`, which checks there are no console logs or
  JavaScript errors on any of them. That one line is a cheap smoke test for every public page.
- `screenshot()`, which names the file after the test when you do not pass one.

When a test fails and the reason is not obvious, two flags help: `--headed` opens a visible browser, and
`--debug` pauses at the end of the failing test so you can look at the page.

Browser tests are slower than feature tests and more sensitive to markup changes, so keep them
to the flows where JavaScript is the point: sign-in, checkout, anything with drag and drop, and a
smoke test over the main pages. Business rules stay in feature tests.

### Mutation testing checks the tests

Coverage tells you a line ran during a test. It does not tell you a test would notice if that
line were wrong. Mutation testing answers the second question: Pest changes your code in small
ways (flips a `>` to `>=`, returns a different value, removes a call), runs the tests, and reports
every change that no test caught.

You tell Pest which code a test file targets with `covers()` or `mutates()` at the top of the
file. For mutation testing they behave the same; `covers()` also filters the coverage report.

```php
use App\Actions\CalculateOrderTotal;

mutates(CalculateOrderTotal::class);

it('applies the discount before tax', function () {
    // ...
});
```

Then run with `--mutate`, ideally in parallel:

```bash
./vendor/bin/pest --mutate --parallel
```

The output lists surviving mutations with a line number and a diff:

```text
UNTESTED  app/Http/TodoController.php > Line 44: ReturnValue - ID: 76d17ad63bb7c307
```

Each one is either a missing assertion or dead code. Both are worth knowing about. To enforce a
floor in CI, add `--min`:

```bash
./vendor/bin/pest --mutate --min=40
```

A score below the threshold fails the run. Mutation testing needs a coverage driver (Xdebug 3+ or
PCOV), and it is slow, because it runs the tests once per mutation. Run it on the classes where
a silent bug costs money, like pricing, permissions and scheduling rules, not on the whole app.
`--covered-only` restricts mutations to lines your tests already execute, and
`// @pest-mutate-ignore` skips a line you have decided not to care about.

### Architecture tests keep the shape

Some rules are not about behaviour: no debug helpers in `app/`, models extend `Model`, controllers
end in `Controller`. [Architecture tests](https://pestphp.com/docs/arch-testing) turn those
conventions into failing tests.

The presets cover the common ground:

```php
arch()->preset()->php();
arch()->preset()->security();
arch()->preset()->laravel();
```

`php` bans `die`, `var_dump` and similar. `security` flags things like `eval` and `md5`. `laravel`
checks Laravel's conventions. There is also `strict` (strict types and final classes) and
`relaxed`, its opposite. A sensible start is `php`, `security` and `laravel`, adding `strict` only on
packages you control end to end, since it fights with code that must be extended.

Then add the project-specific rules:

```php
arch()
    ->expect('App')
    ->toUseStrictTypes()
    ->not->toUse(['die', 'dd', 'dump']);

arch()
    ->expect('App\Models')
    ->toExtend('Illuminate\Database\Eloquent\Model');

arch()
    ->expect('App\Http\Controllers')
    ->toHaveSuffix('Controller');
```

When a rule has a legitimate exception, use `->ignoring()` rather than deleting the rule.

These tests run in milliseconds, so they belong in every run.

### Putting it together

A workable split: run feature and arch tests locally on every change with `--parallel`. CI runs the full suite,
browser tests included. Mutation testing runs on the critical classes with a `--min` threshold,
so a pull request that adds code without tests that would catch a mistake in it fails review on
its own. Each layer answers a different question, and none of them replaces the feature tests
underneath.
