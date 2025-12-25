---
title: "FilamentPHP Custom Actions and Bulk Operations: Complete Guide"
description: Master FilamentPHP actions from basic buttons to complex bulk operations. Learn modals, confirmations, notifications, background jobs, and action groups.
tags:
  - FilamentPHP
  - Laravel
  - Admin Panel
  - TALL Stack
noImage: true
createdAt: 2025-09-20T10:00:00.000Z
updatedAt: 2025-09-20T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# FilamentPHP Custom Actions and Bulk Operations: Complete Guide

Actions are the heart of interactivity in FilamentPHP. From simple buttons to complex bulk operations with modals, Filament provides a powerful, consistent API for building admin workflows.

## Understanding Actions

Actions in Filament can appear in multiple places:
- **Table row actions** - Per-record operations
- **Table bulk actions** - Multi-record operations
- **Header actions** - Page-level operations
- **Form actions** - Within forms
- **Infolist actions** - In display views

## Basic Actions

### Simple Action

```php
use Filament\Tables\Actions\Action;

Action::make('view')
    ->label('View Details')
    ->icon('heroicon-o-eye')
    ->url(fn (Post $record) => route('posts.show', $record));
```

### Action with Callback

```php
Action::make('archive')
    ->icon('heroicon-o-archive-box')
    ->color('warning')
    ->action(function (Post $record) {
        $record->update(['archived_at' => now()]);
    });
```

### Action with Confirmation

```php
Action::make('delete')
    ->icon('heroicon-o-trash')
    ->color('danger')
    ->requiresConfirmation()
    ->modalHeading('Delete Post')
    ->modalDescription('Are you sure you want to delete this post? This cannot be undone.')
    ->modalSubmitActionLabel('Yes, delete it')
    ->action(fn (Post $record) => $record->delete());
```

## Actions with Forms

### Modal Form

```php
Action::make('changeStatus')
    ->icon('heroicon-o-pencil-square')
    ->form([
        Select::make('status')
            ->options([
                'draft' => 'Draft',
                'published' => 'Published',
                'archived' => 'Archived',
            ])
            ->required(),
        Textarea::make('reason')
            ->label('Reason for change')
            ->required(),
    ])
    ->action(function (Post $record, array $data) {
        $record->update(['status' => $data['status']]);

        Activity::log('status_changed', [
            'reason' => $data['reason'],
            'old_status' => $record->getOriginal('status'),
            'new_status' => $data['status'],
        ]);
    });
```

### Pre-filled Form

```php
Action::make('edit')
    ->icon('heroicon-o-pencil')
    ->fillForm(fn (Post $record) => [
        'title' => $record->title,
        'category' => $record->category_id,
    ])
    ->form([
        TextInput::make('title')->required(),
        Select::make('category')
            ->relationship('category', 'name'),
    ])
    ->action(function (Post $record, array $data) {
        $record->update($data);
    });
```

## Bulk Actions

### Basic Bulk Action

```php
use Filament\Tables\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;

BulkAction::make('publish')
    ->icon('heroicon-o-check-circle')
    ->color('success')
    ->requiresConfirmation()
    ->action(fn (Collection $records) => $records->each->update(['status' => 'published']));
```

### Bulk Action with Form

```php
BulkAction::make('assignCategory')
    ->icon('heroicon-o-tag')
    ->form([
        Select::make('category_id')
            ->label('Category')
            ->options(Category::pluck('name', 'id'))
            ->required(),
    ])
    ->action(function (Collection $records, array $data) {
        $records->each(function ($record) use ($data) {
            $record->update(['category_id' => $data['category_id']]);
        });
    })
    ->deselectRecordsAfterCompletion();
```

### Bulk Delete with Conditions

```php
BulkAction::make('forceDelete')
    ->icon('heroicon-o-trash')
    ->color('danger')
    ->requiresConfirmation()
    ->modalHeading('Permanently Delete Records')
    ->modalDescription(fn (Collection $records) =>
        "You are about to permanently delete {$records->count()} records. This cannot be undone."
    )
    ->action(function (Collection $records) {
        $records->each(function ($record) {
            if ($record->canBeDeleted()) {
                $record->forceDelete();
            }
        });
    })
    ->hidden(fn () => ! auth()->user()->can('forceDelete', Post::class));
```

## Action Groups

Organize related actions:

```php
use Filament\Tables\Actions\ActionGroup;

ActionGroup::make([
    Action::make('view')
        ->icon('heroicon-o-eye')
        ->url(fn (Post $record) => route('posts.show', $record)),

    Action::make('edit')
        ->icon('heroicon-o-pencil')
        ->url(fn (Post $record) => PostResource::getUrl('edit', ['record' => $record])),

    Action::make('duplicate')
        ->icon('heroicon-o-document-duplicate')
        ->action(function (Post $record) {
            $record->replicate()->save();
        }),
])
    ->label('Actions')
    ->icon('heroicon-m-ellipsis-vertical')
    ->color('gray')
    ->button();
```

### Dropdown Group

```php
ActionGroup::make([
    Action::make('export_pdf')
        ->icon('heroicon-o-document')
        ->action(fn (Post $record) => $this->exportPdf($record)),

    Action::make('export_word')
        ->icon('heroicon-o-document-text')
        ->action(fn (Post $record) => $this->exportWord($record)),
])
    ->label('Export')
    ->icon('heroicon-o-arrow-down-tray')
    ->dropdown();
```

## Notifications

### Success Notification

```php
Action::make('approve')
    ->action(function (Post $record) {
        $record->approve();

        Notification::make()
            ->success()
            ->title('Post Approved')
            ->body("The post '{$record->title}' has been approved.")
            ->send();
    });
```

### Error Handling

```php
Action::make('process')
    ->action(function (Post $record) {
        try {
            $record->process();

            Notification::make()
                ->success()
                ->title('Processing Complete')
                ->send();
        } catch (\Exception $e) {
            Notification::make()
                ->danger()
                ->title('Processing Failed')
                ->body($e->getMessage())
                ->persistent()
                ->send();
        }
    });
```

## Background Jobs

### Dispatching Jobs

```php
Action::make('generateReport')
    ->icon('heroicon-o-document-chart-bar')
    ->action(function (Post $record) {
        GeneratePostReport::dispatch($record, auth()->user());

        Notification::make()
            ->info()
            ->title('Report Generation Started')
            ->body('You will receive an email when the report is ready.')
            ->send();
    });
```

### Bulk Job Processing

```php
BulkAction::make('processAll')
    ->icon('heroicon-o-cog')
    ->requiresConfirmation()
    ->action(function (Collection $records) {
        // Dispatch as batch for monitoring
        $batch = Bus::batch(
            $records->map(fn ($record) => new ProcessRecord($record))
        )
            ->name('Process Records')
            ->onQueue('processing')
            ->dispatch();

        Notification::make()
            ->success()
            ->title('Processing Started')
            ->body("Batch ID: {$batch->id}")
            ->send();
    });
```

## Conditional Actions

### Visibility Conditions

```php
Action::make('publish')
    ->visible(fn (Post $record) => $record->status === 'draft')
    ->action(fn (Post $record) => $record->publish());

Action::make('unpublish')
    ->visible(fn (Post $record) => $record->status === 'published')
    ->action(fn (Post $record) => $record->unpublish());
```

### Authorization

```php
Action::make('delete')
    ->authorize('delete')  // Uses PostPolicy@delete
    ->action(fn (Post $record) => $record->delete());

// Or explicit check
Action::make('forceDelete')
    ->hidden(fn (Post $record) => ! auth()->user()->can('forceDelete', $record))
    ->action(fn (Post $record) => $record->forceDelete());
```

### Disabled State

```php
Action::make('checkout')
    ->disabled(fn (Order $record) => $record->items->isEmpty())
    ->tooltip(fn (Order $record) =>
        $record->items->isEmpty() ? 'Add items before checkout' : null
    );
```

## Advanced Patterns

### Multi-Step Wizard Action

```php
Action::make('onboard')
    ->steps([
        Step::make('Personal')
            ->schema([
                TextInput::make('name')->required(),
                TextInput::make('email')->email()->required(),
            ]),
        Step::make('Company')
            ->schema([
                TextInput::make('company_name')->required(),
                Select::make('industry')->options([...]),
            ]),
        Step::make('Preferences')
            ->schema([
                CheckboxList::make('features')
                    ->options([...]),
            ]),
    ])
    ->action(function (array $data, User $record) {
        $record->update($data);
        $record->markAsOnboarded();
    });
```

### Chained Actions

```php
Action::make('processAndNotify')
    ->action(function (Post $record, $livewire) {
        $record->process();

        // Trigger another action
        $livewire->mountAction('sendNotification', [
            'record' => $record,
        ]);
    });
```

### Action with File Download

```php
Action::make('downloadInvoice')
    ->icon('heroicon-o-arrow-down-tray')
    ->action(function (Order $record) {
        $pdf = Pdf::loadView('invoices.pdf', ['order' => $record]);

        return response()->streamDownload(
            fn () => print($pdf->output()),
            "invoice-{$record->number}.pdf"
        );
    });
```

## Table Actions Configuration

```php
public static function table(Table $table): Table
{
    return $table
        ->columns([...])
        ->actions([
            ActionGroup::make([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Action::make('duplicate')
                    ->icon('heroicon-o-document-duplicate')
                    ->action(fn (Post $record) => $record->replicate()->save()),
            ]),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\DeleteBulkAction::make(),
                BulkAction::make('export')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->action(fn (Collection $records) => $this->export($records)),
            ]),
        ]);
}
```

## Conclusion

FilamentPHP's action system provides a consistent, powerful way to add interactivity to your admin panels. From simple buttons to complex multi-step wizards with background processing, actions handle it all with clean, readable code.

The key is choosing the right action type for your use case and leveraging modals, forms, and notifications to create intuitive user experiences.

---

## Resources

- [Filament Actions Documentation](https://filamentphp.com/docs/4.x/actions)
- [Filament Tables Actions](https://filamentphp.com/docs/4.x/tables/actions)

