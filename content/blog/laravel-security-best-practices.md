---
title: "Laravel Security Best Practices: Protecting Your Application"
description: Comprehensive security guide for Laravel applications. Cover authentication, authorization, SQL injection, XSS, CSRF, rate limiting, and security headers.
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

# Laravel Security Best Practices: Protecting Your Application

Security isn't optional. Laravel provides excellent security features out of the box, but you need to use them correctly. This guide covers essential security practices for Laravel applications.

## Authentication Security

### Password Requirements

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

### Secure Session Configuration

```php
// config/session.php
'lifetime' => 120,
'expire_on_close' => false,
'encrypt' => true,
'secure' => true,          // Only send over HTTPS
'http_only' => true,       // Prevent JavaScript access
'same_site' => 'lax',      // CSRF protection
```

### Rate Limiting Login Attempts

```php
// Already built into Laravel's Auth
// Customize in RateLimiter
RateLimiter::for('login', function (Request $request) {
    $key = Str::transliterate(Str::lower($request->email) . '|' . $request->ip());

    return Limit::perMinute(5)->by($key);
});
```

### Two-Factor Authentication

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

## Authorization

### Policy-Based Authorization

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

### Route-Level Authorization

```php
Route::middleware(['auth', 'can:admin'])->group(function () {
    Route::resource('users', UserController::class);
});

// Or in routes
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->can('update', 'post');
```

## SQL Injection Prevention

### Always Use Eloquent or Query Builder

```php
// NEVER do this - SQL injection vulnerable
$results = DB::select("SELECT * FROM users WHERE email = '$email'");

// ALWAYS use parameter binding
$results = DB::select('SELECT * FROM users WHERE email = ?', [$email]);

// Or Eloquent (automatically escaped)
$user = User::where('email', $email)->first();
```

### Raw Expressions with Care

```php
// If you must use raw SQL, always bind parameters
$users = User::whereRaw('email = ?', [$email])
    ->orderByRaw('FIELD(status, ?, ?, ?)', ['active', 'pending', 'inactive'])
    ->get();

// Never interpolate user input
// BAD: ->whereRaw("status = '$status'")
```

## XSS Prevention

### Output Escaping

```blade
{{-- Always use double braces - automatically escaped --}}
<p>{{ $user->name }}</p>
<p>{{ $user->bio }}</p>

{{-- Only use {!! !!} for trusted HTML content --}}
{!! $page->sanitizedContent !!}

{{-- For user-submitted HTML, sanitize first --}}
{!! clean($user->bio) !!}  {{-- Using HTMLPurifier --}}
```

### Content Security Policy

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

## CSRF Protection

### Enabled by Default

```blade
{{-- Always include in forms --}}
<form method="POST" action="/posts">
    @csrf
    <!-- form fields -->
</form>
```

### API Routes Exception

```php
// APIs using tokens don't need CSRF
// Already configured in VerifyCsrfToken middleware
protected $except = [
    'api/*',
    'webhook/*',
];
```

### SPA Considerations

```javascript
// For SPAs, use Sanctum's CSRF cookie endpoint
await axios.get('/sanctum/csrf-cookie');
await axios.post('/login', credentials);
```

## Mass Assignment Protection

### Define Fillable or Guarded

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

### Validate Before Fill

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

## File Upload Security

### Validate File Types

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

### Secure Storage

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

### Prevent Executable Uploads

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

## API Security

### Token Expiration

```php
// Sanctum tokens with expiration
$token = $user->createToken(
    'api-token',
    ['*'],
    now()->addDays(30)
);
```

### Scoped Tokens

```php
// Create token with limited abilities
$token = $user->createToken('read-only', ['read']);

// Check in routes
Route::get('/data', fn() => ...)->middleware('ability:read');
Route::post('/data', fn() => ...)->middleware('ability:write');
```

### Rate Limiting

```php
// config/api rate limits
RateLimiter::for('api', function (Request $request) {
    return $request->user()
        ? Limit::perMinute(60)->by($request->user()->id)
        : Limit::perMinute(10)->by($request->ip());
});
```

## Environment Security

### Secure Environment Variables

```env
APP_ENV=production
APP_DEBUG=false  # NEVER true in production
APP_KEY=base64:...

# Never commit real credentials
DB_PASSWORD=secure_password
API_SECRET=never_commit_this
```

### Hide Sensitive Data in Logs

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

## Security Checklist

### Pre-Deployment

- [ ] `APP_DEBUG=false`
- [ ] `APP_ENV=production`
- [ ] HTTPS enforced
- [ ] Database credentials rotated
- [ ] API keys rotated
- [ ] Error pages don't leak information

### Regular Audits

- [ ] `composer audit` for vulnerabilities
- [ ] Review user permissions
- [ ] Check for unused accounts
- [ ] Review API token usage
- [ ] Audit log review

### Monitoring

- [ ] Failed login monitoring
- [ ] Unusual traffic patterns
- [ ] Error rate spikes
- [ ] Resource usage anomalies

## Conclusion

Security is a continuous process, not a one-time setup. Laravel provides excellent security features, but they must be properly configured and used. Regular audits, updates, and monitoring are essential for maintaining a secure application.

---

## Resources

- [Laravel Security Documentation](https://laravel.com/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

