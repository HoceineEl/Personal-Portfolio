---
title: "حزم البداية في Laravel 12: React و Vue و Livewire و WorkOS"
description: تعرّف على حزم البداية الجديدة في Laravel 12 بواجهات React أو Vue أو Livewire، مع WorkOS AuthKit لمصادقة بمستوى المؤسسات جاهزة من أول تشغيل.
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

# حزم البداية في Laravel 12: React و Vue و Livewire و WorkOS

يقدّم **Laravel 12** حزم بداية (starter kits) أُعيد تصميمها، تتيح لك واجهة أمامية بـ React أو Vue أو Livewire، مع تكامل اختياري مع WorkOS AuthKit لمصادقة بمستوى المؤسسات.

## ما الجديد في حزم البداية في Laravel 12

- واجهة أمامية تختارها: React أو Vue أو Livewire
- خيار التكامل مع WorkOS AuthKit
- تسجيل الدخول بالحسابات الاجتماعية (Google و Microsoft و GitHub)
- دعم الدخول الموحد للمؤسسات (Enterprise SSO)
- واجهة حديثة متجاوبة

## التثبيت

### React مع Inertia

```bash
laravel new my-app --react
```

### Vue مع Inertia

```bash
laravel new my-app --vue
```

### Livewire

```bash
laravel new my-app --livewire
```

### مع مصادقة WorkOS

```bash
laravel new my-app --react --workos
# or
laravel new my-app --vue --workos
# or
laravel new my-app --livewire --workos
```

## ميزات WorkOS AuthKit

### تسجيل الدخول الاجتماعي

مزوّدو تسجيل دخول اجتماعي مضبوطون مسبقًا:

```php
// Users can sign in with:
// - Google
// - Microsoft
// - GitHub
// - Apple
// - LinkedIn
```

### الدخول الموحد للمؤسسات (Enterprise SSO)

تسجيل دخول موحد (Single Sign-On) لعملاء المؤسسات:

```php
// Support for:
// - SAML
// - OIDC
// - Directory Sync
// - SCIM provisioning
```

### الإعداد

```env
# .env
WORKOS_API_KEY=your-api-key
WORKOS_CLIENT_ID=your-client-id
WORKOS_REDIRECT_URI=http://localhost:8000/authenticate
```

## بنية حزمة React

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

### مكوّنات React

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

## بنية حزمة Vue

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

### مكوّنات Vue

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

## بنية حزمة Livewire

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

### مكوّنات Livewire

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

## مسارات المصادقة

كل حزم البداية تتضمن هذه المسارات:

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

## مسار المصادقة عبر WorkOS

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

## التخصيص

### إضافة صفحات جديدة (React)

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

### إضافة صفحات جديدة (Livewire)

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

## دعم الوضع الداكن

كل حزم البداية تتضمن الوضع الداكن:

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

## دعم TypeScript

حزمتا React و Vue تدعمان TypeScript دعمًا كاملًا:

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

## الاختبار

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

## الخلاصة

تمنحك حزم البداية في Laravel 12 أساسًا متينًا مع حرية اختيار واجهتك الأمامية الحديثة. ويضيف التكامل مع WorkOS مصادقة جاهزة للمؤسسات من أول تشغيل. اختر أدواتك وابدأ البناء.

---

## مصادر

- [حزم البداية في Laravel](https://laravel.com/docs/starter-kits)
- [WorkOS AuthKit](https://workos.com/authkit)
- [Inertia.js](https://inertiajs.com)

