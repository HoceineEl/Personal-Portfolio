---
title: Media Library Pro – A Filament Plugin
description: A shared media library for Filament 4 and 5, built on spatie/laravel-medialibrary. Upload a file once and pick it anywhere, with folders, tags, focal points, versions, usage tracking, private files and tenancy. Coming soon.
tags: [Laravel, FilamentPHP, Filament Plugin, Media Library, Spatie, Multi-tenancy]
image: "/images/my_projects/filament-media-library-pro/cover.webp"
createdAt: 2026-10-19T00:00:00.000Z
updatedAt: 2026-10-19T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## Media Library Pro for Filament

Filament doesn't ship a shared media library. Each form field uploads its own files, so the same logo ends up stored five times and nobody knows which product still uses an image before deleting it. Media Library Pro adds that layer: upload a file once, then pick it in forms, tables, infolists and Blade. It is built on [spatie/laravel-medialibrary](https://spatie.be/docs/laravel-medialibrary) and is coming soon as a commercial plugin.

![The media library: folders, smart views, tags and a grid of files](/images/my_projects/filament-media-library-pro/cover.webp)

### What's in it

- **A browser page** with a folder tree and drag and drop, smart views (recent, favorites, my uploads, unused, trash), tags, type filters, search across names, alt text and tags, grid and list layouts, keyboard shortcuts and a lightbox
- **Uploads** that are chunked, resumable and parallel, from files, folders, the clipboard or a URL. Duplicates are caught by checksum, and the user chooses to reuse the existing file or keep both
- **An inspector** for title, alt text, caption, tags, folder and visibility, with a focal point and live crop previews, where a file is used, version history with one-click restore, and EXIF data

![The inspector: alt text, focal point, usage and versions](/images/my_projects/filament-media-library-pro/inspector.webp)

- **An image editor** to crop, rotate, flip and zoom, saving over the file (the old one is kept as a version) or as a copy

![The built-in image editor](/images/my_projects/filament-media-library-pro/editor.webp)

- **Safe deletes**: a file still attached somewhere can't be deleted by accident, and deleted files go to a trash that keeps their usage links, so restoring puts them back where they were
- **Multi-tenancy** with Filament panel tenancy, stancl/tenancy or your own resolver, plus private per-user files and per-tenant storage quotas
- **Security**: content sniffing, blocked executable extensions, SVG sanitizing, an SSRF guard on URL imports, signed links for private files and policy-based authorization
- **Migration** from existing Spatie media, Curator media or a plain directory in one command

It speaks English, French and Arabic with full RTL support, and runs on PHP 8.2 to 8.5, Laravel 12 and 13, Filament 4 and 5, and Livewire 3 and 4, on any Laravel disk including S3 and S3-compatible storage.

![Picking a file from the library inside a Filament form](/images/my_projects/filament-media-library-pro/picker.webp)
