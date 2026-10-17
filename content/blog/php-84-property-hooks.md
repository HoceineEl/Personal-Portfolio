---
title: "PHP 8.4 Property Hooks and Asymmetric Visibility in a Laravel Codebase"
description: How property hooks and private(set) change DTOs and value objects in Laravel apps, the rules that catch people out, and why you should not try to use them on Eloquent model attributes.
tags:
  - PHP
  - PHP 8.4
  - Laravel
  - Backend
image: /images/blog/php-84-property-hooks/cover.jpg
banner: /images/blog/php-84-property-hooks/cover.jpg
createdAt: 2025-05-15T10:00:00.000Z
updatedAt: 2026-10-17T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

## PHP 8.4 Property Hooks and Asymmetric Visibility in a Laravel Codebase

For years the choice for a PHP class that holds data was between public properties, which anyone
can overwrite, and private properties with a `getX()`/`setX()` pair for each one. `readonly` in
8.1 helped, but it is all or nothing: once set, nobody can change it, including the class itself.

PHP 8.4 added two features that fill the gap. [Property hooks](https://www.php.net/manual/en/language.oop5.property-hooks.php)
let a property run code when it is read or written. [Asymmetric visibility](https://www.php.net/manual/en/language.oop5.visibility.php)
lets a property be public to read and private to write. Together they remove most of the getter
and setter boilerplate that DTOs and value objects used to carry.

This post is about where they fit in a Laravel app, and the one place they do not: Eloquent
models.

### The syntax in two minutes

A hooked property replaces the trailing semicolon with a block:

```php
class User
{
    public string $email {
        set => strtolower(trim($value));
    }
}

$user = new User();
$user->email = '  Hoceine@Example.COM ';

echo $user->email; // hoceine@example.com
```

The short `set =>` form assigns the expression's result to the property. The long form gives you
a body, and you assign to `$this->email` yourself:

```php
public string $email {
    set {
        if (! filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email: {$value}");
        }

        $this->email = strtolower($value);
    }
}
```

A `get` hook works the same way. If none of the hooks refer to the property by its own name, the
property is virtual: it has no storage, and it behaves like a computed value.

```php
class Rectangle
{
    public function __construct(
        public int $width,
        public int $height,
    ) {}

    public int $area {
        get => $this->width * $this->height;
    }
}
```

Writing to `$area` throws an `Error`, because it has no `set` hook.

Asymmetric visibility is a modifier on the property, not a hook:

```php
class Order
{
    public function __construct(
        public private(set) string $status = 'pending',
    ) {}

    public function markPaid(): void
    {
        $this->status = 'paid';
    }
}

$order = new Order();
echo $order->status;      // pending
$order->status = 'paid';  // Error: cannot modify private(set) property
```

### Rules that catch people out

These come straight from the manual, and most of them show up as soon as you convert existing classes:

- Hooks cannot be combined with `readonly`. If you want "set once, then frozen" plus custom
  logic, use `private(set)` and a hook instead.
- A separate set visibility needs a typed property. `public private(set) $status` without a type
  is a compile error.
- The set visibility can be narrower than the read visibility, never wider. `protected public(set)`
  does not parse.
- A `private(set)` property is implicitly `final`. A child class cannot redeclare it.
- The `set` hook's parameter type must be the property type or wider. A `string` property can
  accept `string|Stringable`, but not `array`.
- With constructor promotion, the constructor parameter uses the property's declared type, not the
  wider `set` type. The wider type only works when assigning after construction.
- A backed array property with hooks only supports `&get`, so `$this->items[] = $x` from outside
  will not go through a `set` hook. Replacing the whole array does.

That last one matters for collection-like objects. If you want to guard every addition, expose a
method such as `addItem()` and keep the array `private(set)`.

### DTOs with `private(set)`

Most DTOs are filled once from a request or an API response and then passed around. Before
8.4 the honest options were `readonly` properties or a pile of getters. `readonly` is fine until
the class needs to adjust its own value after construction, for example to normalise it.

With asymmetric visibility the DTO stays a plain object to read, and only the class can write:

```php
namespace App\Data;

use App\Http\Requests\StoreCustomerRequest;

final class CustomerData
{
    public function __construct(
        public private(set) string $name,
        public private(set) string $email,
        public private(set) ?string $phone = null,
    ) {}

    public static function fromRequest(StoreCustomerRequest $request): self
    {
        return new self(
            name: $request->validated('name'),
            email: $request->validated('email'),
            phone: $request->validated('phone'),
        );
    }
}
```

Code that receives a `CustomerData` reads `$data->email` directly. Nobody outside the class can
assign to it. Compared with `readonly`, the class keeps the right to change its own state, which is
the thing `readonly` never allowed.

A good place for hooks in a DTO is normalisation that should happen no matter how the value arrives.
Moved out of the constructor and into the class body, `$phone` looks like this:

```php
public private(set) ?string $phone = null {
    set => $value === null ? null : preg_replace('/\D+/', '', $value);
}
```

The constructor then assigns `$this->phone = $phone`. Every assignment, from there or from anywhere else inside the class, goes through that hook, so there
is no way to end up with a formatted and an unformatted phone number in the same app.

### Value objects with hooks

Value objects are where virtual properties earn their keep. A money object stores minor units and
exposes derived views of them:

```php
namespace App\Support;

use InvalidArgumentException;

final class Money
{
    public function __construct(
        public private(set) int $amount {
            set {
                if ($value < 0) {
                    throw new InvalidArgumentException('Amount cannot be negative.');
                }

                $this->amount = $value;
            }
        },
        public private(set) string $currency = 'USD',
    ) {}

    public float $decimal {
        get => $this->amount / 100;
    }

    public function add(Money $other): self
    {
        if ($other->currency !== $this->currency) {
            throw new InvalidArgumentException('Currency mismatch.');
        }

        return new self($this->amount + $other->amount, $this->currency);
    }
}
```

`$money->decimal` reads like a property, costs no storage, and can never disagree with `$amount`.
The constructor check runs through the hook, so an invalid object cannot be built. And
`private(set)` means the object only changes through methods that return a new instance.

Before 8.4 this class would have had `getAmount()`, `getCurrency()` and `getDecimal()`. The class is
not much shorter now, but the call sites are cleaner: `$total->decimal` instead of
`$total->getDecimal()`.

### Interfaces can require properties

Interfaces can declare properties with the hooks an implementer must support:

```php
interface HasLabel
{
    public string $label { get; }
}

final class PlanData implements HasLabel
{
    public function __construct(
        public private(set) string $name,
        public private(set) int $seats,
    ) {}

    public string $label {
        get => "{$this->name} ({$this->seats} seats)";
    }
}
```

`{ get; }` means "readable". A plain public property satisfies it, and so does a virtual property
with only a `get` hook. Before 8.4 this contract had to be a `getLabel()` method.

### Why not on Eloquent models

This is a common question, and the answer is short: do not put hooks or asymmetric visibility
on properties that map to database columns.

Eloquent stores attributes in an internal `$attributes` array and exposes them through `__get()` and
`__set()`. PHP only calls those magic methods when the property does not exist on the class. The
moment you declare `public string $email { ... }` on a model, it is a real property, and PHP uses
it instead of the magic. `$user->email` now reads your property, not the column. `save()` will not
see what you assigned, and `fill()` and `toArray()` work on `$attributes`, so they will not see it
either. You have two copies of the field that do not know about each other.

Laravel already has a hook mechanism for model attributes:
[accessors and mutators](https://laravel.com/docs/12.x/eloquent-mutators) through
`Attribute::make()`, plus casts. Keep using those:

```php
use Illuminate\Database\Eloquent\Casts\Attribute;

protected function email(): Attribute
{
    return Attribute::make(
        set: fn (string $value) => strtolower(trim($value)),
    );
}
```

Where the two features meet is casting to a value object. A custom cast can turn an `amount`
column into the `Money` class above, and from then on the rest of the app gets hooks and
`private(set)` without the model needing either.

Plain properties on a model that are not columns, like a cached flag on a service object, are a
different story. But on models those are rare, so a simple rule works: hooks in
DTOs, value objects, and services; Eloquent's own tools on models.

### What not to convert

Not every getter needs to become a hook. If reading a value runs a query, calls an API or does
anything slow, leave it as a method. `$order->total` looks free to the reader; `$order->total()`
at least hints that work happens. Hooks hide cost, and a property access that sends an HTTP request
is a bug waiting for someone who loops over it.

There is also little reason to rewrite stable classes just to use new syntax. Changing `getEmail()` to `$email`
changes the public API, and every caller has to move with it. Hooks pay off in new code and when you are
already refactoring a class for another reason.
