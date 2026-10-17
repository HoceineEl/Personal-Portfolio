---
title: "Global Scopes for Multi-Tenant Laravel Apps, and Where They Leak"
description: How to scope tenant data with an Eloquent global scope in Laravel 12, and the places it does not reach, queued jobs, console commands, withoutGlobalScopes, validation rules, raw queries and pivot tables.
tags:
  - Laravel
  - SaaS
  - Multi-tenancy
  - Security
  - Eloquent
image: /images/blog/laravel-global-scopes/cover.jpg
banner: /images/blog/laravel-global-scopes/cover.jpg
createdAt: 2025-08-20T14:00:00.000Z
updatedAt: 2026-10-17T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

## Global Scopes for Multi-Tenant Laravel Apps

In a single-database SaaS every tenant's rows sit in the same tables, separated by a
`tenant_id` column. Every query has to filter on it. Forget once, in one report or one
autocomplete endpoint, and one shop sees another shop's customers.

An Eloquent global scope is the usual answer: add the filter once, on the model, and every
query gets it. It works well, and I use it. But a global scope only covers Eloquent queries
made while the app knows who the current tenant is, and several common code paths fall outside
that. This post covers a setup that works and then the places it leaks.

### Where the current tenant comes from

The first decision matters more than the scope itself. A lot of examples read the tenant
inside the scope with `auth()->user()->tenant_id`. I don't, for two reasons:

- Queued jobs and console commands have no authenticated user, so the scope silently stops
  filtering there.
- If the `User` model is itself tenant-scoped, the scope calls `auth()->user()`, which queries
  `User`, which applies the scope, which calls `auth()->user()`. That loop is a classic.

A safer setup keeps the current tenant in one small object bound as a scoped singleton, set by
middleware for web requests and set explicitly everywhere else:

```php
namespace App\Support;

use App\Models\Tenant;

final class CurrentTenant
{
    private ?Tenant $tenant = null;

    public function set(?Tenant $tenant): void
    {
        $this->tenant = $tenant;
    }

    public function get(): ?Tenant
    {
        return $this->tenant;
    }

    public function id(): ?int
    {
        return $this->tenant?->id;
    }
}
```

```php
// AppServiceProvider::register()
$this->app->scoped(CurrentTenant::class);
```

`scoped` gives one instance per request or per job, and Laravel resets it between jobs on a
long-running worker, so one job's tenant does not bleed into the next.

The middleware resolves the tenant however your app identifies it (subdomain, custom domain,
the user's current team) and sets it:

```php
public function handle(Request $request, Closure $next): Response
{
    $tenant = Tenant::query()->where('domain', $request->getHost())->firstOrFail();

    app(CurrentTenant::class)->set($tenant);

    return $next($request);
}
```

### The scope

`php artisan make:scope TenantScope` puts the class in `app/Models/Scopes`. The scope implements
`Illuminate\Database\Eloquent\Scope` and its one method, `apply`:

```php
namespace App\Models\Scopes;

use App\Support\CurrentTenant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $tenantId = app(CurrentTenant::class)->id();

        if ($tenantId === null) {
            $builder->whereRaw('1 = 0');

            return;
        }

        $builder->where($model->qualifyColumn('tenant_id'), $tenantId);
    }
}
```

Two details. `qualifyColumn` prefixes the table name, so the condition stays unambiguous when
the query joins another tenant table that also has `tenant_id`. And when no tenant is set, the
scope returns nothing instead of everything. Many examples do `if ($tenantId) { ... }` and skip
the filter when there is no tenant, which means the failure mode of "we forgot to set the
tenant" is "show all tenants' data". I would rather get an empty table and a bug report.

### Attaching it to models

Laravel 12 lets you attach a global scope with the `ScopedBy` attribute, from
`Illuminate\Database\Eloquent\Attributes\ScopedBy`. Tenant models also need `tenant_id` filled
on create, so I pair the attribute with a small trait:

```php
namespace App\Models\Concerns;

use App\Models\Tenant;
use App\Support\CurrentTenant;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        static::creating(function ($model): void {
            $model->tenant_id ??= app(CurrentTenant::class)->id()
                ?? throw new \LogicException('Creating '.$model::class.' without a current tenant.');
        });
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
}
```

```php
use App\Models\Concerns\BelongsToTenant;
use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Model;

#[ScopedBy([TenantScope::class])]
class Customer extends Model
{
    use BelongsToTenant;
}
```

You can also register the scope inside the trait's boot method with
`static::addGlobalScope(new TenantScope)`, which saves repeating the attribute. I like the
attribute because it is visible at the top of the model: anyone opening `Customer` sees that
it is tenant-scoped without reading a trait. Both are in the
[Eloquent docs](https://laravel.com/docs/12.x/eloquent#global-scopes).

Route model binding goes through Eloquent, so `/customers/{customer}` with another tenant's ID
returns a 404. That alone closes a lot of IDOR bugs.

### Leak 1: queued jobs and console commands

A job is handled in a worker process. The middleware never ran there, so `CurrentTenant` is
empty and every scoped query in the job returns nothing (with the fail-closed scope) or
everything (with the common fail-open one).

Models passed to the job still come back: when Laravel restores a serialized model it queries
without global scopes. It's the queries the job runs afterwards that need the tenant.

Laravel's [Context](https://laravel.com/docs/12.x/context) is a clean way to carry the tenant
across. Context data is captured when a job is dispatched and hydrated back when the job runs.
Add the tenant ID as hidden context, so it doesn't end up in every log line, and restore it in
a `hydrated` callback:

```php
// In the tenant middleware, after resolving the tenant
Context::addHidden('tenant_id', $tenant->id);
```

```php
// AppServiceProvider::boot()
use Illuminate\Log\Context\Repository;

Context::hydrated(function (Repository $context): void {
    if ($context->hasHidden('tenant_id')) {
        app(CurrentTenant::class)->set(Tenant::find($context->getHidden('tenant_id')));
    }
});
```

The docs ask you to change the repository passed to the callback rather than the `Context`
facade, which is why this reads from `$context`.

Console commands and scheduled tasks have no request at all, so they loop over tenants and set
the tenant explicitly for each one:

```php
Tenant::query()->each(function (Tenant $tenant): void {
    app(CurrentTenant::class)->set($tenant);

    SendOverdueInvoiceReminders::dispatch();
});
```

The dispatch picks up the tenant from the code that set it, as long as the command also adds it
to Context. In practice, put both lines in one `TenantManager::switchTo($tenant)` method so they
can't drift apart.

### Leak 2: withoutGlobalScopes removes more than you think

Admin reports and platform-level jobs legitimately need cross-tenant data. The tempting call
is `withoutGlobalScopes()`, with no arguments. That removes every global scope on the model,
including `SoftDeletes`. A "total customers across all tenants" report written that way counts
deleted customers too.

Remove only the scope you mean to remove:

```php
Customer::withoutGlobalScope(TenantScope::class)->count();
```

Or, if a model has several custom scopes and you want to keep a known set,
`withoutGlobalScopesExcept([SoftDeletingScope::class])`.

Don't call this from a controller directly either. Keep cross-tenant queries in a few named
places, an `Admin` namespace or a dedicated query class, so a grep for `TenantScope::class`
shows every bypass in the app. If you find yourself adding a bypass in a tenant-facing feature
(sharing a document with another workspace, say), model that sharing explicitly with its own
table rather than punching through the scope.

### Leak 3: validation rules don't use Eloquent

`Rule::unique` and `Rule::exists` check the database with the query builder, not through your
model. Global scopes don't apply to them. This one is easy to miss because the rules look
model-aware:

```php
'email' => ['required', 'email', Rule::unique(Customer::class)],
'category_id' => ['required', Rule::exists(Category::class, 'id')],
```

The first rejects an email that exists in any tenant, which is wrong for most apps: two shops
can both have a customer with the same email. The second is worse. It accepts a category ID
from another tenant, and the record gets saved pointing at someone else's data.

Add the tenant condition yourself:

```php
$tenantId = app(CurrentTenant::class)->id();

'email' => [
    'required', 'email',
    Rule::unique(Customer::class)->where('tenant_id', $tenantId)->ignore($this->customer),
],
'category_id' => [
    'required',
    Rule::exists(Category::class, 'id')->where('tenant_id', $tenantId),
],
```

The database should agree with the rule. A unique index on `email` alone fights this
validation; the index has to include the tenant:

```php
$table->unique(['tenant_id', 'email']);
```

Every tenant table also wants an index that starts with `tenant_id`, because every single query
now filters on it. The composite unique index covers that for the `email` lookups; for the
rest, add `$table->index(['tenant_id', 'created_at'])` or whatever your list pages sort by.

### Leak 4: anything that is not an Eloquent query on a scoped model

The scope lives on the model. Anything that does not go through that model's builder skips it:

- `DB::table('customers')` and raw SQL.
- Joins. `Order::query()->join('customers', ...)` scopes `orders`, but the joined `customers`
  rows are not filtered. If the join can only match same-tenant rows through the foreign key,
  that is fine. If it can't, add the condition to the join.
- Pivot tables. In a `belongsToMany`, the related model's scope applies, but the pivot rows
  themselves are not scoped. If the pivot carries tenant-sensitive data, give it a model with
  `using()` and scope that, or make sure both ends are always same-tenant.
- Models that forgot the attribute. This is the most common one. A new `Coupon` model gets
  created, nobody adds `ScopedBy`, and it is global.

The last one is easy to catch with an architecture test. Pest's arch plugin can check that classes use
a trait; for the attribute, loop over models with `tenant_id` and assert the scope is
registered:

```php
use App\Models\Scopes\TenantScope;
use Illuminate\Support\Facades\Schema;

it('scopes every model that has a tenant_id column', function (string $model) {
    $instance = new $model;

    if (! Schema::hasColumn($instance->getTable(), 'tenant_id')) {
        expect(true)->toBeTrue();

        return;
    }

    expect($instance->hasGlobalScope(TenantScope::class))->toBeTrue();
})->with(fn () => collect(glob(app_path('Models/*.php')))
    ->map(fn (string $path) => 'App\\Models\\'.basename($path, '.php'))
    ->all());
```

### Testing isolation directly

Beyond the structural test, keep one behavioral test per sensitive model:

```php
it('does not show another tenant\'s customers', function () {
    $mine = Tenant::factory()->create();
    $theirs = Tenant::factory()->create();

    app(CurrentTenant::class)->set($theirs);
    $foreign = Customer::factory()->create();

    app(CurrentTenant::class)->set($mine);

    expect(Customer::find($foreign->id))->toBeNull();

    $this->actingAs(User::factory()->for($mine)->create())
        ->get(route('customers.show', $foreign))
        ->assertNotFound();
});
```

### When a global scope is not enough

Global scopes are the right tool for the kind of app I build most, one database, shared tables,
many tenants of similar size.

If tenants need hard isolation for contractual reasons, or a single tenant is large enough to
need its own database, a column filter is the wrong layer and you want database-per-tenant.
At that point a package such as [stancl/tenancy](https://tenancyforlaravel.com) handles the
connection switching, and the scope goes away. Short of that, a fail-closed scope, a tenant that
follows jobs through Context, and tenant-aware validation rules cover the places where
data usually leaks.
