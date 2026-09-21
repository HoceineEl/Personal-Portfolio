---
title: "تعدد المستأجرين المدمج في FilamentPHP: دليل تطبيق كامل"
description: تعلّم كيف تطبّق تعدد المستأجرين في FilamentPHP v4 بميزات الـ tenancy المدمجة في اللوحات، من تسجيل المستأجر والتنقل بين المستأجرين إلى حصر الموارد بالمستأجر وربط الفوترة.
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

# تعدد المستأجرين المدمج في FilamentPHP: دليل تطبيق كامل

يأتي FilamentPHP v4 بميزات قوية **لتعدد المستأجرين (multi-tenancy) مدمجة فيه**، تجعل بناء تطبيقات SaaS أمرًا مباشرًا. وعلى خلاف الحزم الخارجية، يندمج نظام الـ tenancy الأصلي في Filament بسلاسة مع اللوحات والموارد (Resources) ونظام الصلاحيات.

## كيف يفهم Filament تعدد المستأجرين

يفترض Filament أن المستخدم قد ينتمي إلى **عدة مستأجرين** (فرق، أو مؤسسات، أو شركات) ويتنقل بينهم. وهذه العلاقة من نوع many-to-many شائعة في تطبيقات SaaS:

- يمكن أن يكون المستخدم عضوًا في عدة فرق
- يمكن أن يحمل المستخدم دورًا مختلفًا في كل فريق
- يستطيع المستخدم التنقل بين الفرق دون تسجيل الخروج

## إعداد تعدد المستأجرين

### الخطوة 1: إنشاء نموذج المستأجر (Model)

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

### الخطوة 2: ضبط الـ tenancy في اللوحة

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

### الخطوة 3: إنشاء صفحة تسجيل المستأجر

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

### الخطوة 4: إنشاء صفحة ملف المستأجر

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

## حصر الموارد بالمستأجر تلقائيًا

يحصر Filament كل الموارد بالمستأجر الحالي تلقائيًا:

```php
// app/Filament/Resources/ProjectResource.php
class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    // Resources are automatically scoped - no extra code needed!
    // The base query includes: WHERE team_id = {current_tenant_id}
}
```

### كيف يعمل الحصر

عندما يزور المستخدم `/admin/acme-corp/projects`:
1. يتعرّف Filament على `acme-corp` بوصفه المستأجر الحالي
2. تُفلتَر كل الاستعلامات تلقائيًا حسب `team_id`
3. تحصل السجلات الجديدة على قيمة `team_id` تلقائيًا
4. محاولة الوصول إلى سجلات مستأجر آخر تُرجع 404

### استثناء موارد من الـ tenancy

للموارد المشتركة أو العامة:

```php
class SettingResource extends Resource
{
    protected static bool $isScopedToTenant = false;

    // This resource shows all records, regardless of tenant
}
```

## التنقل بين المستأجرين

يوفّر Filament أداة مدمجة للتنقل بين المستأجرين داخل قائمة المستخدم:

```php
->tenantMenu(true)
// or customize:
->tenantMenuItems([
    'settings' => MenuItem::make()
        ->label('Team Settings')
        ->url(fn () => EditTeamProfile::getUrl()),
])
```

## تخصيص طريقة تحديد المستأجر

### عبر النطاق الفرعي

```php
->tenant(Team::class, slugAttribute: 'slug')
->tenantDomain(fn (Team $tenant) => "{$tenant->slug}.yourapp.com")
```

### عبر المسار (الافتراضي)

```
/admin/{tenant}/resources
```

### وسيط مخصص (middleware)

```php
->tenantMiddleware([
    EnsureValidTenant::class,
    SetTenantTimezone::class,
])
```

## الصلاحيات لكل مستأجر

طبّق أدوارًا خاصة بكل مستأجر:

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

## ربط الفوترة

اربط اللوحة بأنظمة الاشتراكات:

```php
->tenant(Team::class)
->tenantBillingProvider(new SparkBillingProvider())
->requiresTenantSubscription()
->tenantBillingRouteSlug('billing')
```

### صفحة فوترة مخصصة

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

## أفضل الممارسات

### 1. تحقّق دائمًا من ملكية المستأجر

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

### 2. استخدم Observers تراعي المستأجر

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

### 3. اختبر عزل المستأجرين

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

### 4. تعامل مع اختيار المستأجر عند أول تسجيل دخول

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

## الخلاصة

يُسقط تعدد المستأجرين المدمج في FilamentPHP عنك تعقيد بناء تطبيقات SaaS. فمع الحصر التلقائي للموارد، والتنقل بين المستأجرين، وربط الفوترة، تستطيع التركيز على الميزات التي تميّز تطبيقك بدل البنية التحتية.

المهم أن تفهم أن Filament يتولى العمل الثقيل، وكل ما عليك هو ضبط نموذج المستأجر وترك الإطار يتكفّل بالباقي.

---

## مصادر

- [توثيق تعدد المستأجرين في Filament](https://filamentphp.com/docs/4.x/users/tenancy)
- [لوحات الـ tenancy في Filament](https://filamentphp.com/docs/4.x/panels/tenancy)


---

## خطوة أبعد: موقع خاص لكل مستأجر

الـ tenancy في اللوحة يحصر لوحة الإدارة بالمستأجر. والسؤال الذي يأتي بعدها عادةً: هل يمكن أن يكون لكل مستأجر موقعه العام أيضًا؟ هذا الجزء يتركه Filament لك.

لسدّ هذه الفجوة بنيتُ **[FilamentCraft](https://filamentcraft.dev?ref=blog-multi-tenancy)**، وهي إضافة تجارية تضيف أداة بناء مواقع بالسحب والإفلات على طريقة Shopify إلى لوحة Filament. ترتبط المواقع بأي نموذج مالك عبر علاقة polymorphic من نوع morph، فتعمل فوق الـ tenancy الذي ضبطته أعلاه أيًّا كان: tenancy الخاص بـ Filament، أو stancl/tenancy، أو spatie/multitenancy، أو بلا tenancy أصلًا. يبني المستأجرون صفحاتهم وينشرونها بأنفسهم، وتواصل أنت تطوير التطبيق.

وهناك [عرض تجريبي حي](https://demo.filamentcraft.dev/launch/admin?ref=blog-multi-tenancy) بلا تسجيل إن أردت أن ترى التجربة من جهة المستأجر.
