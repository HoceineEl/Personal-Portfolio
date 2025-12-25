---
title: "FilamentPHP Schemas: Building Server-Driven UIs in PHP"
description: Master FilamentPHP v4's revolutionary Schemas system. Learn to combine forms, infolists, and actions into unified interfaces without writing JavaScript.
tags:
  - FilamentPHP
  - Filament v4
  - Laravel
  - TALL Stack
  - Admin Panel
noImage: true
createdAt: 2025-09-15T10:00:00.000Z
updatedAt: 2025-09-15T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# FilamentPHP Schemas: Building Server-Driven UIs in PHP

**Schemas** are FilamentPHP v4's most architectural innovation. They unify forms, infolists, tables, and actions into a single, composable component system—all controlled from PHP.

## What Are Schemas?

Schemas are a unified component architecture that allows you to mix and match different component types in a single view:

```php
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Actions\Action;

public function schema(Schema $schema): Schema
{
    return $schema->components([
        Section::make('User Profile')
            ->schema([
                // Editable field
                TextInput::make('name')->required(),

                // Read-only display
                TextEntry::make('email'),

                // Action button
                Action::make('verify')
                    ->button()
                    ->action(fn () => $this->verify()),
            ]),
    ]);
}
```

## Why Schemas Matter

### Before Schemas (v3)

You needed separate classes and views:

```php
// UserResource/Pages/EditUser.php - Form
// UserResource/Pages/ViewUser.php - Infolist
// Separate action modals
// Different component APIs
```

### With Schemas (v4)

Everything in one place:

```php
// One schema, multiple component types
public function profileSchema(Schema $schema): Schema
{
    return $schema->components([
        $this->editableSection(),
        $this->readOnlyStats(),
        $this->actionButtons(),
    ]);
}
```

## Core Schema Components

### Section

The primary container for grouping:

```php
Section::make('Account Details')
    ->description('Manage your account settings')
    ->icon('heroicon-o-user')
    ->collapsible()
    ->schema([
        TextInput::make('username'),
        TextInput::make('email')->email(),
    ]);
```

### Grid

Responsive layouts:

```php
Grid::make(3) // 3 columns
    ->schema([
        TextInput::make('first_name')->columnSpan(1),
        TextInput::make('last_name')->columnSpan(1),
        TextInput::make('email')->columnSpan(1),
    ]);
```

### Tabs

Organized content:

```php
Tabs::make('Settings')
    ->tabs([
        Tab::make('Profile')
            ->icon('heroicon-o-user')
            ->schema([
                TextInput::make('name'),
                FileUpload::make('avatar'),
            ]),
        Tab::make('Security')
            ->icon('heroicon-o-lock-closed')
            ->schema([
                TextInput::make('password')->password(),
                Toggle::make('two_factor'),
            ]),
    ]);
```

## Mixing Component Types

The real power is combining forms, infolists, and actions:

```php
public function orderSchema(Schema $schema): Schema
{
    return $schema->components([
        // Read-only order info
        Section::make('Order Information')
            ->schema([
                TextEntry::make('order_number')
                    ->copyable(),
                TextEntry::make('created_at')
                    ->dateTime(),
                BadgeEntry::make('status')
                    ->color(fn (string $state) => match ($state) {
                        'pending' => 'warning',
                        'processing' => 'info',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                    }),
            ]),

        // Editable notes
        Section::make('Internal Notes')
            ->schema([
                Textarea::make('notes')
                    ->rows(3),
            ]),

        // Action buttons
        Actions::make([
            Action::make('process')
                ->color('info')
                ->requiresConfirmation()
                ->action(fn () => $this->record->process()),

            Action::make('cancel')
                ->color('danger')
                ->requiresConfirmation()
                ->action(fn () => $this->record->cancel()),
        ]),
    ]);
}
```

## Building Custom Pages with Schemas

### Dashboard Example

```php
class Dashboard extends Page
{
    protected static string $view = 'filament.pages.dashboard';

    public function schema(Schema $schema): Schema
    {
        return $schema->components([
            // Stats widgets
            Grid::make(4)->schema([
                $this->statCard('Total Users', User::count(), 'heroicon-o-users'),
                $this->statCard('Revenue', '$' . number_format(Order::sum('total')), 'heroicon-o-currency-dollar'),
                $this->statCard('Orders', Order::count(), 'heroicon-o-shopping-cart'),
                $this->statCard('Products', Product::count(), 'heroicon-o-cube'),
            ]),

            // Recent activity
            Section::make('Recent Orders')
                ->schema([
                    RepeatableEntry::make('recentOrders')
                        ->schema([
                            TextEntry::make('order_number'),
                            TextEntry::make('customer.name'),
                            TextEntry::make('total')->money('USD'),
                        ])
                        ->columns(3),
                ]),

            // Quick actions
            Section::make('Quick Actions')
                ->schema([
                    Actions::make([
                        Action::make('new_order')
                            ->label('Create Order')
                            ->url(OrderResource::getUrl('create')),
                        Action::make('export')
                            ->label('Export Report')
                            ->action(fn () => $this->export()),
                    ]),
                ]),
        ]);
    }

    protected function statCard(string $label, string $value, string $icon): Component
    {
        return Section::make()
            ->schema([
                IconEntry::make('icon')
                    ->icon($icon)
                    ->size('lg'),
                TextEntry::make('value')
                    ->state($value)
                    ->size('xl')
                    ->weight('bold'),
                TextEntry::make('label')
                    ->state($label)
                    ->color('gray'),
            ])
            ->extraAttributes(['class' => 'text-center']);
    }
}
```

## Conditional Schemas

Show different components based on state:

```php
public function schema(Schema $schema): Schema
{
    return $schema->components([
        Select::make('type')
            ->options(['individual' => 'Individual', 'company' => 'Company'])
            ->live(),

        // Show for individuals
        Section::make('Personal Information')
            ->visible(fn (Get $get) => $get('type') === 'individual')
            ->schema([
                TextInput::make('first_name'),
                TextInput::make('last_name'),
                DatePicker::make('birth_date'),
            ]),

        // Show for companies
        Section::make('Company Information')
            ->visible(fn (Get $get) => $get('type') === 'company')
            ->schema([
                TextInput::make('company_name'),
                TextInput::make('registration_number'),
                TextInput::make('vat_number'),
            ]),
    ]);
}
```

## Reusable Schema Components

Create component factories:

```php
// app/Filament/Schemas/AddressSchema.php
class AddressSchema
{
    public static function make(string $prefix = ''): array
    {
        return [
            TextInput::make($prefix . 'street')
                ->label('Street Address')
                ->required(),
            Grid::make(3)->schema([
                TextInput::make($prefix . 'city')->required(),
                TextInput::make($prefix . 'state')->required(),
                TextInput::make($prefix . 'zip')->required(),
            ]),
            Select::make($prefix . 'country')
                ->options(Country::pluck('name', 'code'))
                ->searchable(),
        ];
    }
}

// Usage
Section::make('Billing Address')
    ->schema(AddressSchema::make('billing_')),

Section::make('Shipping Address')
    ->schema(AddressSchema::make('shipping_')),
```

## Schema Validation

Combine validation across component types:

```php
public function schema(Schema $schema): Schema
{
    return $schema
        ->components([
            TextInput::make('email')
                ->email()
                ->required()
                ->unique('users', 'email'),

            TextInput::make('password')
                ->password()
                ->required()
                ->minLength(8)
                ->confirmed(),

            TextInput::make('password_confirmation')
                ->password()
                ->required(),
        ])
        ->statePath('data');
}

public function save(): void
{
    $data = $this->form->getState(); // Validates all fields

    User::create($data);
}
```

## Performance Optimization

### Partial Rendering

```php
TextInput::make('search')
    ->live()
    ->partiallyRenderComponentsAfterStateUpdated()
    ->afterStateUpdated(fn () => $this->search());
```

### Deferred Loading

```php
Section::make('Heavy Data')
    ->deferred()
    ->schema([
        // Only loads when section is visible
        RepeatableEntry::make('items')
            ->schema([...]),
    ]);
```

## Conclusion

Schemas represent a paradigm shift in how we build admin interfaces. By unifying forms, infolists, and actions into a single system, FilamentPHP v4 lets you build complex UIs entirely in PHP—no JavaScript required.

The key insight is that server-driven UI doesn't mean sacrificing interactivity. With Livewire under the hood, schemas feel responsive while keeping all logic on the server.

---

## Resources

- [Filament Schemas Documentation](https://filamentphp.com/docs/4.x/schemas)
- [Filament Components Reference](https://filamentphp.com/docs/4.x/components)

