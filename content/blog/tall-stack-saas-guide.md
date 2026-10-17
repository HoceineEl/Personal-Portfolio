---
title: "Building a SaaS on Laravel, Livewire and Filament: What I Learned from FilamentCraft and Dukanos"
description: Tenancy, billing, dashboards and testing for a SaaS on the TALL stack with Filament 4, based on what I ran into building FilamentCraft and the Dukanos shop platform.
tags:
  - TALL Stack
  - Laravel
  - Livewire
  - SaaS
  - FilamentPHP
image: /images/blog/tall-saas/cover.jpg
banner: /images/blog/tall-saas/cover.jpg
createdAt: 2025-07-15T10:00:00.000Z
updatedAt: 2026-10-17T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

## Building a SaaS on Laravel, Livewire and Filament

Most "how to build a SaaS" posts are a list of packages. The packages are the easy part. What
decides whether a SaaS on this stack stays pleasant to work on is a handful of design choices made
early: what a tenant is, where tenant scoping is enforced, how billing state reaches the UI, and
what you test.

I have made those choices twice recently. [FilamentCraft](/projects/filamentcraft) is a commercial
Filament plugin that other people install into their own multi-tenant apps, so it has to work with
whatever tenancy they chose. [Dukanos](/projects/dukanos) is my own SaaS for shops, one platform with
a separate store per shop, with Filament for the dashboard and the point of sale, and FilamentCraft
for the storefronts. This post is what I would tell myself before starting either.

### Why this stack for a solo or small team

The argument for Laravel, Livewire and Filament is not speed of the first demo. It is that one
person can own the whole thing. The dashboard, the billing pages, the admin tools and the public
pages are PHP and Blade, tested with the same test runner, deployed as one app. There is no API
layer between a frontend and a backend to version, because there is no separate frontend.

Filament covers most of what a SaaS back office needs: CRUD resources, tables with filters, forms,
notifications, and multi-tenancy at the panel level. Livewire handles the screens Filament does not
fit, and Alpine handles the small client-side bits. Where that stops working is heavy client-side
interaction. The FilamentCraft editor canvas is TypeScript for that reason, talking to Livewire
through an iframe bridge. I wrote about that part in
[the live preview post](/blog/livewire-iframe-live-preview).

### Decide what a tenant is

Before any code, decide what owns data. In Dukanos it is the shop. In a B2B tool it is usually a
team or a company. The tenant is almost never the user, because sooner or later a customer wants a
second person on the account.

Filament's [tenancy](https://filamentphp.com/docs/4.x/users/tenancy) is configured on the panel:

```php
use App\Filament\Pages\Tenancy\EditTeamProfile;
use App\Filament\Pages\Tenancy\RegisterTeam;
use App\Models\Team;

public function panel(Panel $panel): Panel
{
    return $panel
        ->tenant(Team::class, slugAttribute: 'slug')
        ->tenantRegistration(RegisterTeam::class)
        ->tenantProfile(EditTeamProfile::class);
}
```

The user model implements `HasTenants`, which tells Filament which tenants a user belongs to and
whether they may open a given one:

```php
use Filament\Models\Contracts\HasTenants;
use Filament\Panel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class User extends Authenticatable implements HasTenants
{
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class);
    }

    public function getTenants(Panel $panel): Collection
    {
        return $this->teams;
    }

    public function canAccessTenant(Model $tenant): bool
    {
        return $this->teams()->whereKey($tenant)->exists();
    }
}
```

`canAccessTenant()` is the line that stops someone from typing another team's slug into the URL.
Do not leave it returning `true` while prototyping and forget it.

### Know where Filament's scoping stops

This is the part that bites. Filament scopes resource queries to the current tenant, and it is
easy to assume that means the whole app is tenant-safe. The docs are explicit that it is not:

- Queries made outside the tenant-aware panel, or before the tenant is identified, need their own
  constraints. That covers queued jobs, scheduled commands, public storefront routes and API
  endpoints.
- The protection does not extend to records passed into relation managers, widgets, or modal table
  selects.
- Tenant scoping is not record authorization. Policies still matter.

Tenant middleware has a trap of its own. By default it runs on the first page load, not on the
Livewire requests that follow. If your middleware sets something every request depends on, like a
locale or a database connection, register it as persistent:

```php
$panel->tenantMiddleware([
    ApplyTenantSettings::class,
], isPersistent: true);
```

In Dukanos the storefront is a public site on the shop's own domain, so it never goes through the
panel at all. The shop has to be resolved from the request, and every query that serves a page has to be
scoped by that, with no panel doing it for you. "Is this scoped?" is worth asking as a review question on every query
outside the panel.

### Make features tenant-agnostic when you can

FilamentCraft taught me something that also applies inside a single app. Because it ships into other
people's projects, it cannot assume a tenancy package. Sites belong to any owner model, so the same
plugin runs under stancl/tenancy, spatie/multitenancy, Filament's own tenancy, or a single-site
app.

The general shape of that, inside your own app, is a polymorphic owner instead of a hard `team_id`:

```php
Schema::create('sites', function (Blueprint $table) {
    $table->id();
    $table->morphs('owner');
    $table->string('name');
    $table->timestamps();
});
```

Inside one SaaS this is useful for any module you might reuse or move: content, files, settings.
The module asks "who owns this?" and does not care whether the answer is a team, a shop or a user.
The cost is that you cannot put a foreign key constraint on a morph column, so cleanup on delete is
your job.

### Billing state belongs to the tenant

Put the billing trait on the tenant model, not the user. [Cashier](https://laravel.com/docs/12.x/billing)
supports any billable model, and if the team pays, the team should be the customer:

```php
use Laravel\Cashier\Billable;

class Team extends Model
{
    use Billable;
}
```

For starting a subscription, Stripe Checkout is a good default over building a card form, because it keeps
card handling and tax collection off your pages:

```php
public function subscribe(string $price)
{
    return Filament::getTenant()
        ->newSubscription('default', $price)
        ->checkout([
            'success_url' => route('billing.success'),
            'cancel_url' => route('billing'),
        ]);
}
```

Filament can also gate the whole panel on an active subscription with
`->requiresTenantSubscription()` and a billing provider. That is a good fit when there is no free
tier. When there is one, such as a free trial, gating individual features fits better.

For FilamentCraft itself I did not use a subscription library at all. It is sold through Paddle as
merchant of record, which handles sales tax across countries, and paid customers get access to a
self-hosted private Composer registry. Selling a package is a different problem from running a SaaS,
and treating it like one would have added a lot of code for nothing.

### Dashboards with Livewire 4 islands

A SaaS dashboard is a page of independent cards, and the slow ones should not hold up the fast
ones. Livewire 4 added [islands](https://livewire.laravel.com/docs/islands): regions of a component
that render and refresh on their own.

```blade
<div>
    <livewire:dashboard.quick-stats />

    @island(name: 'revenue', lazy: true)
        @include('dashboard.revenue-chart', ['data' => $this->revenue])
    @endisland

    @island(defer: true)
        <div wire:poll.30s>
            @foreach ($this->recentOrders as $order)
                @include('dashboard.order-row', ['order' => $order])
            @endforeach
        </div>
    @endisland
</div>
```

`lazy: true` waits until the island is visible, and `defer: true` loads it right after the page.
There is no polling option on `@island` itself; you put `wire:poll` on an element inside the
island, and only that island refreshes. A button elsewhere can refresh a named island with
`wire:click="$refresh" wire:island="revenue"`.

An earlier version of this post showed an `@island(poll: '30s')` syntax. That does not exist, and
copying it would not work.

Inside a Filament panel, Filament widgets are the natural first choice, since they come with lazy
loading and polling of their own. Islands are for custom Livewire pages outside the widget grid.

### Test the boundaries, not the framework

FilamentCraft has over 1,700 Pest tests gating releases, alongside PHPStan at level 6 and Pint. Most
of those tests are about its own behaviour, but the ones I would write first in any SaaS are the
boundary tests:

```php
it('does not show another team\'s orders', function () {
    $mine = Team::factory()->create();
    $theirs = Team::factory()->create();
    $order = Order::factory()->for($theirs)->create();

    $user = User::factory()->hasAttached($mine)->create();

    $this->actingAs($user)
        ->get(OrderResource::getUrl('index', tenant: $mine))
        ->assertDontSee($order->number);
});
```

Write one of these for every place data leaves the panel: exports, jobs, notifications, public
routes. They are boring, and they are the tests that catch the bug that costs you a customer.

### What I would do the same way again

One app, Filament for every internal screen, a tenant model decided on day one, billing on the
tenant, and scoping treated as something to review on every query outside the panel. The rest,
including the choice between Stripe and Paddle or between Filament's tenancy and a package, can
change later without a rewrite.


---

## The page-building problem every SaaS eventually hits

Somewhere after launch, a SaaS built on this stack needs marketing pages, and often per-customer pages too. Hand-coding each one turns your team into a page factory.

**[FilamentCraft](https://filamentcraft.dev?ref=blog-tall-saas)** is the commercial plugin I built for that: a drag-and-drop website builder inside your Filament panel, with sites scoped to any owner model so each tenant can build and publish their own. Server-rendered output, so the SEO story stays intact. It powers the shop storefronts on [Dukanos](/projects/dukanos) and the academy sites on [Mediano](/projects/mediano).

[Open the demo](https://demo.filamentcraft.dev/launch/admin?ref=blog-tall-saas) — no signup, you land straight in the editor.
