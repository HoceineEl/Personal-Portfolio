---
title: "إشعارات FilamentPHP: رسائل Toast وإشعارات قاعدة البيانات والتنبيهات الفورية"
description: أتقن إشعارات Filament، من رسائل Toast وإشعارات قاعدة البيانات إلى البث الفوري وقوالب العرض المخصصة وإجراءات الإشعارات.
tags:
  - FilamentPHP
  - Filament
  - Laravel
  - Notifications
noImage: true
createdAt: 2025-05-05T10:00:00.000Z
updatedAt: 2025-05-05T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# إشعارات FilamentPHP: رسائل Toast وإشعارات قاعدة البيانات والتنبيهات الفورية

تقدّم **Filament Notifications** نظامًا موحدًا لرسائل Toast وإشعارات قاعدة البيانات والتنبيهات الفورية. أبقِ مستخدميك على اطلاع بأقل قدر من الكود.

## الإشعارات السريعة (Toast)

### الاستخدام الأساسي

```php
use Filament\Notifications\Notification;

Notification::make()
    ->title('Saved successfully')
    ->success()
    ->send();
```

### أنواع الإشعارات

```php
// Success
Notification::make()
    ->title('User created')
    ->success()
    ->send();

// Warning
Notification::make()
    ->title('Storage almost full')
    ->warning()
    ->send();

// Danger
Notification::make()
    ->title('Failed to save')
    ->body('Please check your input and try again.')
    ->danger()
    ->send();

// Info
Notification::make()
    ->title('New update available')
    ->info()
    ->send();
```

### مع نص وأيقونة

```php
Notification::make()
    ->title('Order shipped')
    ->body('Your order #12345 has been shipped and will arrive in 3-5 days.')
    ->icon('heroicon-o-truck')
    ->iconColor('success')
    ->send();
```

### مدة الظهور

```php
Notification::make()
    ->title('Quick message')
    ->success()
    ->duration(3000) // 3 seconds
    ->send();

// Persistent (no auto-close)
Notification::make()
    ->title('Important notice')
    ->persistent()
    ->send();
```

## إشعارات قاعدة البيانات

### الإعداد

```bash
php artisan notifications:table
php artisan migrate
```

### الإرسال إلى قاعدة البيانات

```php
use Filament\Notifications\Notification;

Notification::make()
    ->title('New comment on your post')
    ->body('John Doe commented: "Great article!"')
    ->actions([
        Action::make('view')
            ->button()
            ->url('/posts/123'),
        Action::make('markAsRead')
            ->button()
            ->color('gray')
            ->markAsRead(),
    ])
    ->sendToDatabase($user);
```

### الإرسال إلى عدة مستخدمين

```php
$users = User::where('role', 'admin')->get();

Notification::make()
    ->title('New support ticket')
    ->body('A customer needs assistance.')
    ->sendToDatabase($users);
```

### جلب الإشعارات

```php
// In your component or controller
$notifications = auth()->user()->notifications;
$unreadCount = auth()->user()->unreadNotifications->count();
```

## الإشعارات الفورية

### إعداد البث (Broadcasting)

```bash
# Install Laravel Echo and Pusher (or Reverb)
npm install laravel-echo pusher-js
```

```php
// config/filament.php
'broadcasting' => [
    'echo' => [
        'broadcaster' => 'reverb',
        'key' => env('VITE_REVERB_APP_KEY'),
        'cluster' => env('VITE_REVERB_CLUSTER'),
        'wsHost' => env('VITE_REVERB_HOST'),
        'wsPort' => env('VITE_REVERB_PORT'),
        'forceTLS' => false,
    ],
],
```

### إشعارات البث

```php
Notification::make()
    ->title('New order received')
    ->body('Order #12345 - $99.00')
    ->broadcast($user);

// Or broadcast to multiple users
Notification::make()
    ->title('System maintenance scheduled')
    ->broadcast(User::all());
```

### الجمع بين الاثنين: قاعدة البيانات + البث

```php
Notification::make()
    ->title('New message')
    ->body('You have a new message from John.')
    ->sendToDatabase($user)
    ->broadcast($user);
```

## إجراءات الإشعارات

### إجراءات الأزرار

```php
use Filament\Notifications\Actions\Action;

Notification::make()
    ->title('New friend request')
    ->body('Jane Doe wants to connect with you.')
    ->actions([
        Action::make('accept')
            ->button()
            ->color('success')
            ->url('/friends/accept/123'),
        Action::make('decline')
            ->button()
            ->color('danger')
            ->url('/friends/decline/123'),
    ])
    ->persistent()
    ->send();
```

### إجراءات الروابط

```php
Notification::make()
    ->title('Invoice ready')
    ->actions([
        Action::make('download')
            ->link()
            ->url('/invoices/123/download'),
        Action::make('view')
            ->link()
            ->url('/invoices/123'),
    ])
    ->send();
```

### إجراءات Livewire

```php
Notification::make()
    ->title('Confirm deletion')
    ->actions([
        Action::make('confirm')
            ->button()
            ->color('danger')
            ->dispatch('deleteConfirmed', ['id' => $recordId]),
        Action::make('cancel')
            ->button()
            ->color('gray')
            ->close(),
    ])
    ->persistent()
    ->send();
```

## جرس إشعارات قاعدة البيانات

### إضافته إلى اللوحة

```php
// app/Providers/Filament/AdminPanelProvider.php
use Filament\Panel;

public function panel(Panel $panel): Panel
{
    return $panel
        ->databaseNotifications()
        ->databaseNotificationsPolling('30s');
}
```

### تخصيص الاستطلاع الدوري (Polling)

```php
->databaseNotifications()
->databaseNotificationsPolling('10s') // Poll every 10 seconds
```

## قوالب عرض مخصصة للإشعارات

### تعريف قالب عرض مخصص

```php
Notification::make()
    ->title('Custom notification')
    ->view('notifications.custom', [
        'order' => $order,
    ])
    ->send();
```

```blade
{{-- resources/views/notifications/custom.blade.php --}}
<div class="flex items-center gap-4">
    <img src="{{ $order->product->image }}" class="w-12 h-12 rounded" />
    <div>
        <p class="font-medium">{{ $order->product->name }}</p>
        <p class="text-sm text-gray-500">{{ $order->formatted_total }}</p>
    </div>
</div>
```

## الإشعارات داخل مكوّنات Livewire

```php
namespace App\Livewire;

use Filament\Notifications\Notification;
use Livewire\Component;

class OrderForm extends Component
{
    public function save()
    {
        // Save logic...

        Notification::make()
            ->title('Order saved')
            ->success()
            ->send();
    }

    public function delete()
    {
        // Delete logic...

        Notification::make()
            ->title('Order deleted')
            ->danger()
            ->send();
    }
}
```

## الإشعارات داخل المتحكمات (Controllers)

```php
use Filament\Notifications\Notification;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $order = Order::create($request->validated());

        // Flash notification for redirect
        Notification::make()
            ->title('Order created')
            ->success()
            ->send();

        // Database notification
        Notification::make()
            ->title('New order: ' . $order->number)
            ->sendToDatabase(User::admins()->get());

        return redirect()->route('orders.show', $order);
    }
}
```

## الإشعارات في طابور المهام (Queued)

```php
use Filament\Notifications\Notification;
use Filament\Notifications\DatabaseNotification;

// Queue database notifications
Notification::make()
    ->title('Processing complete')
    ->body('Your file has been processed.')
    ->sendToDatabase($user, isQueued: true);
```

## تجميع الإشعارات

```php
Notification::make()
    ->title('5 new messages')
    ->body('You have unread messages from multiple users.')
    ->actions([
        Action::make('viewAll')
            ->button()
            ->url('/messages'),
    ])
    ->send();
```

## أفضل الممارسات

### 1. اجعل الرسائل موجزة

```php
// Good
Notification::make()
    ->title('Saved')
    ->success()
    ->send();

// Avoid lengthy messages for simple actions
```

### 2. استخدم النوع المناسب

```php
// Success for completed actions
Notification::make()->title('Created')->success()->send();

// Warning for potential issues
Notification::make()->title('Low stock')->warning()->send();

// Danger for errors or destructive actions
Notification::make()->title('Deleted')->danger()->send();
```

### 3. قدّم إشعارات قابلة للتنفيذ

```php
Notification::make()
    ->title('Export ready')
    ->body('Your data export is ready for download.')
    ->actions([
        Action::make('download')
            ->button()
            ->url('/exports/123/download'),
    ])
    ->persistent()
    ->send();
```

## الخلاصة

تجمع إشعارات Filament بين الرسائل السريعة وإشعارات قاعدة البيانات والبث الفوري. استخدمها لإبقاء المستخدمين على اطلاع، ولدفعهم إلى اتخاذ إجراء، ولتحسين تجربة الاستخدام عمومًا.

---

## مصادر

- [توثيق Filament Notifications](https://filamentphp.com/docs/notifications)
- [الإشعارات في Laravel](https://laravel.com/docs/notifications)

