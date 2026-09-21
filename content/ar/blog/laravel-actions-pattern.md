---
title: "نمط Actions في Laravel: أصناف بمسؤولية واحدة"
description: أتقن نمط Actions في Laravel. تعلّم أصناف الإجراء الواحد، وحقن التبعيات، والإجراءات في طابور المهام، واستراتيجيات الاختبار، ومتى تختار Actions ومتى تختار Services.
tags:
  - Laravel
  - Design Patterns
  - Architecture
noImage: true
createdAt: 2025-04-20T10:00:00.000Z
updatedAt: 2025-04-20T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# نمط Actions في Laravel: أصناف بمسؤولية واحدة

**الإجراءات (Actions)** أصناف لها غرض واحد، تغلّف منطق العمل (business logic). صنف واحد، مهمة واحدة. تُبقي المتحكمات (Controllers) نحيفة، وتجعل الكود سهل الاختبار وقابلًا لإعادة الاستخدام.

## مشكلة المتحكمات المتضخمة

```php
// Fat controller - too many responsibilities
class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([...]);

        // Create order
        $order = Order::create([...]);

        // Process payment
        $payment = Stripe::charge($order->total, $request->payment_method);

        // Update inventory
        foreach ($order->items as $item) {
            $item->product->decrement('stock', $item->quantity);
        }

        // Send notifications
        Mail::to($order->user)->send(new OrderConfirmation($order));
        $order->user->notify(new OrderPlaced($order));

        // Log analytics
        Analytics::track('order_placed', [...]);

        return redirect()->route('orders.show', $order);
    }
}
```

## الحل مع Actions

### البنية الأساسية للإجراء

```php
// app/Actions/CreateOrderAction.php
namespace App\Actions;

use App\Models\Order;
use App\Models\User;

class CreateOrderAction
{
    public function execute(User $user, array $items): Order
    {
        return Order::create([
            'user_id' => $user->id,
            'items' => $items,
            'total' => collect($items)->sum('subtotal'),
            'status' => 'pending',
        ]);
    }
}
```

### الاستخدام داخل المتحكم

```php
class OrderController extends Controller
{
    public function store(
        OrderRequest $request,
        CreateOrderAction $createOrder,
        ProcessPaymentAction $processPayment,
        UpdateInventoryAction $updateInventory,
        SendOrderNotificationsAction $sendNotifications,
    ) {
        $order = $createOrder->execute(
            $request->user(),
            $request->validated('items')
        );

        $processPayment->execute($order, $request->validated('payment_method'));
        $updateInventory->execute($order);
        $sendNotifications->execute($order);

        return redirect()->route('orders.show', $order);
    }
}
```

## حقن التبعيات (Dependency Injection)

```php
namespace App\Actions;

use App\Services\PaymentGateway;
use App\Repositories\OrderRepository;

class ProcessPaymentAction
{
    public function __construct(
        private PaymentGateway $gateway,
        private OrderRepository $orders,
    ) {}

    public function execute(Order $order, string $paymentMethod): Payment
    {
        $payment = $this->gateway->charge(
            amount: $order->total,
            method: $paymentMethod,
            metadata: ['order_id' => $order->id],
        );

        $this->orders->markAsPaid($order, $payment);

        return $payment;
    }
}
```

## تركيب الإجراءات

يمكن للإجراء أن يستدعي إجراءات أخرى:

```php
class PlaceOrderAction
{
    public function __construct(
        private CreateOrderAction $createOrder,
        private ProcessPaymentAction $processPayment,
        private UpdateInventoryAction $updateInventory,
        private SendOrderNotificationsAction $sendNotifications,
    ) {}

    public function execute(User $user, array $data): Order
    {
        $order = $this->createOrder->execute($user, $data['items']);

        try {
            $this->processPayment->execute($order, $data['payment_method']);
            $this->updateInventory->execute($order);
            $this->sendNotifications->execute($order);
        } catch (PaymentFailedException $e) {
            $order->markAsFailed();
            throw $e;
        }

        return $order;
    }
}
```

## الإجراءات القابلة للاستدعاء (Invokable)

لصياغة أبسط:

```php
class CreateOrderAction
{
    public function __invoke(User $user, array $items): Order
    {
        return Order::create([
            'user_id' => $user->id,
            'items' => $items,
            'total' => collect($items)->sum('subtotal'),
        ]);
    }
}

// Usage
$order = app(CreateOrderAction::class)($user, $items);
```

## الإجراءات مع DTOs

```php
// app/DTOs/CreateOrderData.php
readonly class CreateOrderData
{
    public function __construct(
        public User $user,
        public array $items,
        public string $shippingMethod,
        public ?string $couponCode = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            user: $request->user(),
            items: $request->validated('items'),
            shippingMethod: $request->validated('shipping_method'),
            couponCode: $request->validated('coupon_code'),
        );
    }
}

// app/Actions/CreateOrderAction.php
class CreateOrderAction
{
    public function execute(CreateOrderData $data): Order
    {
        return Order::create([
            'user_id' => $data->user->id,
            'items' => $data->items,
            'shipping_method' => $data->shippingMethod,
            'coupon_code' => $data->couponCode,
        ]);
    }
}

// Controller
public function store(OrderRequest $request, CreateOrderAction $action)
{
    $order = $action->execute(CreateOrderData::fromRequest($request));
    return redirect()->route('orders.show', $order);
}
```

## الإجراءات في طابور المهام

```php
namespace App\Actions;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GenerateInvoicePdfAction implements ShouldQueue
{
    use Queueable;

    public function execute(Order $order): void
    {
        $pdf = PDF::loadView('invoices.pdf', ['order' => $order]);
        $path = "invoices/{$order->number}.pdf";

        Storage::put($path, $pdf->output());

        $order->update(['invoice_path' => $path]);
    }
}

// Dispatch to queue
app(GenerateInvoicePdfAction::class)
    ->onQueue('invoices')
    ->execute($order);
```

## اختبار الإجراءات

### اختبار الوحدة (Unit Testing)

```php
use App\Actions\CreateOrderAction;

test('creates order with correct total', function () {
    $user = User::factory()->create();
    $items = [
        ['product_id' => 1, 'quantity' => 2, 'price' => 10.00, 'subtotal' => 20.00],
        ['product_id' => 2, 'quantity' => 1, 'price' => 15.00, 'subtotal' => 15.00],
    ];

    $action = new CreateOrderAction();
    $order = $action->execute($user, $items);

    expect($order->total)->toBe(35.00);
    expect($order->user_id)->toBe($user->id);
});
```

### محاكاة التبعيات (Mocking)

```php
test('processes payment through gateway', function () {
    $gateway = Mockery::mock(PaymentGateway::class);
    $gateway->shouldReceive('charge')
        ->once()
        ->with(100.00, 'pm_123', Mockery::any())
        ->andReturn(new Payment(['id' => 'pay_123']));

    $action = new ProcessPaymentAction($gateway, new OrderRepository());

    $order = Order::factory()->create(['total' => 100.00]);
    $payment = $action->execute($order, 'pm_123');

    expect($payment->id)->toBe('pay_123');
});
```

### اختبار التكامل (Integration Testing)

```php
test('complete order flow', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock' => 10]);

    $action = app(PlaceOrderAction::class);

    $order = $action->execute($user, [
        'items' => [
            ['product_id' => $product->id, 'quantity' => 2],
        ],
        'payment_method' => 'pm_test',
    ]);

    expect($order->status)->toBe('paid');
    expect($product->fresh()->stock)->toBe(8);
});
```

## Actions أم Services؟

### استخدم Actions عندما:
- تكون المسؤولية واحدة (شيء واحد فقط)
- يُستدعى المنطق من أماكن متعددة
- تحتاج اختباره بمعزل عن غيره
- يكون المنطق مكتملًا وذريًا (atomic)

### استخدم Services عندما:
- تجمع عمليات مترابطة
- تحتفظ بحالة عبر استدعاءات متعددة
- تغلّف واجهات API خارجية
- تنسّق تدفقات معقدة

```php
// Service: Groups related payment operations
class PaymentService
{
    public function charge(Order $order): Payment { }
    public function refund(Payment $payment): void { }
    public function getBalance(User $user): float { }
}

// Action: Single operation
class ChargeOrderAction
{
    public function execute(Order $order): Payment { }
}
```

## بنية المجلدات

```
app/
├── Actions/
│   ├── Orders/
│   │   ├── CreateOrderAction.php
│   │   ├── CancelOrderAction.php
│   │   └── RefundOrderAction.php
│   ├── Payments/
│   │   ├── ProcessPaymentAction.php
│   │   └── RefundPaymentAction.php
│   └── Users/
│       ├── CreateUserAction.php
│       └── UpdateProfileAction.php
```

## حزمة Laravel Actions

لمزايا إضافية، جرّب حزمة `lorisleiva/laravel-actions`:

```bash
composer require lorisleiva/laravel-actions
```

```php
use Lorisleiva\Actions\Concerns\AsAction;

class CreateOrder
{
    use AsAction;

    public function handle(User $user, array $items): Order
    {
        return Order::create([...]);
    }

    // Use as controller
    public function asController(Request $request): RedirectResponse
    {
        $order = $this->handle($request->user(), $request->items);
        return redirect()->route('orders.show', $order);
    }

    // Use as job
    public function asJob(User $user, array $items): void
    {
        $this->handle($user, $items);
    }
}
```

## أفضل الممارسات

1. **اجعل كل إجراء مركّزًا** - إجراء واحد، غرض واحد
2. **استخدم أسماء واضحة** - `CreateOrderAction` لا `OrderAction`
3. **أعد قيمًا ولا تُعد التوجيه** - اترك استجابات HTTP للمتحكمات
4. **احقن التبعيات** - يسهّل ذلك الاختبار
5. **استخدم DTOs للمدخلات المعقدة** - تبقى تواقيع الدوال نظيفة

## الخلاصة

تضفي الإجراءات وضوحًا على تطبيقات Laravel لأنها تفرض مبدأ المسؤولية الواحدة. اختبارها أسهل، وفهمها أسهل، وإعادة استخدامها أسهل من المتحكمات المتضخمة أو الخدمات.

---

## المصادر

- [حزمة Laravel Actions](https://laravelactions.com)
- [إعادة الهيكلة نحو Actions](https://stitcher.io/blog/laravel-beyond-crud-03-actions)
