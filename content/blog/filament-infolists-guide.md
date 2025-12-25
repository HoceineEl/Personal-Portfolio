---
title: "FilamentPHP Infolists: Beautiful Read-Only Data Display"
description: Master Filament Infolists for stunning data presentation. Learn entry types, layouts, relationships, actions, and custom views for detail pages.
tags:
  - FilamentPHP
  - Filament
  - Laravel
noImage: true
createdAt: 2025-04-15T10:00:00.000Z
updatedAt: 2025-04-15T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# FilamentPHP Infolists: Beautiful Read-Only Data Display

**Filament Infolists** create stunning read-only views for your data. Perfect for detail pages, dashboards, and anywhere you need to display information beautifully.

## Basic Setup

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

## Entry Types

### Text Entry

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

### Icon Entry

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

### Image Entry

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

### Color Entry

```php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('primary_color')
    ->copyable()
    ->copyMessage('Color copied!'),
```

### Key-Value Entry

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

## Layout Components

### Sections

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

### Grids

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

### Fieldsets

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

### Tabs

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

### Split Layout

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

## Relationships

### Repeatable Entry

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

### Nested Relationships

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

## Conditional Display

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

## Formatting

### Dates

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

### Numbers

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

### Lists

```php
TextEntry::make('tags')
    ->listWithLineBreaks()
    ->bulleted(),

TextEntry::make('permissions')
    ->badge()
    ->separator(','),
```

## Actions

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

## Custom Views

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

## Live Infolists (Livewire)

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

## Resource View Page

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

## Best Practices

1. **Group related information** - Use sections and tabs logically
2. **Use appropriate entry types** - Icons for booleans, badges for status
3. **Format data for readability** - Money, dates, lists
4. **Add actions where useful** - Copy, edit, view links
5. **Consider responsive layouts** - Use columns and grids

## Conclusion

Filament Infolists make data display beautiful and functional. Use them for detail pages, dashboards, and anywhere you need to present information clearly. Combine with actions for interactive read-only views.

---

## Resources

- [Filament Infolists Documentation](https://filamentphp.com/docs/infolists)
- [Filament Documentation](https://filamentphp.com/docs)

