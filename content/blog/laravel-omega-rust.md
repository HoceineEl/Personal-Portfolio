---
title: "Laravel Omega: What We Actually Know About Laravel for Rust"
description: Taylor Otwell is teasing Omega, a Laravel-flavored framework written in Rust. I went through the posts, the replies and the one public repo, inertia-omega, to separate what is confirmed from what is guesswork.
tags:
  - Laravel
  - Rust
  - Inertia.js
  - News
image: /images/blog/laravel-omega/cover.jpg
banner: /images/blog/laravel-omega/cover.jpg
createdAt: 2026-10-17T10:00:00.000Z
updatedAt: 2026-10-17T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

## Laravel Omega: What We Actually Know About Laravel for Rust

On Monday, October 5, Taylor Otwell posted three lines of code and nothing else:

```rust
use laravel::{Application, inertia};

use crate::http::middleware::HandleInertiaRequests;
use crate::routes;
```

No caption. No link. Just Rust, typed in that monospace Unicode font people use when they
want a tweet to look like a terminal. It got [85k views and 680+ likes](https://x.com/taylorotwell/status/2107117389762515319)
in a day, and the replies filled up with one word: **Omega**.

I have been writing Laravel for years and I touch Rust about twice a year, usually when a
CLI tool breaks. So I did what everyone did: I zoomed into those three lines like they were
a crime scene photo. Then I went looking for anything solid. This post is what I found,
sorted into "confirmed", "very likely" and "people are guessing".

Short version: there is no Omega release, no docs, no landing page. But there *is* a public
repository under the Inertia.js organisation, with Taylor's name on the commits, and it tells
us a lot.

### The timeline

Everything public so far, in order. All times UTC.

| Date | What happened | Source |
| --- | --- | --- |
| Jul 16 | Taylor posts "from @laravelphp to @laravel ✨". A reply asks if a Rust port is confirmed. Nobody answers. | [X](https://x.com/taylorotwell/status/2077863029874503921) |
| Oct 5, 12:49 | First commit of `inertiajs/inertia-omega` on GitHub. | [GitHub](https://github.com/inertiajs/inertia-omega) |
| Oct 5, 14:35 | Taylor posts the `use laravel::{Application, inertia};` snippet. | [X](https://x.com/taylorotwell/status/2107117389762515319) |
| Oct 5, 15:29 | Punyapal Shah quotes it: "I told you; now cannot wait to use Omega: Laravel for Rust 💪". This is where the name spreads. | [X](https://x.com/MrPunyapal/status/2107130989042667563) |
| Oct 5, 21:39 | Taylor: "Ready for the Rust meet-up 😌". The photo is his orange Lamborghini. The plate says **FACADE**. | [X](https://x.com/taylorotwell/status/2107224136502411595) |
| Oct 7 | Taylor: "Omega before GTA6 😭". | [X](https://x.com/taylorotwell/status/2107657903360401512) |
| Oct 8 | Laravel Daily's newsletter goes out titled "The Future of Laravel is... Rust?" | [archive](https://migma.ai/trending/emails/laravel-daily-cz/the-future-of-laravel-is-rust-6ac75583eeb1736217d3252e) |
| Oct 14 | `inertia-omega` bumps to "Require Rust 1.99". | [commits](https://github.com/inertiajs/inertia-omega/commits) |
| Oct 16 | Latest push, co-authored by Taylor Otwell. | [commits](https://github.com/inertiajs/inertia-omega/commits) |

Notice the first two rows on October 5. The repo went up about two hours *before* the tweet.
That is not a coincidence I am willing to ignore.

> A licence plate that says FACADE, posted on the same day as a Rust teaser, captioned
> "Rust meet-up". If you know Laravel, you know what a facade is. I don't think Taylor
> picked that photo at random.

### Reading the three lines like a Laravel dev

Each line in that snippet maps to something you already have in a Laravel app.

**`use laravel::{Application, inertia};`** A crate literally named `laravel`. `Application` is
the same name as `Illuminate\Foundation\Application`, the container that boots everything.
And `inertia` is exported from the framework itself, not pulled in as a third-party package.
That tells me Inertia is a first-class citizen, like it is in the official starter kits.

**`use crate::http::middleware::HandleInertiaRequests;`** In Rust, `crate::` means "this
project". So the *user's app* has a folder `http/middleware/` with a file defining
`HandleInertiaRequests`. That is `app/Http/Middleware/HandleInertiaRequests.php`, the exact
file every Laravel + Inertia app has. The folder structure survived the language change.

**`use crate::routes;`** A `routes` module in the app. Same idea as `routes/web.php`.

So the shape is: a Laravel skeleton, in Rust, where your app code lives in your crate and the
framework lives in `laravel`. That is the confirmed part, and it is already more than I
expected.

### The repo that isn't a rumour: inertia-omega

[`inertiajs/inertia-omega`](https://github.com/inertiajs/inertia-omega) is public, MIT,
marked **[ALPHA]**, and at the time of writing has 9 commits and around 110 stars. Its
description: *"The Inertia.js server-side protocol for Rust, with a framework-agnostic core
and an Axum adapter."*

A few details that matter:

- **It is called `inertia-omega`, but you import it as `inertia`.** The `Cargo.toml` sets
  `[lib] name = "inertia"`. The README links to a `laravel/omega-workspace` repo for setup.
  That repo returns a 404 for me, so it is private. There is the "Omega" name, on an official
  org, pointing at a private Laravel workspace.
- **It mentions a sibling crate called `laravel-omega-vite`**, which renders asset tags "like
  Laravel's `@vite`". Also not public yet.
- **Taylor is a contributor.** Recent commits carry `Co-authored-by: Taylor Otwell <taylor@laravel.com>`.
- **It is a port, not a rewrite from scratch.** The README says the props resolver and the
  protocol rules are ports of [inertia-laravel](https://github.com/inertiajs/inertia-laravel),
  and credits [Veer](https://github.com/climactic/veer) for the adapter design.
- **It is built heavily with AI agents.** Commits carry Amp thread IDs and the first commit is
  co-authored by Claude. Make of that what you will. I find it interesting that the creator
  of one of the biggest PHP frameworks is porting it with agents doing a lot of the typing.

#### What the code looks like

A handler, straight from the README:

```rust
async fn show(inertia: Inertia, Path(id): Path<u64>, State(db): State<Db>) -> inertia::Response {
    let user = db.find_user(id).await;

    inertia.render("Users/Show", props! {
        "user" => user,
        "activity" => inertia::defer(move || async move { db.activity_for(id).await }),
    })
}
```

If you have written `Inertia::render('Users/Show', [...])` with an `Inertia::defer()` prop,
you can read that without knowing any Rust. That is clearly the point.

Validation and redirects feel familiar too:

```rust
async fn store(inertia: Inertia, Json(form): Json<NewUser>) -> HttpResponse {
    let mut errors = ValidationErrors::new();

    if form.name.trim().is_empty() {
        errors.add("name", "The name field is required.");
    }

    if !errors.is_empty() {
        return inertia.back_with_errors(errors);
    }

    create_user(form).await;
    inertia.flash("toast", "User created!");

    inertia::redirect("/users")
}
```

Yes, that error message is word for word Laravel's `validation.required` string.

And testing, modelled on `assertInertia`:

```rust
AssertablePage::from_body(&body)
    .component("Users/Index")
    .has_count("users", 3)
    .equals("users.0.name", "Taylor")
    .missing("users.0.password")
    .deferred("default", &["stats"])
    .flash("toast", "Saved!");
```

#### The cheat sheet they wrote for us

The README has a "Coming from Laravel" table. Here is a trimmed version, because it is the
best preview of how Omega wants to feel:

| Laravel | Rust (inertia-omega) |
| --- | --- |
| `Inertia::render('Users/Index', [...])` | `inertia.render("Users/Index", props! { .. })` |
| `Inertia::defer(fn () => ..)->group('x')` | `inertia::defer(\|\| async { .. }).group("x")` |
| `Inertia::merge(..)->matchOn('id')` | `inertia::merge(..).match_on("id")` |
| `Inertia::once(fn () => ..)->until(..)` | `inertia::once(\|\| async { .. }).until(..)` |
| `HandleInertiaRequests::share()` | `Config::share` or `inertia.share(..)` in a middleware |
| `back()->withErrors($errors)` | `inertia.back_with_errors(errors)` |
| `Inertia::flash('key', $value)` | `inertia.flash("key", value)` |
| `$response->assertInertia(fn ($page) => ..)` | `AssertablePage::from_body(&body)..` |

Not ported yet, per the README: Inertia DevTools, `ProvidesInertiaProperties`, component
name transformers, the `ensure_pages_exist` check, and Precognition.

#### Under the hood

Today the adapter targets [Axum](https://github.com/tokio-rs/axum) with
[tower-sessions](https://github.com/maxcountryman/tower-sessions). Feature flags let you turn
pieces on and off:

| Feature | Default | What it adds |
| --- | --- | --- |
| `axum` | yes | The Axum adapter |
| `tower-sessions` | yes | Sessions through tower-sessions |
| `ssr` | yes | Server-side rendering over HTTP |
| `ssr-tls` | no | HTTPS for the SSR gateway |
| `validator` / `garde` | no | Turn those crates' errors into `ValidationErrors` |

It needs **Rust 1.99** and the 2024 edition. SSR works the way it does in Laravel: a
`public/hot` file in development, `bootstrap/ssr/app.js` in production. Those paths are
Laravel paths. Again, not an accident.

### Confirmed, likely, guessing

Let me be careful here, because a lot of posts this week blurred the line.

**Confirmed**

- Taylor is writing Rust that imports from a crate called `laravel`, with Laravel's folder
  conventions.
- A public, alpha, Laravel-team-backed Inertia server adapter for Rust exists and uses the
  "omega" name.
- A private `laravel/omega-workspace` and a `laravel-omega-vite` crate exist (referenced in
  the README).
- Taylor has used the word "Omega" himself ("Omega before GTA6").

**Very likely**

- Omega is the codename for a Laravel-style framework in Rust, and inertia-omega is the first
  piece shipped in public.
- Inertia + React/Vue/Svelte is the default frontend story, like the current starter kits.
- It sits on Axum and Tokio rather than building its own HTTP server, at least for now.

**People are guessing**

- That Omega replaces PHP Laravel. Nothing says that. Laravel 13.x shipped point releases the
  same week.
- A release date. "Before GTA6" is a joke, and GTA6 keeps moving anyway.
- Eloquent, queues, Blade, Artisan in Rust. Probably on the list, zero public evidence yet.
- One reply guessed it is a PHP-to-binary compiler written in Rust. The `use crate::http::…`
  line is app code written in Rust, so I don't buy it.

### The other "Laravel for Rust" projects

Omega is not the first attempt. The community has been building this for a while, and if you
want to play with the idea *today*, these exist:

| Project | Built on | Notes |
| --- | --- | --- |
| [Kit](https://github.com/dayemsiddiqui/kit) | Inertia, React | Inertia + React first-class. [Docs](https://docs.kit-rs.dev/). Successor of the archived [Ruskit](https://github.com/dayemsiddiqui/ruskit). |
| [Suprnova](https://github.com/eas4ai/suprnova) | hyper, SeaORM, Tokio | Fork of Kit, `Auth::login`, `Cache::remember` style APIs. [Site](https://suprnova.app/). |
| [Larust](https://github.com/WallabyDesigns/Larust) | Axum, sqlx, tower-sessions | Routing, ORM, validation, auth, CLI. [Docs](https://docs.larust.dev/). |
| [Rustlavel](https://github.com/advancedynamic/rustlavel) | Tokio only | Built from scratch, Eloquent-shaped ORM, Artisan-style CLI. |
| [Renox](https://github.com/renox-rs/renox) | Axum, HTMX, Alpine.js | The "TALL in Rust" one. Ships as one binary. |
| [portside-labs/laravel-rust](https://github.com/portside-labs/laravel-rust) | Tokio | Unofficial port aiming at Laravel 13 parity. Very new. |

There is also a candid DEV post, ["I built a Laravel-like web framework for Rust, but nobody
is using it yet"](https://dev.to/lechatthecat/i-built-a-laravel-like-web-framework-for-rust-but-nobody-is-using-it-yet-39hh),
which is worth reading because it shows the real problem. The code is not the hard part.
Docs, ecosystem and trust are. That is exactly the thing Laravel the company has and these
projects do not.

### Why would anyone want this?

My honest take, as someone who ships Laravel for a living:

**What Rust would buy you.** One binary you `scp` to a server. No PHP-FPM, no OPcache tuning,
no "which extension is missing on prod". Memory usage you can actually predict. Type errors at
compile time instead of in Sentry at 2 a.m. Long-running processes that don't need Octane
tricks to stay warm.

**What it would cost you.** Compile times. The borrow checker on a Friday afternoon. A
`dd()` that is not quite as fun. And the biggest one: Laravel's magic is mostly runtime
magic. Facades, the container, Eloquent's `__call`, macros. Rust doesn't do runtime magic. You
get macros and traits instead. Looking at `props!` and the `Inertia` extractor, the team
seems to be translating the *feel* rather than the *mechanism*, and I think that is the right
call.

**What I am watching for.**

1. An ORM. This is where Rust frameworks live or die. Eloquent is the reason half of us stay.
2. Whether `php artisan make:*` becomes `cargo laravel make:*` or something new.
3. How Forge, Vapor and Laravel Cloud treat a Rust app. Cloud deploying a single binary would
   be a big deal.
4. Whether the Filament and Livewire world gets a story at all, or whether Omega is
   Inertia-only.

### How to follow along

- Watch [inertiajs/inertia-omega](https://github.com/inertiajs/inertia-omega) on GitHub. It is
  the only public code, and it moves every few days.
- Follow [@taylorotwell](https://x.com/taylorotwell) on X. Every clue so far came from there.
- Keep an eye on [laravel-news.com](https://laravel-news.com) and the Laravel Daily newsletter.
- If you want to try the protocol now, clone inertia-omega, run `cargo test --all-features`,
  and read `tests/core.rs`. It is the clearest view of how the core works without a web
  framework.

I will update this post when there is an official announcement. If you spot something I
missed, a reply, a repo, a talk, send it to me and I'll add it with credit.

### Sources

- Taylor Otwell, [`use laravel::{Application, inertia};`](https://x.com/taylorotwell/status/2107117389762515319), Oct 5, 2026
- Punyapal Shah, ["Omega: Laravel for Rust"](https://x.com/MrPunyapal/status/2107130989042667563), Oct 5, 2026
- Taylor Otwell, ["Ready for the Rust meet-up"](https://x.com/taylorotwell/status/2107224136502411595), Oct 5, 2026
- Taylor Otwell, ["Omega before GTA6"](https://x.com/taylorotwell/status/2107657903360401512), Oct 7, 2026
- Taylor Otwell, ["from @laravelphp to @laravel"](https://x.com/taylorotwell/status/2077863029874503921), Jul 16, 2026
- [inertiajs/inertia-omega](https://github.com/inertiajs/inertia-omega) README, Cargo.toml and commit history
- [inertiajs/inertia-laravel](https://github.com/inertiajs/inertia-laravel), the adapter it ports
- [Inertia v3 protocol](https://inertiajs.com/docs/v3/core-concepts/the-protocol)
- Laravel Daily, ["The Future of Laravel is... Rust?"](https://migma.ai/trending/emails/laravel-daily-cz/the-future-of-laravel-is-rust-6ac75583eeb1736217d3252e), Oct 8, 2026
