---
title: "FilamentPHP v4: The Complete Guide to All New Features"
description: Master FilamentPHP v4's revolutionary features including Schemas, nested resources, MFA, non-model tables, TipTap editor, and massive performance improvements with 2-3x faster rendering.
tags:
  - FilamentPHP
  - Filament v4
  - Laravel
  - Admin Panel
  - TALL Stack
noImage: true
createdAt: 2025-09-01T10:00:00.000Z
updatedAt: 2025-09-01T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# FilamentPHP v4: The Complete Guide to All New Features

FilamentPHP v4 went **stable on August 12, 2025**, after its beta launch at Laravel Live UK on June 10. This release transforms Filament from an admin panel builder into a comprehensive application framework capable of building enterprise-grade systems.

## Performance Improvements (2-3x Faster)

The headline feature is **massive performance gains**, especially for large tables:

### Server Rendering Optimization

- **2-3x faster** server rendering time for complex tables
- Reduced Blade template overhead through optimized PHP object rendering
- Fewer file loads = faster response times

### Partial Component Rendering

New methods prevent expensive re-renders:

```php
TextInput::make('name')
    ->live()
    ->partiallyRenderComponentsAfterStateUpdated(),

Select::make('category')
    ->live()
    ->skipRenderAfterStateUpdated(),
```

## Schemas: Unified Component Architecture

Schemas unify forms, infolists, and prime components into a single, composable system:

```php
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;

public function schema(Schema $schema): Schema
{
    return $schema->components([
        Section::make('User Details')
            ->schema([
                // Mix form fields and infolist entries!
                TextInput::make('name')
                    ->required(),

                TextEntry::make('created_at')
                    ->dateTime(),

                // Prime components work too
                Actions::make([
                    Action::make('save')->submit(),
                ]),
            ]),
    ]);
}
```

### Benefits of Schemas

- **Mix and Match** - Combine forms, infolists, and actions in one view
- **Server-Driven UI** - Build interfaces in PHP, no JavaScript needed
- **Consistent API** - Same patterns across all component types

## Nested Resources

The most requested feature is finally here:

```bash
php artisan make:filament-resource Lesson --nested
```

```php
// CourseResource.php
class CourseResource extends Resource
{
    public static function getNestedResources(): array
    {
        return [
            'lessons' => LessonResource::class,
        ];
    }
}

// LessonResource.php
class LessonResource extends Resource
{
    protected static bool $isNested = true;
    protected static ?string $parentResource = CourseResource::class;
}
```

URL structure:
```
/admin/courses/1/lessons/5/edit
```

Breadcrumbs automatically show: `Courses > Laravel Basics > Lessons > Introduction`

## Multi-Factor Authentication (MFA)

Built-in MFA without third-party packages:

```php
// In your PanelProvider
public function panel(Panel $panel): Panel
{
    return $panel
        ->mfa()
        ->mfaMethods([
            EmailMfa::class,
            TotpMfa::class, // Google Authenticator
        ]);
}
```

Features:
- **Email-based codes**
- **TOTP apps** (Google Authenticator, Authy)
- **Recovery codes**
- **Remember device** option

## Non-Model-Backed Tables

Display any data in tables, not just Eloquent models:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->records([
            ['name' => 'John', 'role' => 'Admin', 'status' => 'Active'],
            ['name' => 'Jane', 'role' => 'Editor', 'status' => 'Active'],
            ['name' => 'Bob', 'role' => 'Viewer', 'status' => 'Inactive'],
        ])
        ->columns([
            TextColumn::make('name')->searchable(),
            TextColumn::make('role')->sortable(),
            BadgeColumn::make('status'),
        ])
        ->paginated()
        ->searchable();
}
```

Use cases:
- API data display
- Aggregated statistics
- External service data
- Hard-coded reference tables

## TipTap Editor (Replacing Trix)

The new `RichEditor` uses TipTap for powerful content editing:

```php
RichEditor::make('content')
    ->toolbarButtons([
        'bold',
        'italic',
        'link',
        'h2',
        'h3',
        'bulletList',
        'orderedList',
        'codeBlock',
        'blockquote',
        'table',
    ])
    ->fileAttachmentsDirectory('attachments')
    ->extraAttributes(['style' => 'min-height: 300px']);
```

New capabilities:
- **Tables** - Insert and edit tables
- **Code blocks** - Syntax highlighting
- **Better link handling**
- **Collaborative editing ready**

## New Input Components

### Slider Component

```php
Slider::make('price')
    ->min(0)
    ->max(1000)
    ->step(10)
    ->marks([
        0 => '$0',
        500 => '$500',
        1000 => '$1000',
    ]);
```

### Code Editor

```php
CodeEditor::make('json_config')
    ->language('json')
    ->lineNumbers()
    ->minHeight(200);
```

Supports: HTML, CSS, JavaScript, PHP, JSON

## Tailwind CSS v4

Filament v4 uses Tailwind v4 with:
- **Faster builds**
- **Simplified configuration**
- **CSS-first config**
- **Better dark mode**

## Upgrading from v3

The upgrade is designed to be smooth:

```bash
composer require filament/filament:"^4.0"
php artisan filament:upgrade
```

Most breaking changes are minimal. Key migrations:
- Update any custom Trix implementations to TipTap
- Review middleware changes
- Test MFA if previously using packages

## Conclusion

FilamentPHP v4 isn't just an update—it's a reimagining of what admin panels can be. With schemas enabling server-driven UI, nested resources managing complex hierarchies, and 2-3x performance improvements, Filament is ready for enterprise applications.

Whether you're building a simple CMS or a complex SaaS platform, Filament v4 has the tools you need.

---

## Resources

- [Filament v4 Release Announcement](https://filamentphp.com/content/alexandersix-filament-v4-is-stable)
- [What's New in Filament v4](https://filamentphp.com/content/leandrocfe-whats-new-in-filament-v4)
- [Filament v4 Documentation](https://filamentphp.com/docs/4.x)
