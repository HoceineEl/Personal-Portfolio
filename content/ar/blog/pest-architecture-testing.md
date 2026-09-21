---
title: "اختبار البنية في Pest: فرض معايير الكود تلقائيًا"
description: "استخدم اختبار البنية في Pest لفرض معايير كتابة الكود، ومنع مخالفات الاعتماديات، والحفاظ على بنية نظيفة في تطبيقات Laravel."
tags:
  - Pest
  - Testing
  - Laravel
  - Architecture
noImage: true
createdAt: 2025-07-10T10:00:00.000Z
updatedAt: 2025-07-10T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# اختبار البنية في Pest: فرض معايير الكود تلقائيًا

يضمن **اختبار البنية (Architecture testing)** أن يلتزم الكود بالأنماط المحددة، ويمنع انحراف البنية مع الوقت. ويجعل Pest ذلك سهلًا باختبارات معبّرة وسهلة القراءة.

## لماذا اختبار البنية؟

دون قواعد مفروضة، يتدهور الكود مع الوقت:
- متحكمات (Controllers) تستدعي المستودعات (repositories) مباشرة
- نماذج (Models) تحتوي منطق العمل
- خدمات تعتمد على طبقة HTTP
- اعتماديات دائرية تتكوّن

تكشف اختبارات البنية هذه المشكلات تلقائيًا في CI.

## البداية

اختبارات البنية مدمجة في Pest 2.0+:

```php
// tests/Architecture/ArchitectureTest.php
arch('controllers should extend base controller')
    ->expect('App\Http\Controllers')
    ->toExtend('App\Http\Controllers\Controller');
```

## قواعد بنية شائعة

### الاعتماديات بين الطبقات

```php
// Models shouldn't use HTTP layer
arch('models are independent of http')
    ->expect('App\Models')
    ->not->toUse('Illuminate\Http');

// Services shouldn't use controllers
arch('services dont depend on controllers')
    ->expect('App\Services')
    ->not->toUse('App\Http\Controllers');

// Repositories only use models
arch('repositories use models')
    ->expect('App\Repositories')
    ->toOnlyUse([
        'App\Models',
        'Illuminate\Database',
        'Illuminate\Support\Collection',
    ]);
```

### أعراف التسمية

```php
arch('controllers have controller suffix')
    ->expect('App\Http\Controllers')
    ->toHaveSuffix('Controller');

arch('jobs have job suffix')
    ->expect('App\Jobs')
    ->toHaveSuffix('Job');

arch('events have event suffix')
    ->expect('App\Events')
    ->toHaveSuffix('Event');

arch('listeners have listener suffix')
    ->expect('App\Listeners')
    ->toHaveSuffix('Listener');
```

### الـ Traits والواجهات (Interfaces)

```php
arch('models use HasFactory')
    ->expect('App\Models')
    ->toUseTrait('Illuminate\Database\Eloquent\Factories\HasFactory');

arch('form requests implement rules')
    ->expect('App\Http\Requests')
    ->toImplement('App\Contracts\ValidatesRequest');
```

## قواعد خاصة بـ Laravel

### المتحكمات (Controllers)

```php
arch('controllers are invokable or have resource methods')
    ->expect('App\Http\Controllers')
    ->toHaveMethod('__invoke')
    ->or
    ->toHaveMethods(['index', 'store', 'show', 'update', 'destroy']);

arch('controllers use form requests')
    ->expect('App\Http\Controllers')
    ->toUse('App\Http\Requests');

arch('controllers dont use eloquent directly')
    ->expect('App\Http\Controllers')
    ->not->toUse('Illuminate\Database\Eloquent\Builder');
```

### نمط الـ Actions

```php
arch('actions are invokable')
    ->expect('App\Actions')
    ->toHaveMethod('__invoke');

arch('actions are final')
    ->expect('App\Actions')
    ->toBeFinal();

arch('actions dont use http layer')
    ->expect('App\Actions')
    ->not->toUse([
        'Illuminate\Http\Request',
        'App\Http\Controllers',
    ]);
```

### كائنات نقل البيانات (DTOs)

```php
arch('dtos are readonly')
    ->expect('App\DataTransferObjects')
    ->toBeReadonly();

arch('dtos are final')
    ->expect('App\DataTransferObjects')
    ->toBeFinal();
```

## منع الممارسات السيئة

### لا أوامر تصحيح أخطاء متروكة

```php
arch('no dd or dump')
    ->expect('App')
    ->not->toUse(['dd', 'dump', 'var_dump', 'print_r']);

arch('no ray in production code')
    ->expect('App')
    ->not->toUse('ray');
```

### لا استعلامات DB مباشرة داخل المتحكمات

```php
arch('controllers use services')
    ->expect('App\Http\Controllers')
    ->not->toUse('Illuminate\Support\Facades\DB');
```

### الأنواع الصارمة (Strict Types)

```php
arch('all files use strict types')
    ->expect('App')
    ->toUseStrictTypes();
```

## التصميم الموجّه بالمجال (Domain-Driven Design)

```php
// Domain layer is independent
arch('domain has no external dependencies')
    ->expect('Domain')
    ->not->toUse([
        'App\Http',
        'Illuminate\Http',
    ]);

// Application layer uses domain
arch('application uses domain')
    ->expect('App\Application')
    ->toUse('Domain');

// Infrastructure implements domain interfaces
arch('infrastructure implements domain contracts')
    ->expect('App\Infrastructure')
    ->toImplement('Domain\Contracts');
```

## بنية تعدد المستأجرين (Multi-Tenancy)

```php
arch('tenant models use tenant scope')
    ->expect('App\Models\Tenant')
    ->toUseTrait('App\Traits\BelongsToTenant');

arch('tenant services receive tenant context')
    ->expect('App\Services\Tenant')
    ->toHaveConstructor()
    ->toHaveParameter('tenant');
```

## تشغيل اختبارات البنية

```bash
# Run all architecture tests
./vendor/bin/pest --filter=Architecture

# Run with coverage
./vendor/bin/pest --filter=Architecture --coverage
```

## التكامل مع CI

```yaml
# .github/workflows/architecture.yml
name: Architecture Tests

on: [push, pull_request]

jobs:
  architecture:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'

      - run: composer install
      - run: ./vendor/bin/pest tests/Architecture
```

## تنظيم الاختبارات

```
tests/
├── Architecture/
│   ├── ControllersTest.php
│   ├── ModelsTest.php
│   ├── ServicesTest.php
│   └── GlobalTest.php
├── Feature/
└── Unit/
```

## أفضل الممارسات

### 1. ابدأ ببساطة

```php
// Begin with basic rules
arch('no debug statements')->expect('App')->not->toUse('dd');
arch('strict types')->expect('App')->toUseStrictTypes();
```

### 2. أضف القواعد تدريجيًا

```php
// As you establish patterns, add rules
arch('new pattern: actions')
    ->expect('App\Actions')
    ->toBeInvokable()
    ->toBeFinal();
```

### 3. وثّق الاستثناءات

```php
arch('services are final')
    ->expect('App\Services')
    ->ignoring('App\Services\AbstractService')
    ->toBeFinal();
```

## الخلاصة

يمنع اختبار البنية في Pest تدهور الكود تلقائيًا. ابدأ بقواعد بسيطة، وأضف غيرها كلما ترسّخت أنماطك. ستشكر نفسك على ذلك لاحقًا.

---

## مصادر

- [اختبار البنية في Pest](https://pestphp.com/docs/arch-testing)
- [توثيق Pest](https://pestphp.com)

