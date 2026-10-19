---
title: Sidebar Editor – A Filament Plugin
description: A free Filament 5 plugin that adds a Sidebar page where people hide, show and reorder navigation groups and pages with drag and drop and a live preview, saved per tenant, per user or for the whole panel.
tags: [Laravel, FilamentPHP, Filament Plugin, Navigation, Multi-tenancy, Open Source]
image: "/images/my_projects/filament-sidebar-editor/cover.webp"
createdAt: 2026-10-19T00:00:00.000Z
updatedAt: 2026-10-19T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## Sidebar Editor for Filament

### What it does

The plugin adds a **Sidebar** page to a Filament 5 panel. On it, people drag navigation groups and pages by their handle, switch pages and child pages on or off, and watch a live preview update before they save. The real sidebar changes on the next page load.

New pages and resources show up on their own, and the editor page itself can never be hidden, so nobody locks themselves out. Hiding a page only removes it from the sidebar; it doesn't change who can open it.

![The sidebar editor with its live preview](/images/my_projects/filament-sidebar-editor/editor.webp)

### Where the layout is saved

- **Per tenant**: on a JSON column of the current tenant, so each team or store has its own sidebar
- **Per user**: one layout per user and panel, in the package's table
- **Globally**: one layout for the whole panel (the default)
- **Your own store**: a class implementing the `LayoutStore` contract, or two closures

Each panel has its own registration and options: who may open the editor, its slug, icon, group and label, which pages can never be hidden, and whether the ungrouped pages stay pinned at the top.

![The editor in dark mode](/images/my_projects/filament-sidebar-editor/dark.webp)

It supports right-to-left panels too.

![The editor in a right-to-left panel](/images/my_projects/filament-sidebar-editor/rtl.webp)

### Install

```bash
composer require hoceineel/filament-sidebar-editor
php artisan filament:assets
```

```php
use HoceineEl\SidebarEditor\SidebarEditorPlugin;

$panel->plugin(SidebarEditorPlugin::make());
```

It needs PHP 8.3+, Laravel 12 or 13 and Filament 5. MIT licensed, on [GitHub](https://github.com/HoceineEl/filament-sidebar-editor) and the [Filament plugin directory](https://filamentphp.com/plugins/hocein-el-idrissi-sidebar-editor).
