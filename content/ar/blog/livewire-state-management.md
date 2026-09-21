---
title: "إدارة الحالة في Livewire: أنماط للتطبيقات المعقدة"
description: أتقن إدارة الحالة في Livewire، من التواصل بين المكوّنات والحالة العامة إلى ربط الخصائص بعنوان URL وكائنات النماذج والحفظ في الجلسة.
tags:
  - Livewire
  - Laravel
  - State Management
  - TALL Stack
noImage: true
createdAt: 2025-11-15T09:00:00.000Z
updatedAt: 2025-11-15T09:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# إدارة الحالة في Livewire: أنماط للتطبيقات المعقدة

كلما كبر تطبيق Livewire، صارت إدارة الحالة (state) أمرًا حاسمًا. يغطي هذا الدليل أنماطًا مجرّبة للتواصل بين المكوّنات، والحالة العامة، وحفظ البيانات.

## أساسيات حالة المكوّن

### الخصائص التفاعلية (Reactive Properties)

```php
class ProductFilter extends Component
{
    public string $search = '';
    public ?string $category = null;
    public string $sortBy = 'created_at';
    public string $sortDirection = 'desc';

    // Automatically update on changes
    public function updatedSearch()
    {
        $this->resetPage(); // Reset pagination
    }

    public function render()
    {
        return view('livewire.product-filter', [
            'products' => Product::query()
                ->when($this->search, fn ($q) => $q->search($this->search))
                ->when($this->category, fn ($q) => $q->where('category_id', $this->category))
                ->orderBy($this->sortBy, $this->sortDirection)
                ->paginate(20),
        ]);
    }
}
```

### الخصائص المحسوبة (Computed Properties)

```php
use Livewire\Attributes\Computed;

class Cart extends Component
{
    public array $items = [];

    #[Computed]
    public function subtotal(): float
    {
        return collect($this->items)->sum(fn ($item) =>
            $item['price'] * $item['quantity']
        );
    }

    #[Computed]
    public function tax(): float
    {
        return $this->subtotal * 0.1;
    }

    #[Computed]
    public function total(): float
    {
        return $this->subtotal + $this->tax;
    }
}
```

## التواصل بين المكوّنات

### من الأب إلى الابن (Props)

```php
// Parent
<livewire:product-card :product="$product" :show-actions="true" />

// Child
class ProductCard extends Component
{
    public Product $product;
    public bool $showActions = false;

    public function render()
    {
        return view('livewire.product-card');
    }
}
```

### من الابن إلى الأب (Events)

```php
// Child component
class AddToCart extends Component
{
    public Product $product;
    public int $quantity = 1;

    public function add()
    {
        $this->dispatch('item-added', [
            'productId' => $this->product->id,
            'quantity' => $this->quantity,
        ]);
    }
}

// Parent component
class ShoppingCart extends Component
{
    public array $items = [];

    #[On('item-added')]
    public function handleItemAdded(int $productId, int $quantity)
    {
        $product = Product::find($productId);

        $this->items[] = [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'quantity' => $quantity,
        ];
    }
}
```

### التواصل بين المكوّنات الشقيقة (Events)

```php
// Component A dispatches
$this->dispatch('filters-changed', category: $this->category);

// Component B listens
#[On('filters-changed')]
public function updateFilters(string $category)
{
    $this->category = $category;
}
```

### الأحداث العامة

```php
// Dispatch to all components
$this->dispatch('cart-updated')->to('shopping-cart');

// Or broadcast to window (for Alpine.js)
$this->dispatch('notification', [
    'message' => 'Item added to cart',
    'type' => 'success',
]);
```

## ربط الخصائص بسلسلة الاستعلام في URL

### ربط أساسي بعنوان URL

```php
use Livewire\Attributes\Url;

class ProductIndex extends Component
{
    #[Url]
    public string $search = '';

    #[Url]
    public ?string $category = null;

    #[Url(as: 'page')]
    public int $currentPage = 1;

    #[Url(keep: true)] // Keep in URL even when default
    public string $sort = 'newest';
}
```

### تخصيص التعامل مع URL

```php
#[Url(history: true)] // Use history.pushState
public string $tab = 'overview';

#[Url(except: '')] // Exclude from URL when empty
public string $filter = '';
```

## كائنات النماذج (Form Objects)

### استخدام أصناف النماذج

```php
// app/Livewire/Forms/ContactForm.php
use Livewire\Form;

class ContactForm extends Form
{
    #[Validate('required|min:2')]
    public string $name = '';

    #[Validate('required|email')]
    public string $email = '';

    #[Validate('required|min:10')]
    public string $message = '';

    public function store(): Contact
    {
        $this->validate();

        return Contact::create($this->all());
    }
}

// Component
class ContactPage extends Component
{
    public ContactForm $form;

    public function submit()
    {
        $contact = $this->form->store();

        $this->form->reset();

        Notification::make()
            ->success()
            ->title('Message sent!')
            ->send();
    }
}
```

### نموذج مرتبط بنموذج بيانات (Model Binding)

```php
class PostForm extends Form
{
    public ?Post $post = null;

    #[Validate('required|max:255')]
    public string $title = '';

    #[Validate('required')]
    public string $content = '';

    public function setPost(Post $post): void
    {
        $this->post = $post;
        $this->title = $post->title;
        $this->content = $post->content;
    }

    public function save(): Post
    {
        $this->validate();

        if ($this->post) {
            $this->post->update($this->only(['title', 'content']));
            return $this->post;
        }

        return Post::create($this->only(['title', 'content']));
    }
}
```

## الحالة المحفوظة في الجلسة

### حفظ الحالة

```php
class UserPreferences extends Component
{
    public string $theme = 'light';
    public string $language = 'en';
    public bool $notifications = true;

    public function mount()
    {
        $this->theme = session('preferences.theme', 'light');
        $this->language = session('preferences.language', 'en');
        $this->notifications = session('preferences.notifications', true);
    }

    public function updatedTheme($value)
    {
        session(['preferences.theme' => $value]);
    }

    public function updatedLanguage($value)
    {
        session(['preferences.language' => $value]);
    }

    public function updatedNotifications($value)
    {
        session(['preferences.notifications' => $value]);
    }
}
```

### استخدام Trait للجلسة

```php
trait PersistsToSession
{
    protected array $sessionKeys = [];

    public function mountPersistsToSession()
    {
        foreach ($this->sessionKeys as $key) {
            if (session()->has($this->sessionKey($key))) {
                $this->$key = session($this->sessionKey($key));
            }
        }
    }

    public function updated($property, $value)
    {
        if (in_array($property, $this->sessionKeys)) {
            session([$this->sessionKey($property) => $value]);
        }
    }

    protected function sessionKey(string $property): string
    {
        return class_basename($this) . '.' . $property;
    }
}

// Usage
class ProductFilter extends Component
{
    use PersistsToSession;

    protected array $sessionKeys = ['category', 'sortBy'];

    public ?string $category = null;
    public string $sortBy = 'newest';
}
```

## إدارة الحالة العامة

### استخدام الكائنات المفردة (Singletons)

```php
// app/State/CartState.php
class CartState
{
    public Collection $items;

    public function __construct()
    {
        $this->items = collect(session('cart', []));
    }

    public function add(Product $product, int $quantity = 1): void
    {
        $existing = $this->items->firstWhere('product_id', $product->id);

        if ($existing) {
            $existing['quantity'] += $quantity;
        } else {
            $this->items->push([
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $quantity,
            ]);
        }

        $this->persist();
    }

    public function remove(int $productId): void
    {
        $this->items = $this->items->reject(fn ($item) =>
            $item['product_id'] === $productId
        );

        $this->persist();
    }

    protected function persist(): void
    {
        session(['cart' => $this->items->toArray()]);
    }

    public function total(): float
    {
        return $this->items->sum(fn ($item) => $item['price'] * $item['quantity']);
    }
}

// Register as singleton
// AppServiceProvider
$this->app->singleton(CartState::class);

// Use in component
class CartIcon extends Component
{
    public function render()
    {
        return view('livewire.cart-icon', [
            'cart' => app(CartState::class),
        ]);
    }
}
```

## تحديثات الواجهة المتفائلة (Optimistic UI)

```php
class LikeButton extends Component
{
    public Post $post;
    public bool $liked = false;
    public int $count = 0;

    public function mount()
    {
        $this->liked = $this->post->isLikedBy(auth()->user());
        $this->count = $this->post->likes_count;
    }

    public function toggle()
    {
        // Optimistic update (immediate UI feedback)
        $this->liked = !$this->liked;
        $this->count += $this->liked ? 1 : -1;

        // Then persist to database
        try {
            if ($this->liked) {
                $this->post->like(auth()->user());
            } else {
                $this->post->unlike(auth()->user());
            }
        } catch (\Exception $e) {
            // Revert on failure
            $this->liked = !$this->liked;
            $this->count += $this->liked ? 1 : -1;

            $this->dispatch('error', 'Failed to update like');
        }
    }
}
```

## تتبّع أخطاء الحالة

```php
class ComplexComponent extends Component
{
    public function render()
    {
        if (app()->isLocal()) {
            logger('Component state:', [
                'search' => $this->search,
                'filters' => $this->filters,
                'page' => $this->page,
            ]);
        }

        return view('livewire.complex-component');
    }
}
```

## أفضل الممارسات

### 1. أبقِ الحالة في حدها الأدنى

```php
// Bad: Storing entire model
public Post $post; // Serializes all attributes

// Good: Store only what's needed
public int $postId;
public string $postTitle;
```

### 2. استخدم الخصائص المحسوبة للحالة المشتقة

```php
// Bad: Manual sync
public int $total = 0;

public function addItem()
{
    $this->items[] = $item;
    $this->total = array_sum(array_column($this->items, 'price'));
}

// Good: Computed property
#[Computed]
public function total()
{
    return collect($this->items)->sum('price');
}
```

### 3. أعد ضبط الحالة بطريقة صحيحة

```php
public function clear()
{
    $this->reset(['search', 'filters', 'selectedItems']);
    $this->resetPage();
}
```

## الخلاصة

الإدارة الجيدة للحالة أساس بناء تطبيقات Livewire سهلة الصيانة. اختر النمط المناسب لكل موقف: الخصائص الممرَّرة (props) بين الأب والابن، والأحداث بين المكوّنات الشقيقة، وربط URL للحالة التي تريد مشاركتها، والجلسات للحفظ.

---

## مصادر

- [Livewire Properties](https://livewire.laravel.com/docs/properties)
- [Livewire Events](https://livewire.laravel.com/docs/events)

