---
title: "PHP 8.5: دليل شامل لكل الميزات الجديدة"
description: تعرّف على أبرز ميزات PHP 8.5، ومنها معامل الأنبوب (pipe operator)، وامتداد URI، وصيغة clone with، والدالتان array_first/array_last، والسمة NoDiscard.
tags:
  - PHP
  - PHP 8.5
  - Backend
noImage: true
createdAt: 2025-11-25T10:00:00.000Z
updatedAt: 2025-11-25T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# PHP 8.5: دليل شامل لكل الميزات الجديدة

صدر **PHP 8.5** في 20 نوفمبر 2025، ومعه ميزات تُحدث فرقًا كبيرًا، مثل معامل الأنبوب (pipe operator)، وامتداد URI مدمج، ونسخ محسّن للكائنات. يغطي هذا الدليل كل ما تحتاج إلى معرفته.

## معامل الأنبوب (`|>`)

أكثر ميزة انتظرها المطورون: سلسلة استدعاءات الدوال بأسلوب أنيق.

```php
// Before PHP 8.5: Nested function calls (hard to read)
$result = array_sum(
    array_filter(
        array_map(
            fn($x) => $x * 2,
            $numbers
        ),
        fn($x) => $x > 10
    )
);

// PHP 8.5: Pipe operator (left-to-right, readable)
$result = $numbers
    |> array_map(fn($x) => $x * 2, $$)
    |> array_filter($$, fn($x) => $x > 10)
    |> array_sum($$);
```

### أمثلة من مشاريع حقيقية

```php
// String processing pipeline
$slug = $title
    |> trim($$)
    |> strtolower($$)
    |> preg_replace('/[^a-z0-9]+/', '-', $$)
    |> trim($$, '-');

// Data transformation
$users = $rawData
    |> json_decode($$, true)
    |> array_filter($$, fn($u) => $u['active'])
    |> array_map(fn($u) => new User($u), $$)
    |> array_values($$);
```

## امتداد URI

تحليل مدمج لعناوين URL وفق معيارَي RFC 3986 و WHATWG:

```php
use Uri\Rfc3986\Uri;

// Parse a URI
$uri = Uri::parse('https://user:pass@example.com:8080/path?query=value#fragment');

echo $uri->getScheme();    // "https"
echo $uri->getHost();      // "example.com"
echo $uri->getPort();      // 8080
echo $uri->getPath();      // "/path"
echo $uri->getQuery();     // "query=value"
echo $uri->getFragment();  // "fragment"
echo $uri->getUserInfo();  // "user:pass"

// Build URIs fluently
$newUri = $uri
    ->withScheme('http')
    ->withHost('api.example.com')
    ->withPath('/v2/users')
    ->withQuery('limit=100');

echo $newUri; // "http://api.example.com/v2/users?limit=100"
```

### معيار WHATWG URL

```php
use Uri\WhatWg\Url;

// Browser-compatible URL parsing
$url = Url::parse('https://example.com/path');

// Handles edge cases like browsers do
$url = Url::parse('HTTP://EXAMPLE.COM/Path');
echo $url->getScheme(); // "http" (normalized)
echo $url->getHost();   // "example.com" (normalized)
```

## صيغة Clone With

عدّل الخصائص أثناء النسخ، وهذا مثالي للكائنات غير القابلة للتغيير (immutable):

```php
readonly class Point
{
    public function __construct(
        public int $x,
        public int $y,
        public int $z = 0
    ) {}
}

$point = new Point(1, 2, 3);

// Clone and modify in one expression
$moved = clone($point, x: $point->x + 10, y: $point->y + 5);

echo $moved->x; // 11
echo $moved->y; // 7
echo $moved->z; // 3 (unchanged)
```

### استخدام عملي

```php
readonly class Order
{
    public function __construct(
        public string $id,
        public string $status,
        public float $total,
        public \DateTimeImmutable $updatedAt
    ) {}

    public function markAsShipped(): self
    {
        return clone($this,
            status: 'shipped',
            updatedAt: new \DateTimeImmutable()
        );
    }

    public function applyDiscount(float $percent): self
    {
        return clone($this,
            total: $this->total * (1 - $percent / 100),
            updatedAt: new \DateTimeImmutable()
        );
    }
}
```

## دوال مصفوفات جديدة

### array_first() و array_last()

```php
$numbers = [10, 20, 30, 40, 50];

// Get first element
$first = array_first($numbers); // 10

// Get last element
$last = array_last($numbers); // 50

// Empty array returns null
$empty = [];
array_first($empty); // null
array_last($empty);  // null

// Works with associative arrays
$users = ['admin' => 'Alice', 'user' => 'Bob'];
array_first($users); // 'Alice'
array_last($users);  // 'Bob'
```

### مقارنة بالطرق السابقة

```php
// Before PHP 8.5
$first = reset($array) ?: null;
$last = end($array) ?: null;
// Or
$first = $array[array_key_first($array)] ?? null;
$last = $array[array_key_last($array)] ?? null;

// PHP 8.5: Clean and simple
$first = array_first($array);
$last = array_last($array);
```

## السمة #[\NoDiscard]

تُطلق تحذيرًا عند تجاهل القيمة المُرجَعة:

```php
#[\NoDiscard('The result should be checked for errors')]
function processPayment(float $amount): PaymentResult
{
    // Process and return result
    return new PaymentResult(success: true);
}

// This triggers a warning - return value ignored
processPayment(99.99);

// Correct usage
$result = processPayment(99.99);
if (!$result->success) {
    handleError($result->error);
}
```

### الاستخدام داخل أطر العمل

```php
class Collection
{
    #[\NoDiscard]
    public function filter(callable $callback): self
    {
        return new self(array_filter($this->items, $callback));
    }

    #[\NoDiscard]
    public function map(callable $callback): self
    {
        return new self(array_map($callback, $this->items));
    }
}

// Warning: filter() return value discarded
$collection->filter(fn($x) => $x > 0);

// Correct
$filtered = $collection->filter(fn($x) => $x > 0);
```

## الدوال المجهولة (Closures) في التعابير الثابتة

استخدم الدوال المجهولة في السمات (attributes) وثوابت الأصناف:

```php
class Validator
{
    public const RULES = [
        'email' => fn($v) => filter_var($v, FILTER_VALIDATE_EMAIL),
        'phone' => fn($v) => preg_match('/^\+?[0-9]{10,15}$/', $v),
    ];
}

// In attributes
#[Route('/users/{id}', middleware: fn($r) => $r->user()->isAdmin())]
public function delete(int $id) {}

// First-class callables in constants
class StringHelper
{
    public const TRIM = trim(...);
    public const UPPER = strtoupper(...);
    public const LOWER = strtolower(...);
}
```

## تتبّع الاستدعاءات في الأخطاء القاتلة (Fatal Error Backtraces)

إعداد INI جديد باسم `fatal_error_backtraces`:

```php
// php.ini
fatal_error_backtraces = 1  // Default in PHP 8.5

// Now fatal errors show full backtraces:
// Fatal error: Allowed memory size exhausted
// Stack trace:
// #0 /app/Process.php(45): processLargeFile()
// #1 /app/Controller.php(23): Process->run()
// #2 /app/index.php(10): Controller->handle()
```

## دوال مساعدة جديدة

```php
// Get current exception handler
$handler = get_exception_handler();

// Get current error handler
$handler = get_error_handler();

// Get cURL handles from multi handle
$handles = curl_multi_get_handles($multiHandle);

// PHP build date constant
echo PHP_BUILD_DATE; // "Nov 20 2025"
```

## السمة Deprecated على الـ Traits

```php
#[\Deprecated('Use NewTrait instead')]
trait OldTrait
{
    public function oldMethod(): void {}
}

class MyClass
{
    use OldTrait; // Triggers deprecation warning
}
```

## السمة Override على الخصائص

```php
class Base
{
    public string $name = 'default';
}

class Child extends Base
{
    #[\Override]
    public string $name = 'child'; // Valid: overrides parent property

    #[\Override]
    public string $unknown; // Error: no parent property to override
}
```

## OPcache مدمج دائمًا

ابتداءً من PHP 8.5، يُبنى OPcache دائمًا داخل PHP. ومع ذلك تستطيع تعطيله وقت التشغيل:

```ini
; Disable OPcache if needed
opcache.enable=0
```

## الترقية من PHP 8.4

الترقية سلسة لمعظم التطبيقات:

```bash
# Check compatibility
composer check-platform-reqs

# Update composer.json
"require": {
    "php": "^8.5"
}
```

### تغييرات كاسرة للتوافق يجب الانتباه لها

1. تغيّرت تواقيع بعض الدوال الداخلية
2. بعض الحالات الطرفية في معالجة الأخطاء
3. حُذفت بعض الميزات المُهمَلة

## الخلاصة

يواصل PHP 8.5 تطوّر اللغة بميزات عملية تجعل الشيفرة أسهل في القراءة والصيانة. معامل الأنبوب وحده سيغيّر طريقة كتابتنا لتحويلات البيانات، وامتداد URI يلبّي حاجة قديمة إلى تعامل صحيح مع عناوين URL.

---

## مصادر

- [PHP 8.5 Release Announcement](https://www.php.net/releases/8.5/en.php)
- [What's New in PHP 8.5](https://stitcher.io/blog/new-in-php-85)
- [PHP.Watch PHP 8.5 Guide](https://php.watch/versions/8.5)

