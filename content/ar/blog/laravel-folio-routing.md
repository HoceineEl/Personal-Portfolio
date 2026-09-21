---
title: "Laravel Folio: توجيه قائم على الملفات لقوالب Blade"
description: بسّط التوجيه باستخدام Laravel Folio. تعلّم قواعد التوجيه القائم على الملفات، ومعاملات المسارات، والوسيط (middleware)، وربط النماذج بالمسارات، ومكوّنات الصفحات.
tags:
  - Laravel
  - Folio
  - Routing
  - Blade
noImage: true
createdAt: 2025-05-25T10:00:00.000Z
updatedAt: 2025-05-25T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel Folio: توجيه قائم على الملفات لقوالب Blade

**Laravel Folio** يضيف التوجيه القائم على الملفات إلى Laravel. أنشئ ملف Blade، ويصبح لديك مسار (route) جاهز. لا مزيد من التنقّل بين ملفات المسارات والمتحكمات (Controllers).

## التثبيت

```bash
composer require laravel/folio
php artisan folio:install
```

يُنشئ هذا الأمر مجلد `resources/views/pages` الذي تضع فيه ملفات صفحاتك.

## الاستخدام الأساسي

### صفحات بسيطة

```
resources/views/pages/
├── index.blade.php          → /
├── about.blade.php          → /about
├── contact.blade.php        → /contact
└── pricing.blade.php        → /pricing
```

```blade
{{-- resources/views/pages/about.blade.php --}}
<x-layouts.app>
    <h1>About Us</h1>
    <p>Welcome to our company.</p>
</x-layouts.app>
```

### صفحات متداخلة

```
resources/views/pages/
├── blog/
│   ├── index.blade.php      → /blog
│   └── categories.blade.php → /blog/categories
├── docs/
│   ├── index.blade.php      → /docs
│   └── getting-started.blade.php → /docs/getting-started
```

## معاملات المسارات

### معاملات أساسية

استخدم الأقواس المربعة للأجزاء المتغيرة من المسار:

```
resources/views/pages/
├── users/
│   └── [id].blade.php       → /users/{id}
├── posts/
│   └── [slug].blade.php     → /posts/{slug}
```

```blade
{{-- resources/views/pages/users/[id].blade.php --}}
<?php
use function Laravel\Folio\{name};

name('users.show');
?>

<x-layouts.app>
    <h1>User #{{ $id }}</h1>
</x-layouts.app>
```

### معاملات متعددة

```
resources/views/pages/
├── teams/
│   └── [team]/
│       └── members/
│           └── [member].blade.php  → /teams/{team}/members/{member}
```

```blade
{{-- /teams/[team]/members/[member].blade.php --}}
<x-layouts.app>
    <h1>Team {{ $team }} - Member {{ $member }}</h1>
</x-layouts.app>
```

### معاملات تلتقط كل شيء (Catch-All)

```
resources/views/pages/
├── docs/
│   └── [...slug].blade.php  → /docs/{slug} (catches all segments)
```

```blade
{{-- /docs/[...slug].blade.php --}}
<?php
// $slug is an array: ['getting-started', 'installation']
// for URL: /docs/getting-started/installation
?>

<x-layouts.app>
    <nav>
        @foreach($slug as $segment)
            <span>{{ $segment }}</span>
        @endforeach
    </nav>
</x-layouts.app>
```

## ربط النماذج بالمسارات (Route Model Binding)

### الربط الضمني

```
resources/views/pages/
├── users/
│   └── [User].blade.php     → /users/{user}
```

```blade
{{-- /users/[User].blade.php --}}
<x-layouts.app>
    <h1>{{ $user->name }}</h1>
    <p>{{ $user->email }}</p>
</x-layouts.app>
```

### مفاتيح مخصصة

```
resources/views/pages/
├── posts/
│   └── [Post:slug].blade.php  → /posts/{post:slug}
```

```blade
{{-- /posts/[Post:slug].blade.php --}}
<x-layouts.app>
    <article>
        <h1>{{ $post->title }}</h1>
        <div>{!! $post->content !!}</div>
    </article>
</x-layouts.app>
```

### النماذج المحذوفة حذفًا ناعمًا

```blade
<?php
use function Laravel\Folio\{withTrashed};

withTrashed();
?>

<x-layouts.app>
    @if($user->trashed())
        <div class="alert">This user has been deleted.</div>
    @endif
    <h1>{{ $user->name }}</h1>
</x-layouts.app>
```

## الوسيط (Middleware)

### وسيط على مستوى الصفحة

```blade
{{-- resources/views/pages/dashboard.blade.php --}}
<?php
use function Laravel\Folio\{middleware};

middleware(['auth', 'verified']);
?>

<x-layouts.app>
    <h1>Dashboard</h1>
</x-layouts.app>
```

### وسيط على مستوى المجلد

```php
// app/Providers/FolioServiceProvider.php
use Laravel\Folio\Folio;

public function boot(): void
{
    Folio::path(resource_path('views/pages'))
        ->middleware([
            'admin/*' => ['auth', 'admin'],
            'dashboard/*' => ['auth'],
        ]);
}
```

## المسارات المسمّاة

```blade
<?php
use function Laravel\Folio\{name};

name('blog.show');
?>

<x-layouts.app>
    <article>...</article>
</x-layouts.app>
```

```blade
{{-- In other templates --}}
<a href="{{ route('blog.show', ['slug' => $post->slug]) }}">
    {{ $post->title }}
</a>
```

## خطافات العرض (Render Hooks)

نفّذ كودًا قبل عرض الصفحة:

```blade
<?php
use function Laravel\Folio\{render};
use App\Models\Post;

render(function (View $view, Post $post) {
    if (!$post->isPublished()) {
        abort(404);
    }

    // Add data to view
    return $view->with('relatedPosts', $post->related()->limit(3)->get());
});
?>

<x-layouts.app>
    <article>
        <h1>{{ $post->title }}</h1>
    </article>

    <aside>
        @foreach($relatedPosts as $related)
            <a href="/posts/{{ $related->slug }}">{{ $related->title }}</a>
        @endforeach
    </aside>
</x-layouts.app>
```

## مكوّنات الصفحات

استخدم Volt للصفحات التفاعلية:

```bash
composer require livewire/volt
```

```blade
{{-- resources/views/pages/counter.blade.php --}}
<?php
use function Livewire\Volt\{state};

state(['count' => 0]);

$increment = fn () => $this->count++;
$decrement = fn () => $this->count--;
?>

<x-layouts.app>
    <div>
        <button wire:click="decrement">-</button>
        <span>{{ $count }}</span>
        <button wire:click="increment">+</button>
    </div>
</x-layouts.app>
```

## مجلدات صفحات متعددة

```php
// app/Providers/FolioServiceProvider.php
public function boot(): void
{
    Folio::path(resource_path('views/pages'));

    Folio::path(resource_path('views/admin'))
        ->uri('/admin')
        ->middleware(['auth', 'admin']);

    Folio::path(resource_path('views/api'))
        ->uri('/api/pages')
        ->middleware(['api']);
}
```

## بنية من مشروع حقيقي

```
resources/views/pages/
├── index.blade.php              → /
├── about.blade.php              → /about
├── contact.blade.php            → /contact
├── blog/
│   ├── index.blade.php          → /blog
│   └── [Post:slug].blade.php    → /blog/{slug}
├── products/
│   ├── index.blade.php          → /products
│   ├── [category].blade.php     → /products/{category}
│   └── [category]/
│       └── [Product:slug].blade.php → /products/{category}/{slug}
├── dashboard/
│   ├── index.blade.php          → /dashboard (auth)
│   ├── settings.blade.php       → /dashboard/settings (auth)
│   └── orders/
│       ├── index.blade.php      → /dashboard/orders (auth)
│       └── [Order].blade.php    → /dashboard/orders/{order} (auth)
```

## متى تستخدم Folio

**استخدم Folio في:**
- الصفحات التسويقية
- مواقع التوثيق
- المدونات
- واجهات CRUD البسيطة
- النماذج الأولية

**التزم بالمتحكمات في:**
- منطق الأعمال المعقّد
- نقاط نهاية API
- معالجة البيانات الثقيلة
- عدة إجراءات لكل مورد

## الاختبار

```php
test('can view blog post', function () {
    $post = Post::factory()->published()->create();

    $this->get("/posts/{$post->slug}")
        ->assertOk()
        ->assertSee($post->title);
});

test('cannot view unpublished post', function () {
    $post = Post::factory()->draft()->create();

    $this->get("/posts/{$post->slug}")
        ->assertNotFound();
});
```

## الخلاصة

يبسّط Laravel Folio التوجيه في التطبيقات المبنية حول الصفحات. التوجيه القائم على الملفات يقلّل الكود المتكرر ويجعل بنية تطبيقك واضحة بديهيًا. اجمعه مع Volt لتحصل على صفحات تفاعلية دون أن تغادر Blade.

---

## مصادر

- [توثيق Laravel Folio](https://laravel.com/docs/folio)
- [Livewire Volt](https://livewire.laravel.com/docs/volt)
