---
title: "Laravel Deployment: Zero-Downtime Production Deployments"
description: Master Laravel deployments with zero-downtime strategies, environment configuration, database migrations, queue management, and monitoring setup.
tags:
  - Laravel
  - Deployment
  - DevOps
  - Production
noImage: true
createdAt: 2025-05-01T10:00:00.000Z
updatedAt: 2025-05-01T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

# Laravel Deployment: Zero-Downtime Production Deployments

Deploying Laravel applications requires careful planning to ensure zero downtime and smooth updates. This guide covers essential deployment strategies, from basic setups to enterprise-grade workflows.

## Pre-Deployment Checklist

### Environment Configuration

```bash
# Verify environment
php artisan about

# Check configuration
php artisan config:show database
php artisan config:show cache
```

### Production Optimizations

```bash
# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Or all at once
php artisan optimize
```

### Database Migrations

```bash
# Test migrations first
php artisan migrate --pretend

# Run migrations
php artisan migrate --force
```

## Deployment Scripts

### Basic Deployment Script

```bash
#!/bin/bash
set -e

echo "Starting deployment..."

# Pull latest code
git pull origin main

# Install dependencies
composer install --no-dev --optimize-autoloader

# Build frontend assets
npm ci
npm run build

# Run migrations
php artisan migrate --force

# Clear and cache
php artisan optimize:clear
php artisan optimize

# Restart services
php artisan queue:restart

echo "Deployment complete!"
```

### Zero-Downtime Deployment

```bash
#!/bin/bash
set -e

RELEASE_DIR="/var/www/releases/$(date +%Y%m%d%H%M%S)"
CURRENT_LINK="/var/www/current"
SHARED_DIR="/var/www/shared"

# Create release directory
mkdir -p $RELEASE_DIR

# Clone/copy code
git clone --depth 1 git@github.com:user/repo.git $RELEASE_DIR

# Link shared files
ln -sf $SHARED_DIR/.env $RELEASE_DIR/.env
ln -sf $SHARED_DIR/storage $RELEASE_DIR/storage

# Install dependencies
cd $RELEASE_DIR
composer install --no-dev --optimize-autoloader

# Build assets
npm ci && npm run build

# Run migrations
php artisan migrate --force

# Optimize
php artisan optimize

# Atomic symlink swap (zero downtime)
ln -sfn $RELEASE_DIR $CURRENT_LINK

# Reload PHP-FPM
sudo systemctl reload php8.3-fpm

# Restart queue workers
php artisan queue:restart

# Cleanup old releases (keep last 5)
cd /var/www/releases
ls -t | tail -n +6 | xargs -r rm -rf

echo "Deployed: $RELEASE_DIR"
```

## Laravel Forge Deployment

### Deploy Script

```bash
cd /home/forge/myapp.com

git pull origin $FORGE_SITE_BRANCH

$FORGE_COMPOSER install --no-dev --optimize-autoloader

( flock -w 10 9 || exit 1
    echo 'Restarting FPM...'; sudo -S service $FORGE_PHP_FPM reload ) 9>/tmp/fpmlock

if [ -f artisan ]; then
    $FORGE_PHP artisan migrate --force
    $FORGE_PHP artisan optimize
    $FORGE_PHP artisan queue:restart
fi

npm ci
npm run build
```

### Environment Variables

```php
// In .env.example (reference)
APP_NAME=MyApp
APP_ENV=production
APP_DEBUG=false
APP_URL=https://myapp.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=forge
DB_PASSWORD=

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

## Database Migration Strategies

### Safe Migration Patterns

```php
// Always use nullable or default values for new columns
Schema::table('users', function (Blueprint $table) {
    $table->string('timezone')->nullable()->after('email');
});

// Or with default
Schema::table('users', function (Blueprint $table) {
    $table->string('status')->default('active')->after('email');
});
```

### Large Table Migrations

```php
// For large tables, use pt-online-schema-change or similar
public function up()
{
    // Add index in separate migration
    Schema::table('orders', function (Blueprint $table) {
        $table->index(['user_id', 'created_at']);
    });
}
```

### Rollback Strategy

```php
// Always define down() method
public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('timezone');
    });
}
```

## Queue Worker Management

### Supervisor Configuration

```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/current/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=forge
numprocs=8
redirect_stderr=true
stdout_logfile=/var/www/shared/storage/logs/worker.log
stopwaitsecs=3600
```

### Horizon for Advanced Queues

```bash
# Install Horizon
composer require laravel/horizon

# Supervisor for Horizon
[program:horizon]
process_name=%(program_name)s
command=php /var/www/current/artisan horizon
autostart=true
autorestart=true
user=forge
redirect_stderr=true
stdout_logfile=/var/www/shared/storage/logs/horizon.log
stopwaitsecs=3600
```

## Health Checks

### Health Check Endpoint

```php
// routes/web.php
Route::get('/health', function () {
    $checks = [
        'database' => false,
        'cache' => false,
        'queue' => false,
    ];

    try {
        DB::connection()->getPdo();
        $checks['database'] = true;
    } catch (\Exception $e) {}

    try {
        Cache::put('health_check', true, 10);
        $checks['cache'] = Cache::get('health_check') === true;
    } catch (\Exception $e) {}

    try {
        Queue::size('default');
        $checks['queue'] = true;
    } catch (\Exception $e) {}

    $allHealthy = !in_array(false, $checks, true);

    return response()->json([
        'status' => $allHealthy ? 'healthy' : 'unhealthy',
        'checks' => $checks,
        'timestamp' => now()->toISOString(),
    ], $allHealthy ? 200 : 503);
});
```

### Monitoring Integration

```php
// app/Providers/AppServiceProvider.php
public function boot()
{
    if (app()->isProduction()) {
        // Log slow queries
        DB::listen(function ($query) {
            if ($query->time > 1000) {
                Log::warning('Slow query', [
                    'sql' => $query->sql,
                    'time' => $query->time,
                ]);
            }
        });

        // Report exceptions to external service
        $this->app['log']->listen(function ($event) {
            if ($event->level === 'error') {
                // Send to Sentry, Flare, etc.
            }
        });
    }
}
```

## Rollback Procedures

### Quick Rollback

```bash
#!/bin/bash
# rollback.sh

CURRENT_LINK="/var/www/current"
RELEASES_DIR="/var/www/releases"

# Get previous release
PREVIOUS=$(ls -t $RELEASES_DIR | sed -n '2p')

if [ -z "$PREVIOUS" ]; then
    echo "No previous release found!"
    exit 1
fi

echo "Rolling back to: $PREVIOUS"

# Swap symlink
ln -sfn "$RELEASES_DIR/$PREVIOUS" $CURRENT_LINK

# Reload PHP-FPM
sudo systemctl reload php8.3-fpm

# Restart queues
php $CURRENT_LINK/artisan queue:restart

echo "Rollback complete!"
```

### Database Rollback

```bash
# Rollback last migration
php artisan migrate:rollback --step=1

# Rollback to specific batch
php artisan migrate:rollback --batch=5
```

## SSL and Security

### Force HTTPS

```php
// app/Providers/AppServiceProvider.php
public function boot()
{
    if (app()->isProduction()) {
        URL::forceScheme('https');
    }
}
```

### Security Headers

```php
// app/Http/Middleware/SecurityHeaders.php
public function handle($request, $next)
{
    $response = $next($request);

    $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
    $response->headers->set('X-Content-Type-Options', 'nosniff');
    $response->headers->set('X-XSS-Protection', '1; mode=block');
    $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
    $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    if (app()->isProduction()) {
        $response->headers->set(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains'
        );
    }

    return $response;
}
```

## Deployment Checklist

### Before Deployment

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Dependencies updated
- [ ] Environment variables set
- [ ] Database backup taken
- [ ] Rollback plan ready

### During Deployment

- [ ] Maintenance mode if needed
- [ ] Pull latest code
- [ ] Install dependencies
- [ ] Run migrations
- [ ] Clear caches
- [ ] Restart queue workers

### After Deployment

- [ ] Health check passing
- [ ] Monitor error logs
- [ ] Verify critical features
- [ ] Check queue processing
- [ ] Monitor performance

## Conclusion

Zero-downtime deployments require atomic symlink swaps, proper database migration strategies, and queue worker management. Always have a rollback plan and monitor your application after every deployment.

---

## Resources

- [Laravel Deployment Documentation](https://laravel.com/docs/deployment)
- [Laravel Forge](https://forge.laravel.com)
- [Envoyer](https://envoyer.io)

