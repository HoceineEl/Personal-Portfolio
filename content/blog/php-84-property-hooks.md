---
title: "PHP 8.4 Property Hooks: Getters and Setters Reimagined"
description: Master PHP 8.4 property hooks. Learn get/set hooks, asymmetric visibility, virtual properties, and how they replace traditional getters and setters.
tags:
  - PHP
  - PHP 8.4
  - Backend
noImage: true
createdAt: 2025-05-15T10:00:00.000Z
updatedAt: 2025-05-15T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# PHP 8.4 Property Hooks: Getters and Setters Reimagined

**PHP 8.4** introduces property hooks, a game-changing feature that lets you define get and set logic directly on properties. Say goodbye to boilerplate getter and setter methods.

## The Problem with Traditional Getters/Setters

```php
// Before PHP 8.4: Verbose and boilerplate-heavy
class User
{
    private string $firstName;
    private string $lastName;

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function setFirstName(string $value): void
    {
        $this->firstName = trim($value);
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function setLastName(string $value): void
    {
        $this->lastName = trim($value);
    }

    public function getFullName(): string
    {
        return $this->firstName . ' ' . $this->lastName;
    }
}
```

## Property Hooks Syntax

```php
// PHP 8.4: Clean and expressive
class User
{
    public string $firstName {
        set => trim($value);
    }

    public string $lastName {
        set => trim($value);
    }

    public string $fullName {
        get => $this->firstName . ' ' . $this->lastName;
    }
}

$user = new User();
$user->firstName = '  John  ';  // Automatically trimmed
$user->lastName = '  Doe  ';    // Automatically trimmed
echo $user->fullName;            // "John Doe"
```

## Get Hooks

### Basic Get Hook

```php
class Product
{
    public float $price;
    public float $taxRate = 0.20;

    public float $priceWithTax {
        get => $this->price * (1 + $this->taxRate);
    }
}

$product = new Product();
$product->price = 100;
echo $product->priceWithTax; // 120
```

### Multi-Line Get Hook

```php
class Order
{
    public array $items = [];

    public float $total {
        get {
            $sum = 0;
            foreach ($this->items as $item) {
                $sum += $item['price'] * $item['quantity'];
            }
            return $sum;
        }
    }
}
```

## Set Hooks

### Basic Set Hook

```php
class Email
{
    public string $address {
        set => strtolower(trim($value));
    }
}

$email = new Email();
$email->address = '  JOHN@EXAMPLE.COM  ';
echo $email->address; // "john@example.com"
```

### Set Hook with Validation

```php
class User
{
    public int $age {
        set {
            if ($value < 0 || $value > 150) {
                throw new InvalidArgumentException('Age must be between 0 and 150');
            }
            $this->age = $value;
        }
    }
}

$user = new User();
$user->age = 25;  // Works
$user->age = 200; // Throws exception
```

### Set Hook with Type Coercion

```php
class Config
{
    public string $value {
        set(string|int|bool $value) {
            $this->value = match(true) {
                is_bool($value) => $value ? 'true' : 'false',
                is_int($value) => (string) $value,
                default => $value,
            };
        }
    }
}

$config = new Config();
$config->value = true;  // Stored as "true"
$config->value = 42;    // Stored as "42"
```

## Combined Get and Set Hooks

```php
class Temperature
{
    private float $celsius;

    public float $fahrenheit {
        get => ($this->celsius * 9/5) + 32;
        set {
            $this->celsius = ($value - 32) * 5/9;
        }
    }

    public float $celsius {
        get => $this->celsius;
        set {
            if ($value < -273.15) {
                throw new InvalidArgumentException('Temperature below absolute zero');
            }
            $this->celsius = $value;
        }
    }
}

$temp = new Temperature();
$temp->celsius = 0;
echo $temp->fahrenheit; // 32

$temp->fahrenheit = 212;
echo $temp->celsius;    // 100
```

## Virtual Properties

Properties with only a get hook are virtual—they compute values without storing data:

```php
class Rectangle
{
    public function __construct(
        public float $width,
        public float $height,
    ) {}

    // Virtual property - no backing storage
    public float $area {
        get => $this->width * $this->height;
    }

    public float $perimeter {
        get => 2 * ($this->width + $this->height);
    }

    public bool $isSquare {
        get => $this->width === $this->height;
    }
}

$rect = new Rectangle(10, 20);
echo $rect->area;      // 200
echo $rect->perimeter; // 60
echo $rect->isSquare;  // false
```

## Asymmetric Visibility

PHP 8.4 also introduces asymmetric visibility:

```php
class User
{
    // Public read, private write
    public private(set) string $id;

    // Public read, protected write
    public protected(set) string $name;

    public function __construct(string $name)
    {
        $this->id = uniqid();
        $this->name = $name;
    }
}

$user = new User('John');
echo $user->id;   // Works (public read)
$user->id = '123'; // Error! (private set)
```

### Combined with Hooks

```php
class Post
{
    public private(set) string $slug {
        set => Str::slug($value);
    }

    public function __construct(
        public string $title,
    ) {
        $this->slug = $title;
    }
}

$post = new Post('Hello World');
echo $post->slug;       // "hello-world"
$post->slug = 'test';   // Error! Cannot set from outside
```

## Constructor Property Promotion with Hooks

```php
class Product
{
    public function __construct(
        public string $name,
        public float $price {
            set {
                if ($value < 0) {
                    throw new InvalidArgumentException('Price cannot be negative');
                }
                $this->price = $value;
            }
        },
    ) {}
}
```

## Interface Compatibility

```php
interface HasFullName
{
    public string $fullName { get; }
}

class User implements HasFullName
{
    public function __construct(
        public string $firstName,
        public string $lastName,
    ) {}

    public string $fullName {
        get => "$this->firstName $this->lastName";
    }
}
```

## Abstract Properties

```php
abstract class Model
{
    abstract public string $tableName { get; }
}

class User extends Model
{
    public string $tableName {
        get => 'users';
    }
}
```

## Real-World Examples

### Money Value Object

```php
class Money
{
    public function __construct(
        private int $cents,
    ) {}

    public string $formatted {
        get => '$' . number_format($this->cents / 100, 2);
    }

    public float $dollars {
        get => $this->cents / 100;
        set {
            $this->cents = (int) ($value * 100);
        }
    }
}

$money = new Money(1999);
echo $money->formatted; // "$19.99"
echo $money->dollars;   // 19.99

$money->dollars = 25.50;
echo $money->formatted; // "$25.50"
```

### Entity with Timestamps

```php
class Entity
{
    public private(set) DateTimeImmutable $createdAt;
    public private(set) DateTimeImmutable $updatedAt;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->updatedAt = new DateTimeImmutable();
    }

    public string $createdAtFormatted {
        get => $this->createdAt->format('M j, Y');
    }

    public function touch(): void
    {
        $this->updatedAt = new DateTimeImmutable();
    }
}
```

### Form Input

```php
class FormInput
{
    public string $value = '' {
        set => htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
    }

    public bool $isEmpty {
        get => $this->value === '';
    }
}
```

## Migration from Getters/Setters

```php
// Before
class User
{
    private string $email;

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = strtolower(trim($email));
    }
}

// After PHP 8.4
class User
{
    public string $email {
        set => strtolower(trim($value));
    }
}

// Usage remains the same for property access
$user->email = 'TEST@EXAMPLE.COM';
echo $user->email; // "test@example.com"
```

## Best Practices

1. **Keep hooks simple** - Complex logic should be in methods
2. **Use for computed values** - Virtual properties are perfect for derived data
3. **Validate in setters** - Enforce invariants at the property level
4. **Consider caching** - Expensive computations should cache results

```php
class Report
{
    private ?array $cachedData = null;

    public array $data {
        get {
            return $this->cachedData ??= $this->computeExpensiveData();
        }
    }

    public function invalidateCache(): void
    {
        $this->cachedData = null;
    }
}
```

## Conclusion

PHP 8.4 property hooks eliminate boilerplate while making code more expressive. Combined with asymmetric visibility, you get fine-grained control over property access with minimal syntax.

---

## Resources

- [PHP 8.4 Release Notes](https://www.php.net/releases/8.4)
- [Property Hooks RFC](https://wiki.php.net/rfc/property-hooks)

