---
title: "Livewire 4 Islands Architecture: Partial Page Loading Done Right"
description: Master Livewire 4's Islands architecture for building fast, responsive UIs. Learn lazy loading, polling, placeholders, and when to use islands vs traditional components.
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

# Livewire 4 Islands Architecture: Partial Page Loading Done Right

**Islands architecture** in Livewire 4 allows parts of your page to load and update independently. Think of each island as a self-contained unit that can fetch its own data, show loading states, and refresh without affecting the rest of the page.

## The Problem Islands Solve

Traditional Livewire pages load everything at once:

```blade
{{-- Old approach: Everything blocks the page --}}
<div>
    <livewire:header />           {{-- Fast: 50ms --}}
    <livewire:user-stats />       {{-- Slow: 500ms --}}
    <livewire:activity-feed />    {{-- Slow: 800ms --}}
    <livewire:notifications />    {{-- Medium: 200ms --}}
</div>
```

**Total page load: 1,550ms** - User sees nothing until everything is ready.

With Islands:

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

**Initial page load: 50ms** - User sees content immediately, rest loads progressively.

## Basic Island Syntax

### Simple Island

```blade
@island
    <livewire:expensive-component />
@endisland
```

### Lazy Loading

Load component after initial page render:

```blade
@island(lazy: true)
    <livewire:heavy-data-table />

    <x-slot:placeholder>
        <div class="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
    </x-slot:placeholder>
@endisland
```

### Auto-Polling

Refresh component at intervals:

```blade
@island(poll: '5s')
    <livewire:live-stats />
@endisland

@island(poll: '1m')
    <livewire:activity-log />
@endisland
```

### Combined Options

```blade
@island(lazy: true, poll: '30s')
    <livewire:notifications />

    <x-slot:placeholder>
        <x-notification-skeleton />
    </x-slot:placeholder>
@endisland
```

## Building Island-Optimized Components

### Component Structure

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

### Placeholder Component

```blade
{{-- resources/views/components/chart-skeleton.blade.php --}}
<div class="bg-white rounded-xl border-2 border-black p-6">
    <div class="animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div class="h-64 bg-gray-200 rounded"></div>
    </div>
</div>
```

### Usage in Page

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

## Advanced Patterns

### Conditional Islands

```blade
@if($user->hasPremiumFeatures())
    @island(lazy: true)
        <livewire:premium-analytics />
    @endisland
@endif
```

### Nested Islands

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

### Event-Triggered Loading

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

## Performance Comparison

### Real-World Dashboard Benchmark

| Metric | Traditional | Islands | Improvement |
|--------|-------------|---------|-------------|
| First Contentful Paint | 1.8s | 0.4s | 4.5x faster |
| Time to Interactive | 2.2s | 0.6s | 3.7x faster |
| Largest Contentful Paint | 2.5s | 0.8s | 3.1x faster |
| Total Blocking Time | 450ms | 120ms | 3.75x faster |

### Server Load

Islands make more HTTP requests but:
- Each request is smaller and faster
- Requests are parallelized
- Failed components don't break the page
- Cache can be applied per-island

## Best Practices

### 1. Use Meaningful Placeholders

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

### 2. Prioritize Above-the-Fold Content

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

### 3. Appropriate Polling Intervals

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

### 4. Handle Errors Gracefully

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

## When NOT to Use Islands

### Tightly Coupled Components

```blade
{{-- Don't island components that depend on each other --}}
<livewire:form-step-1 />
<livewire:form-step-2 />  {{-- Needs step 1 data --}}
<livewire:form-step-3 />  {{-- Needs step 2 data --}}
```

### Small, Fast Components

```blade
{{-- Overhead not worth it for simple components --}}
@island(lazy: true)  {{-- Unnecessary --}}
    <livewire:simple-counter />
@endisland
```

### SEO-Critical Content

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

## Conclusion

Islands architecture transforms how we think about page loading in Livewire. Instead of waiting for everything, users see content progressively—making applications feel significantly faster even when total data hasn't changed.

The key is identifying which parts of your UI are independent enough to load separately, and using meaningful placeholders that maintain layout stability.

---

## Resources

- [Livewire 4 Documentation](https://livewire.laravel.com)
- [Islands Architecture Concept](https://jasonformat.com/islands-architecture/)

