---
title: "ويدجت FilamentPHP: ابنِ لوحات معلومات قوية"
description: "أنشئ لوحات إدارة لافتة باستخدام ويدجت Filament: الإحصاءات، والرسوم البيانية، والجداول، والويدجت المخصصة، والتحديثات الفورية في تطبيقات Laravel."
tags:
  - FilamentPHP
  - Filament
  - Laravel
  - Dashboard
noImage: true
createdAt: 2025-06-10T10:00:00.000Z
updatedAt: 2025-06-10T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# ويدجت FilamentPHP: ابنِ لوحات معلومات قوية

تحوّل **ويدجت Filament** (widgets) لوحة الإدارة إلى لوحة معلومات غنية بالبيانات. اعرض الإحصاءات والرسوم البيانية والجداول والمحتوى المخصص بقليل من الكود.

## أنواع الويدجت

يوفّر Filament عدة أنواع جاهزة من الويدجت:
- نظرة عامة على الإحصاءات (Stats Overview)
- الرسوم البيانية (Charts)
- الجداول (Tables)
- الويدجت المخصصة (Custom Widgets)

## ويدجت نظرة عامة على الإحصاءات

### إحصاءات أساسية

```php
// app/Filament/Widgets/StatsOverview.php
namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', User::count()),
            Stat::make('Total Orders', Order::count()),
            Stat::make('Revenue', '$' . number_format(Order::sum('total'), 2)),
        ];
    }
}
```

### إحصاءات محسّنة

```php
protected function getStats(): array
{
    $usersThisMonth = User::whereMonth('created_at', now()->month)->count();
    $usersLastMonth = User::whereMonth('created_at', now()->subMonth()->month)->count();
    $growth = $usersLastMonth > 0
        ? (($usersThisMonth - $usersLastMonth) / $usersLastMonth) * 100
        : 0;

    return [
        Stat::make('New Users', $usersThisMonth)
            ->description($growth >= 0 ? "{$growth}% increase" : abs($growth) . '% decrease')
            ->descriptionIcon($growth >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
            ->color($growth >= 0 ? 'success' : 'danger')
            ->chart([7, 3, 4, 5, 6, 3, 5, 8]),

        Stat::make('Pending Orders', Order::where('status', 'pending')->count())
            ->description('Requires attention')
            ->descriptionIcon('heroicon-m-clock')
            ->color('warning'),

        Stat::make('Monthly Revenue', '$' . number_format(Order::thisMonth()->sum('total'), 2))
            ->description('Active subscriptions: ' . Subscription::active()->count())
            ->color('success'),
    ];
}
```

## ويدجت الرسوم البيانية

### رسم خطي

```php
// app/Filament/Widgets/RevenueChart.php
namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;

class RevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Monthly Revenue';
    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $data = Order::query()
            ->selectRaw('MONTH(created_at) as month, SUM(total) as revenue')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->pluck('revenue', 'month')
            ->toArray();

        return [
            'datasets' => [
                [
                    'label' => 'Revenue',
                    'data' => array_values($data),
                    'borderColor' => '#10B981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'fill' => true,
                ],
            ],
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
```

### رسم بالأعمدة

```php
class OrdersByStatusChart extends ChartWidget
{
    protected static ?string $heading = 'Orders by Status';

    protected function getData(): array
    {
        $statuses = Order::query()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return [
            'datasets' => [
                [
                    'label' => 'Orders',
                    'data' => $statuses->values()->toArray(),
                    'backgroundColor' => ['#10B981', '#F59E0B', '#EF4444', '#6366F1'],
                ],
            ],
            'labels' => $statuses->keys()->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
```

### رسم دائري مجوّف (Doughnut)

```php
class UserTypesChart extends ChartWidget
{
    protected static ?string $heading = 'User Distribution';

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'data' => [
                        User::where('role', 'admin')->count(),
                        User::where('role', 'manager')->count(),
                        User::where('role', 'user')->count(),
                    ],
                    'backgroundColor' => ['#6366F1', '#10B981', '#F59E0B'],
                ],
            ],
            'labels' => ['Admins', 'Managers', 'Users'],
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
```

## ويدجت الجداول

### جدول أحدث الطلبات

```php
// app/Filament/Widgets/LatestOrders.php
namespace App\Filament\Widgets;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestOrders extends TableWidget
{
    protected static ?int $sort = 3;
    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(Order::query()->latest()->limit(10))
            ->columns([
                Tables\Columns\TextColumn::make('number')
                    ->searchable(),
                Tables\Columns\TextColumn::make('customer.name')
                    ->label('Customer'),
                Tables\Columns\TextColumn::make('total')
                    ->money(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'completed',
                        'danger' => 'cancelled',
                    ]),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\Action::make('view')
                    ->url(fn (Order $record) => OrderResource::getUrl('view', ['record' => $record])),
            ]);
    }
}
```

## الويدجت المخصصة

### سجل النشاط

```php
// app/Filament/Widgets/ActivityFeed.php
namespace App\Filament\Widgets;

use Filament\Widgets\Widget;

class ActivityFeed extends Widget
{
    protected static string $view = 'filament.widgets.activity-feed';
    protected int|string|array $columnSpan = 'full';

    public function getActivities(): Collection
    {
        return Activity::with('causer')
            ->latest()
            ->limit(10)
            ->get();
    }
}
```

```blade
{{-- resources/views/filament/widgets/activity-feed.blade.php --}}
<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            Recent Activity
        </x-slot>

        <div class="space-y-4">
            @foreach ($this->getActivities() as $activity)
                <div class="flex items-start gap-4">
                    <div class="flex-shrink-0">
                        <x-filament::avatar
                            :src="$activity->causer?->avatar_url"
                            size="md"
                        />
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ $activity->causer?->name ?? 'System' }}
                        </p>
                        <p class="text-sm text-gray-500">
                            {{ $activity->description }}
                        </p>
                        <p class="text-xs text-gray-400">
                            {{ $activity->created_at->diffForHumans() }}
                        </p>
                    </div>
                </div>
            @endforeach
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
```

## إعداد الويدجت

### الترتيب والامتداد على الأعمدة

```php
class StatsOverview extends StatsOverviewWidget
{
    // Order on dashboard
    protected static ?int $sort = 1;

    // Width: 1, 2, 3, 'full', or array for responsive
    protected int|string|array $columnSpan = 'full';

    // Or responsive
    protected int|string|array $columnSpan = [
        'default' => 'full',
        'md' => 2,
        'lg' => 3,
    ];
}
```

### التحديث الدوري (Polling)

```php
class LiveStats extends StatsOverviewWidget
{
    // Refresh every 10 seconds
    protected static ?string $pollingInterval = '10s';

    // Or disable
    protected static ?string $pollingInterval = null;
}
```

### التحميل الكسول (Lazy Loading)

```php
class HeavyChart extends ChartWidget
{
    protected static bool $isLazy = true;
}
```

## إعداد لوحة المعلومات

### تسجيل الويدجت

```php
// app/Providers/Filament/AdminPanelProvider.php
->widgets([
    Widgets\AccountWidget::class,
    Widgets\FilamentInfoWidget::class,
    StatsOverview::class,
    RevenueChart::class,
    LatestOrders::class,
])
```

### ويدجت الموارد (Resources)

أضف الويدجت إلى صفحات الموارد:

```php
// app/Filament/Resources/OrderResource/Pages/ListOrders.php
protected function getHeaderWidgets(): array
{
    return [
        OrderStats::class,
    ];
}

protected function getFooterWidgets(): array
{
    return [
        OrdersByMonth::class,
    ];
}
```

## الفلاتر في الرسوم البيانية

```php
class FilterableRevenueChart extends ChartWidget
{
    public ?string $filter = 'week';

    protected function getFilters(): ?array
    {
        return [
            'week' => 'Last Week',
            'month' => 'Last Month',
            'year' => 'This Year',
        ];
    }

    protected function getData(): array
    {
        $query = Order::query();

        match ($this->filter) {
            'week' => $query->where('created_at', '>=', now()->subWeek()),
            'month' => $query->where('created_at', '>=', now()->subMonth()),
            'year' => $query->whereYear('created_at', now()->year),
        };

        // Build chart data...
    }
}
```

## تحديثات فورية مع Livewire

```php
class LiveOrderCount extends Widget
{
    protected static string $view = 'filament.widgets.live-order-count';

    #[Computed]
    public function pendingCount(): int
    {
        return Order::where('status', 'pending')->count();
    }

    #[On('order-created')]
    public function refresh(): void
    {
        unset($this->pendingCount);
    }
}
```

## الخلاصة

توفّر ويدجت Filament كل ما تحتاجه لبناء لوحات معلومات قوية. اجمع بين الإحصاءات والرسوم البيانية والجداول لتمنح المستخدمين فهمًا فوريًا لبياناتهم.

---

## مصادر

- [توثيق ويدجت Filament](https://filamentphp.com/docs/widgets)
- [توثيق Chart.js](https://www.chartjs.org/docs)

