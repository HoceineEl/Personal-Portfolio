---
title: "Pest Architecture Testing: Enforce Code Standards Automatically"
description: Use Pest's architecture testing to enforce coding standards, prevent dependency violations, and maintain clean architecture in your Laravel applications.
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

# Pest Architecture Testing: Enforce Code Standards Automatically

**Architecture testing** ensures your codebase follows defined patterns and prevents architectural drift. Pest makes this effortless with expressive, readable tests.

## Why Architecture Testing?

Without enforcement, codebases degrade over time:
- Controllers calling repositories directly
- Models containing business logic
- Services depending on HTTP layer
- Circular dependencies forming

Architecture tests catch these issues automatically in CI.

## Getting Started

Architecture tests are built into Pest 2.0+:

```php
// tests/Architecture/ArchitectureTest.php
arch('controllers should extend base controller')
    ->expect('App\Http\Controllers')
    ->toExtend('App\Http\Controllers\Controller');
```

## Common Architecture Rules

### Layer Dependencies

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

### Naming Conventions

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

### Traits and Interfaces

```php
arch('models use HasFactory')
    ->expect('App\Models')
    ->toUseTrait('Illuminate\Database\Eloquent\Factories\HasFactory');

arch('form requests implement rules')
    ->expect('App\Http\Requests')
    ->toImplement('App\Contracts\ValidatesRequest');
```

## Laravel-Specific Rules

### Controllers

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

### Actions Pattern

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

### DTOs

```php
arch('dtos are readonly')
    ->expect('App\DataTransferObjects')
    ->toBeReadonly();

arch('dtos are final')
    ->expect('App\DataTransferObjects')
    ->toBeFinal();
```

## Preventing Bad Practices

### No Debug Statements

```php
arch('no dd or dump')
    ->expect('App')
    ->not->toUse(['dd', 'dump', 'var_dump', 'print_r']);

arch('no ray in production code')
    ->expect('App')
    ->not->toUse('ray');
```

### No Direct DB Queries in Controllers

```php
arch('controllers use services')
    ->expect('App\Http\Controllers')
    ->not->toUse('Illuminate\Support\Facades\DB');
```

### Strict Types

```php
arch('all files use strict types')
    ->expect('App')
    ->toUseStrictTypes();
```

## Domain-Driven Design

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

## Multi-Tenancy Architecture

```php
arch('tenant models use tenant scope')
    ->expect('App\Models\Tenant')
    ->toUseTrait('App\Traits\BelongsToTenant');

arch('tenant services receive tenant context')
    ->expect('App\Services\Tenant')
    ->toHaveConstructor()
    ->toHaveParameter('tenant');
```

## Running Architecture Tests

```bash
# Run all architecture tests
./vendor/bin/pest --filter=Architecture

# Run with coverage
./vendor/bin/pest --filter=Architecture --coverage
```

## CI Integration

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

## Organizing Tests

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

## Best Practices

### 1. Start Simple

```php
// Begin with basic rules
arch('no debug statements')->expect('App')->not->toUse('dd');
arch('strict types')->expect('App')->toUseStrictTypes();
```

### 2. Add Rules Incrementally

```php
// As you establish patterns, add rules
arch('new pattern: actions')
    ->expect('App\Actions')
    ->toBeInvokable()
    ->toBeFinal();
```

### 3. Document Exceptions

```php
arch('services are final')
    ->expect('App\Services')
    ->ignoring('App\Services\AbstractService')
    ->toBeFinal();
```

## Conclusion

Architecture testing with Pest prevents codebase degradation automatically. Start with simple rules and add more as your patterns solidify. Your future self will thank you.

---

## Resources

- [Pest Architecture Testing](https://pestphp.com/docs/arch-testing)
- [Pest Documentation](https://pestphp.com)

