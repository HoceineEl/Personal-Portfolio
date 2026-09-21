---
title: "Infolists في FilamentPHP: عرض أنيق للبيانات للقراءة فقط"
description: أتقن Infolists في Filament لعرض البيانات عرضًا لافتًا. تعرّف على أنواع الحقول، والتخطيطات، والعلاقات، والإجراءات، والعروض المخصصة لصفحات التفاصيل.
tags:
  - FilamentPHP
  - Filament
  - Laravel
noImage: true
createdAt: 2025-04-15T10:00:00.000Z
updatedAt: 2025-04-15T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Infolists في FilamentPHP: عرض أنيق للبيانات للقراءة فقط

تنشئ **Filament Infolists** واجهات عرض لافتة لبياناتك للقراءة فقط. مثالية لصفحات التفاصيل ولوحات المؤشرات، وأي مكان تحتاج فيه إلى عرض المعلومات بأناقة.

## الإعداد الأساسي

```php
use Filament\Infolists\Infolist;
use Filament\Infolists\Components\TextEntry;

public function infolist(Infolist $infolist): Infolist
{
    return $infolist
        ->schema([
            TextEntry::make('name'),
            TextEntry::make('email'),
            TextEntry::make('created_at')
                ->dateTime(),
        ]);
}
```

## أنواع الحقول (Entries)

### حقل النص (Text Entry)

```php
TextEntry::make('name')
    ->label('Full Name')
    ->size(TextEntry\EntrySize::Large)
    ->weight(FontWeight::Bold)
    ->color('primary'),

TextEntry::make('description')
    ->markdown()
    ->columnSpanFull(),

TextEntry::make('status')
    ->badge()
    ->color(fn (string $state) => match ($state) {
        'active' => 'success',
        'pending' => 'warning',
        'cancelled' => 'danger',
        default => 'gray',
    }),
```

### حقل الأيقونة (Icon Entry)

```php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_active')
    ->boolean(),

IconEntry::make('status')
    ->icon(fn (string $state) => match ($state) {
        'published' => 'heroicon-o-check-circle',
        'draft' => 'heroicon-o-pencil',
        'archived' => 'heroicon-o-archive-box',
    })
    ->color(fn (string $state) => match ($state) {
        'published' => 'success',
        'draft' => 'warning',
        'archived' => 'gray',
    }),
```

### حقل الصورة (Image Entry)

```php
use Filament\Infolists\Components\ImageEntry;

ImageEntry::make('avatar')
    ->circular()
    ->size(100),

ImageEntry::make('gallery')
    ->stacked()
    ->limit(3)
    ->ring(2)
    ->overlap(4),
```

### حقل اللون (Color Entry)

```php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('primary_color')
    ->copyable()
    ->copyMessage('Color copied!'),
```

### حقل المفتاح والقيمة (Key-Value Entry)

```php
use Filament\Infolists\Components\KeyValueEntry;

KeyValueEntry::make('metadata')
    ->label('Order Details'),

// Displays:
// Key        | Value
// Order ID   | 12345
// Status     | Shipped
// Total      | $99.00
```

## مكوّنات التخطيط

### الأقسام (Sections)

```php
use Filament\Infolists\Components\Section;

Section::make('Personal Information')
    ->description('Basic user details')
    ->icon('heroicon-o-user')
    ->schema([
        TextEntry::make('name'),
        TextEntry::make('email'),
        TextEntry::make('phone'),
    ])
    ->columns(2),

Section::make('Settings')
    ->collapsible()
    ->collapsed()
    ->schema([
        // ...
    ]),
```

### الشبكات (Grids)

```php
use Filament\Infolists\Components\Grid;

Grid::make(3)
    ->schema([
        TextEntry::make('orders_count')
            ->label('Total Orders'),
        TextEntry::make('total_spent')
            ->money('USD'),
        TextEntry::make('average_order')
            ->money('USD'),
    ]),
```

### مجموعات الحقول (Fieldsets)

```php
use Filament\Infolists\Components\Fieldset;

Fieldset::make('Address')
    ->schema([
        TextEntry::make('street'),
        TextEntry::make('city'),
        TextEntry::make('state'),
        TextEntry::make('zip'),
    ])
    ->columns(2),
```

### التبويبات (Tabs)

```php
use Filament\Infolists\Components\Tabs;

Tabs::make('Details')
    ->tabs([
        Tabs\Tab::make('Overview')
            ->icon('heroicon-o-information-circle')
            ->schema([
                TextEntry::make('name'),
                TextEntry::make('description'),
            ]),
        Tabs\Tab::make('Orders')
            ->icon('heroicon-o-shopping-bag')
            ->schema([
                RepeatableEntry::make('orders')
                    ->schema([
                        TextEntry::make('number'),
                        TextEntry::make('total')->money(),
                    ]),
            ]),
        Tabs\Tab::make('Activity')
            ->icon('heroicon-o-clock')
            ->badge(fn ($record) => $record->activities->count())
            ->schema([
                // ...
            ]),
    ]),
```

### التخطيط المقسوم (Split)

```php
use Filament\Infolists\Components\Split;

Split::make([
    Section::make('Details')
        ->schema([
            TextEntry::make('name'),
            TextEntry::make('email'),
        ]),
    Section::make('Avatar')
        ->schema([
            ImageEntry::make('avatar')
                ->size(200),
        ])
        ->grow(false),
]),
```

## العلاقات

### الحقل المتكرر (Repeatable Entry)

```php
use Filament\Infolists\Components\RepeatableEntry;

RepeatableEntry::make('orderItems')
    ->schema([
        TextEntry::make('product.name'),
        TextEntry::make('quantity'),
        TextEntry::make('price')
            ->money(),
        TextEntry::make('subtotal')
            ->money()
            ->state(fn ($record) => $record->quantity * $record->price),
    ])
    ->columns(4),
```

### العلاقات المتداخلة

```php
Section::make('Customer')
    ->relationship('customer')
    ->schema([
        TextEntry::make('name'),
        TextEntry::make('email'),
        RepeatableEntry::make('addresses')
            ->schema([
                TextEntry::make('label'),
                TextEntry::make('full_address'),
            ]),
    ]),
```

## العرض المشروط

```php
TextEntry::make('discount')
    ->money()
    ->visible(fn ($record) => $record->discount > 0),

TextEntry::make('employee_id')
    ->hidden(fn ($record) => !$record->is_employee),

Section::make('Admin Notes')
    ->visible(fn () => auth()->user()->isAdmin())
    ->schema([
        TextEntry::make('internal_notes'),
    ]),
```

## التنسيق

### التواريخ

```php
TextEntry::make('created_at')
    ->date(), // Jan 1, 2024

TextEntry::make('published_at')
    ->dateTime(), // Jan 1, 2024 12:00 AM

TextEntry::make('updated_at')
    ->since(), // 2 hours ago

TextEntry::make('event_date')
    ->date('F j, Y'), // January 1, 2024
```

### الأرقام

```php
TextEntry::make('price')
    ->money('USD'),

TextEntry::make('quantity')
    ->numeric(
        decimalPlaces: 0,
        thousandsSeparator: ',',
    ),

TextEntry::make('percentage')
    ->suffix('%'),
```

### القوائم

```php
TextEntry::make('tags')
    ->listWithLineBreaks()
    ->bulleted(),

TextEntry::make('permissions')
    ->badge()
    ->separator(','),
```

## الإجراءات (Actions)

```php
use Filament\Infolists\Components\Actions;
use Filament\Infolists\Components\Actions\Action;

Actions::make([
    Action::make('edit')
        ->url(fn ($record) => route('users.edit', $record))
        ->icon('heroicon-o-pencil'),
    Action::make('delete')
        ->requiresConfirmation()
        ->action(fn ($record) => $record->delete())
        ->icon('heroicon-o-trash')
        ->color('danger'),
]),

// Inline actions on entries
TextEntry::make('email')
    ->copyable()
    ->copyMessage('Email copied!')
    ->suffixAction(
        Action::make('send')
            ->icon('heroicon-o-envelope')
            ->action(fn () => /* send email */),
    ),
```

## العروض المخصصة

```php
use Filament\Infolists\Components\ViewEntry;

ViewEntry::make('map')
    ->view('infolists.components.map'),
```

```blade
{{-- resources/views/infolists/components/map.blade.php --}}
<div
    x-data="{ lat: @js($getState()['lat']), lng: @js($getState()['lng']) }"
    x-init="initMap(lat, lng)"
    class="h-64 rounded-lg"
    id="map"
></div>
```

## Infolists حية (Livewire)

```php
use Filament\Infolists\Concerns\InteractsWithInfolists;
use Filament\Infolists\Contracts\HasInfolists;

class ShowOrder extends Component implements HasInfolists
{
    use InteractsWithInfolists;

    public Order $order;

    public function orderInfolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->record($this->order)
            ->schema([
                Section::make('Order Details')
                    ->schema([
                        TextEntry::make('number'),
                        TextEntry::make('status')->badge(),
                        TextEntry::make('total')->money(),
                    ]),
            ]);
    }

    public function render()
    {
        return view('livewire.show-order');
    }
}
```

```blade
<div>
    {{ $this->orderInfolist }}
</div>
```

## صفحة العرض في المورد (Resource)

```php
// app/Filament/Resources/UserResource/Pages/ViewUser.php
class ViewUser extends ViewRecord
{
    protected static string $resource = UserResource::class;

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Split::make([
                    Section::make([
                        TextEntry::make('name'),
                        TextEntry::make('email'),
                        TextEntry::make('role')->badge(),
                    ]),
                    Section::make([
                        ImageEntry::make('avatar')
                            ->circular()
                            ->size(150),
                    ])->grow(false),
                ]),
                Section::make('Orders')
                    ->schema([
                        RepeatableEntry::make('orders')
                            ->schema([
                                TextEntry::make('number'),
                                TextEntry::make('total')->money(),
                                TextEntry::make('created_at')->date(),
                            ])
                            ->columns(3),
                    ]),
            ]);
    }
}
```

## أفضل الممارسات

1. **اجمع المعلومات المترابطة**: استخدم الأقسام والتبويبات بترتيب منطقي
2. **اختر نوع الحقل المناسب**: الأيقونات للقيم المنطقية (booleans)، والشارات (badges) للحالة
3. **نسّق البيانات لتسهل قراءتها**: المبالغ المالية، والتواريخ، والقوائم
4. **أضف الإجراءات حيث تفيد**: النسخ، والتعديل، وروابط العرض
5. **راعِ التخطيطات المتجاوبة**: استخدم الأعمدة والشبكات

## الخلاصة

تجعل Filament Infolists عرض البيانات أنيقًا وعمليًا. استخدمها لصفحات التفاصيل ولوحات المؤشرات، وأي مكان تحتاج فيه إلى عرض المعلومات بوضوح. واجمعها مع الإجراءات لتحصل على واجهات تفاعلية للقراءة فقط.

---

## مصادر

- [Filament Infolists Documentation](https://filamentphp.com/docs/infolists)
- [Filament Documentation](https://filamentphp.com/docs)

