---
title: "Mastering Nested Resources in FilamentPHP v4"
description: Learn how to use FilamentPHP v4's most requested feature - nested resources. Build hierarchical admin panels with parent-child relationships and intuitive breadcrumb navigation.
tags:
  - FilamentPHP
  - Laravel
  - Admin Panel
  - PHP
  - TALL Stack
noImage: true
createdAt: 2024-12-19T14:00:00.000Z
updatedAt: 2024-12-19T14:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Mastering Nested Resources in FilamentPHP v4

FilamentPHP v4, released on August 12, 2025, finally delivered the most requested feature in Filament's history: **nested resources**. This game-changing addition allows you to manage complex hierarchical data with intuitive navigation and proper URL structures.

## What Are Nested Resources?

Nested resources allow you to operate on a Filament resource within the context of a parent resource. Think of it like this:

- **Courses** → **Lessons** → **Quizzes**
- **Companies** → **Departments** → **Employees**
- **Projects** → **Tasks** → **Subtasks**

Previously, you'd use relation managers for this, but they were limited to modal-based editing. Nested resources give each child its own full-page experience while maintaining the parent context.

## When to Use Nested Resources vs Relation Managers

| Feature | Relation Manager | Nested Resource |
|---------|-----------------|-----------------|
| Editing | Modal-based | Full page |
| Complexity | Simple records | Complex records |
| Forms | Limited space | Unlimited space |
| Navigation | Same page | Dedicated pages |
| URL Structure | Parent URL only | Hierarchical URLs |

## Creating Your First Nested Resource

Let's build a Course → Lesson hierarchy.

### Step 1: Create the Parent Resource

```bash
php artisan make:filament-resource Course
```

### Step 2: Create the Nested Resource

```bash
php artisan make:filament-resource Lesson --nested
```

The `--nested` flag is crucial - it tells Filament this resource should be nested within another.

### Step 3: Configure the Parent Resource

In your `CourseResource.php`:

```php
use App\Filament\Resources\LessonResource;

class CourseResource extends Resource
{
    protected static ?string $model = Course::class;

    public static function getRelations(): array
    {
        return [
            // Traditional relation managers still work
        ];
    }

    public static function getNestedResources(): array
    {
        return [
            'lessons' => LessonResource::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCourses::route('/'),
            'create' => Pages\CreateCourse::route('/create'),
            'edit' => Pages\EditCourse::route('/{record}/edit'),
            'lessons' => Pages\ManageLessons::route('/{record}/lessons'),
        ];
    }
}
```

### Step 4: Configure the Nested Resource

In your `LessonResource.php`:

```php
class LessonResource extends Resource
{
    protected static ?string $model = Lesson::class;

    protected static bool $isNested = true;

    protected static ?string $parentResource = CourseResource::class;

    protected static ?string $parentRelationship = 'lessons';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\RichEditor::make('content')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('duration_minutes')
                    ->numeric()
                    ->required(),
                Forms\Components\Toggle::make('is_published')
                    ->default(false),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),
                Tables\Columns\TextColumn::make('duration_minutes')
                    ->suffix(' min'),
                Tables\Columns\IconColumn::make('is_published')
                    ->boolean(),
            ])
            ->defaultSort('order_column');
    }
}
```

## URL Structure and Breadcrumbs

One of the best parts of nested resources is the automatic URL structure:

```
/admin/courses                      → List all courses
/admin/courses/1/edit               → Edit course #1
/admin/courses/1/lessons            → List lessons for course #1
/admin/courses/1/lessons/create     → Create lesson for course #1
/admin/courses/1/lessons/5/edit     → Edit lesson #5 of course #1
```

The breadcrumbs automatically reflect this hierarchy:

```
Courses > Introduction to Laravel > Lessons > Getting Started
```

## Deep Nesting

You can nest resources multiple levels deep:

```php
// In LessonResource
public static function getNestedResources(): array
{
    return [
        'quizzes' => QuizResource::class,
    ];
}
```

This creates URLs like:
```
/admin/courses/1/lessons/5/quizzes/3/edit
```

## Accessing Parent Data

Within a nested resource, you can access the parent record:

```php
// In a nested resource's form
public static function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\Placeholder::make('course_name')
                ->content(fn ($livewire) => $livewire->getOwnerRecord()->name),
            // ... other fields
        ]);
}
```

## Navigation Within Parent

Add a navigation item in the parent's edit page:

```php
// In EditCourse.php
protected function getHeaderActions(): array
{
    return [
        Actions\Action::make('manage_lessons')
            ->label('Manage Lessons')
            ->url(fn () => CourseResource::getUrl('lessons', ['record' => $this->record])),
    ];
}
```

## Best Practices

### 1. Keep Nesting Shallow

While deep nesting is supported, 2-3 levels is usually the sweet spot. Beyond that, users may get lost.

### 2. Use Relation Managers for Simple Data

If your child records are simple (just a name and a few fields), a relation manager might still be better.

### 3. Leverage Breadcrumbs

Customize breadcrumbs to make navigation crystal clear:

```php
public static function getBreadcrumb(): string
{
    return 'Lessons';
}
```

### 4. Consider Authorization

Nested resources inherit parent authorization by default. Customize if needed:

```php
public static function canViewAny(): bool
{
    $parent = request()->route('record');
    return auth()->user()->can('viewLessons', $parent);
}
```

## Migration from Relation Managers

If you're converting existing relation managers to nested resources:

1. Create the nested resource with `--nested`
2. Move your table and form definitions
3. Update the parent resource's `getNestedResources()`
4. Remove the old relation manager
5. Update any navigation or actions pointing to the old setup

## Conclusion

Nested resources in FilamentPHP v4 solve a long-standing pain point for developers building complex admin panels. The automatic URL structure, breadcrumb navigation, and full-page editing experience make managing hierarchical data a breeze.

Whether you're building an LMS, project management tool, or any application with parent-child relationships, nested resources will significantly improve both developer experience and end-user usability.

---

## Resources

- [FilamentPHP Nested Resources Documentation](https://filamentphp.com/docs/4.x/resources/nesting)
- [Filament v4 Release Notes](https://filamentphp.com/content)
