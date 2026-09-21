---
title: "Laravel Precognition: تحقق فوري دون تنفيذ الطلب كاملًا"
description: طبّق التحقق الفوري من النماذج باستخدام Laravel Precognition. تعلّم التحقق المباشر، والتكامل مع Vue/React، والتحقق الجزئي، وتحسين تجربة استخدام النماذج.
tags:
  - Laravel
  - Precognition
  - Validation
  - Forms
noImage: true
createdAt: 2025-05-20T10:00:00.000Z
updatedAt: 2025-05-20T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel Precognition: تحقق فوري دون تنفيذ الطلب كاملًا

تتيح **Laravel Precognition** التحقق الفوري من النماذج، فهي تشغّل قواعد التحقق الموجودة على الخادم دون تنفيذ الطلب كاملًا. يرى المستخدم النتيجة مباشرة أثناء الكتابة.

## كيف تعمل

1. يكتب المستخدم في أحد حقول النموذج
2. ترسل Precognition طلب تحقق خفيفًا
3. يتحقق الخادم من البيانات بقواعدك الحالية
4. تظهر الأخطاء فورًا، دون إعادة تحميل الصفحة

## التثبيت

```bash
composer require laravel/precognition
npm install laravel-precognition-vue
# or
npm install laravel-precognition-react
```

## الإعداد الأساسي

### المتحكم (Controller)

```php
// app/Http/Controllers/UserController.php
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8', 'confirmed'],
        ]);

        $user = User::create($validated);

        return redirect()->route('users.show', $user);
    }
}
```

### المسارات (Routes)

```php
// routes/web.php
use App\Http\Controllers\UserController;

Route::post('/users', [UserController::class, 'store'])
    ->middleware('precognitive');
```

### التكامل مع Vue

```vue
<script setup>
import { useForm } from 'laravel-precognition-vue'

const form = useForm('post', '/users', {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
})

const submit = () => form.submit()
</script>

<template>
    <form @submit.prevent="submit">
        <div>
            <label>Name</label>
            <input
                v-model="form.name"
                @change="form.validate('name')"
            />
            <span v-if="form.errors.name" class="error">
                {{ form.errors.name }}
            </span>
        </div>

        <div>
            <label>Email</label>
            <input
                v-model="form.email"
                @change="form.validate('email')"
                type="email"
            />
            <span v-if="form.errors.email" class="error">
                {{ form.errors.email }}
            </span>
        </div>

        <div>
            <label>Password</label>
            <input
                v-model="form.password"
                @change="form.validate('password')"
                type="password"
            />
            <span v-if="form.errors.password" class="error">
                {{ form.errors.password }}
            </span>
        </div>

        <div>
            <label>Confirm Password</label>
            <input
                v-model="form.password_confirmation"
                @change="form.validate('password_confirmation')"
                type="password"
            />
        </div>

        <button :disabled="form.processing">
            {{ form.processing ? 'Creating...' : 'Create User' }}
        </button>
    </form>
</template>
```

## التكامل مع React

```jsx
import { useForm } from 'laravel-precognition-react'

export default function CreateUser() {
    const form = useForm('post', '/users', {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const submit = (e) => {
        e.preventDefault()
        form.submit()
    }

    return (
        <form onSubmit={submit}>
            <div>
                <label>Name</label>
                <input
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    onBlur={() => form.validate('name')}
                />
                {form.errors.name && (
                    <span className="error">{form.errors.name}</span>
                )}
            </div>

            <div>
                <label>Email</label>
                <input
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    onBlur={() => form.validate('email')}
                    type="email"
                />
                {form.errors.email && (
                    <span className="error">{form.errors.email}</span>
                )}
            </div>

            <button disabled={form.processing}>
                {form.processing ? 'Creating...' : 'Create User'}
            </button>
        </form>
    )
}
```

## التكامل مع Inertia

```bash
npm install laravel-precognition-vue-inertia
```

```vue
<script setup>
import { useForm } from 'laravel-precognition-vue-inertia'

const form = useForm('post', '/users', {
    name: '',
    email: '',
})

const submit = () => form.submit({
    preserveScroll: true,
    onSuccess: () => form.reset(),
})
</script>
```

## استراتيجيات التحقق

### التحقق عند مغادرة الحقل (Blur)

```vue
<input
    v-model="form.email"
    @blur="form.validate('email')"
/>
```

### التحقق عند التغيير (مع Debounce)

```vue
<script setup>
import { useForm } from 'laravel-precognition-vue'
import { debounce } from 'lodash-es'

const form = useForm('post', '/users', { email: '' })

const validateEmail = debounce(() => {
    form.validate('email')
}, 300)
</script>

<template>
    <input
        v-model="form.email"
        @input="validateEmail"
    />
</template>
```

### التحقق من عدة حقول

```vue
<script setup>
const validatePasswords = () => {
    form.validate(['password', 'password_confirmation'])
}
</script>

<template>
    <input
        v-model="form.password_confirmation"
        @blur="validatePasswords"
        type="password"
    />
</template>
```

## أصناف Form Request

```php
// app/Http/Requests/CreateUserRequest.php
class CreateUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8', 'confirmed'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already registered.',
            'password.min' => 'Password must be at least 8 characters.',
        ];
    }
}
```

```php
// Controller
public function store(CreateUserRequest $request)
{
    $user = User::create($request->validated());
    return redirect()->route('users.show', $user);
}
```

## رفع الملفات

```vue
<script setup>
import { useForm } from 'laravel-precognition-vue'

const form = useForm('post', '/users', {
    name: '',
    avatar: null,
})

const handleFile = (e) => {
    form.avatar = e.target.files[0]
    form.validate('avatar')
}
</script>

<template>
    <input
        type="file"
        @change="handleFile"
        accept="image/*"
    />
    <span v-if="form.errors.avatar">{{ form.errors.avatar }}</span>
</template>
```

## التحقق المشروط

```php
public function rules(): array
{
    return [
        'type' => ['required', 'in:individual,company'],
        'company_name' => ['required_if:type,company', 'string', 'max:255'],
        'tax_id' => ['required_if:type,company', 'string'],
        'first_name' => ['required_if:type,individual', 'string'],
        'last_name' => ['required_if:type,individual', 'string'],
    ];
}
```

```vue
<script setup>
const validateCompanyFields = () => {
    if (form.type === 'company') {
        form.validate(['company_name', 'tax_id'])
    }
}
</script>
```

## حالتا Touched و Dirty

```vue
<template>
    <input
        v-model="form.email"
        @blur="form.touch('email')"
        :class="{
            'border-red-500': form.touched('email') && form.errors.email,
            'border-green-500': form.touched('email') && !form.errors.email,
        }"
    />

    <!-- Only show error if field was touched -->
    <span v-if="form.touched('email') && form.errors.email">
        {{ form.errors.email }}
    </span>

    <!-- Check if form has changes -->
    <button :disabled="!form.isDirty">Save Changes</button>
</template>
```

## إعادة الضبط والمسح

```vue
<script setup>
const form = useForm('post', '/users', {
    name: '',
    email: '',
})

// Reset to initial values
const reset = () => form.reset()

// Reset specific fields
const resetEmail = () => form.reset('email')

// Clear all errors
const clearErrors = () => form.clearErrors()

// Clear specific error
const clearEmailError = () => form.clearErrors('email')
</script>
```

## تحويل البيانات

```vue
<script setup>
const form = useForm('post', '/users', {
    name: '',
    email: '',
})

form.transform((data) => ({
    ...data,
    email: data.email.toLowerCase().trim(),
}))
</script>
```

## إعداد Axios

```js
// resources/js/app.js
import { client } from 'laravel-precognition-vue'

client.axios.defaults.headers.common['X-Custom-Header'] = 'value'

// Or use interceptors
client.axios.interceptors.request.use((config) => {
    config.headers['Authorization'] = `Bearer ${token}`
    return config
})
```

## الاختبار

```php
test('validates email uniqueness', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $this->post('/users', [
        'email' => 'taken@example.com',
    ], [
        'Precognition' => 'true',
        'Precognition-Validate-Only' => 'email',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors('email');
});

test('passes validation with unique email', function () {
    $this->post('/users', [
        'email' => 'new@example.com',
    ], [
        'Precognition' => 'true',
        'Precognition-Validate-Only' => 'email',
    ])
        ->assertStatus(204);
});
```

## الخلاصة

تقدّم Laravel Precognition تحققًا فوريًا بقواعدك الحالية على الخادم. لا تكرار لمنطق التحقق، واستجابة فورية للمستخدم، وتجربة أسلس في تعبئة النماذج.

---

## مصادر

- [توثيق Laravel Precognition](https://laravel.com/docs/precognition)
- [حزمة Vue](https://github.com/laravel/precognition)

