---
title: "Laravel API Development: Building RESTful APIs That Scale"
description: Complete guide to building production-ready APIs with Laravel. Cover API resources, versioning, authentication, rate limiting, documentation, and testing strategies.
tags:
  - Laravel
  - API
  - REST
  - Backend
  - Authentication
noImage: true
createdAt: 2025-04-15T10:00:00.000Z
updatedAt: 2025-04-15T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel API Development: Building RESTful APIs That Scale

Laravel excels at API development with built-in support for JSON responses, API resources, rate limiting, and authentication. This guide covers building production-ready APIs from the ground up.

## Project Setup

### API-Only Installation

```bash
laravel new api-project --api
```

Or configure existing project:

```php
// bootstrap/app.php
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api/v1',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->create();
```

## API Resources

### Basic Resource

```php
php artisan make:resource UserResource
```

```php
// app/Http/Resources/UserResource.php
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
```

### Resource with Relationships

```php
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->content,
            'published_at' => $this->published_at?->toISOString(),

            // Conditional relationships
            'author' => new UserResource($this->whenLoaded('author')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'comments_count' => $this->whenCounted('comments'),

            // Computed fields
            'reading_time' => $this->reading_time,
            'is_published' => $this->is_published,

            // Links
            'links' => [
                'self' => route('api.posts.show', $this),
                'author' => route('api.users.show', $this->author_id),
            ],
        ];
    }
}
```

### Resource Collection

```php
class PostCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => [
                'total' => $this->total(),
                'per_page' => $this->perPage(),
                'current_page' => $this->currentPage(),
                'last_page' => $this->lastPage(),
            ],
            'links' => [
                'first' => $this->url(1),
                'last' => $this->url($this->lastPage()),
                'prev' => $this->previousPageUrl(),
                'next' => $this->nextPageUrl(),
            ],
        ];
    }
}
```

## Controllers

### API Controller Pattern

```php
// app/Http/Controllers/Api/V1/PostController.php
class PostController extends Controller
{
    public function __construct(
        private PostService $postService
    ) {}

    public function index(Request $request)
    {
        $posts = Post::query()
            ->with(['author', 'category', 'tags'])
            ->withCount('comments')
            ->when($request->category, fn($q, $cat) => $q->where('category_id', $cat))
            ->when($request->search, fn($q, $search) => $q->search($search))
            ->latest('published_at')
            ->paginate($request->per_page ?? 15);

        return new PostCollection($posts);
    }

    public function store(StorePostRequest $request)
    {
        $post = $this->postService->create($request->validated());

        return (new PostResource($post))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Post $post)
    {
        $post->load(['author', 'category', 'tags', 'comments.author']);

        return new PostResource($post);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $post = $this->postService->update($post, $request->validated());

        return new PostResource($post);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->noContent();
    }
}
```

### Form Requests

```php
// app/Http/Requests/StorePostRequest.php
class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Post::class);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'tags' => ['array'],
            'tags.*' => ['exists:tags,id'],
            'published_at' => ['nullable', 'date', 'after:now'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'A post title is required.',
            'category_id.exists' => 'The selected category does not exist.',
        ];
    }
}
```

## Authentication

### Sanctum Token Authentication

```php
// routes/api.php
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('posts', PostController::class);
});
```

```php
// app/Http/Controllers/Api/AuthController.php
class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();

        $token = $user->createToken(
            $request->device_name ?? 'api-token',
            ['*'], // abilities
            now()->addDays(30) // expiration
        );

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token->plainTextToken,
            'expires_at' => $token->accessToken->expires_at,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }

    public function user(Request $request)
    {
        return new UserResource($request->user());
    }
}
```

### Token Abilities (Scopes)

```php
// Creating token with specific abilities
$token = $user->createToken('api', ['posts:read', 'posts:write']);

// Checking abilities
Route::get('/posts', [PostController::class, 'index'])
    ->middleware('ability:posts:read');

Route::post('/posts', [PostController::class, 'store'])
    ->middleware('ability:posts:write');

// In controller
if ($request->user()->tokenCan('posts:delete')) {
    // Can delete
}
```

## API Versioning

### URL Versioning

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::apiResource('posts', Api\V1\PostController::class);
});

Route::prefix('v2')->group(function () {
    Route::apiResource('posts', Api\V2\PostController::class);
});
```

### Header Versioning

```php
// app/Http/Middleware/ApiVersion.php
class ApiVersion
{
    public function handle(Request $request, Closure $next)
    {
        $version = $request->header('API-Version', 'v1');

        config(['api.version' => $version]);

        return $next($request);
    }
}
```

## Rate Limiting

### Define Limiters

```php
// app/Providers/AppServiceProvider.php
public function boot(): void
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    RateLimiter::for('uploads', function (Request $request) {
        return Limit::perMinute(10)->by($request->user()->id);
    });

    // Tiered limits
    RateLimiter::for('api', function (Request $request) {
        $user = $request->user();

        return match ($user?->plan) {
            'enterprise' => Limit::none(),
            'pro' => Limit::perMinute(1000)->by($user->id),
            'basic' => Limit::perMinute(100)->by($user->id),
            default => Limit::perMinute(20)->by($request->ip()),
        };
    });
}
```

### Apply to Routes

```php
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::apiResource('posts', PostController::class);
});

Route::post('/upload', [UploadController::class, 'store'])
    ->middleware('throttle:uploads');
```

## Error Handling

### Custom Exception Handler

```php
// bootstrap/app.php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (NotFoundHttpException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json([
                'message' => 'Resource not found',
                'error' => 'not_found',
            ], 404);
        }
    });

    $exceptions->render(function (ValidationException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    });

    $exceptions->render(function (AuthenticationException $e, Request $request) {
        if ($request->is('api/*')) {
            return response()->json([
                'message' => 'Unauthenticated',
                'error' => 'unauthenticated',
            ], 401);
        }
    });
})
```

### Custom API Exceptions

```php
// app/Exceptions/ApiException.php
class ApiException extends Exception
{
    public function __construct(
        string $message,
        public string $errorCode,
        public int $statusCode = 400,
        public array $meta = []
    ) {
        parent::__construct($message);
    }

    public function render(Request $request)
    {
        return response()->json([
            'message' => $this->message,
            'error' => $this->errorCode,
            'meta' => $this->meta,
        ], $this->statusCode);
    }
}

// Usage
throw new ApiException(
    'Insufficient credits',
    'insufficient_credits',
    402,
    ['required' => 100, 'available' => 50]
);
```

## Testing

### Feature Tests

```php
class PostApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_posts(): void
    {
        $user = User::factory()->create();
        Post::factory()->count(5)->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/posts');

        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'title', 'slug', 'excerpt'],
                ],
                'meta' => ['total', 'per_page'],
                'links' => ['first', 'last'],
            ]);
    }

    public function test_can_create_post(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/posts', [
                'title' => 'Test Post',
                'content' => 'Post content here',
                'category_id' => $category->id,
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'Test Post');

        $this->assertDatabaseHas('posts', [
            'title' => 'Test Post',
            'author_id' => $user->id,
        ]);
    }

    public function test_validates_post_creation(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/posts', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'content', 'category_id']);
    }

    public function test_unauthenticated_user_cannot_access(): void
    {
        $response = $this->getJson('/api/v1/posts');

        $response->assertUnauthorized();
    }
}
```

## Best Practices

### 1. Consistent Response Format

```php
// app/Traits/ApiResponse.php
trait ApiResponse
{
    protected function success($data, int $status = 200)
    {
        return response()->json(['data' => $data], $status);
    }

    protected function created($data)
    {
        return $this->success($data, 201);
    }

    protected function noContent()
    {
        return response()->noContent();
    }

    protected function error(string $message, string $code, int $status = 400)
    {
        return response()->json([
            'message' => $message,
            'error' => $code,
        ], $status);
    }
}
```

### 2. Use Query Parameters Consistently

```
GET /api/v1/posts?page=1&per_page=15
GET /api/v1/posts?filter[status]=published&filter[category]=tech
GET /api/v1/posts?include=author,tags
GET /api/v1/posts?sort=-published_at
GET /api/v1/posts?fields[posts]=id,title,excerpt
```

### 3. Document Your API

Use tools like Scribe or OpenAPI/Swagger for automatic documentation.

```bash
composer require knuckleswtf/scribe
php artisan scribe:generate
```

## Conclusion

Building APIs with Laravel is straightforward with the right patterns. Focus on consistent responses, proper authentication, comprehensive testing, and good documentation.

The key is designing for the consumer—whether that's a mobile app, SPA, or third-party integration.

---

## Resources

- [Laravel API Documentation](https://laravel.com/docs/eloquent-resources)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Scribe Documentation](https://scribe.knuckles.wtf/)

