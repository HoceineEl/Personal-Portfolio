---
title: "Laravel Global Scopes for SaaS: Securing Multi-Tenant Data"
description: Master Laravel global scopes to implement bulletproof tenant isolation in SaaS applications. Learn automatic query scoping, bypassing scopes safely, and preventing data leaks.
tags:
  - Laravel
  - SaaS
  - Multi-tenancy
  - Security
  - Eloquent
noImage: true
createdAt: 2025-08-20T14:00:00.000Z
updatedAt: 2025-08-20T14:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel Global Scopes for SaaS: Securing Multi-Tenant Data

Global scopes are the foundation of data isolation in Laravel SaaS applications. They automatically apply query constraints to every database operation, ensuring tenants only access their own data. Let's dive deep into implementing bulletproof tenant isolation.

## Understanding Global Scopes

A global scope automatically applies a `WHERE` clause to all queries for a model:

```php
// Without global scope
Project::all();
// SELECT * FROM projects

// With tenant global scope
Project::all();
// SELECT * FROM projects WHERE tenant_id = 1
```

## Creating a Tenant Scope

### The Scope Class

```php
// app/Scopes/TenantScope.php
namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $tenantId = $this->getCurrentTenantId();

        if ($tenantId) {
            $builder->where($model->getTable() . '.tenant_id', $tenantId);
        }
    }

    protected function getCurrentTenantId(): ?int
    {
        // Option 1: From authenticated user
        if (auth()->check()) {
            return auth()->user()->current_tenant_id;
        }

        // Option 2: From session
        if (session()->has('tenant_id')) {
            return session('tenant_id');
        }

        // Option 3: From service container
        if (app()->has('current_tenant')) {
            return app('current_tenant')->id;
        }

        return null;
    }
}
```

### Applying the Scope to Models

```php
// app/Traits/BelongsToTenant.php
namespace App\Traits;

use App\Scopes\TenantScope;
use App\Models\Tenant;

trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        // Apply global scope
        static::addGlobalScope(new TenantScope);

        // Auto-set tenant_id on create
        static::creating(function ($model) {
            if (!$model->tenant_id && auth()->check()) {
                $model->tenant_id = auth()->user()->current_tenant_id;
            }
        });
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
```

### Using the Trait

```php
class Project extends Model
{
    use BelongsToTenant;

    protected $fillable = ['name', 'description', 'tenant_id'];
}

class Invoice extends Model
{
    use BelongsToTenant;

    protected $fillable = ['number', 'amount', 'tenant_id'];
}
```

## Advanced Scope Techniques

### Scope with Joins

Handle scopes in queries with joins:

```php
class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $tenantId = $this->getCurrentTenantId();

        if ($tenantId) {
            // Use qualified column name to avoid ambiguity in joins
            $column = $model->qualifyColumn('tenant_id');
            $builder->where($column, $tenantId);
        }
    }
}
```

### Extending the Builder

Add helper methods to the query builder:

```php
public function extend(Builder $builder): void
{
    // Allow bypassing scope for specific queries
    $builder->macro('withoutTenancy', function (Builder $builder) {
        return $builder->withoutGlobalScope(TenantScope::class);
    });

    // Query across all tenants (admin only)
    $builder->macro('forAllTenants', function (Builder $builder) {
        if (!auth()->user()?->isSuperAdmin()) {
            throw new UnauthorizedException('Cannot query across tenants');
        }
        return $builder->withoutGlobalScope(TenantScope::class);
    });
}
```

## Safely Bypassing Scopes

Sometimes you need to bypass tenant scoping. Do it safely:

### For Admin Reports

```php
// Only for super admins
public function globalReport()
{
    abort_unless(auth()->user()->isSuperAdmin(), 403);

    return Project::withoutGlobalScope(TenantScope::class)
        ->selectRaw('tenant_id, COUNT(*) as count')
        ->groupBy('tenant_id')
        ->get();
}
```

### For System Operations

```php
// In scheduled commands
class CleanupOldProjects extends Command
{
    public function handle()
    {
        // Bypass scope for system-level cleanup
        Project::withoutGlobalScopes()
            ->where('deleted_at', '<', now()->subYear())
            ->forceDelete();
    }
}
```

### For Cross-Tenant Features

```php
// Sharing a project with another tenant
public function shareProject(Project $project, Tenant $targetTenant)
{
    // Verify ownership first
    abort_unless($project->tenant_id === auth()->user()->current_tenant_id, 403);

    // Create share record without scope interference
    ProjectShare::withoutGlobalScope(TenantScope::class)->create([
        'project_id' => $project->id,
        'tenant_id' => $targetTenant->id,
    ]);
}
```

## Security Best Practices

### 1. Defense in Depth

Never rely solely on global scopes:

```php
class ProjectController extends Controller
{
    public function update(Request $request, Project $project)
    {
        // Global scope already filters, but verify anyway
        abort_unless(
            $project->tenant_id === auth()->user()->current_tenant_id,
            403,
            'Access denied'
        );

        $project->update($request->validated());
    }
}
```

### 2. Use Database Constraints

Add database-level protection:

```php
Schema::create('projects', function (Blueprint $table) {
    $table->id();
    $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
    $table->string('name');

    // Composite unique constraint
    $table->unique(['tenant_id', 'slug']);
});
```

### 3. Test Tenant Isolation

```php
class TenantIsolationTest extends TestCase
{
    public function test_user_cannot_access_other_tenant_data()
    {
        $tenant1 = Tenant::factory()->create();
        $tenant2 = Tenant::factory()->create();

        $user1 = User::factory()->create(['current_tenant_id' => $tenant1->id]);
        $user2 = User::factory()->create(['current_tenant_id' => $tenant2->id]);

        $project = Project::factory()->create(['tenant_id' => $tenant1->id]);

        // User 1 can access
        $this->actingAs($user1);
        $this->assertTrue(Project::find($project->id) !== null);

        // User 2 cannot access
        $this->actingAs($user2);
        $this->assertNull(Project::find($project->id));
    }

    public function test_user_cannot_update_other_tenant_data()
    {
        $tenant1 = Tenant::factory()->create();
        $tenant2 = Tenant::factory()->create();

        $project = Project::factory()->create(['tenant_id' => $tenant1->id]);

        $this->actingAs(User::factory()->create(['current_tenant_id' => $tenant2->id]));

        $response = $this->put("/projects/{$project->id}", [
            'name' => 'Hacked!',
        ]);

        $response->assertForbidden();
    }
}
```

### 4. Audit Scope Bypasses

Log whenever scopes are bypassed:

```php
public function extend(Builder $builder): void
{
    $builder->macro('withoutTenancy', function (Builder $builder) {
        Log::warning('Tenant scope bypassed', [
            'user' => auth()->id(),
            'model' => get_class($builder->getModel()),
            'trace' => debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 5),
        ]);

        return $builder->withoutGlobalScope(TenantScope::class);
    });
}
```

### 5. Handle Relationships Carefully

```php
class Project extends Model
{
    use BelongsToTenant;

    // This relationship inherits the tenant scope
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    // For cross-tenant relationships (rare)
    public function allTasks()
    {
        return $this->hasMany(Task::class)->withoutGlobalScope(TenantScope::class);
    }
}
```

## Performance Optimization

### Index the tenant_id Column

```php
Schema::table('projects', function (Blueprint $table) {
    $table->index('tenant_id');
    // Or composite index for common queries
    $table->index(['tenant_id', 'status']);
    $table->index(['tenant_id', 'created_at']);
});
```

### Tenant-Aware Caching

```php
trait BelongsToTenant
{
    public function getCacheKey(): string
    {
        $tenantId = auth()->user()->current_tenant_id;
        return "tenant:{$tenantId}:{$this->getTable()}:{$this->id}";
    }
}

// Usage
Cache::tags(["tenant:{$tenantId}"])->remember($project->getCacheKey(), 3600, fn() => $project);

// Clear tenant cache
Cache::tags(["tenant:{$tenantId}"])->flush();
```

## Conclusion

Global scopes are essential for SaaS data isolation, but they're just one layer of defense. Combine them with:

- Explicit ownership checks
- Database constraints
- Comprehensive testing
- Audit logging
- Proper indexing

Remember: **Data leaks in multi-tenant apps are catastrophic**. Take the time to implement thorough isolation.

---

## Resources

- [Laravel Global Scopes Documentation](https://laravel.com/docs/eloquent#global-scopes)
- [Tenancy for Laravel](https://tenancyforlaravel.com)
