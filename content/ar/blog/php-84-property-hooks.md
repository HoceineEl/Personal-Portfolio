---
title: "خطافات الخصائص (Property Hooks) في PHP 8.4: الـ getters والـ setters بصيغة جديدة"
description: "أتقن خطافات الخصائص في PHP 8.4: خطافات get و set، والرؤية غير المتماثلة، والخصائص الافتراضية، وكيف تحل محل الـ getters والـ setters التقليدية."
tags:
  - PHP
  - PHP 8.4
  - Backend
noImage: true
createdAt: 2025-05-15T10:00:00.000Z
updatedAt: 2025-05-15T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# خطافات الخصائص (Property Hooks) في PHP 8.4: الـ getters والـ setters بصيغة جديدة

يضيف **PHP 8.4** خطافات الخصائص (property hooks)، وهي ميزة تغيّر طريقة كتابة الأصناف كثيرًا: تعرّف منطق القراءة والكتابة (get و set) على الخاصية نفسها مباشرة. وداعًا لدوال getter و setter المكررة.

## مشكلة الـ Getters/Setters التقليدية

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

## صيغة خطافات الخصائص

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

## خطافات get

### خطاف get بسيط

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

### خطاف get متعدد الأسطر

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

## خطافات set

### خطاف set بسيط

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

### خطاف set مع التحقق من القيمة

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

### خطاف set مع تحويل النوع (type coercion)

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

## الجمع بين خطافَي get و set

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

## الخصائص الافتراضية (Virtual Properties)

الخاصية التي لها خطاف get فقط خاصية افتراضية: تحسب قيمتها دون أن تخزّن أي بيانات:

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

## الرؤية غير المتماثلة (Asymmetric Visibility)

يضيف PHP 8.4 أيضًا الرؤية غير المتماثلة:

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

### مع الخطافات

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

## ترقية الخصائص في الـ constructor (Constructor Property Promotion) مع الخطافات

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

## التوافق مع الواجهات (Interfaces)

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

## الخصائص المجردة (Abstract Properties)

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

## أمثلة واقعية

### كائن قيمة للمبالغ المالية (Money Value Object)

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

### كيان (Entity) مع الطوابع الزمنية

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

### حقل إدخال في نموذج

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

## الانتقال من الـ Getters/Setters

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

## أفضل الممارسات

1. **اجعل الخطافات بسيطة**: المنطق المعقد مكانه الدوال (methods)
2. **استخدمها للقيم المحسوبة**: الخصائص الافتراضية مناسبة تمامًا للبيانات المشتقة
3. **تحقّق من القيم في الـ setters**: افرض الثوابت (invariants) على مستوى الخاصية
4. **فكّر في التخزين المؤقت (caching)**: الحسابات المكلفة يجب أن تخزّن نتائجها

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

## الخلاصة

تتخلص خطافات الخصائص في PHP 8.4 من الكود المكرر وتجعل الكود أوضح تعبيرًا. ومع الرؤية غير المتماثلة، تتحكم بدقة في الوصول إلى الخصائص بأقل قدر من الصياغة.

---

## مصادر

- [ملاحظات إصدار PHP 8.4](https://www.php.net/releases/8.4)
- [مقترح Property Hooks (RFC)](https://wiki.php.net/rfc/property-hooks)

