---
title: "Action Classes in Laravel: One Class Per Operation, Called From Anywhere"
description: How I write action classes in Laravel 12, why I keep them as plain classes with one handle method, and how the same action gets called from a controller, a Filament action, a Livewire component and a queued job.
tags:
  - Laravel
  - FilamentPHP
  - Livewire
  - Architecture
image: /images/blog/laravel-actions/cover.jpg
banner: /images/blog/laravel-actions/cover.jpg
createdAt: 2025-04-20T10:00:00.000Z
updatedAt: 2026-10-17T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

## Action Classes in Laravel

A lot of business logic gets triggered from more than one place. A refund starts
from a button in the Filament panel, but it also has to run from an API endpoint, from a
support tool built in Livewire, and sometimes from an Artisan command when a payment provider
sends a batch of disputes. If the refund logic lives in a controller method, every other entry
point either copies it or calls the controller, and both are bad.

An action class fixes that. It is a class that does one operation, takes its inputs as
arguments, and gets its dependencies from the container. Every entry point becomes a thin
adapter that collects input and calls it.

This post is my take on how to write them. It is opinionated, and some of it disagrees with
how actions are usually shown.

### What an action is, and what it is not

An action is one business operation, named as a verb: `RefundOrder`, `InviteTeamMember`,
`PublishPage`. It is not a wrapper around a single Eloquent call. `UpdateUserName` that runs
`$user->update(['name' => $name])` is a class for the sake of a class. If the operation is a
model update with validation and nothing else, the Filament resource or the form request
already handles it fine.

The test I use: does this operation touch more than one model, call an outside service, fire
side effects, or need to run from more than one entry point? If yes, it gets an action. If no,
it stays where it is.

### The shape I use

No package, no base class, no interface. One public method called `handle`:

```php
namespace App\Actions\Orders;

use App\Enums\OrderStatus;
use App\Events\OrderRefunded;
use App\Exceptions\OrderNotRefundable;
use App\Models\Order;
use App\Models\Refund;
use App\Models\User;
use App\Services\Payments\PaymentGateway;
use Illuminate\Support\Facades\DB;

final class RefundOrder
{
    public function __construct(
        private PaymentGateway $gateway,
    ) {}

    public function handle(Order $order, User $by, ?string $reason = null): Refund
    {
        if (! $order->status->isRefundable()) {
            throw OrderNotRefundable::for($order);
        }

        $providerRefund = $this->gateway->refund($order->payment_reference, $order->total);

        $refund = DB::transaction(function () use ($order, $by, $reason, $providerRefund) {
            $refund = $order->refunds()->create([
                'amount' => $order->total,
                'provider_id' => $providerRefund->id,
                'reason' => $reason,
                'refunded_by' => $by->id,
            ]);

            $order->update(['status' => OrderStatus::Refunded]);

            return $refund;
        });

        OrderRefunded::dispatch($order, $refund);

        return $refund;
    }
}
```

A few choices in there that I hold to:

- **`handle`, not `__invoke` or `execute`.** It reads the same as jobs and listeners, and
  `$refund->handle(...)` is clearer at the call site than `($refund)(...)`. The name itself
  matters less than using one name across the whole codebase.
- **Explicit arguments, not an array.** `handle(Order $order, User $by, ?string $reason)` tells
  you what the operation needs. `handle(array $data)` tells you nothing, and static analysis
  can't help you. When the argument list gets long, I pass a small readonly data object instead.
- **The acting user is an argument.** The action does not call `auth()->user()`. When this
  runs from a queued job or a console command there is no authenticated user, and an action
  that reads the session quietly breaks there.
- **Authorization stays outside.** The controller or the Filament action checks the policy.
  The action enforces business rules ("this order is not refundable") and throws a domain
  exception when they fail. A console command run by an admin should not need to fake a
  logged-in user to pass a policy check.
- **The external call happens before the transaction.** Holding a database transaction open
  while you wait on a payment provider is how you get lock timeouts. Call the provider, then
  write everything in one short transaction.

### Calling it from a controller

The controller does HTTP things: authorize, validate, call, respond.

```php
public function store(RefundRequest $request, Order $order, RefundOrder $refundOrder)
{
    $this->authorize('refund', $order);

    $refund = $refundOrder->handle($order, $request->user(), $request->validated('reason'));

    return new RefundResource($refund);
}
```

Laravel resolves `RefundOrder` from the container, which builds the `PaymentGateway` for it.

### Calling it from a Filament action

This is where actions earn their keep for me, because most of my work is Filament panels. A
Filament table or page action is already a small adapter: it renders a button, maybe a modal
form, and runs a closure. The closure is the right place to call the action and nothing more.

In Filament 4 actions live under `Filament\Actions\Action`, and the closure gets `$record` and
the modal form `$data` injected by name:

```php
use App\Actions\Orders\RefundOrder;
use App\Exceptions\OrderNotRefundable;
use App\Models\Order;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;

Action::make('refund')
    ->requiresConfirmation()
    ->schema([
        Textarea::make('reason')->maxLength(500),
    ])
    ->visible(fn (Order $record): bool => auth()->user()->can('refund', $record))
    ->action(function (Order $record, array $data): void {
        try {
            resolve(RefundOrder::class)->handle($record, auth()->user(), $data['reason']);
        } catch (OrderNotRefundable $e) {
            Notification::make()->title($e->getMessage())->danger()->send();

            return;
        }

        Notification::make()->title('Order refunded')->success()->send();
    });
```

Two things I like about this split. The Filament code only deals with Filament concerns:
visibility, the modal, the notification. And when the same refund button is needed as a bulk
action, the bulk action loops over the records and calls the same `handle`. Nothing gets
copied into a second closure.

The version I see often, and avoid, puts thirty lines of refund logic directly in the
`->action()` closure. It works until someone needs the refund from an API, and then that logic
is trapped inside a resource class.

### Calling it from a Livewire component

Livewire 3 resolves type-hinted dependencies on action methods, so a component method can take
the action as a parameter the same way a controller does:

```php
use App\Actions\Orders\RefundOrder;
use App\Exceptions\OrderNotRefundable;
use App\Models\Order;
use Livewire\Attributes\Validate;
use Livewire\Component;

class OrderSupportPanel extends Component
{
    public Order $order;

    #[Validate('nullable|string|max:500')]
    public string $reason = '';

    public function refund(RefundOrder $refundOrder): void
    {
        $this->authorize('refund', $this->order);
        $this->validate();

        try {
            $refundOrder->handle($this->order, auth()->user(), $this->reason ?: null);
        } catch (OrderNotRefundable $e) {
            $this->addError('reason', $e->getMessage());

            return;
        }

        $this->dispatch('order-refunded');
    }
}
```

Same pattern again: the component owns state, validation, and what the UI shows on failure. The
action owns the operation.

### Queueing: wrap the action in a job

A pattern I have seen in tutorials is to mark the action itself `ShouldQueue` and call it
directly. That does nothing. `ShouldQueue` only matters when a class is dispatched through the
bus as a job, or registered as an event listener. Calling `->handle()` on an object runs it
right there, queue marker or not.

When the operation needs to run in the background, write a job that calls the action:

```php
namespace App\Jobs;

use App\Actions\Orders\RefundOrder;
use App\Models\Order;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class RefundOrderJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public Order $order,
        public User $by,
        public ?string $reason = null,
    ) {}

    public function handle(RefundOrder $refundOrder): void
    {
        $refundOrder->handle($this->order, $this->by, $this->reason);
    }
}
```

Job `handle` methods get dependencies injected by the container, so the action comes in as a
parameter. The job owns queue concerns (tries, backoff, uniqueness), the action owns the
business rule. This is also where passing the user explicitly pays off: the job has no session,
and the action never needed one.

If you would rather have one class that can be a controller, a job, a listener and a command,
[lorisleiva/laravel-actions](https://www.laravelactions.com) does that. I've chosen not to use it,
because I find two small explicit classes easier to read than one class that changes role
depending on how it was called. That is a preference, not a flaw in the package.

### Composing actions

Actions can call other actions through the constructor:

```php
final class CancelSubscription
{
    public function __construct(
        private RefundOrder $refundOrder,
        private RevokeAccess $revokeAccess,
    ) {}

    public function handle(Subscription $subscription, User $by): void
    {
        if ($subscription->latestOrder->isWithinRefundWindow()) {
            $this->refundOrder->handle($subscription->latestOrder, $by, 'Cancelled in refund window');
        }

        $this->revokeAccess->handle($subscription->team);

        $subscription->markCancelled();
    }
}
```

I keep this to one level. When an action calls an action that calls an action, it becomes hard
to see where a transaction starts and which events fire, and it usually means the top-level
action is really a workflow that wants to be a job chain or a batch.

### Testing

Actions are easy to test because they are plain classes. With Pest, I resolve the action from
the container and swap the external dependency:

```php
use App\Actions\Orders\RefundOrder;
use App\Enums\OrderStatus;
use App\Events\OrderRefunded;
use App\Exceptions\OrderNotRefundable;
use App\Models\Order;
use App\Models\User;
use App\Services\Payments\FakePaymentGateway;
use App\Services\Payments\PaymentGateway;
use Illuminate\Support\Facades\Event;

beforeEach(function () {
    $this->app->instance(PaymentGateway::class, new FakePaymentGateway);
});

it('refunds a paid order', function () {
    Event::fake([OrderRefunded::class]);
    $order = Order::factory()->paid()->create();

    $refund = resolve(RefundOrder::class)->handle($order, User::factory()->create());

    expect($order->fresh()->status)->toBe(OrderStatus::Refunded)
        ->and($refund->amount)->toEqual($order->total);

    Event::assertDispatched(OrderRefunded::class);
});

it('refuses an order that is already refunded', function () {
    $order = Order::factory()->refunded()->create();

    resolve(RefundOrder::class)->handle($order, User::factory()->create());
})->throws(OrderNotRefundable::class);
```

The business rules get tested once, here. The Filament and Livewire tests then only need to
check that the button calls the action and shows the right notification, which keeps them short.

### Where they live

`app/Actions`, grouped by domain: `app/Actions/Orders`, `app/Actions/Teams`. I don't add an
`Action` suffix, because the folder already says it, and `RefundOrder` reads better at the call
site than `RefundOrderAction`. Pick one convention and keep it.

### Where actions go wrong

The pattern has failure modes, and they are easy to fall into:

- **A hundred tiny actions.** If every model update gets a class, navigation gets worse and
  nothing is reused. Only extract operations that have real rules or several callers.
- **Actions that read global state.** `auth()`, `request()` and `session()` inside an action
  tie it to HTTP. Pass the values in.
- **Actions that return HTTP things.** An action that returns a `RedirectResponse` or calls
  `Notification::make()` can only be used from one place. Return the domain result and let the
  caller decide what to show.
- **Actions used as a namespace for helpers.** If a class has `handle`, `handleForAdmin` and
  `handleSilently`, it is a service. That is fine, but call it a service.

Kept to those rules, actions are the most boring part of a codebase, which is the point. When the
same operation is needed from a new place, such as an API or a bulk action, the answer is a new adapter of ten lines that calls code which is already tested.
