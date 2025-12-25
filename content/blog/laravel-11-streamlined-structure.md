---
title: "Laravel 11's Streamlined Application Structure: A Complete Guide"
description: Discover how Laravel 11's minimalist architecture removes boilerplate, consolidates middleware in bootstrap/app.php, and makes your applications cleaner and more maintainable.
tags:
  - Laravel
  - Laravel 11
  - PHP
  - Web Development
  - Best Practices
noImage: true
createdAt: 2024-12-20T10:00:00.000Z
updatedAt: 2024-12-20T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel 11's Streamlined Application Structure: A Complete Guide

Laravel 11, released on March 12, 2024, brought one of the most significant architectural changes in the framework's history. The new streamlined application structure removes unnecessary boilerplate and consolidates configuration in a way that makes your applications cleaner and more maintainable.

## What Changed in Laravel 11?

When you create a new Laravel 11 project, you'll immediately notice the difference. The folder structure is dramatically cleaner compared to Laravel 10.

### Removed Folders and Files

Several folders that previously existed by default are now gone:

- `app/Console/` - The Kernel is no longer needed
- `app/Exceptions/` - Exception handling moved to bootstrap
- `app/Http/Middleware/` - Middleware now lives in the framework

### The New bootstrap/app.php

The heart of Laravel 11's new architecture is the `bootstrap/app.php` file. This single file now handles:

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Customize middleware here
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Handle exceptions here
    })->create();
```

## Middleware Customization

Gone are the days of modifying multiple middleware files. In Laravel 11, you customize middleware behavior directly in `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\CustomMiddleware::class,
    ]);

    $middleware->api(prepend: [
        \App\Http\Middleware\ApiRateLimiter::class,
    ]);

    $middleware->alias([
        'admin' => \App\Http\Middleware\EnsureUserIsAdmin::class,
    ]);
})
```

### Common Middleware Operations

**Disabling default middleware:**

```php
$middleware->web(remove: [
    \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
]);
```

**Adding global middleware:**

```php
$middleware->use([
    \App\Http\Middleware\LogRequests::class,
]);
```

## Optional API and Broadcasting

Laravel 11 acknowledges that not every application needs API routes or broadcasting. These are now opt-in features.

### Installing API Support

```bash
php artisan install:api
```

This command:
1. Creates `routes/api.php`
2. Registers the API routes in `bootstrap/app.php`
3. Installs Laravel Sanctum for API authentication

### Installing Broadcasting

```bash
php artisan install:broadcasting
```

## The Health Check Endpoint

Laravel 11 introduces a built-in health check at `/up`. This is invaluable for load balancers and monitoring systems:

```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    health: '/up', // Responds with 200 OK when app is healthy
)
```

You can customize health checks by listening to the `DiagnosingHealth` event:

```php
use Illuminate\Foundation\Events\DiagnosingHealth;

Event::listen(DiagnosingHealth::class, function (DiagnosingHealth $event) {
    // Check database connection
    // Check Redis connection
    // Check external services
});
```

## New Artisan Commands

Laravel 11 adds several useful make commands:

```bash
# Create an enum
php artisan make:enum Status

# Create an interface
php artisan make:interface PaymentGateway

# Create a class
php artisan make:class Services/PaymentService
```

## SQLite as Default Database

For local development, SQLite is now the default database. This means you can start building immediately without any database configuration:

```bash
laravel new my-project
cd my-project
php artisan migrate
```

Your database is ready at `database/database.sqlite`.

## Migration to Laravel 11

If you're upgrading from Laravel 10, you have two options:

### Option 1: Keep Your Current Structure

Laravel 11 is fully backward compatible. Your existing middleware, exception handlers, and folder structure will continue to work.

### Option 2: Adopt the New Structure

Gradually migrate by:

1. Moving middleware customizations to `bootstrap/app.php`
2. Removing empty folders like `app/Console/`, `app/Exceptions/`
3. Consolidating exception handling

## Best Practices

1. **Embrace the simplicity** - Don't recreate the old structure out of habit
2. **Use bootstrap/app.php** - Centralize your configuration
3. **Keep middleware in the framework** - Only create custom middleware when truly needed
4. **Leverage the health endpoint** - Integrate with your monitoring stack

## Conclusion

Laravel 11's streamlined structure represents a maturation of the framework. By removing boilerplate and centralizing configuration, Taylor Otwell and the Laravel team have made the framework more approachable for newcomers while maintaining the flexibility power users need.

The new architecture encourages cleaner applications and reduces the cognitive load of understanding where things belong. Whether you're starting a new project or maintaining an existing one, understanding these changes will help you write better Laravel applications.

---

## Resources

- [Laravel 11 Release Notes](https://laravel.com/docs/11.x/releases)
- [Laravel 11 Upgrade Guide](https://laravel.com/docs/11.x/upgrade)
