---
title: "Inertia.js 2.0: دليل شامل لكل المزايا الجديدة"
description: "أتقن المزايا الجديدة في Inertia.js 2.0: الطلبات غير المتزامنة، والخصائص المؤجلة، والاستطلاع الدوري، والتحميل المسبق، والتمرير اللانهائي، و WhenVisible، وتشفير سجل التصفح."
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

# Inertia.js 2.0: دليل شامل لكل المزايا الجديدة

يأتي **Inertia.js 2.0** بطبقة معالجة طلبات أُعيدت كتابتها بالكامل، تتيح العمليات غير المتزامنة. هذه الطبقة تفتح الباب لمزايا جديدة قوية، مع الحفاظ على التكامل السلس بين Laravel و Vue و React و Svelte.

## ما الجديد في Inertia 2.0

أبرز المزايا:
- الطلبات غير المتزامنة (Asynchronous requests)
- الخصائص المؤجلة (Deferred props)
- التحميل المسبق (Prefetching)
- الاستطلاع الدوري (Polling)
- التمرير اللانهائي (Infinite scrolling)
- مكوّن WhenVisible
- تشفير سجل التصفح (History encryption)

## 1. الطلبات غير المتزامنة

في السابق كانت كل طلبات Inertia متزامنة، فكل طلب جديد يلغي الطلب الذي قبله. في الإصدار 2.0 يمكن أن تعمل الطلبات في الوقت نفسه دون أن تعطّل الواجهة.

### خاصية async

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

### تحديثات الواجهة المتفائلة (Optimistic UI)

لأن الطلبات غير المتزامنة لا تعطّل الواجهة، تستطيع تحديث الواجهة فورًا:

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

## 2. الخصائص المؤجلة

حمّل البيانات الثقيلة بعد العرض الأول للصفحة. تظهر البيانات الأساسية فورًا، بينما تُحمَّل الاستعلامات المكلفة في الخلفية.

### الإعداد في الخادم

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

### المعالجة في الواجهة

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

### تجميع الخصائص المؤجلة

حمّل الخصائص المترابطة معًا:

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

## 3. التحميل المسبق

حمّل الصفحات قبل أن ينتقل إليها المستخدم، لتحصل على انتقالات فورية.

### التحميل المسبق للروابط

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

### التحميل المسبق يدويًا

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

### التحكم في التخزين المؤقت

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

## 4. الاستطلاع الدوري

أبقِ واجهتك متزامنة مع حالة الخادم تلقائيًا.

### استطلاع أساسي

```vue
<script setup>
import { usePoll } from '@inertiajs/vue3'

// Poll every 5 seconds, only refresh 'notifications'
usePoll(5000, {
    only: ['notifications'],
})
</script>
```

### استطلاع تتحكم فيه

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

### مثال واقعي: لوحة مؤشرات مباشرة

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

## 5. مكوّن WhenVisible

حمّل البيانات فقط عندما تظهر العناصر أثناء التمرير، بالاعتماد على Intersection Observer API.

### الاستخدام الأساسي

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

### مع هامش مسبق (buffer)

حمّل البيانات مسبقًا قبل أن يظهر العنصر:

```vue
<!-- Start loading 200px before element is visible -->
<WhenVisible data="heavyContent" :buffer="200">
    <HeavyComponent :data="heavyContent" />
</WhenVisible>
```

## 6. التمرير اللانهائي

مبني على WhenVisible والدالة المساعدة الجديدة `Inertia::merge()`.

### الإعداد في الخادم

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

### التنفيذ في الواجهة

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

## 7. تشفير سجل التصفح

يشفّر Inertia 2.0 حالة سجل المتصفح تلقائيًا، حتى لا تُرى المعلومات الحساسة بعد تسجيل الخروج.

### مفعّل افتراضيًا

```php
// No configuration needed - enabled automatically
```

### تعطيله لصفحات محددة

```php
return Inertia::render('PublicPage', [
    'publicData' => $data,
])->withoutEncryptingHistory();
```

### لماذا يهم

دون التشفير، يستطيع المستخدم بعد تسجيل الخروج أن يضغط زر الرجوع ويرى بيانات الصفحة السابقة. مع تشفير سجل التصفح تصبح هذه البيانات غير قابلة للقراءة.

## الترقية من 1.x

الترقية سلسة، والتغييرات الكاسرة قليلة:

```bash
# Update packages
composer update inertiajs/inertia-laravel
npm update @inertiajs/vue3  # or @inertiajs/react
```

### التغييرات الكاسرة

1. **إسقاط دعم Vue 2** - رقِّ إلى Vue 3
2. **إسقاط دعم Svelte 3** - رقِّ إلى Svelte 4+
3. **إعادة التحميل الجزئي صارت غير متزامنة** - قد يتأثر المنطق المعتمد عليها

## مقارنة الأداء

| الميزة | قبل | بعد |
|---------|--------|-------|
| التحميل الأول للصفحة | تحميل كل البيانات | البيانات الأساسية فقط |
| الاستعلامات الثقيلة | تعطّل التنقل | تُحمَّل في الخلفية |
| البيانات اللحظية | استطلاع يدوي | usePoll مدمج |
| القوائم الطويلة | تحميل كل شيء دفعة واحدة | تمرير لانهائي |
| التنقل | التحميل عند النقر | تحميل مسبق عند التمرير فوق الرابط |

## الخلاصة

Inertia.js 2.0 قفزة كبيرة إلى الأمام. الطلبات غير المتزامنة والخصائص المؤجلة والتحميل المسبق تجعل التطبيقات أسرع وأكثر استجابة. ومزايا الاستطلاع الدوري و WhenVisible الجديدة تبسّط الواجهات اللحظية، بينما يرفع تشفير سجل التصفح مستوى الأمان افتراضيًا.

---

## المصادر

- [توثيق Inertia.js](https://inertiajs.com)
- [إعلان Inertia 2.0](https://blog.laravel.com/announcing-inertia-20-redefining-frontend-development-for-laravel)
- [دليل الترقية](https://inertiajs.com/docs/v2/getting-started/upgrade-guide)
