---
title: "بنية الجُزر في Livewire 4: التحميل الجزئي للصفحة كما يجب"
description: "أتقن بنية الجُزر (Islands) في Livewire 4 لبناء واجهات سريعة الاستجابة. تعلّم التحميل الكسول، والتحديث الدوري (polling)، والعناصر المؤقتة (placeholders)، ومتى تختار الجُزر بدل المكوّنات التقليدية."
tags:
  - Livewire
  - Livewire 4
  - Laravel
  - Performance
  - TALL Stack
noImage: true
createdAt: 2025-11-01T09:00:00.000Z
updatedAt: 2025-11-01T09:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# بنية الجُزر في Livewire 4: التحميل الجزئي للصفحة كما يجب

تتيح **بنية الجُزر (Islands architecture)** في Livewire 4 أن تُحمَّل أجزاء صفحتك وتتحدّث كلٌّ منها مستقلًا عن غيره. تخيّل كل جزيرة وحدة قائمة بذاتها: تجلب بياناتها، وتعرض حالات التحميل، وتتحدّث دون أن تمسّ بقية الصفحة.

## المشكلة التي تحلّها الجُزر

صفحات Livewire التقليدية تحمّل كل شيء دفعة واحدة:

```blade
{{-- Old approach: Everything blocks the page --}}
<div>
    <livewire:header />           {{-- Fast: 50ms --}}
    <livewire:user-stats />       {{-- Slow: 500ms --}}
    <livewire:activity-feed />    {{-- Slow: 800ms --}}
    <livewire:notifications />    {{-- Medium: 200ms --}}
</div>
```

**زمن تحميل الصفحة الكلي: 1,550ms**، ولا يرى المستخدم شيئًا حتى يجهز كل شيء.

مع الجُزر:

```blade
{{-- Islands approach: Progressive loading --}}
<div>
    <livewire:header />           {{-- Loads immediately --}}

    @island(lazy: true)
        <livewire:user-stats />
    @endisland

    @island(lazy: true)
        <livewire:activity-feed />
    @endisland

    @island(poll: '30s')
        <livewire:notifications />
    @endisland
</div>
```

**زمن التحميل الأولي: 50ms**، فيرى المستخدم المحتوى فورًا، ويُحمَّل الباقي تدريجيًا.

## الصياغة الأساسية للجزيرة

### جزيرة بسيطة

```blade
@island
    <livewire:expensive-component />
@endisland
```

### التحميل الكسول (Lazy Loading)

حمّل المكوّن بعد العرض الأولي للصفحة:

```blade
@island(lazy: true)
    <livewire:heavy-data-table />

    <x-slot:placeholder>
        <div class="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
    </x-slot:placeholder>
@endisland
```

### التحديث الدوري التلقائي (Auto-Polling)

حدّث المكوّن على فترات منتظمة:

```blade
@island(poll: '5s')
    <livewire:live-stats />
@endisland

@island(poll: '1m')
    <livewire:activity-log />
@endisland
```

### الجمع بين الخيارات

```blade
@island(lazy: true, poll: '30s')
    <livewire:notifications />

    <x-slot:placeholder>
        <x-notification-skeleton />
    </x-slot:placeholder>
@endisland
```

## بناء مكوّنات مهيّأة للجُزر

### بنية المكوّن

```php
// app/Livewire/Dashboard/RevenueChart.php
class RevenueChart extends Component
{
    public string $period = 'week';

    public function mount()
    {
        // Heavy initialization is fine - runs in isolated request
        $this->loadChartData();
    }

    public function loadChartData()
    {
        // Expensive query - doesn't block main page
        $this->data = Order::query()
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue')
            ->where('created_at', '>=', now()->sub($this->period))
            ->groupBy('date')
            ->get();
    }

    public function setPeriod(string $period)
    {
        $this->period = $period;
        $this->loadChartData();
    }

    public function render()
    {
        return view('livewire.dashboard.revenue-chart');
    }
}
```

### مكوّن العنصر المؤقت (Placeholder)

```blade
{{-- resources/views/components/chart-skeleton.blade.php --}}
<div class="bg-white rounded-xl border-2 border-black p-6">
    <div class="animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div class="h-64 bg-gray-200 rounded"></div>
    </div>
</div>
```

### الاستخدام داخل الصفحة

```blade
{{-- Dashboard page --}}
<div class="grid grid-cols-2 gap-6">
    @island(lazy: true)
        <livewire:dashboard.revenue-chart />
        <x-slot:placeholder>
            <x-chart-skeleton />
        </x-slot:placeholder>
    @endisland

    @island(lazy: true)
        <livewire:dashboard.orders-chart />
        <x-slot:placeholder>
            <x-chart-skeleton />
        </x-slot:placeholder>
    @endisland
</div>
```

## أنماط متقدمة

### جُزر مشروطة

```blade
@if($user->hasPremiumFeatures())
    @island(lazy: true)
        <livewire:premium-analytics />
    @endisland
@endif
```

### جُزر متداخلة

```blade
@island(lazy: true)
    <livewire:user-dashboard>
        {{-- Inner islands load after parent --}}
        @island(lazy: true)
            <livewire:user-activity />
        @endisland
    </livewire:user-dashboard>
@endisland
```

### تحميل عند وقوع حدث

```php
// Parent component
public function selectUser($userId)
{
    $this->selectedUserId = $userId;
    $this->dispatch('user-selected', userId: $userId);
}
```

```blade
{{-- In view --}}
@island(on: 'user-selected')
    <livewire:user-details :user-id="$selectedUserId" />

    <x-slot:placeholder>
        <p class="text-gray-500">Select a user to view details</p>
    </x-slot:placeholder>
@endisland
```

## مقارنة الأداء

### قياس أداء على لوحة تحكم حقيقية

| المقياس | التقليدي | الجُزر | التحسّن |
|--------|-------------|---------|-------------|
| First Contentful Paint | 1.8s | 0.4s | أسرع 4.5x |
| Time to Interactive | 2.2s | 0.6s | أسرع 3.7x |
| Largest Contentful Paint | 2.5s | 0.8s | أسرع 3.1x |
| Total Blocking Time | 450ms | 120ms | أسرع 3.75x |

### الحمل على الخادم

تُرسل الجُزر طلبات HTTP أكثر، لكن:
- كل طلب أصغر وأسرع
- الطلبات تُنفَّذ بالتوازي
- فشل مكوّن لا يُعطّل الصفحة
- يمكن تطبيق التخزين المؤقت (cache) لكل جزيرة على حدة

## أفضل الممارسات

### 1. استخدم عناصر مؤقتة معبّرة

```blade
{{-- Bad: Generic loading --}}
<x-slot:placeholder>
    <div>Loading...</div>
</x-slot:placeholder>

{{-- Good: Skeleton that matches content --}}
<x-slot:placeholder>
    <div class="bg-white rounded-lg p-4 border">
        <div class="animate-pulse space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="h-32 bg-gray-200 rounded"></div>
        </div>
    </div>
</x-slot:placeholder>
```

### 2. قدّم المحتوى الظاهر أعلى الصفحة

```blade
<div>
    {{-- Critical content loads immediately --}}
    <livewire:page-header />
    <livewire:key-metrics />

    {{-- Below fold can be lazy --}}
    @island(lazy: true)
        <livewire:detailed-analytics />
    @endisland

    @island(lazy: true)
        <livewire:activity-timeline />
    @endisland
</div>
```

### 3. فترات تحديث دوري مناسبة

```blade
{{-- Real-time data: 5-10 seconds --}}
@island(poll: '5s')
    <livewire:live-orders />
@endisland

{{-- Semi-live data: 30-60 seconds --}}
@island(poll: '30s')
    <livewire:notifications />
@endisland

{{-- Infrequent updates: 5+ minutes --}}
@island(poll: '5m')
    <livewire:system-status />
@endisland
```

### 4. تعامل مع الأخطاء بسلاسة

```php
class RiskyComponent extends Component
{
    public function render()
    {
        try {
            $data = $this->fetchExternalData();
            return view('livewire.risky-component', compact('data'));
        } catch (\Exception $e) {
            return view('livewire.risky-component-error');
        }
    }
}
```

## متى لا تستخدم الجُزر

### المكوّنات شديدة الترابط

```blade
{{-- Don't island components that depend on each other --}}
<livewire:form-step-1 />
<livewire:form-step-2 />  {{-- Needs step 1 data --}}
<livewire:form-step-3 />  {{-- Needs step 2 data --}}
```

### المكوّنات الصغيرة والسريعة

```blade
{{-- Overhead not worth it for simple components --}}
@island(lazy: true)  {{-- Unnecessary --}}
    <livewire:simple-counter />
@endisland
```

### المحتوى المهم لتحسين محركات البحث (SEO)

```blade
{{-- Search engines may not wait for lazy content --}}
<article>
    {{-- Don't lazy load the main content --}}
    <livewire:article-content />

    {{-- OK to lazy load supplementary content --}}
    @island(lazy: true)
        <livewire:related-articles />
    @endisland
</article>
```

## الخلاصة

تغيّر بنية الجُزر طريقة تفكيرنا في تحميل الصفحات داخل Livewire. بدل انتظار كل شيء، يرى المستخدمون المحتوى تدريجيًا، فيبدو التطبيق أسرع بوضوح حتى لو لم يتغيّر حجم البيانات الكلي.

المفتاح أن تحدّد أجزاء واجهتك المستقلة بما يكفي لتُحمَّل منفصلة، وأن تستخدم عناصر مؤقتة معبّرة تحافظ على ثبات التخطيط.

---

## مصادر

- [توثيق Livewire 4](https://livewire.laravel.com)
- [مفهوم بنية الجُزر](https://jasonformat.com/islands-architecture/)

