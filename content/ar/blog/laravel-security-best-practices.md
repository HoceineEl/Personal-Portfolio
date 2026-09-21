---
title: "أفضل ممارسات الأمان في Laravel: كيف تحمي تطبيقك"
description: دليل أمان شامل لتطبيقات Laravel، يغطي المصادقة، والتفويض، وحقن SQL، و XSS، و CSRF، وتحديد معدل الطلبات، وترويسات الأمان.
tags:
  - Laravel
  - Security
  - Authentication
  - Best Practices
noImage: true
createdAt: 2025-02-20T10:00:00.000Z
updatedAt: 2025-02-20T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# أفضل ممارسات الأمان في Laravel: كيف تحمي تطبيقك

الأمان ليس خيارًا إضافيًا. يوفّر Laravel ميزات أمان ممتازة جاهزة للاستخدام، لكن عليك أن تستخدمها بالطريقة الصحيحة. يغطي هذا الدليل ممارسات الأمان الأساسية لتطبيقات Laravel.

## أمان المصادقة

### شروط كلمة المرور

```php
// In your registration/password update validation
'password' => [
    'required',
    'confirmed',
    Password::min(8)
        ->letters()
        ->mixedCase()
        ->numbers()
        ->symbols()
        ->uncompromised(), // Check against breached password databases
],
```

### إعداد جلسات آمنة

```php
// config/session.php
'lifetime' => 120,
'expire_on_close' => false,
'encrypt' => true,
'secure' => true,          // Only send over HTTPS
'http_only' => true,       // Prevent JavaScript access
'same_site' => 'lax',      // CSRF protection
```

### تحديد عدد محاولات تسجيل الدخول

```php
// Already built into Laravel's Auth
// Customize in RateLimiter
RateLimiter::for('login', function (Request $request) {
    $key = Str::transliterate(Str::lower($request->email) . '|' . $request->ip());

    return Limit::perMinute(5)->by($key);
});
```

### المصادقة الثنائية

```php
// Using Laravel Fortify
use Laravel\Fortify\Features;

'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
    Features::updateProfileInformation(),
    Features::updatePasswords(),
    Features::twoFactorAuthentication([
        'confirm' => true,
        'confirmPassword' => true,
    ]),
],
```

## التفويض (Authorization)

### التفويض عبر السياسات (Policies)

```php
// Always use policies, never inline checks
class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id
            || $user->hasRole('admin');
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id
            || $user->hasRole('admin');
    }
}

// In controller
public function update(Request $request, Post $post)
{
    $this->authorize('update', $post);

    // Safe to proceed
}
```

### التفويض على مستوى المسار

```php
Route::middleware(['auth', 'can:admin'])->group(function () {
    Route::resource('users', UserController::class);
});

// Or in routes
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->can('update', 'post');
```

## منع حقن SQL

### استخدم Eloquent أو Query Builder دائمًا

```php
// NEVER do this - SQL injection vulnerable
$results = DB::select("SELECT * FROM users WHERE email = '$email'");

// ALWAYS use parameter binding
$results = DB::select('SELECT * FROM users WHERE email = ?', [$email]);

// Or Eloquent (automatically escaped)
$user = User::where('email', $email)->first();
```

### استخدم التعابير الخام بحذر

```php
// If you must use raw SQL, always bind parameters
$users = User::whereRaw('email = ?', [$email])
    ->orderByRaw('FIELD(status, ?, ?, ?)', ['active', 'pending', 'inactive'])
    ->get();

// Never interpolate user input
// BAD: ->whereRaw("status = '$status'")
```

## منع XSS

### تهريب المخرجات (Escaping)

```blade
{{-- Always use double braces - automatically escaped --}}
<p>{{ $user->name }}</p>
<p>{{ $user->bio }}</p>

{{-- Only use {!! !!} for trusted HTML content --}}
{!! $page->sanitizedContent !!}

{{-- For user-submitted HTML, sanitize first --}}
{!! clean($user->bio) !!}  {{-- Using HTMLPurifier --}}
```

### سياسة أمان المحتوى (CSP)

```php
// app/Http/Middleware/SecurityHeaders.php
class SecurityHeaders
{
    public function handle($request, $next)
    {
        $response = $next($request);

        $response->headers->set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-inline' https://trusted-cdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com"
        );

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        return $response;
    }
}
```

## الحماية من CSRF

### مفعّلة افتراضيًا

```blade
{{-- Always include in forms --}}
<form method="POST" action="/posts">
    @csrf
    <!-- form fields -->
</form>
```

### استثناء مسارات API

```php
// APIs using tokens don't need CSRF
// Already configured in VerifyCsrfToken middleware
protected $except = [
    'api/*',
    'webhook/*',
];
```

### ما يجب مراعاته في تطبيقات SPA

```javascript
// For SPAs, use Sanctum's CSRF cookie endpoint
await axios.get('/sanctum/csrf-cookie');
await axios.post('/login', credentials);
```

## الحماية من الإسناد الجماعي (Mass Assignment)

### حدّد الحقول القابلة للتعبئة أو المحمية

```php
class User extends Model
{
    // Whitelist approach (recommended)
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    // Never fillable
    protected $guarded = [
        'is_admin',
        'role',
        'balance',
    ];
}
```

### تحقّق قبل التعبئة

```php
public function update(Request $request, User $user)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id,
    ]);

    // Only validated data is used
    $user->update($validated);
}
```

## أمان رفع الملفات

### تحقّق من أنواع الملفات

```php
$request->validate([
    'document' => [
        'required',
        'file',
        'mimes:pdf,doc,docx',
        'max:10240', // 10MB
    ],
    'avatar' => [
        'required',
        'image',
        'mimes:jpg,png,webp',
        'max:2048',
        'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000',
    ],
]);
```

### خزّن الملفات بأمان

```php
// Store outside public directory
$path = $request->file('document')->store('documents', 'private');

// Serve through controller with authorization
public function download(Document $document)
{
    $this->authorize('download', $document);

    return Storage::disk('private')->download(
        $document->path,
        $document->original_name
    );
}
```

### امنع رفع الملفات التنفيذية

```php
// Never trust file extensions
public function store(Request $request)
{
    $file = $request->file('upload');

    // Check MIME type, not just extension
    $mimeType = $file->getMimeType();

    $allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (!in_array($mimeType, $allowedMimes)) {
        abort(422, 'Invalid file type');
    }

    // Generate safe filename
    $filename = Str::uuid() . '.' . $file->guessExtension();

    $file->storeAs('uploads', $filename);
}
```

## أمان API

### انتهاء صلاحية الرموز (Tokens)

```php
// Sanctum tokens with expiration
$token = $user->createToken(
    'api-token',
    ['*'],
    now()->addDays(30)
);
```

### رموز بصلاحيات محددة

```php
// Create token with limited abilities
$token = $user->createToken('read-only', ['read']);

// Check in routes
Route::get('/data', fn() => ...)->middleware('ability:read');
Route::post('/data', fn() => ...)->middleware('ability:write');
```

### تحديد معدل الطلبات

```php
// config/api rate limits
RateLimiter::for('api', function (Request $request) {
    return $request->user()
        ? Limit::perMinute(60)->by($request->user()->id)
        : Limit::perMinute(10)->by($request->ip());
});
```

## أمان البيئة

### احمِ متغيرات البيئة

```env
APP_ENV=production
APP_DEBUG=false  # NEVER true in production
APP_KEY=base64:...

# Never commit real credentials
DB_PASSWORD=secure_password
API_SECRET=never_commit_this
```

### أخفِ البيانات الحساسة في السجلات

```php
// config/logging.php - sanitize sensitive data
'tap' => [App\Logging\SanitizeLogger::class],

// App\Logging\SanitizeLogger
public function __invoke($logger)
{
    foreach ($logger->getHandlers() as $handler) {
        $handler->pushProcessor(function ($record) {
            $record['context'] = $this->sanitize($record['context']);
            return $record;
        });
    }
}

protected function sanitize(array $context): array
{
    $sensitive = ['password', 'token', 'secret', 'authorization'];

    array_walk_recursive($context, function (&$value, $key) use ($sensitive) {
        if (in_array(strtolower($key), $sensitive)) {
            $value = '[REDACTED]';
        }
    });

    return $context;
}
```

## قائمة تحقق الأمان

### قبل النشر

- [ ] `APP_DEBUG=false`
- [ ] `APP_ENV=production`
- [ ] فرض HTTPS
- [ ] تغيير بيانات اعتماد قاعدة البيانات
- [ ] تغيير مفاتيح API
- [ ] صفحات الأخطاء لا تكشف أي معلومات

### مراجعات دورية

- [ ] تشغيل `composer audit` لكشف الثغرات
- [ ] مراجعة صلاحيات المستخدمين
- [ ] البحث عن الحسابات غير المستخدمة
- [ ] مراجعة استخدام رموز API
- [ ] مراجعة سجلات التدقيق

### المراقبة

- [ ] مراقبة محاولات الدخول الفاشلة
- [ ] أنماط الزيارات غير المعتادة
- [ ] القفزات في معدل الأخطاء
- [ ] استهلاك غير طبيعي للموارد

## الخلاصة

الأمان عمل مستمر، لا إعداد تضبطه مرة واحدة. يوفّر Laravel ميزات أمان ممتازة، لكن يجب إعدادها واستخدامها كما ينبغي. المراجعات الدورية والتحديثات والمراقبة ضرورية ليبقى تطبيقك آمنًا.

---

## مصادر

- [توثيق الأمان في Laravel](https://laravel.com/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

