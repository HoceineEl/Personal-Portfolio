---
title: "نشر تطبيقات Laravel: نشر إلى الإنتاج بلا توقف"
description: أتقن نشر تطبيقات Laravel باستراتيجيات النشر بلا توقف، وضبط متغيرات البيئة، وملفات الترحيل لقاعدة البيانات، وإدارة طوابير المهام، وإعداد المراقبة.
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

# نشر تطبيقات Laravel: نشر إلى الإنتاج بلا توقف

نشر (deployment) تطبيقات Laravel يحتاج تخطيطًا دقيقًا حتى يبقى التطبيق متاحًا طوال الوقت وتمر التحديثات بسلاسة. يغطي هذا الدليل أهم استراتيجيات النشر، من الإعدادات البسيطة إلى مسارات العمل بمستوى المؤسسات الكبرى.

## قائمة التحقق قبل النشر

### إعداد البيئة

```bash
# Verify environment
php artisan about

# Check configuration
php artisan config:show database
php artisan config:show cache
```

### تحسينات بيئة الإنتاج

```bash
# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Or all at once
php artisan optimize
```

### ملفات الترحيل لقاعدة البيانات

```bash
# Test migrations first
php artisan migrate --pretend

# Run migrations
php artisan migrate --force
```

## سكربتات النشر

### سكربت نشر أساسي

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

### النشر بلا توقف

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

## النشر عبر Laravel Forge

### سكربت النشر

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

### متغيرات البيئة

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

## استراتيجيات ترحيل قاعدة البيانات

### أنماط ترحيل آمنة

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

### ترحيل الجداول الكبيرة

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

### استراتيجية التراجع

```php
// Always define down() method
public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn('timezone');
    });
}
```

## إدارة عمّال طوابير المهام

### إعداد Supervisor

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

### Horizon للطوابير المتقدمة

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

## فحوصات السلامة

### نقطة نهاية لفحص السلامة

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

### التكامل مع أدوات المراقبة

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

## إجراءات التراجع

### تراجع سريع

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

### التراجع في قاعدة البيانات

```bash
# Rollback last migration
php artisan migrate:rollback --step=1

# Rollback to specific batch
php artisan migrate:rollback --batch=5
```

## SSL والأمان

### فرض HTTPS

```php
// app/Providers/AppServiceProvider.php
public function boot()
{
    if (app()->isProduction()) {
        URL::forceScheme('https');
    }
}
```

### ترويسات الأمان

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

## قائمة التحقق للنشر

### قبل النشر

- [ ] كل الاختبارات تنجح
- [ ] مراجعة الكود مكتملة
- [ ] الاعتماديات محدّثة
- [ ] متغيرات البيئة مضبوطة
- [ ] نسخة احتياطية من قاعدة البيانات جاهزة
- [ ] خطة التراجع جاهزة

### أثناء النشر

- [ ] وضع الصيانة عند الحاجة
- [ ] سحب آخر نسخة من الكود
- [ ] تثبيت الاعتماديات
- [ ] تشغيل ملفات الترحيل
- [ ] مسح الذاكرة المؤقتة
- [ ] إعادة تشغيل عمّال طوابير المهام

### بعد النشر

- [ ] فحص السلامة ينجح
- [ ] مراقبة سجلات الأخطاء
- [ ] التأكد من عمل الميزات الحرجة
- [ ] التحقق من معالجة طوابير المهام
- [ ] مراقبة الأداء

## الخلاصة

النشر بلا توقف يحتاج تبديلًا ذريًا للرابط الرمزي (symlink)، واستراتيجيات سليمة لترحيل قاعدة البيانات، وإدارة جيدة لعمّال طوابير المهام. جهّز دائمًا خطة للتراجع، وراقب تطبيقك بعد كل نشر.

---

## مصادر

- [توثيق النشر في Laravel](https://laravel.com/docs/deployment)
- [Laravel Forge](https://forge.laravel.com)
- [Envoyer](https://envoyer.io)
