---
title: "الإجراءات المخصصة والعمليات الجماعية في FilamentPHP: دليل شامل"
description: أتقن إجراءات FilamentPHP من الأزرار البسيطة إلى العمليات الجماعية المعقدة. تعلّم النوافذ المنبثقة، والتأكيدات، والإشعارات، والمهام في الخلفية، ومجموعات الإجراءات.
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

# الإجراءات المخصصة والعمليات الجماعية في FilamentPHP: دليل شامل

الإجراءات (Actions) هي قلب التفاعل في FilamentPHP. من الأزرار البسيطة إلى العمليات الجماعية المعقدة بنوافذ منبثقة، يوفّر Filament واجهة برمجية (API) قوية ومتّسقة لبناء مسارات العمل في لوحات الإدارة.

## فهم الإجراءات

تظهر الإجراءات في Filament في أماكن متعددة:
- **إجراءات صفوف الجدول** - عمليات على سجل واحد
- **الإجراءات الجماعية في الجدول** - عمليات على عدة سجلات
- **إجراءات الترويسة** - عمليات على مستوى الصفحة
- **إجراءات النماذج** - داخل النماذج
- **إجراءات قوائم المعلومات (Infolist)** - في صفحات العرض

## الإجراءات الأساسية

### إجراء بسيط

```php
use Filament\Tables\Actions\Action;

Action::make('view')
    ->label('View Details')
    ->icon('heroicon-o-eye')
    ->url(fn (Post $record) => route('posts.show', $record));
```

### إجراء مع دالة تنفيذ

```php
Action::make('archive')
    ->icon('heroicon-o-archive-box')
    ->color('warning')
    ->action(function (Post $record) {
        $record->update(['archived_at' => now()]);
    });
```

### إجراء مع تأكيد

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

## الإجراءات مع النماذج

### نموذج في نافذة منبثقة

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

### نموذج معبّأ مسبقًا

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

## الإجراءات الجماعية

### إجراء جماعي أساسي

```php
use Filament\Tables\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;

BulkAction::make('publish')
    ->icon('heroicon-o-check-circle')
    ->color('success')
    ->requiresConfirmation()
    ->action(fn (Collection $records) => $records->each->update(['status' => 'published']));
```

### إجراء جماعي مع نموذج

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

### حذف جماعي بشروط

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

## مجموعات الإجراءات

نظّم الإجراءات المترابطة:

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

### مجموعة في قائمة منسدلة

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

## الإشعارات

### إشعار نجاح

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

### معالجة الأخطاء

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

## المهام في الخلفية

### إرسال المهام إلى الطابور

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

### معالجة جماعية بالمهام

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

## الإجراءات الشرطية

### شروط الظهور

```php
Action::make('publish')
    ->visible(fn (Post $record) => $record->status === 'draft')
    ->action(fn (Post $record) => $record->publish());

Action::make('unpublish')
    ->visible(fn (Post $record) => $record->status === 'published')
    ->action(fn (Post $record) => $record->unpublish());
```

### الصلاحيات

```php
Action::make('delete')
    ->authorize('delete')  // Uses PostPolicy@delete
    ->action(fn (Post $record) => $record->delete());

// Or explicit check
Action::make('forceDelete')
    ->hidden(fn (Post $record) => ! auth()->user()->can('forceDelete', $record))
    ->action(fn (Post $record) => $record->forceDelete());
```

### حالة التعطيل

```php
Action::make('checkout')
    ->disabled(fn (Order $record) => $record->items->isEmpty())
    ->tooltip(fn (Order $record) =>
        $record->items->isEmpty() ? 'Add items before checkout' : null
    );
```

## أنماط متقدمة

### إجراء بمعالج متعدد الخطوات

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

### إجراءات متسلسلة

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

### إجراء لتنزيل ملف

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

## إعداد إجراءات الجدول

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

## الخلاصة

يوفّر نظام الإجراءات في FilamentPHP طريقة متّسقة وقوية لإضافة التفاعل إلى لوحات الإدارة. من الأزرار البسيطة إلى المعالجات المعقدة متعددة الخطوات مع المعالجة في الخلفية، تتولى الإجراءات كل ذلك بشيفرة نظيفة وسهلة القراءة.

المفتاح أن تختار نوع الإجراء المناسب لحالتك، وأن تستفيد من النوافذ المنبثقة والنماذج والإشعارات لبناء تجربة استخدام بديهية.

---

## مصادر

- [توثيق إجراءات Filament](https://filamentphp.com/docs/4.x/actions)
- [إجراءات الجداول في Filament](https://filamentphp.com/docs/4.x/tables/actions)

