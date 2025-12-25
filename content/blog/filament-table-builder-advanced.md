---
title: "FilamentPHP Table Builder: Advanced Techniques for Complex Data"
description: Master FilamentPHP tables with advanced filtering, custom columns, bulk actions, export functionality, and performance optimization for large datasets.
tags:
  - FilamentPHP
  - Laravel
  - Tables
  - Admin Panel
  - TALL Stack
noImage: true
createdAt: 2025-10-10T10:00:00.000Z
updatedAt: 2025-10-10T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# FilamentPHP Table Builder: Advanced Techniques for Complex Data

FilamentPHP's table builder is remarkably powerful. This guide covers advanced techniques for filtering, custom columns, performance optimization, and handling complex data scenarios.

## Advanced Columns

### Custom Column Formatting

```php
use Filament\Tables\Columns\TextColumn;

TextColumn::make('price')
    ->money('USD')
    ->sortable(),

TextColumn::make('status')
    ->badge()
    ->color(fn (string $state) => match ($state) {
        'draft' => 'gray',
        'pending' => 'warning',
        'published' => 'success',
        'archived' => 'danger',
    }),

TextColumn::make('created_at')
    ->dateTime()
    ->sortable()
    ->since() // "2 hours ago"
    ->description(fn ($record) => $record->created_at->format('F j, Y')),
```

### Computed Columns

```php
TextColumn::make('full_name')
    ->state(fn ($record) => "{$record->first_name} {$record->last_name}")
    ->searchable(query: function ($query, $search) {
        $query->where('first_name', 'like', "%{$search}%")
              ->orWhere('last_name', 'like', "%{$search}%");
    }),

TextColumn::make('profit')
    ->state(fn ($record) => $record->revenue - $record->costs)
    ->money('USD')
    ->color(fn ($state) => $state >= 0 ? 'success' : 'danger'),
```

### Relationship Columns

```php
TextColumn::make('author.name')
    ->sortable()
    ->searchable(),

TextColumn::make('tags.name')
    ->badge()
    ->separator(',')
    ->limitList(3)
    ->expandableLimitedList(),

TextColumn::make('orders_count')
    ->counts('orders')
    ->sortable(),

TextColumn::make('orders_sum_total')
    ->sum('orders', 'total')
    ->money('USD'),
```

### Icon Column

```php
IconColumn::make('is_featured')
    ->boolean()
    ->trueIcon('heroicon-o-star')
    ->falseIcon('heroicon-o-x-mark')
    ->trueColor('warning')
    ->falseColor('gray'),

IconColumn::make('status')
    ->icon(fn (string $state) => match ($state) {
        'pending' => 'heroicon-o-clock',
        'processing' => 'heroicon-o-arrow-path',
        'shipped' => 'heroicon-o-truck',
        'delivered' => 'heroicon-o-check-circle',
    })
    ->color(fn (string $state) => match ($state) {
        'pending' => 'warning',
        'processing' => 'info',
        'shipped' => 'primary',
        'delivered' => 'success',
    }),
```

## Advanced Filtering

### Custom Filter

```php
use Filament\Tables\Filters\Filter;
use Illuminate\Database\Eloquent\Builder;

Filter::make('date_range')
    ->form([
        DatePicker::make('from'),
        DatePicker::make('until'),
    ])
    ->query(function (Builder $query, array $data): Builder {
        return $query
            ->when(
                $data['from'],
                fn (Builder $query, $date) => $query->whereDate('created_at', '>=', $date)
            )
            ->when(
                $data['until'],
                fn (Builder $query, $date) => $query->whereDate('created_at', '<=', $date)
            );
    })
    ->indicateUsing(function (array $data): array {
        $indicators = [];

        if ($data['from'] ?? null) {
            $indicators['from'] = 'From ' . Carbon::parse($data['from'])->toFormattedDateString();
        }

        if ($data['until'] ?? null) {
            $indicators['until'] = 'Until ' . Carbon::parse($data['until'])->toFormattedDateString();
        }

        return $indicators;
    }),
```

### Select Filter with Relationship

```php
SelectFilter::make('category')
    ->relationship('category', 'name')
    ->searchable()
    ->preload()
    ->multiple(),

SelectFilter::make('status')
    ->options([
        'draft' => 'Draft',
        'pending' => 'Pending Review',
        'published' => 'Published',
        'archived' => 'Archived',
    ])
    ->multiple()
    ->default(['published']),
```

### Ternary Filter

```php
TernaryFilter::make('is_featured')
    ->label('Featured')
    ->placeholder('All posts')
    ->trueLabel('Featured only')
    ->falseLabel('Non-featured only'),

TernaryFilter::make('has_comments')
    ->queries(
        true: fn (Builder $query) => $query->has('comments'),
        false: fn (Builder $query) => $query->doesntHave('comments'),
    ),
```

### Filter Groups

```php
->filters([
    Filter::make('status')
        ->form([
            Select::make('status')
                ->options(['active' => 'Active', 'inactive' => 'Inactive']),
        ]),
], layout: FiltersLayout::AboveContent)
->filtersFormColumns(3),
```

## Bulk Actions

### Custom Bulk Action

```php
use Filament\Tables\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;

BulkAction::make('export')
    ->label('Export Selected')
    ->icon('heroicon-o-arrow-down-tray')
    ->action(function (Collection $records) {
        return response()->streamDownload(function () use ($records) {
            $csv = fopen('php://output', 'w');

            fputcsv($csv, ['ID', 'Name', 'Email', 'Created']);

            foreach ($records as $record) {
                fputcsv($csv, [
                    $record->id,
                    $record->name,
                    $record->email,
                    $record->created_at->format('Y-m-d'),
                ]);
            }

            fclose($csv);
        }, 'export.csv');
    }),

BulkAction::make('changeStatus')
    ->icon('heroicon-o-pencil-square')
    ->form([
        Select::make('status')
            ->options([
                'active' => 'Active',
                'inactive' => 'Inactive',
            ])
            ->required(),
    ])
    ->action(function (Collection $records, array $data) {
        $records->each(fn ($record) => $record->update(['status' => $data['status']]));

        Notification::make()
            ->success()
            ->title('Status updated')
            ->body("{$records->count()} records updated.")
            ->send();
    })
    ->deselectRecordsAfterCompletion(),
```

### Bulk Delete with Confirmation

```php
BulkAction::make('delete')
    ->icon('heroicon-o-trash')
    ->color('danger')
    ->requiresConfirmation()
    ->modalHeading('Delete selected records?')
    ->modalDescription(fn (Collection $records) =>
        "You are about to delete {$records->count()} records. This action cannot be undone."
    )
    ->action(fn (Collection $records) => $records->each->delete())
    ->deselectRecordsAfterCompletion(),
```

## Inline Editing

```php
TextColumn::make('name')
    ->sortable()
    ->searchable(),

TextInputColumn::make('name')
    ->rules(['required', 'max:255']),

SelectColumn::make('status')
    ->options([
        'draft' => 'Draft',
        'published' => 'Published',
    ]),

ToggleColumn::make('is_active'),
```

## Performance Optimization

### Eager Loading

```php
public static function table(Table $table): Table
{
    return $table
        ->query(
            Post::query()
                ->with(['author', 'category', 'tags'])
                ->withCount('comments')
        )
        ->columns([
            TextColumn::make('title'),
            TextColumn::make('author.name'),
            TextColumn::make('category.name'),
            TextColumn::make('comments_count'),
        ]);
}
```

### Pagination Optimization

```php
->paginated([10, 25, 50, 100])
->defaultPaginationPageOption(25)
->paginationPageOptions([10, 25, 50, 100, 'all'])
->deferLoading(), // Only load visible rows
```

### Column-Specific Optimization

```php
TextColumn::make('author.name')
    ->sortable(query: function (Builder $query, string $direction): Builder {
        return $query
            ->join('users', 'posts.author_id', '=', 'users.id')
            ->orderBy('users.name', $direction);
    }),
```

## Empty States

```php
->emptyStateHeading('No posts yet')
->emptyStateDescription('Create your first post to get started.')
->emptyStateIcon('heroicon-o-document-text')
->emptyStateActions([
    Action::make('create')
        ->label('Create Post')
        ->url(route('filament.admin.resources.posts.create'))
        ->icon('heroicon-m-plus')
        ->button(),
]),
```

## Row Actions

### Action Group

```php
->actions([
    ActionGroup::make([
        ViewAction::make(),
        EditAction::make(),
        Action::make('duplicate')
            ->icon('heroicon-o-document-duplicate')
            ->action(function (Post $record) {
                $duplicate = $record->replicate();
                $duplicate->title = $record->title . ' (Copy)';
                $duplicate->slug = $record->slug . '-copy';
                $duplicate->save();

                Notification::make()
                    ->success()
                    ->title('Post duplicated')
                    ->send();
            }),
        DeleteAction::make(),
    ])
        ->button()
        ->label('Actions'),
])
```

### Conditional Actions

```php
Action::make('publish')
    ->icon('heroicon-o-check')
    ->color('success')
    ->visible(fn (Post $record) => $record->status === 'draft')
    ->action(fn (Post $record) => $record->publish()),

Action::make('unpublish')
    ->icon('heroicon-o-x-mark')
    ->color('warning')
    ->visible(fn (Post $record) => $record->status === 'published')
    ->action(fn (Post $record) => $record->unpublish()),
```

## Table Grouping

```php
->groups([
    Group::make('category.name')
        ->label('Category')
        ->collapsible(),

    Group::make('created_at')
        ->label('Date')
        ->date()
        ->collapsible(),
])
->defaultGroup('category.name')
->groupingSettingsHidden(),
```

## Reordering

```php
->reorderable('sort_order')
->defaultSort('sort_order')
```

## Full Table Example

```php
public static function table(Table $table): Table
{
    return $table
        ->query(Post::with(['author', 'category']))
        ->columns([
            TextColumn::make('title')
                ->searchable()
                ->sortable()
                ->limit(50),

            TextColumn::make('author.name')
                ->sortable()
                ->searchable(),

            TextColumn::make('category.name')
                ->badge()
                ->color('primary'),

            TextColumn::make('status')
                ->badge()
                ->color(fn (string $state) => match ($state) {
                    'draft' => 'gray',
                    'published' => 'success',
                    default => 'warning',
                }),

            TextColumn::make('published_at')
                ->dateTime()
                ->sortable()
                ->toggleable(),

            TextColumn::make('views_count')
                ->numeric()
                ->sortable(),
        ])
        ->filters([
            SelectFilter::make('status')
                ->options(['draft' => 'Draft', 'published' => 'Published']),
            SelectFilter::make('category')
                ->relationship('category', 'name'),
        ])
        ->actions([
            ViewAction::make(),
            EditAction::make(),
            DeleteAction::make(),
        ])
        ->bulkActions([
            BulkActionGroup::make([
                DeleteBulkAction::make(),
            ]),
        ])
        ->defaultSort('created_at', 'desc')
        ->poll('30s');
}
```

## Conclusion

FilamentPHP's table builder handles everything from simple lists to complex data grids. Master column customization, advanced filtering, and bulk actions to build powerful admin interfaces.

---

## Resources

- [Filament Tables Documentation](https://filamentphp.com/docs/4.x/tables)
- [Filament Columns Reference](https://filamentphp.com/docs/4.x/tables/columns)

