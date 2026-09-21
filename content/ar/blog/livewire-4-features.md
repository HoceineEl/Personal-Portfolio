---
title: "Livewire 4: ميزات ثورية تغيّر طريقة بناء واجهات Laravel"
description: تعرّف على ميزات Livewire 4 الفارقة، ومنها مترجم Blaze (عرض أسرع 20x)، وبنية Islands، والمكوّنات أحادية الملف، ودعم property hooks في PHP 8.4.
tags:
  - Livewire
  - Livewire 4
  - Laravel
  - TALL Stack
  - PHP
noImage: true
createdAt: 2025-10-20T09:00:00.000Z
updatedAt: 2025-10-20T09:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Livewire 4: ميزات ثورية تغيّر طريقة بناء واجهات Laravel

كشف Caleb Porzio عن **Livewire 4** في **Laracon US 2025**، والإصدار ثوري بكل معنى الكلمة. فمع مترجم Blaze الذي يجعل العرض أسرع 20x، وبنية Islands التي تتيح تحميل أجزاء من الصفحة، يمثّل Livewire 4 أكبر قفزة للإطار منذ نشأته.

> **ملاحظة:** ما زال Livewire 4 في مرحلة beta. ورغم أنه جاهز للإنتاج في حالات استخدام كثيرة، توقّع بعض التحسينات قبل الإصدار المستقر.

## مترجم Blaze: عرض أسرع 20x

الميزة الأبرز هي **Blaze**، طبقة تحسين جديدة تعرض المحتوى الثابت مسبقًا وقت الترجمة (compile time):

### كيف يعمل

ينفّذ Blaze ما يُسمّى "code folding": يعرض الأجزاء الثابتة من قوالب Blade مسبقًا، فلا تحتاج إلى معالجة مع كل طلب.

**نتائج العرض في Laracon:**
```
Before Blaze: 329ms render time
After Blaze:   19ms render time
```

**قياس من مشروع حقيقي:**
- جدول بيانات فيه 29,000 مكوّن Blade
- قبل: 1.6 ثانية
- بعد: 131 ميلي ثانية

### تفعيل Blaze

```php
// In your Livewire component
use Livewire\Attributes\Blaze;

#[Blaze]
class UserDashboard extends Component
{
    // Component code
}
```

## بنية Islands

تتيح لك Islands أن تغلّف الأجزاء المكلفة من المكوّن لتُعرض مستقلة عن بقيته:

```blade
<div>
    <h1>Dashboard</h1>

    {{-- This loads immediately --}}
    <x-quick-stats />

    {{-- This loads independently after initial render --}}
    @island
        <livewire:expensive-chart />
    @endisland

    {{-- Lazy load with loading state --}}
    @island(lazy: true)
        <livewire:heavy-data-table />
        <x-slot:placeholder>
            <div class="animate-pulse h-64 bg-gray-200 rounded"></div>
        </x-slot:placeholder>
    @endisland

    {{-- Auto-refresh island every 5 seconds --}}
    @island(poll: '5s')
        <livewire:live-notifications />
    @endisland
</div>
```

### الفوائد

- **عرض لا يعطّل الصفحة** - الاستعلامات البطيئة لا توقف الصفحة كلها
- **تحميل تدريجي** - المحتوى المهم يُحمَّل أولًا
- **تحديثات مستقلة** - تتحدّث الـ Islands دون أن تمسّ بقية الصفحة
- **استطلاع تلقائي (polling)** - تحديثات لحظية مدمجة

## المكوّنات أحادية الملف (SFCs)

يقدّم Livewire 4 **نهجًا يبدأ من الـ view** عبر ملفات `.wire.php`:

```php
{{-- resources/views/components/counter.wire.php --}}
<?php
use function Livewire\Volt\{state, computed, action};

state(['count' => 0]);

$increment = action(fn () => $this->count++);
$decrement = action(fn () => $this->count--);

$doubled = computed(fn () => $this->count * 2);
?>

<div>
    <h2>Count: {{ $count }}</h2>
    <p>Doubled: {{ $this->doubled }}</p>

    <button wire:click="increment">+</button>
    <button wire:click="decrement">-</button>
</div>
```

### مكوّنات أحادية الملف مبنية على الأصناف

للمنطق المعقّد:

```php
{{-- resources/views/components/contact-form.wire.php --}}
<?php

use Livewire\Volt\Component;

new class extends Component {
    public string $name = '';
    public string $email = '';
    public string $message = '';

    protected function rules()
    {
        return [
            'name' => 'required|min:2',
            'email' => 'required|email',
            'message' => 'required|min:10',
        ];
    }

    public function submit()
    {
        $this->validate();

        Contact::create($this->only(['name', 'email', 'message']));

        $this->reset();
        session()->flash('success', 'Message sent!');
    }
}
?>

<form wire:submit="submit">
    <input wire:model="name" placeholder="Name">
    <input wire:model="email" type="email" placeholder="Email">
    <textarea wire:model="message" placeholder="Message"></textarea>
    <button type="submit">Send</button>
</form>
```

## الـ Slots والسمات في المكوّنات

أخيرًا، slots شبيهة بـ Blade داخل مكوّنات Livewire:

```php
{{-- Parent component --}}
<livewire:modal>
    <x-slot:header>
        <h2>Confirm Action</h2>
    </x-slot:header>

    <p>Are you sure you want to proceed?</p>

    <x-slot:footer>
        <button wire:click="confirm">Yes</button>
        <button wire:click="cancel">No</button>
    </x-slot:footer>
</livewire:modal>
```

```php
{{-- Modal.wire.php --}}
<div class="modal">
    <div class="modal-header">
        {{ $header }}
    </div>

    <div class="modal-body">
        {{ $slot }}
    </div>

    <div class="modal-footer">
        {{ $footer }}
    </div>
</div>
```

### تمرير السمات

```blade
<livewire:input
    wire:model="name"
    class="custom-class"
    placeholder="Enter name"
    {{ $attributes }}
/>
```

## Property Hooks في PHP 8.4

دعم كامل لـ property accessors في PHP 8.4:

```php
class Counter extends Component
{
    public int $count = 0 {
        set {
            // Prevent negative values
            $this->count = max(0, $value);
        }
    }

    public function decrement()
    {
        $this->count--; // Automatically clamped to 0
    }
}
```

## حالات تحميل محسّنة

سمات `data-loading` تلقائية:

```blade
<button wire:click="save" class="btn">
    <span data-loading:remove>Save</span>
    <span data-loading:show class="hidden">Saving...</span>
</button>

{{-- Or with CSS classes --}}
<button
    wire:click="save"
    data-loading:class="opacity-50 cursor-wait"
>
    Save
</button>
```

## امتدادات البرق ⚡

نعم، يمكنك وضع رمز البرق فعلًا في أسماء الملفات:

```
resources/views/components/⚡counter.wire.php
```

تظهر هذه الملفات في أعلى المجلد، وتميّز مكوّنات Livewire بوضوح.

## قياسات الأداء

من عروض Laracon US 2025:

| السيناريو | قبل | بعد | التحسّن |
|----------|--------|-------|-------------|
| تحميل واجهة معقّدة | 900ms | 300ms | أسرع 3x |
| مكوّنات متداخلة | 1.6s | 131ms | أسرع 12x |
| الاستجابة التفاعلية | 100ms | 10ms | أسرع 10x |

## الترقية من Livewire 3

لا تغييرات كبيرة تكسر التوافق! مكوّناتك الحالية تواصل العمل:

```bash
composer require livewire/livewire:"^4.0"
```

ثم تبنَّ الميزات الجديدة تدريجيًا:
1. فعّل Blaze على المكوّنات الثقيلة
2. حوّل المكوّنات المتكررة إلى SFCs
3. أضف Islands للعمليات المكلفة
4. استخدم الـ slots حيث تحتاجها

## الخلاصة

يمثّل Livewire 4 قفزة هائلة في قدرات Laravel التفاعلية. مترجم Blaze وحده يستحق الترقية، ومع بنية Islands والمكوّنات أحادية الملف يتضح أن Livewire لم يعد مجرد خيار "جيد بما يكفي"، بل صار استثنائيًا فعلًا.

لم يبدُ مستقبل تطوير الواجهات الأمامية في Laravel أكثر إشراقًا من الآن.

---

## مصادر

- [إعلان Livewire 4](https://laravel.com/blog/livewire-4-is-here-the-artisan-of-the-day-is-caleb-porzio)
- [توثيق Livewire](https://livewire.laravel.com)
- [Laravel News - Livewire 4](https://laravel-news.com/everything-we-know-about-livewire-4)
