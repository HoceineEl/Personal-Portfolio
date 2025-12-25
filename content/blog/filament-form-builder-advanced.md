---
title: "FilamentPHP Advanced Form Builder: Dynamic Forms and Custom Fields"
description: Master advanced FilamentPHP form techniques including dynamic fields, conditional logic, custom components, repeaters, and complex validation patterns.
tags:
  - FilamentPHP
  - Laravel
  - Forms
  - Admin Panel
  - TALL Stack
noImage: true
createdAt: 2025-10-01T10:00:00.000Z
updatedAt: 2025-10-01T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# FilamentPHP Advanced Form Builder: Dynamic Forms and Custom Fields

FilamentPHP's form builder is incredibly powerful. Beyond basic inputs, it supports dynamic fields, complex validation, custom components, and sophisticated conditional logic—all in pure PHP.

## Dynamic Form Fields

### Conditional Visibility

```php
use Filament\Forms\Get;
use Filament\Forms\Set;

Select::make('type')
    ->options([
        'individual' => 'Individual',
        'company' => 'Company',
    ])
    ->live()
    ->required(),

// Show for individuals
TextInput::make('first_name')
    ->visible(fn (Get $get) => $get('type') === 'individual'),

TextInput::make('last_name')
    ->visible(fn (Get $get) => $get('type') === 'individual'),

// Show for companies
TextInput::make('company_name')
    ->visible(fn (Get $get) => $get('type') === 'company'),

TextInput::make('registration_number')
    ->visible(fn (Get $get) => $get('type') === 'company'),
```

### Dynamic Options

```php
Select::make('country')
    ->options(Country::pluck('name', 'id'))
    ->live()
    ->required(),

Select::make('state')
    ->options(fn (Get $get) =>
        State::where('country_id', $get('country'))
            ->pluck('name', 'id')
    )
    ->live()
    ->visible(fn (Get $get) => filled($get('country'))),

Select::make('city')
    ->options(fn (Get $get) =>
        City::where('state_id', $get('state'))
            ->pluck('name', 'id')
    )
    ->visible(fn (Get $get) => filled($get('state'))),
```

### Setting Values Programmatically

```php
Select::make('template')
    ->options([
        'blog' => 'Blog Post',
        'product' => 'Product Page',
        'landing' => 'Landing Page',
    ])
    ->live()
    ->afterStateUpdated(function (Set $set, ?string $state) {
        $defaults = match ($state) {
            'blog' => [
                'layout' => 'sidebar',
                'show_author' => true,
                'show_date' => true,
            ],
            'product' => [
                'layout' => 'full-width',
                'show_price' => true,
                'show_cart' => true,
            ],
            'landing' => [
                'layout' => 'hero',
                'show_cta' => true,
            ],
            default => [],
        };

        foreach ($defaults as $field => $value) {
            $set($field, $value);
        }
    }),
```

## Repeaters

### Basic Repeater

```php
Repeater::make('items')
    ->schema([
        TextInput::make('name')->required(),
        TextInput::make('quantity')
            ->numeric()
            ->minValue(1)
            ->default(1),
        TextInput::make('price')
            ->numeric()
            ->prefix('$'),
    ])
    ->columns(3)
    ->defaultItems(1)
    ->addActionLabel('Add Item')
    ->reorderable()
    ->collapsible(),
```

### Repeater with Calculations

```php
Repeater::make('line_items')
    ->schema([
        Select::make('product_id')
            ->relationship('product', 'name')
            ->live()
            ->afterStateUpdated(function (Set $set, Get $get, ?string $state) {
                if ($state) {
                    $product = Product::find($state);
                    $set('unit_price', $product->price);
                    $set('subtotal', $product->price * ($get('quantity') ?: 1));
                }
            }),

        TextInput::make('quantity')
            ->numeric()
            ->default(1)
            ->live()
            ->afterStateUpdated(function (Set $set, Get $get) {
                $set('subtotal', $get('unit_price') * $get('quantity'));
            }),

        TextInput::make('unit_price')
            ->numeric()
            ->prefix('$')
            ->disabled(),

        TextInput::make('subtotal')
            ->numeric()
            ->prefix('$')
            ->disabled(),
    ])
    ->live()
    ->afterStateUpdated(function (Get $get, Set $set) {
        $total = collect($get('line_items'))
            ->sum('subtotal');
        $set('total', $total);
    }),

TextInput::make('total')
    ->numeric()
    ->prefix('$')
    ->disabled(),
```

### Nested Repeaters

```php
Repeater::make('sections')
    ->schema([
        TextInput::make('title'),

        Repeater::make('blocks')
            ->schema([
                Select::make('type')
                    ->options([
                        'text' => 'Text Block',
                        'image' => 'Image',
                        'video' => 'Video',
                    ])
                    ->live(),

                Textarea::make('content')
                    ->visible(fn (Get $get) => $get('type') === 'text'),

                FileUpload::make('image')
                    ->image()
                    ->visible(fn (Get $get) => $get('type') === 'image'),

                TextInput::make('video_url')
                    ->url()
                    ->visible(fn (Get $get) => $get('type') === 'video'),
            ])
            ->itemLabel(fn (array $state) => $state['type'] ?? 'Block'),
    ])
    ->itemLabel(fn (array $state) => $state['title'] ?? 'Section'),
```

## Custom Field Components

### Creating Custom Field

```php
// app/Forms/Components/ColorPicker.php
use Filament\Forms\Components\Field;

class ColorPicker extends Field
{
    protected string $view = 'forms.components.color-picker';

    protected array $colors = [];

    public function colors(array $colors): static
    {
        $this->colors = $colors;
        return $this;
    }

    public function getColors(): array
    {
        return $this->colors ?: [
            '#EF4444', '#F97316', '#EAB308',
            '#22C55E', '#3B82F6', '#8B5CF6',
        ];
    }
}
```

```blade
{{-- resources/views/forms/components/color-picker.blade.php --}}
<x-dynamic-component :component="$getFieldWrapperView()" :field="$field">
    <div class="flex gap-2">
        @foreach($getColors() as $color)
            <button
                type="button"
                wire:click="$set('{{ $getStatePath() }}', '{{ $color }}')"
                class="w-8 h-8 rounded-full border-2 {{ $getState() === $color ? 'border-black' : 'border-transparent' }}"
                style="background-color: {{ $color }}"
            ></button>
        @endforeach
    </div>
</x-dynamic-component>
```

### Using Custom Field

```php
ColorPicker::make('brand_color')
    ->colors(['#FF0000', '#00FF00', '#0000FF', '#FFFF00'])
    ->required(),
```

## Complex Validation

### Conditional Validation

```php
TextInput::make('tax_id')
    ->requiredIf('type', 'company')
    ->rules([
        fn (Get $get) => $get('type') === 'company'
            ? 'regex:/^[A-Z]{2}[0-9]{9}$/'
            : '',
    ]),
```

### Cross-Field Validation

```php
DatePicker::make('start_date')
    ->required()
    ->live(),

DatePicker::make('end_date')
    ->required()
    ->after('start_date')
    ->rules([
        fn (Get $get) => function ($attribute, $value, $fail) use ($get) {
            $start = $get('start_date');
            if ($start && Carbon::parse($value)->diffInDays($start) > 30) {
                $fail('The date range cannot exceed 30 days.');
            }
        },
    ]),
```

### Repeater Validation

```php
Repeater::make('contacts')
    ->schema([
        TextInput::make('email')->email()->required(),
        Select::make('type')
            ->options(['primary' => 'Primary', 'secondary' => 'Secondary']),
    ])
    ->minItems(1)
    ->maxItems(5)
    ->rules([
        function () {
            return function ($attribute, $value, $fail) {
                $primaryCount = collect($value)
                    ->where('type', 'primary')
                    ->count();

                if ($primaryCount !== 1) {
                    $fail('You must have exactly one primary contact.');
                }
            };
        },
    ]),
```

## Wizard Forms

### Multi-Step Form

```php
use Filament\Forms\Components\Wizard;

Wizard::make([
    Wizard\Step::make('Account')
        ->description('Set up your account')
        ->icon('heroicon-o-user')
        ->schema([
            TextInput::make('email')->email()->required(),
            TextInput::make('password')->password()->required()->confirmed(),
            TextInput::make('password_confirmation')->password()->required(),
        ])
        ->columns(1),

    Wizard\Step::make('Profile')
        ->description('Tell us about yourself')
        ->icon('heroicon-o-identification')
        ->schema([
            TextInput::make('name')->required(),
            FileUpload::make('avatar')->image()->avatar(),
            Textarea::make('bio')->rows(3),
        ]),

    Wizard\Step::make('Billing')
        ->description('Add payment method')
        ->icon('heroicon-o-credit-card')
        ->schema([
            TextInput::make('card_number')->required(),
            Grid::make(2)->schema([
                TextInput::make('expiry')->placeholder('MM/YY'),
                TextInput::make('cvc')->password(),
            ]),
        ]),
])
    ->startOnStep(1)
    ->cancelAction($this->getCancelFormAction())
    ->submitAction($this->getSubmitFormAction())
    ->skippable(),
```

### Step Validation

```php
Wizard\Step::make('Account')
    ->schema([...])
    ->afterValidation(function () {
        // Check email isn't already taken
        if (User::where('email', $this->data['email'])->exists()) {
            Notification::make()
                ->danger()
                ->title('Email already registered')
                ->send();

            $this->halt();
        }
    }),
```

## File Uploads

### Advanced Upload Configuration

```php
FileUpload::make('documents')
    ->multiple()
    ->maxFiles(10)
    ->maxSize(10240) // 10MB
    ->acceptedFileTypes(['application/pdf', 'image/*'])
    ->disk('s3')
    ->directory('documents/' . auth()->id())
    ->visibility('private')
    ->downloadable()
    ->previewable()
    ->openable()
    ->reorderable()
    ->appendFiles() // Keep existing files when adding new ones
    ->storeFileNamesIn('document_names'),
```

### Image Manipulation

```php
FileUpload::make('avatar')
    ->image()
    ->avatar()
    ->imageEditor()
    ->imageEditorAspectRatios([
        '1:1',
        '4:3',
        '16:9',
    ])
    ->imageCropAspectRatio('1:1')
    ->imageResizeTargetWidth('400')
    ->imageResizeTargetHeight('400'),
```

## Performance Optimization

### Deferred Loading

```php
Select::make('user_id')
    ->searchable()
    ->getSearchResultsUsing(fn (string $search) =>
        User::where('name', 'like', "%{$search}%")
            ->limit(50)
            ->pluck('name', 'id')
    )
    ->getOptionLabelUsing(fn ($value) =>
        User::find($value)?->name
    ),
```

### Partial Updates

```php
TextInput::make('search')
    ->live(debounce: 500)
    ->afterStateUpdated(function ($state, $livewire) {
        // Only update specific component
        $livewire->dispatch('refresh-results');
    }),
```

## Conclusion

FilamentPHP's form builder handles everything from simple inputs to complex multi-step wizards with conditional logic. The key is understanding the Get/Set pattern for reactivity and leveraging the component system for reusability.

Master these patterns, and you can build any form your application needs.

---

## Resources

- [Filament Forms Documentation](https://filamentphp.com/docs/4.x/forms)
- [Filament Form Fields](https://filamentphp.com/docs/4.x/forms/fields)

