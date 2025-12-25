---
title: "Livewire Form Objects: Clean and Reusable Form Logic"
description: Master Livewire Form Objects for cleaner components. Learn form validation, nested forms, form arrays, file uploads, and reusable form patterns.
tags:
  - Livewire
  - Laravel
  - Forms
noImage: true
createdAt: 2025-04-30T10:00:00.000Z
updatedAt: 2025-04-30T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Livewire Form Objects: Clean and Reusable Form Logic

**Livewire Form Objects** extract form logic from components into dedicated classes. Keep your components clean and your forms reusable.

## The Problem

Components with forms often become bloated:

```php
// Bloated component - form logic mixed with everything
class CreateUser extends Component
{
    public $name = '';
    public $email = '';
    public $password = '';
    public $password_confirmation = '';
    public $role = 'user';
    public $permissions = [];
    public $avatar;
    public $bio = '';
    public $website = '';
    public $twitter = '';
    public $github = '';

    protected $rules = [
        'name' => 'required|min:3',
        'email' => 'required|email|unique:users',
        // ... 10 more rules
    ];

    // ... validation messages, save logic, etc.
}
```

## Form Objects Solution

```php
// app/Livewire/Forms/UserForm.php
namespace App\Livewire\Forms;

use Livewire\Form;
use Livewire\Attributes\Validate;

class UserForm extends Form
{
    #[Validate('required|min:3')]
    public string $name = '';

    #[Validate('required|email|unique:users')]
    public string $email = '';

    #[Validate('required|min:8|confirmed')]
    public string $password = '';

    public string $password_confirmation = '';

    #[Validate('required|in:user,admin,editor')]
    public string $role = 'user';

    public function store(): User
    {
        $this->validate();

        return User::create([
            'name' => $this->name,
            'email' => $this->email,
            'password' => Hash::make($this->password),
            'role' => $this->role,
        ]);
    }
}
```

```php
// app/Livewire/CreateUser.php
namespace App\Livewire;

use App\Livewire\Forms\UserForm;
use Livewire\Component;

class CreateUser extends Component
{
    public UserForm $form;

    public function save()
    {
        $user = $this->form->store();

        return redirect()->route('users.show', $user);
    }

    public function render()
    {
        return view('livewire.create-user');
    }
}
```

## Blade Template

```blade
<form wire:submit="save">
    <div>
        <label>Name</label>
        <input wire:model="form.name" type="text" />
        @error('form.name') <span class="error">{{ $message }}</span> @enderror
    </div>

    <div>
        <label>Email</label>
        <input wire:model="form.email" type="email" />
        @error('form.email') <span class="error">{{ $message }}</span> @enderror
    </div>

    <div>
        <label>Password</label>
        <input wire:model="form.password" type="password" />
        @error('form.password') <span class="error">{{ $message }}</span> @enderror
    </div>

    <div>
        <label>Confirm Password</label>
        <input wire:model="form.password_confirmation" type="password" />
    </div>

    <button type="submit">Create User</button>
</form>
```

## Reusing Forms

### Create and Edit with Same Form

```php
// Form object handles both create and update
class PostForm extends Form
{
    public ?Post $post = null;

    #[Validate('required|min:5')]
    public string $title = '';

    #[Validate('required|min:100')]
    public string $content = '';

    #[Validate('required|exists:categories,id')]
    public ?int $category_id = null;

    #[Validate('array')]
    public array $tags = [];

    public function setPost(Post $post): void
    {
        $this->post = $post;
        $this->title = $post->title;
        $this->content = $post->content;
        $this->category_id = $post->category_id;
        $this->tags = $post->tags->pluck('id')->toArray();
    }

    public function store(): Post
    {
        $this->validate();

        $data = [
            'title' => $this->title,
            'content' => $this->content,
            'category_id' => $this->category_id,
        ];

        if ($this->post) {
            $this->post->update($data);
            $post = $this->post;
        } else {
            $post = auth()->user()->posts()->create($data);
        }

        $post->tags()->sync($this->tags);

        return $post;
    }
}
```

```php
// CreatePost component
class CreatePost extends Component
{
    public PostForm $form;

    public function save()
    {
        $post = $this->form->store();
        return redirect()->route('posts.show', $post);
    }
}

// EditPost component
class EditPost extends Component
{
    public PostForm $form;

    public function mount(Post $post)
    {
        $this->form->setPost($post);
    }

    public function save()
    {
        $post = $this->form->store();
        return redirect()->route('posts.show', $post);
    }
}
```

## Dynamic Validation Rules

```php
class UserForm extends Form
{
    public ?User $user = null;

    #[Validate]
    public string $email = '';

    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($this->user?->id),
            ],
        ];
    }
}
```

## Validation Messages

```php
class ContactForm extends Form
{
    #[Validate('required|email')]
    public string $email = '';

    #[Validate('required|min:10')]
    public string $message = '';

    public function messages(): array
    {
        return [
            'email.required' => 'We need your email to respond.',
            'message.min' => 'Please provide more details (at least 10 characters).',
        ];
    }
}
```

## File Uploads

```php
use Livewire\WithFileUploads;
use Livewire\Attributes\Validate;

class ProfileForm extends Form
{
    use WithFileUploads;

    #[Validate('nullable|image|max:2048')]
    public $avatar;

    #[Validate('required')]
    public string $name = '';

    public function store(): void
    {
        $this->validate();

        $data = ['name' => $this->name];

        if ($this->avatar) {
            $data['avatar_path'] = $this->avatar->store('avatars', 'public');
        }

        auth()->user()->update($data);
    }
}
```

## Nested Forms

```php
class OrderForm extends Form
{
    #[Validate('required')]
    public string $customer_name = '';

    #[Validate('required|email')]
    public string $customer_email = '';

    // Nested address
    #[Validate('required')]
    public string $shipping_street = '';

    #[Validate('required')]
    public string $shipping_city = '';

    #[Validate('required|size:5')]
    public string $shipping_zip = '';

    // Order items
    #[Validate('required|array|min:1')]
    public array $items = [];

    public function addItem(): void
    {
        $this->items[] = [
            'product_id' => null,
            'quantity' => 1,
            'price' => 0,
        ];
    }

    public function removeItem(int $index): void
    {
        unset($this->items[$index]);
        $this->items = array_values($this->items);
    }

    public function rules(): array
    {
        return [
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ];
    }
}
```

```blade
@foreach($form->items as $index => $item)
    <div class="item-row">
        <select wire:model="form.items.{{ $index }}.product_id">
            @foreach($products as $product)
                <option value="{{ $product->id }}">{{ $product->name }}</option>
            @endforeach
        </select>

        <input wire:model="form.items.{{ $index }}.quantity" type="number" min="1" />

        <button wire:click="form.removeItem({{ $index }})" type="button">
            Remove
        </button>
    </div>
@endforeach

<button wire:click="form.addItem" type="button">Add Item</button>
```

## Reset Form

```php
class ContactForm extends Form
{
    public string $name = '';
    public string $email = '';
    public string $message = '';

    public function submit(): void
    {
        $this->validate();

        // Send email...

        $this->reset(); // Reset all properties
        // or
        $this->reset(['message']); // Reset specific properties
    }
}
```

## Form States

```php
class CheckoutForm extends Form
{
    public string $step = 'shipping';

    // Shipping fields
    public string $address = '';
    public string $city = '';

    // Payment fields
    public string $card_number = '';
    public string $expiry = '';
    public string $cvv = '';

    public function validateShipping(): bool
    {
        $this->validateOnly('address');
        $this->validateOnly('city');

        if ($this->getErrorBag()->isEmpty()) {
            $this->step = 'payment';
            return true;
        }

        return false;
    }

    public function validatePayment(): bool
    {
        $this->validateOnly('card_number');
        $this->validateOnly('expiry');
        $this->validateOnly('cvv');

        return $this->getErrorBag()->isEmpty();
    }
}
```

## Real-Time Validation

```php
class RegistrationForm extends Form
{
    #[Validate('required|min:3')]
    public string $username = '';

    #[Validate('required|email|unique:users')]
    public string $email = '';
}
```

```blade
<input
    wire:model.live.debounce.500ms="form.email"
    type="email"
/>
@error('form.email')
    <span class="error">{{ $message }}</span>
@enderror
```

## Best Practices

### 1. One Form Per Use Case

```php
// Good: Specific forms
class CreateUserForm extends Form { }
class UpdateProfileForm extends Form { }
class ChangePasswordForm extends Form { }

// Avoid: One giant form for everything
class UserForm extends Form { } // Does too much
```

### 2. Keep Store Methods Focused

```php
public function store(): User
{
    $this->validate();

    // Create user
    $user = User::create($this->validated());

    // Let events handle side effects
    event(new UserCreated($user));

    return $user;
}
```

### 3. Use Computed Properties

```php
class OrderForm extends Form
{
    public array $items = [];

    public function getTotal(): float
    {
        return collect($this->items)->sum(fn ($item) =>
            $item['quantity'] * $item['price']
        );
    }
}
```

## Conclusion

Form Objects keep your Livewire components clean by extracting form logic into dedicated, reusable classes. Use them for any form with more than a few fields.

---

## Resources

- [Livewire Form Objects](https://livewire.laravel.com/docs/forms)
- [Livewire Documentation](https://livewire.laravel.com)

