---
title: "FilamentPHP Built-in Multi-Tenancy: Complete Implementation Guide"
description: Learn how to implement multi-tenancy in FilamentPHP v4 using built-in panel tenancy features including tenant registration, switching, resource scoping, and billing integration.
tags:
  - FilamentPHP
  - Multi-tenancy
  - Laravel
  - SaaS
  - TALL Stack
noImage: true
createdAt: 2025-08-25T10:00:00.000Z
updatedAt: 2025-08-25T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# FilamentPHP Built-in Multi-Tenancy: Complete Implementation Guide

FilamentPHP v4 includes powerful **built-in multi-tenancy** features that make building SaaS applications straightforward. Unlike external packages, Filament's native tenancy integrates seamlessly with panels, resources, and the authorization system.

## Understanding Filament's Tenancy Model

Filament's tenancy assumes users can belong to **multiple tenants** (teams, organizations, companies) and switch between them. This many-to-many relationship is common in SaaS applications:

- A user can be a member of multiple teams
- A user can have different roles per team
- A user can switch between teams without logging out

## Setting Up Multi-Tenancy

### Step 1: Create the Tenant Model

```php
// app/Models/Team.php
class Team extends Model
{
    protected $fillable = ['name', 'slug', 'owner_id'];

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}

// app/Models/User.php
class User extends Authenticatable
{
    public function teams()
    {
        return $this->belongsToMany(Team::class)
            ->withPivot('role')
            ->withTimestamps();
    }

    public function ownedTeams()
    {
        return $this->hasMany(Team::class, 'owner_id');
    }
}
```

### Step 2: Configure Panel Tenancy

```php
// app/Providers/Filament/AdminPanelProvider.php
use App\Models\Team;
use App\Filament\Pages\Tenancy\RegisterTeam;
use App\Filament\Pages\Tenancy\EditTeamProfile;

public function panel(Panel $panel): Panel
{
    return $panel
        ->default()
        ->id('admin')
        ->path('admin')
        ->login()
        ->registration()

        // Enable tenancy
        ->tenant(Team::class, slugAttribute: 'slug')
        ->tenantRegistration(RegisterTeam::class)
        ->tenantProfile(EditTeamProfile::class)
        ->tenantMenu(true);
}
```

### Step 3: Create Tenant Registration Page

```php
// app/Filament/Pages/Tenancy/RegisterTeam.php
use Filament\Forms\Components\TextInput;
use Filament\Pages\Tenancy\RegisterTenant;

class RegisterTeam extends RegisterTenant
{
    public static function getLabel(): string
    {
        return 'Register Team';
    }

    public function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('name')
                ->required()
                ->maxLength(255),
            TextInput::make('slug')
                ->required()
                ->unique(Team::class, 'slug')
                ->maxLength(255),
        ]);
    }

    protected function handleRegistration(array $data): Team
    {
        $team = Team::create([
            ...$data,
            'owner_id' => auth()->id(),
        ]);

        $team->users()->attach(auth()->id(), ['role' => 'owner']);

        return $team;
    }
}
```

### Step 4: Create Tenant Profile Page

```php
// app/Filament/Pages/Tenancy/EditTeamProfile.php
use Filament\Pages\Tenancy\EditTenantProfile;

class EditTeamProfile extends EditTenantProfile
{
    public static function getLabel(): string
    {
        return 'Team Settings';
    }

    public function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('name')
                ->required(),
            TextInput::make('slug')
                ->required()
                ->unique(Team::class, 'slug', ignoreRecord: true),
        ]);
    }
}
```

## Automatic Resource Scoping

Filament automatically scopes all resources to the current tenant:

```php
// app/Filament/Resources/ProjectResource.php
class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    // Resources are automatically scoped - no extra code needed!
    // The base query includes: WHERE team_id = {current_tenant_id}
}
```

### How Scoping Works

When a user visits `/admin/acme-corp/projects`:
1. Filament identifies `acme-corp` as the current tenant
2. All queries are automatically filtered by `team_id`
3. New records get `team_id` set automatically
4. Accessing another tenant's records returns 404

### Excluding Resources from Tenancy

For shared/global resources:

```php
class SettingResource extends Resource
{
    protected static bool $isScopedToTenant = false;

    // This resource shows all records, regardless of tenant
}
```

## Tenant Switching

Filament provides a built-in tenant switcher in the user menu:

```php
->tenantMenu(true)
// or customize:
->tenantMenuItems([
    'settings' => MenuItem::make()
        ->label('Team Settings')
        ->url(fn () => EditTeamProfile::getUrl()),
])
```

## Customizing Tenant Resolution

### By Subdomain

```php
->tenant(Team::class, slugAttribute: 'slug')
->tenantDomain(fn (Team $tenant) => "{$tenant->slug}.yourapp.com")
```

### By Path (Default)

```
/admin/{tenant}/resources
```

### Custom Middleware

```php
->tenantMiddleware([
    EnsureValidTenant::class,
    SetTenantTimezone::class,
])
```

## Authorization Per Tenant

Implement tenant-specific roles:

```php
// app/Models/Team.php
class Team extends Model
{
    public function hasRole(User $user, string $role): bool
    {
        return $this->users()
            ->where('user_id', $user->id)
            ->where('role', $role)
            ->exists();
    }
}

// In a Resource
public static function canCreate(): bool
{
    return Filament::getTenant()
        ->hasRole(auth()->user(), 'admin');
}
```

## Billing Integration

Integrate with subscription systems:

```php
->tenant(Team::class)
->tenantBillingProvider(new SparkBillingProvider())
->requiresTenantSubscription()
->tenantBillingRouteSlug('billing')
```

### Custom Billing Page

```php
class TeamBilling extends Page
{
    protected static string $view = 'filament.pages.team-billing';

    public static function getUrl(array $parameters = [], bool $isAbsolute = true, ?string $panel = null, ?Model $tenant = null): string
    {
        return route('billing.portal', [
            'team' => Filament::getTenant(),
        ]);
    }
}
```

## Best Practices

### 1. Always Verify Tenant Ownership

```php
// In Form or Action
public function save()
{
    // Double-check tenant ownership for sensitive operations
    abort_unless(
        $this->record->team_id === Filament::getTenant()->id,
        403
    );

    // Proceed with save
}
```

### 2. Use Tenant-Aware Observers

```php
class ProjectObserver
{
    public function creating(Project $project)
    {
        if (Filament::getTenant()) {
            $project->team_id = Filament::getTenant()->id;
        }
    }
}
```

### 3. Test Tenant Isolation

```php
public function test_user_cannot_access_other_tenant_project()
{
    $team1 = Team::factory()->create();
    $team2 = Team::factory()->create();

    $project = Project::factory()->for($team1)->create();

    $this->actingAs($team2->users->first())
        ->get("/admin/{$team2->slug}/projects/{$project->id}")
        ->assertNotFound();
}
```

### 4. Handle Tenant Selection on First Login

```php
// In custom Login class
protected function afterLogin(): void
{
    $user = auth()->user();

    if ($user->teams->count() === 1) {
        // Auto-select single tenant
        session(['current_team_id' => $user->teams->first()->id]);
    }
    // Otherwise, user will see tenant selection
}
```

## Conclusion

FilamentPHP's built-in multi-tenancy eliminates the complexity of building SaaS applications. With automatic resource scoping, tenant switching, and billing integration, you can focus on your application's unique features rather than infrastructure.

The key is understanding that Filament handles the heavy lifting—you just need to configure your tenant model and let the framework do the rest.

---

## Resources

- [Filament Multi-Tenancy Documentation](https://filamentphp.com/docs/4.x/users/tenancy)
- [Filament Tenancy Panels](https://filamentphp.com/docs/4.x/panels/tenancy)
