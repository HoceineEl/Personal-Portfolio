---
title: "Laravel 12: Complete Guide to the Latest Features (2025)"
description: Explore Laravel 12's groundbreaking features including automatic eager loading, session cache, failover queues, AI-powered packages, and the new starter kits with WorkOS AuthKit integration.
tags:
  - Laravel
  - Laravel 12
  - PHP
  - Web Development
noImage: true
createdAt: 2025-03-15T10:00:00.000Z
updatedAt: 2025-03-15T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel 12: Complete Guide to the Latest Features (2025)

Laravel 12 was officially released on **February 24, 2025**, marking another milestone in the framework's evolution. While described as a "maintenance release," it introduced several powerful features that enhance developer productivity and application performance.

## What's New in Laravel 12

### New Starter Kits with WorkOS AuthKit

Laravel 12 introduces redesigned starter kits for **React**, **Vue**, and **Livewire**. The standout addition is **WorkOS AuthKit** integration, providing:

- **Social Authentication** - Google, GitHub, Microsoft, and more
- **Passkeys Support** - Passwordless authentication
- **Single Sign-On (SSO)** - Enterprise-ready authentication
- **Shadcn Components** - Modern, accessible UI components
- **Flux Components** - Free version available for Livewire

```bash
# Create a new Laravel 12 project with React starter kit
laravel new my-app --kit=react

# With WorkOS AuthKit
laravel new my-app --kit=react --auth=workos
```

### Automatic Eager Loading (Laravel 12.8)

The most impactful feature is **automatic eager loading**, solving the infamous N+1 query problem without manual `with()` calls:

```php
// In AppServiceProvider
use Illuminate\Database\Eloquent\Model;

public function boot()
{
    Model::automaticallyEagerLoadRelationships();
}
```

**Before automatic eager loading:**
```php
// 302 queries for 100 posts with authors and comments
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name;
    echo $post->comments->count();
}
```

**After automatic eager loading:**
```php
// Just 5 queries - Laravel detects and loads relationships automatically
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->author->name; // Auto-loaded!
    echo $post->comments->count(); // Auto-loaded!
}
```

You can also enable it per-query or per-model:

```php
// Per-query
$users = User::all()->withRelationshipAutoloading();

// Per-model
class Invoice extends Model
{
    protected $autoLoadRelations = true;
}
```

### Session Cache

A new session-scoped caching mechanism that automatically isolates data per user:

```php
// Cache data for the current user session
session()->cache()->put('user_preferences', $preferences, now()->addHours(24));

// Retrieve session-cached data
$preferences = session()->cache()->get('user_preferences');

// Automatically cleaned up when session expires
```

This is perfect for:
- User-specific calculations
- Temporary shopping carts
- Form wizard progress
- User dashboard stats

### Failover Queue Driver

Laravel 12 introduces automatic queue failover for high-availability applications:

```php
// config/queue.php
'connections' => [
    'failover' => [
        'driver' => 'failover',
        'connections' => [
            'redis',
            'sqs',
            'database',
        ],
    ],
],
```

If Redis fails, Laravel automatically pushes jobs to SQS, then database. No more lost jobs during infrastructure issues.

### Route Attributes

Define routes directly using PHP 8 attributes:

```php
use Illuminate\Routing\Attributes\Get;
use Illuminate\Routing\Attributes\Post;
use Illuminate\Routing\Attributes\Middleware;

#[Middleware('auth')]
class UserController extends Controller
{
    #[Get('/users', name: 'users.index')]
    public function index()
    {
        return view('users.index');
    }

    #[Post('/users', name: 'users.store')]
    public function store(Request $request)
    {
        // Create user
    }

    #[Get('/users/{user}', name: 'users.show')]
    public function show(User $user)
    {
        return view('users.show', compact('user'));
    }
}
```

### Laravel Boost (AI-Powered Dev Assistant)

Laravel's first official AI package, powered by Model Context Protocol (MCP):

```bash
composer require laravel/boost
```

Features:
- **Versioned Documentation** - AI knows your Laravel version
- **Laravel-Curated Rules** - Best practices built-in
- **MCP Server Setup** - Easy AI integration in your app

### Health Check Improvements

Enhanced system health monitoring:

```php
// bootstrap/app.php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    health: '/up',
)

// Custom health checks
use Illuminate\Foundation\Events\DiagnosingHealth;

Event::listen(DiagnosingHealth::class, function () {
    // Check database
    DB::connection()->getPdo();

    // Check Redis
    Redis::ping();

    // Check external services
    Http::get('https://api.example.com/health')->throw();
});
```

## PHP Requirements

Laravel 12 requires **PHP 8.2** or higher. PHP 8.4 is recommended for best performance and access to property hooks.

## Upgrading from Laravel 11

Most applications can upgrade without code changes:

```bash
# Update composer.json
"laravel/framework": "^12.0"

# Run update
composer update

# Clear caches
php artisan optimize:clear
```

## Conclusion

Laravel 12 may be called a "maintenance release," but features like automatic eager loading and session cache are game-changers. Combined with WorkOS AuthKit starter kits and AI-powered tooling, Laravel continues to be the most developer-friendly PHP framework.

---

## Resources

- [Laravel 12 Release Notes](https://laravel.com/docs/12.x/releases)
- [Laravel News - Laravel 12](https://laravel-news.com/laravel-12)
- [Laracon US 2025 Announcements](https://laravel.com/blog/everything-we-announced-at-laracon-us-2025)
