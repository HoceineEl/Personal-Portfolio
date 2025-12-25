---
title: "Laravel 12 Starter Kits: React, Vue, Livewire & WorkOS"
description: Explore Laravel 12's new starter kits with React, Vue, or Livewire frontends and WorkOS AuthKit for enterprise authentication out of the box.
tags:
  - Laravel
  - Laravel 12
  - Authentication
  - WorkOS
noImage: true
createdAt: 2025-04-05T10:00:00.000Z
updatedAt: 2025-04-05T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel 12 Starter Kits: React, Vue, Livewire & WorkOS

**Laravel 12** introduces redesigned starter kits offering React, Vue, or Livewire frontends with optional WorkOS AuthKit integration for enterprise-grade authentication.

## What's New in Laravel 12 Starter Kits

- Choice of React, Vue, or Livewire frontends
- WorkOS AuthKit integration option
- Social authentication (Google, Microsoft, GitHub)
- Enterprise SSO support
- Modern, responsive UI

## Installation

### React with Inertia

```bash
laravel new my-app --react
```

### Vue with Inertia

```bash
laravel new my-app --vue
```

### Livewire

```bash
laravel new my-app --livewire
```

### With WorkOS Authentication

```bash
laravel new my-app --react --workos
# or
laravel new my-app --vue --workos
# or
laravel new my-app --livewire --workos
```

## WorkOS AuthKit Features

### Social Authentication

Pre-configured social login providers:

```php
// Users can sign in with:
// - Google
// - Microsoft
// - GitHub
// - Apple
// - LinkedIn
```

### Enterprise SSO

Single Sign-On for enterprise customers:

```php
// Support for:
// - SAML
// - OIDC
// - Directory Sync
// - SCIM provisioning
```

### Configuration

```env
# .env
WORKOS_API_KEY=your-api-key
WORKOS_CLIENT_ID=your-client-id
WORKOS_REDIRECT_URI=http://localhost:8000/authenticate
```

## React Starter Kit Structure

```
app/
├── Http/
│   └── Controllers/
│       ├── Auth/
│       │   ├── AuthenticatedSessionController.php
│       │   ├── RegisteredUserController.php
│       │   └── ...
resources/
├── js/
│   ├── Components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── InputError.tsx
│   │   └── ...
│   ├── Layouts/
│   │   ├── AuthLayout.tsx
│   │   └── AppLayout.tsx
│   ├── Pages/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ...
│   │   ├── Dashboard.tsx
│   │   └── ...
```

### React Components

```tsx
// resources/js/Pages/Dashboard.tsx
import { Head } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
```

## Vue Starter Kit Structure

```
resources/
├── js/
│   ├── Components/
│   │   ├── ui/           # UI components
│   │   └── ...
│   ├── Layouts/
│   │   ├── AuthLayout.vue
│   │   └── AppLayout.vue
│   ├── Pages/
│   │   ├── Auth/
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   └── Dashboard.vue
```

### Vue Components

```vue
<!-- resources/js/Pages/Dashboard.vue -->
<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue'
import { Head } from '@inertiajs/vue3'
</script>

<template>
    <AppLayout>
        <Head title="Dashboard" />

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        You're logged in!
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
```

## Livewire Starter Kit Structure

```
app/
├── Livewire/
│   ├── Auth/
│   │   ├── Login.php
│   │   ├── Register.php
│   │   └── ...
│   └── Dashboard.php
resources/
├── views/
│   ├── components/
│   │   └── layouts/
│   │       ├── app.blade.php
│   │       └── guest.blade.php
│   ├── livewire/
│   │   ├── auth/
│   │   │   ├── login.blade.php
│   │   │   └── register.blade.php
│   │   └── dashboard.blade.php
```

### Livewire Components

```php
// app/Livewire/Dashboard.php
namespace App\Livewire;

use Livewire\Component;

class Dashboard extends Component
{
    public function render()
    {
        return view('livewire.dashboard')
            ->layout('components.layouts.app');
    }
}
```

```blade
{{-- resources/views/livewire/dashboard.blade.php --}}
<div class="py-12">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div class="p-6 text-gray-900">
                You're logged in!
            </div>
        </div>
    </div>
</div>
```

## Authentication Routes

All starter kits include these routes:

```php
// routes/auth.php
Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::get('dashboard', Dashboard::class)->name('dashboard');
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
```

## WorkOS Authentication Flow

```php
// app/Http/Controllers/Auth/WorkOsController.php
class WorkOsController extends Controller
{
    public function redirect()
    {
        return redirect(WorkOS::getAuthorizationUrl([
            'provider' => request('provider'),
            'redirect_uri' => route('workos.callback'),
        ]));
    }

    public function callback()
    {
        $user = WorkOS::getProfileAndToken(request('code'));

        $localUser = User::updateOrCreate(
            ['email' => $user->email],
            [
                'name' => $user->first_name . ' ' . $user->last_name,
                'workos_id' => $user->id,
            ]
        );

        Auth::login($localUser);

        return redirect()->route('dashboard');
    }
}
```

## Customization

### Adding New Pages (React)

```tsx
// resources/js/Pages/Settings.tsx
import AppLayout from '@/Layouts/AppLayout'
import { Head } from '@inertiajs/react'

export default function Settings() {
    return (
        <AppLayout>
            <Head title="Settings" />
            {/* Your content */}
        </AppLayout>
    )
}
```

```php
// routes/web.php
Route::get('/settings', fn () => Inertia::render('Settings'))
    ->middleware('auth')
    ->name('settings');
```

### Adding New Pages (Livewire)

```php
// app/Livewire/Settings.php
class Settings extends Component
{
    public function render()
    {
        return view('livewire.settings')
            ->layout('components.layouts.app');
    }
}
```

```php
// routes/web.php
Route::get('/settings', Settings::class)
    ->middleware('auth')
    ->name('settings');
```

## Dark Mode Support

All starter kits include dark mode:

```tsx
// React
import { useTheme } from '@/hooks/use-theme'

function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            Toggle Theme
        </button>
    )
}
```

```vue
<!-- Vue -->
<script setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
    <button @click="toggleDark()">Toggle Theme</button>
</template>
```

## TypeScript Support

React and Vue kits include full TypeScript support:

```tsx
// resources/js/types/index.d.ts
export interface User {
    id: number
    name: string
    email: string
    email_verified_at?: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User
    }
}
```

## Testing

```php
test('dashboard requires authentication', function () {
    $this->get('/dashboard')
        ->assertRedirect('/login');
});

test('authenticated users can view dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/dashboard')
        ->assertOk();
});
```

## Conclusion

Laravel 12 starter kits provide a solid foundation with your choice of modern frontend stack. WorkOS integration adds enterprise-ready authentication out of the box. Pick your stack and start building.

---

## Resources

- [Laravel Starter Kits](https://laravel.com/docs/starter-kits)
- [WorkOS AuthKit](https://workos.com/authkit)
- [Inertia.js](https://inertiajs.com)

