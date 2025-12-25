---
title: "FilamentPHP Notifications: Toast, Database & Real-Time Alerts"
description: Master Filament notifications - toast messages, database notifications, real-time broadcasts, custom notification views, and notification actions.
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

# FilamentPHP Notifications: Toast, Database & Real-Time Alerts

**Filament Notifications** provide a unified system for toast messages, database notifications, and real-time alerts. Keep your users informed with minimal code.

## Flash Notifications (Toast)

### Basic Usage

```php
use Filament\Notifications\Notification;

Notification::make()
    ->title('Saved successfully')
    ->success()
    ->send();
```

### Notification Types

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

### With Body and Icon

```php
Notification::make()
    ->title('Order shipped')
    ->body('Your order #12345 has been shipped and will arrive in 3-5 days.')
    ->icon('heroicon-o-truck')
    ->iconColor('success')
    ->send();
```

### Duration

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

## Database Notifications

### Setup

```bash
php artisan notifications:table
php artisan migrate
```

### Sending to Database

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

### Send to Multiple Users

```php
$users = User::where('role', 'admin')->get();

Notification::make()
    ->title('New support ticket')
    ->body('A customer needs assistance.')
    ->sendToDatabase($users);
```

### Retrieving Notifications

```php
// In your component or controller
$notifications = auth()->user()->notifications;
$unreadCount = auth()->user()->unreadNotifications->count();
```

## Real-Time Notifications

### Setup Broadcasting

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

### Broadcast Notifications

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

### Combined: Database + Broadcast

```php
Notification::make()
    ->title('New message')
    ->body('You have a new message from John.')
    ->sendToDatabase($user)
    ->broadcast($user);
```

## Notification Actions

### Button Actions

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

### Link Actions

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

### Livewire Actions

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

## Database Notification Bell

### Add to Panel

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

### Customize Polling

```php
->databaseNotifications()
->databaseNotificationsPolling('10s') // Poll every 10 seconds
```

## Custom Notification Views

### Define Custom View

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

## Notification in Livewire Components

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

## Notification in Controllers

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

## Queued Notifications

```php
use Filament\Notifications\Notification;
use Filament\Notifications\DatabaseNotification;

// Queue database notifications
Notification::make()
    ->title('Processing complete')
    ->body('Your file has been processed.')
    ->sendToDatabase($user, isQueued: true);
```

## Grouping Notifications

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

## Best Practices

### 1. Keep Messages Concise

```php
// Good
Notification::make()
    ->title('Saved')
    ->success()
    ->send();

// Avoid lengthy messages for simple actions
```

### 2. Use Appropriate Types

```php
// Success for completed actions
Notification::make()->title('Created')->success()->send();

// Warning for potential issues
Notification::make()->title('Low stock')->warning()->send();

// Danger for errors or destructive actions
Notification::make()->title('Deleted')->danger()->send();
```

### 3. Provide Actionable Notifications

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

## Conclusion

Filament Notifications unify flash messages, database notifications, and real-time broadcasts. Use them to keep users informed, prompt actions, and improve the overall user experience.

---

## Resources

- [Filament Notifications Documentation](https://filamentphp.com/docs/notifications)
- [Laravel Notifications](https://laravel.com/docs/notifications)

