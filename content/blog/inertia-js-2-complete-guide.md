---
title: "Inertia.js 2.0: Complete Guide to All New Features"
description: Master Inertia.js 2.0's game-changing features - async requests, deferred props, polling, prefetching, infinite scroll, WhenVisible, and history encryption.
tags:
  - Inertia.js
  - Laravel
  - Vue
  - React
  - SPA
noImage: true
createdAt: 2025-05-28T10:00:00.000Z
updatedAt: 2025-05-28T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Inertia.js 2.0: Complete Guide to All New Features

**Inertia.js 2.0** brings a completely rewritten request handling layer that enables asynchronous operations, unlocking powerful new features while maintaining seamless Laravel integration with Vue, React, and Svelte.

## What's New in Inertia 2.0

The headline features include:
- Asynchronous requests
- Deferred props
- Prefetching
- Polling
- Infinite scrolling
- WhenVisible component
- History encryption

## 1. Asynchronous Requests

Previously, all Inertia requests were synchronous—each new request would cancel the previous one. In 2.0, requests can run simultaneously without blocking the UI.

### The Async Property

```vue
<script setup>
import { Link } from '@inertiajs/vue3'
</script>

<template>
    <!-- Async request - doesn't show loading indicator -->
    <Link
        method="put"
        :href="`/settings/${id}`"
        :data="{ enabled: !enabled }"
        async
    >
        Toggle Setting
    </Link>
</template>
```

### Optimistic UI Updates

Because async requests don't block, you can update the UI immediately:

```vue
<script setup>
import { router } from '@inertiajs/vue3'
import { ref } from 'vue'

const isEnabled = ref(false)

const toggle = () => {
    // Update UI immediately (optimistic)
    isEnabled.value = !isEnabled.value

    // Send request in background
    router.put('/settings/theme', {
        enabled: isEnabled.value
    }, {
        async: true,
        onError: () => {
            // Revert on failure
            isEnabled.value = !isEnabled.value
        }
    })
}
</script>

<template>
    <button @click="toggle">
        {{ isEnabled ? 'Enabled' : 'Disabled' }}
    </button>
</template>
```

## 2. Deferred Props

Load heavy data after the initial page render. Critical data appears immediately, while expensive queries load in the background.

### Backend Setup

```php
// app/Http/Controllers/DashboardController.php
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            // Loads immediately
            'user' => auth()->user(),
            'notifications' => auth()->user()->unreadNotifications()->limit(5)->get(),

            // Deferred - loads after page renders
            'stats' => Inertia::defer(fn () => $this->calculateStats()),
            'recentOrders' => Inertia::defer(fn () => Order::with('customer')
                ->latest()
                ->limit(10)
                ->get()
            ),
            'chartData' => Inertia::defer(fn () => $this->getChartData()),
        ]);
    }
}
```

### Frontend Handling

```vue
<script setup>
import { Deferred } from '@inertiajs/vue3'

defineProps({
    user: Object,
    notifications: Array,
    stats: Object,
    recentOrders: Array,
    chartData: Object,
})
</script>

<template>
    <!-- Shows immediately -->
    <header>
        <h1>Welcome, {{ user.name }}</h1>
        <NotificationBell :count="notifications.length" />
    </header>

    <!-- Deferred content with loading state -->
    <Deferred :data="['stats']">
        <template #fallback>
            <div class="animate-pulse">
                <div class="h-24 bg-gray-200 rounded"></div>
            </div>
        </template>

        <StatsCards :stats="stats" />
    </Deferred>

    <Deferred :data="['recentOrders', 'chartData']">
        <template #fallback>
            <Skeleton />
        </template>

        <OrdersTable :orders="recentOrders" />
        <RevenueChart :data="chartData" />
    </Deferred>
</template>
```

### Grouped Deferred Props

Load related props together:

```php
return Inertia::render('Analytics', [
    // Group 1: Charts (load together)
    'revenueChart' => Inertia::defer(fn () => $this->getRevenueData())->group('charts'),
    'usersChart' => Inertia::defer(fn () => $this->getUsersData())->group('charts'),

    // Group 2: Tables (load together)
    'topProducts' => Inertia::defer(fn () => $this->getTopProducts())->group('tables'),
    'topCustomers' => Inertia::defer(fn () => $this->getTopCustomers())->group('tables'),
]);
```

## 3. Prefetching

Load pages before the user navigates to them for instant transitions.

### Link Prefetching

```vue
<template>
    <!-- Prefetch on hover (default) -->
    <Link href="/users" prefetch>Users</Link>

    <!-- Prefetch immediately on mount -->
    <Link href="/dashboard" prefetch="mount">Dashboard</Link>

    <!-- Prefetch on hover with cache duration -->
    <Link
        href="/settings"
        prefetch="hover"
        :cacheFor="['5s', '1m']"
    >
        Settings
    </Link>
</template>
```

### Manual Prefetching

```vue
<script setup>
import { router } from '@inertiajs/vue3'

// Prefetch when component mounts
onMounted(() => {
    router.prefetch('/users', { method: 'get' })
})

// Or prefetch with specific props
router.prefetch('/dashboard', {
    method: 'get',
    data: { period: 'week' }
})
</script>
```

### Cache Control

```vue
<Link
    href="/reports"
    prefetch="hover"
    :cacheFor="['30s', '5m']"
>
    <!-- First value: stale time (use cache) -->
    <!-- Second value: cache time (keep in memory) -->
    Reports
</Link>
```

## 4. Polling

Keep your UI in sync with server state automatically.

### Basic Polling

```vue
<script setup>
import { usePoll } from '@inertiajs/vue3'

// Poll every 5 seconds, only refresh 'notifications'
usePoll(5000, {
    only: ['notifications'],
})
</script>
```

### Controlled Polling

```vue
<script setup>
import { usePoll } from '@inertiajs/vue3'
import { ref } from 'vue'

const visitorCount = ref(0)

const { start, stop } = usePoll(3000, {
    only: ['visitorCount'],
    onSuccess: (response) => {
        visitorCount.value = response.props.visitorCount
    }
}, {
    keepAlive: true,    // Continue polling when tab is hidden
    autoStart: true,    // Start automatically
})

// Manual control
const pausePolling = () => stop()
const resumePolling = () => start()
</script>

<template>
    <div>
        <p>Live visitors: {{ visitorCount }}</p>
        <button @click="pausePolling">Pause</button>
        <button @click="resumePolling">Resume</button>
    </div>
</template>
```

### Real-World: Live Dashboard

```vue
<script setup>
import { usePoll } from '@inertiajs/vue3'

defineProps({
    leaderboard: Array,
    liveStats: Object,
})

// Update leaderboard every 10 seconds
usePoll(10000, {
    only: ['leaderboard', 'liveStats'],
})
</script>

<template>
    <LiveStatsBar :stats="liveStats" />
    <Leaderboard :entries="leaderboard" />
</template>
```

## 5. WhenVisible Component

Load data only when elements scroll into view using the Intersection Observer API.

### Basic Usage

```php
// Controller
return Inertia::render('Posts/Show', [
    'post' => $post,
    // Optional props - only loaded when requested
    'comments' => Inertia::optional(fn () => $post->comments()->with('author')->get()),
    'relatedPosts' => Inertia::optional(fn () => $post->related()->limit(5)->get()),
]);
```

```vue
<script setup>
import { WhenVisible } from '@inertiajs/vue3'

defineProps({
    post: Object,
    comments: Array,
    relatedPosts: Array,
})
</script>

<template>
    <article>
        <h1>{{ post.title }}</h1>
        <div v-html="post.content"></div>
    </article>

    <!-- Comments load when scrolled into view -->
    <WhenVisible data="comments" :buffer="200">
        <template #fallback>
            <CommentsSkeleton />
        </template>

        <CommentsSection :comments="comments" />
    </WhenVisible>

    <!-- Related posts load when visible -->
    <WhenVisible data="relatedPosts">
        <template #fallback>
            <div class="animate-pulse">Loading related posts...</div>
        </template>

        <RelatedPosts :posts="relatedPosts" />
    </WhenVisible>
</template>
```

### With Buffer

Preload before element is visible:

```vue
<!-- Start loading 200px before element is visible -->
<WhenVisible data="heavyContent" :buffer="200">
    <HeavyComponent :data="heavyContent" />
</WhenVisible>
```

## 6. Infinite Scrolling

Built on WhenVisible and the new `Inertia::merge()` helper.

### Backend Setup

```php
// app/Http/Controllers/PostController.php
class PostController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Posts/Index', [
            'posts' => Inertia::merge(fn () =>
                Post::with('author')
                    ->latest()
                    ->paginate(15)
                    ->through(fn ($post) => [
                        'id' => $post->id,
                        'title' => $post->title,
                        'excerpt' => $post->excerpt,
                        'author' => $post->author->name,
                        'created_at' => $post->created_at->diffForHumans(),
                    ])
            ),
        ]);
    }
}
```

### Frontend Implementation

```vue
<script setup>
import { WhenVisible } from '@inertiajs/vue3'

defineProps({
    posts: Object,
})
</script>

<template>
    <div class="space-y-4">
        <PostCard
            v-for="post in posts.data"
            :key="post.id"
            :post="post"
        />

        <!-- Load more when scrolled to bottom -->
        <WhenVisible
            v-if="posts.next_page_url"
            :data="{ posts: posts.next_page_url }"
            :buffer="300"
        >
            <template #fallback>
                <div class="flex justify-center py-4">
                    <Spinner />
                </div>
            </template>
        </WhenVisible>

        <p v-else class="text-center text-gray-500 py-4">
            No more posts to load
        </p>
    </div>
</template>
```

## 7. History Encryption

Inertia 2.0 automatically encrypts browser history state to prevent seeing privileged information after logout.

### Enabled by Default

```php
// No configuration needed - enabled automatically
```

### Disable for Specific Pages

```php
return Inertia::render('PublicPage', [
    'publicData' => $data,
])->withoutEncryptingHistory();
```

### Why It Matters

Without encryption, after logout a user could hit the back button and see previous page data. With history encryption, this data is unreadable.

## Upgrading from 1.x

The upgrade is smooth with minimal breaking changes:

```bash
# Update packages
composer update inertiajs/inertia-laravel
npm update @inertiajs/vue3  # or @inertiajs/react
```

### Breaking Changes

1. **Vue 2 dropped** - Upgrade to Vue 3
2. **Svelte 3 dropped** - Upgrade to Svelte 4+
3. **Partial reloads are async** - May affect dependent logic

## Performance Comparison

| Feature | Before | After |
|---------|--------|-------|
| Initial page load | All data loaded | Only critical data |
| Heavy queries | Block navigation | Load in background |
| Real-time data | Manual polling | Built-in usePoll |
| Long lists | Load all at once | Infinite scroll |
| Navigation | Load on click | Prefetch on hover |

## Conclusion

Inertia.js 2.0 is a major leap forward. Async requests, deferred props, and prefetching create faster, more responsive applications. The new polling and WhenVisible features simplify real-time UIs, while history encryption improves security by default.

---

## Resources

- [Inertia.js Documentation](https://inertiajs.com)
- [Inertia 2.0 Announcement](https://blog.laravel.com/announcing-inertia-20-redefining-frontend-development-for-laravel)
- [Upgrade Guide](https://inertiajs.com/docs/v2/getting-started/upgrade-guide)

