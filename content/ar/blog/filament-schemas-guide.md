---
title: "Schemas في FilamentPHP: بناء واجهات يديرها الخادم بلغة PHP"
description: أتقن نظام Schemas الثوري في FilamentPHP v4. تعلّم كيف تجمع النماذج وقوائم المعلومات والإجراءات في واجهات موحدة دون كتابة JavaScript.
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

# Schemas في FilamentPHP: بناء واجهات يديرها الخادم بلغة PHP

**Schemas** أعمق ابتكار معماري في FilamentPHP v4. توحّد النماذج (forms)، وقوائم المعلومات (infolists)، والجداول، والإجراءات (actions) في نظام مكوّنات واحد قابل للتركيب، وكل ذلك تتحكم فيه من PHP.

## ما هي Schemas؟

Schemas بنية مكوّنات موحّدة تسمح لك بمزج أنواع مختلفة من المكوّنات في واجهة واحدة:

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

## لماذا تهم Schemas

### قبل Schemas (v3)

كنت تحتاج أصنافًا وواجهات منفصلة:

```php
// UserResource/Pages/EditUser.php - Form
// UserResource/Pages/ViewUser.php - Infolist
// Separate action modals
// Different component APIs
```

### مع Schemas (v4)

كل شيء في مكان واحد:

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

## مكوّنات Schema الأساسية

### Section

الحاوية الأساسية للتجميع:

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

تخطيطات متجاوبة:

```php
Grid::make(3) // 3 columns
    ->schema([
        TextInput::make('first_name')->columnSpan(1),
        TextInput::make('last_name')->columnSpan(1),
        TextInput::make('email')->columnSpan(1),
    ]);
```

### Tabs

محتوى منظّم:

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

## مزج أنواع المكوّنات

القوة الحقيقية في الجمع بين النماذج وقوائم المعلومات والإجراءات:

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

## بناء صفحات مخصصة بـ Schemas

### مثال: لوحة المؤشرات

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

## Schemas شرطية

اعرض مكوّنات مختلفة حسب الحالة:

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

## مكوّنات Schema قابلة لإعادة الاستخدام

أنشئ مصانع للمكوّنات:

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

## التحقق في Schemas

اجمع التحقق عبر أنواع المكوّنات المختلفة:

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

## تحسين الأداء

### العرض الجزئي

```php
TextInput::make('search')
    ->live()
    ->partiallyRenderComponentsAfterStateUpdated()
    ->afterStateUpdated(fn () => $this->search());
```

### التحميل المؤجل

```php
Section::make('Heavy Data')
    ->deferred()
    ->schema([
        // Only loads when section is visible
        RepeatableEntry::make('items')
            ->schema([...]),
    ]);
```

## الخلاصة

تمثل Schemas نقلة جذرية في طريقة بناء لوحات الإدارة. حين توحّد FilamentPHP v4 النماذج وقوائم المعلومات والإجراءات في نظام واحد، تستطيع بناء واجهات معقدة بالكامل بلغة PHP، دون الحاجة إلى JavaScript.

الفكرة الأهم: الواجهة التي يديرها الخادم لا تعني التضحية بالتفاعلية. بفضل Livewire في الخلفية، تستجيب Schemas بسرعة ويبقى كل المنطق على الخادم.

---

## مصادر

- [توثيق Filament Schemas](https://filamentphp.com/docs/4.x/schemas)
- [مرجع مكوّنات Filament](https://filamentphp.com/docs/4.x/components)

