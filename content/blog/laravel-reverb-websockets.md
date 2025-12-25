---
title: "Laravel Reverb: Real-Time WebSockets Made Simple"
description: Build real-time applications with Laravel Reverb. Learn WebSocket setup, broadcasting events, private channels, presence channels, and Laravel Cloud integration.
tags:
  - Laravel
  - WebSockets
  - Reverb
  - Real-time
noImage: true
createdAt: 2025-08-10T10:00:00.000Z
updatedAt: 2025-08-10T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel Reverb: Real-Time WebSockets Made Simple

**Laravel Reverb** is the official first-party WebSocket server for Laravel, providing blazing-fast real-time communication directly within your Laravel ecosystem.

## Why Reverb?

- **Native Integration** - Works seamlessly with Laravel Broadcasting
- **High Performance** - Handles thousands of concurrent connections
- **Zero Configuration** - Works out of the box
- **Scalable** - Horizontal scaling with Redis clustering

## Installation

```bash
php artisan install:broadcasting
```

This automatically:
- Installs Reverb
- Configures broadcasting
- Sets up Laravel Echo

### Environment Configuration

```env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=my-app
REVERB_APP_KEY=my-app-key
REVERB_APP_SECRET=my-app-secret
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

## Starting the Server

```bash
php artisan reverb:start

# With options
php artisan reverb:start --host=0.0.0.0 --port=8080 --debug
```

## Broadcasting Events

### Creating Events

```php
// app/Events/MessageSent.php
class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Message $message,
        public User $user
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->message->room_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->message->id,
            'content' => $this->message->content,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'avatar' => $this->user->avatar_url,
            ],
            'created_at' => $this->message->created_at->toISOString(),
        ];
    }
}
```

### Dispatching Events

```php
// In controller or service
event(new MessageSent($message, auth()->user()));

// Or use broadcast helper
broadcast(new MessageSent($message, auth()->user()));

// Broadcast to others only (exclude sender)
broadcast(new MessageSent($message, auth()->user()))->toOthers();
```

## Channel Types

### Public Channels

Anyone can listen:

```php
public function broadcastOn(): Channel
{
    return new Channel('updates');
}
```

```javascript
Echo.channel('updates')
    .listen('.update.published', (e) => {
        console.log(e.data);
    });
```

### Private Channels

Requires authentication:

```php
// Event
public function broadcastOn(): PrivateChannel
{
    return new PrivateChannel('user.' . $this->userId);
}
```

```php
// routes/channels.php
Broadcast::channel('user.{id}', function (User $user, int $id) {
    return $user->id === $id;
});
```

```javascript
Echo.private(`user.${userId}`)
    .listen('.notification', (e) => {
        showNotification(e);
    });
```

### Presence Channels

Track who's online:

```php
// Event
public function broadcastOn(): PresenceChannel
{
    return new PresenceChannel('room.' . $this->roomId);
}
```

```php
// routes/channels.php
Broadcast::channel('room.{roomId}', function (User $user, int $roomId) {
    if ($user->canJoinRoom($roomId)) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'avatar' => $user->avatar_url,
        ];
    }
});
```

```javascript
Echo.join(`room.${roomId}`)
    .here((users) => {
        this.onlineUsers = users;
    })
    .joining((user) => {
        this.onlineUsers.push(user);
        showToast(`${user.name} joined`);
    })
    .leaving((user) => {
        this.onlineUsers = this.onlineUsers.filter(u => u.id !== user.id);
        showToast(`${user.name} left`);
    })
    .listen('.message.sent', (e) => {
        this.messages.push(e);
    });
```

## Client-Side Setup

### Laravel Echo Configuration

```javascript
// resources/js/bootstrap.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});
```

### Vue.js Integration

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const messages = ref([]);
const onlineUsers = ref([]);

onMounted(() => {
    Echo.join(`room.${roomId}`)
        .here((users) => {
            onlineUsers.value = users;
        })
        .joining((user) => {
            onlineUsers.value.push(user);
        })
        .leaving((user) => {
            onlineUsers.value = onlineUsers.value.filter(u => u.id !== user.id);
        })
        .listen('.message.sent', (e) => {
            messages.value.push(e);
        });
});

onUnmounted(() => {
    Echo.leave(`room.${roomId}`);
});
</script>
```

## Real-Time Notifications

```php
// app/Notifications/OrderShipped.php
class OrderShipped extends Notification implements ShouldBroadcast
{
    public function __construct(
        public Order $order
    ) {}

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'title' => 'Order Shipped!',
            'body' => "Your order #{$this->order->number} has been shipped.",
            'action_url' => route('orders.show', $this->order),
        ]);
    }
}
```

```javascript
// Listen for notifications
Echo.private(`App.Models.User.${userId}`)
    .notification((notification) => {
        showNotification(notification);
    });
```

## Whisper (Client Events)

Send events directly from client to client:

```javascript
// Typing indicator
const input = document.querySelector('#message-input');

input.addEventListener('input', () => {
    Echo.private(`room.${roomId}`)
        .whisper('typing', {
            user: currentUser.name
        });
});

// Listen for whispers
Echo.private(`room.${roomId}`)
    .listenForWhisper('typing', (e) => {
        showTypingIndicator(e.user);
    });
```

## Laravel Cloud Integration

Deploy WebSockets instantly with Laravel Cloud:

```bash
# Enable WebSockets in cloud.yaml
services:
  web:
    websockets:
      enabled: true
```

Features:
- Managed Reverb clusters
- Auto-scaling
- Zero configuration
- 50% cheaper than alternatives

## Production Configuration

### Supervisor Setup

```ini
[program:reverb]
process_name=%(program_name)s
command=php /var/www/app/artisan reverb:start --host=0.0.0.0 --port=8080
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/www/app/storage/logs/reverb.log
stopwaitsecs=3600
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name ws.example.com;

    ssl_certificate /etc/ssl/certs/example.com.pem;
    ssl_certificate_key /etc/ssl/private/example.com.key;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

### Scaling with Redis

```env
REVERB_SCALING_ENABLED=true
REVERB_SCALING_CHANNEL=reverb
```

```php
// config/reverb.php
'scaling' => [
    'enabled' => env('REVERB_SCALING_ENABLED', false),
    'channel' => env('REVERB_SCALING_CHANNEL', 'reverb'),
],
```

## Monitoring with Laravel Pulse

```php
// config/pulse.php
'recorders' => [
    \Laravel\Reverb\Pulse\Recorders\ReverbConnections::class => [],
    \Laravel\Reverb\Pulse\Recorders\ReverbMessages::class => [],
],
```

## Conclusion

Laravel Reverb makes real-time features accessible to every Laravel developer. With native integration, excellent performance, and Laravel Cloud support, building real-time applications has never been easier.

---

## Resources

- [Laravel Reverb Documentation](https://laravel.com/docs/reverb)
- [Laravel Broadcasting](https://laravel.com/docs/broadcasting)
- [Reverb Website](https://reverb.laravel.com)

