---
title: "Laravel Reverb: اتصالات WebSockets لحظية بلا تعقيد"
description: ابنِ تطبيقات لحظية باستخدام Laravel Reverb. تعلّم إعداد WebSockets، وبث الأحداث، والقنوات الخاصة، وقنوات الحضور، والتكامل مع Laravel Cloud.
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

# Laravel Reverb: اتصالات WebSockets لحظية بلا تعقيد

**Laravel Reverb** هو خادم WebSocket الرسمي من فريق Laravel نفسه، ويوفّر اتصالًا لحظيًا سريعًا جدًا داخل منظومة Laravel مباشرة.

## لماذا Reverb؟

- **تكامل أصلي**: يعمل بسلاسة مع Laravel Broadcasting
- **أداء عالٍ**: يتحمّل آلاف الاتصالات المتزامنة
- **بلا إعداد**: يعمل فور تثبيته
- **قابل للتوسّع**: توسّع أفقي عبر عنقود Redis

## التثبيت

```bash
php artisan install:broadcasting
```

يتولّى هذا الأمر تلقائيًا:
- تثبيت Reverb
- ضبط البث (broadcasting)
- إعداد Laravel Echo

### إعداد متغيرات البيئة

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

## تشغيل الخادم

```bash
php artisan reverb:start

# With options
php artisan reverb:start --host=0.0.0.0 --port=8080 --debug
```

## بث الأحداث

### إنشاء الأحداث

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

### إطلاق الأحداث

```php
// In controller or service
event(new MessageSent($message, auth()->user()));

// Or use broadcast helper
broadcast(new MessageSent($message, auth()->user()));

// Broadcast to others only (exclude sender)
broadcast(new MessageSent($message, auth()->user()))->toOthers();
```

## أنواع القنوات

### القنوات العامة

يستطيع أي أحد الاستماع إليها:

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

### القنوات الخاصة

تتطلب المصادقة:

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

### قنوات الحضور (Presence)

تتبّع من المتصل الآن:

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

## الإعداد في جهة العميل

### ضبط Laravel Echo

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

### التكامل مع Vue.js

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

## إشعارات لحظية

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

## Whisper (أحداث العميل)

أرسل الأحداث مباشرة من عميل إلى آخر:

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

## التكامل مع Laravel Cloud

انشر WebSockets فورًا عبر Laravel Cloud:

```bash
# Enable WebSockets in cloud.yaml
services:
  web:
    websockets:
      enabled: true
```

المزايا:
- عناقيد Reverb مُدارة
- توسّع تلقائي
- بلا إعداد
- أرخص من البدائل بنسبة 50%

## إعداد بيئة الإنتاج

### إعداد Supervisor

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

### إعداد Nginx

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

### التوسّع باستخدام Redis

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

## المراقبة باستخدام Laravel Pulse

```php
// config/pulse.php
'recorders' => [
    \Laravel\Reverb\Pulse\Recorders\ReverbConnections::class => [],
    \Laravel\Reverb\Pulse\Recorders\ReverbMessages::class => [],
],
```

## الخلاصة

يضع Laravel Reverb الميزات اللحظية في متناول كل مطوّر Laravel. بفضل التكامل الأصلي والأداء الممتاز ودعم Laravel Cloud، صار بناء التطبيقات اللحظية أسهل من أي وقت مضى.

---

## مصادر

- [توثيق Laravel Reverb](https://laravel.com/docs/reverb)
- [Laravel Broadcasting](https://laravel.com/docs/broadcasting)
- [موقع Reverb](https://reverb.laravel.com)
