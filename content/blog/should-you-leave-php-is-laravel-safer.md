---
title: "After PHP2Shell: Should You Leave PHP, and Is Laravel Safer Than Plain PHP?"
description: An honest answer from a Laravel developer. Why PHP2Shell is not a reason to switch languages, what Laravel protects you from and what it cannot, and the checklist that actually keeps a PHP app safe.
tags:
  - PHP
  - Laravel
  - Security
  - Opinion
image: /images/blog/leave-php/cover.jpg
banner: /images/blog/leave-php/cover.jpg
createdAt: 2026-10-26T11:00:00.000Z
updatedAt: 2026-10-26T11:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

## After PHP2Shell: Should You Leave PHP?

After [PHP2Shell](/blog/php2shell-cve-2026-109618-109619), two questions kept coming up in my
messages and in every PHP community I follow:

1. Is PHP now too dangerous to build on?
2. Is Laravel safer than writing plain PHP?

Short answers: **no**, and **yes, but not against this bug**. Here is the long version.

### Question 1: should you leave PHP?

Look at what else broke in [the same week](/blog/october-2026-vulnerability-week-gitlab-java-nginx):

| Runtime or tool | Worst bug this week | Login needed? |
| --- | --- | --- |
| PHP | 9.2, code execution | No |
| Java (Oracle, GraalVM) | 9.1, TLS trust broken | No |
| Node.js | out-of-bounds write in Brotli | No |
| GitLab (Ruby) | 10.0, code execution | No |
| NGINX (in front of all of them) | 9.2, code execution | No |

If one critical runtime bug were a reason to leave a language, you would have to leave Java and
Node in the same week, and Ruby the week before. Every runtime written in C or C++ (PHP, Node,
Python, Ruby, the JVM's native parts) has memory bugs. They get found, fixed and shipped.

What actually decides your risk is not the language. It is these three things:

- **Are you on a supported version?** PHP 8.2 to 8.5 got a fix within hours. PHP 7 and 8.1 got
  nothing. Node 20 got nothing for its Brotli bug either. Same lesson, different language.
- **How fast can you deploy a runtime update?** Minutes with Docker or a managed platform. Days or
  never with a hand built server nobody wants to touch.
- **What runs in front of PHP?** Request size limits, a WAF and a patched NGINX reduce the window.

Rewriting a working product in Go or Rust to avoid one interpreter bug trades a one hour patch for
a year of rewrite risk. It also brings new runtimes with their own bug history. Go needed its own
fix this very week for the eMudhra certificates.

There **are** real reasons to pick another language for a project: the team's skills, the kind
of workload, the ecosystem you need. PHP2Shell is not one of them.

### Question 2: is Laravel safer than plain PHP?

It depends on which layer you mean.

![Where a PHP app can be broken: your code, framework, runtime, web server, OS](/images/blog/leave-php/layers.png)

**Against PHP2Shell, Laravel does not help at all.** The bug sits in the interpreter. On Apache
`mod_php` the attack completes before `public/index.php` runs. No middleware, no route, no
validation ever sees the request. A fully updated Laravel app on PHP 8.1 is more exposed than a plain PHP
script on PHP 8.4.27. Upgrading Laravel with `composer update` changes nothing; upgrading PHP fixes
it.

**Against the bugs that hack most PHP sites, Laravel helps a lot.** Year after year, PHP sites
get broken through application code far more often than through the interpreter: SQL injection,
XSS, missing CSRF checks, insecure uploads, weak password storage. That is the layer where a
framework earns its keep:

| Common hole | Plain PHP, by default | Laravel, by default |
| --- | --- | --- |
| SQL injection | you must remember prepared statements | Eloquent and the query builder bind values |
| XSS | you must call `htmlspecialchars` everywhere | Blade `{{ }}` escapes output |
| CSRF | you build tokens yourself | `VerifyCsrfToken` on every web route |
| Passwords | easy to store MD5 or SHA1 | `Hash::make` uses bcrypt or argon2 |
| Mass assignment | not a concept | `$fillable` and `$guarded` |
| Signed links, encryption, rate limits | DIY | built in |

Laravel does not make you safe; it makes the safe path the default path. You can still write
`DB::raw($request->input('sort'))` or `{!! $comment !!}` and undo all of it.

So the honest answer: **Laravel makes your code safer. It makes your runtime exactly as safe as
the PHP version under it.**

### What actually protects a PHP app

This is the checklist I now apply to every Laravel project I build or inherit:

1. **Stay on a supported PHP branch.** Today that means 8.2 or newer. Put the end-of-life date
   for your branch in the calendar. 8.2 leaves security support at the end of 2026.
2. **Make PHP updates boring.** Pin the base image (`php:8.4-fpm`), rebuild weekly, and let CI
   redeploy. Or use a platform that patches the runtime for you, like Laravel Cloud did this week.
3. **Restart what you patch.** FPM pools, Octane, FrankenPHP and queue workers keep the old
   binary in memory until they restart.
4. **Turn off what you do not use.** If you never show upload progress, set
   `session.upload_progress.enabled = 0`. Drop `mod_php` for PHP-FPM behind NGINX.
5. **Limit the blast radius.** Run PHP as a non-root user, keep `.env` out of the web root, give
   the database user only the grants it needs, and keep secrets you can rotate in minutes.
6. **Watch the right feeds.** Subscribe to PHP's announcements, the Laravel security list, your
   distro's security tracker and CISA's KEV catalog. Run `composer audit` in CI.
7. **Patch the layers around PHP too.** NGINX, OpenSSL, the kernel and your Git server all had
   critical bugs this month.

### My take

I build with Laravel and I am staying with it. PHP2Shell was serious, the leak made it messy, and
the patch window was short. But PHP shipped fixes for every supported branch the same day the
details went public, and platforms like Laravel Cloud patched customers before most of them woke
up.

The scary number from this week is not 9.2. It is the **roughly half of PHP websites still on
versions with no fix**. That is not a PHP problem, it is a maintenance problem, and it follows you
to any language you switch to.

If you want help checking or upgrading a PHP or Laravel server, [get in touch](/#contact).

### Sources

- [Securing Laravel: Laravel security notice](https://securinglaravel.com/laravel-security-notice-critical-php-security-release/)
- [Safeguard: PHP2Shell for Laravel and Symfony (Octane, FrankenPHP, Forge, Docker)](https://safeguard.sh/resources/blog/php2shell-laravel-and-symfony-applications)
- [DEV: PHP2Shell, patch the PHP runtime, not just your app](https://dev.to/nooryasserx/php2shell-patch-the-php-runtime-not-just-your-app-1p01)
- [CISA alert on PHP](https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching)
- [PHP supported versions](https://www.php.net/supported-versions.php)
- [W3Techs PHP usage](https://w3techs.com/technologies/details/pl-php)
