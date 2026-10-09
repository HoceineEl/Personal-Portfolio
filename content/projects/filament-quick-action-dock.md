---
title: Quick Action Dock – A Filament Plugin
description: A free Filament 4 and 5 plugin that adds a draggable floating dock of your most used actions to every page of a panel.
tags: [Laravel, FilamentPHP, Filament Plugin, Actions, UX, Open Source]
image: "/images/my_projects/filament-quick-action-dock/cover.webp"
createdAt: 2026-10-09T00:00:00.000Z
updatedAt: 2026-10-09T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## Quick Action Dock for Filament

### Why I built it

In most panels I build, people do the same three or four things all day: create an order, add a customer, open today's report. Those actions live on different pages, so users keep navigating just to click one button. The dock puts them on every page.

### What it does

- **A floating dock** shown as a speed dial or a bar, in four styles: Native, Outline, Contrast and Tinted
- **Drag it anywhere.** The position is remembered per panel and per user
- **Grouped actions** with labels, live badges and keyboard hints
- **Show actions to the right people** by user, ability, role, page, resource, route, path or device
- **Context aware:** `DockContext` tells an action which page and record it is on
- **Real Filament actions,** so modals, confirmations, icons, colors and authorization work as usual

It works with multiple panels and tenants, fits phones with safe-area insets, supports RTL and 23 languages, and comes with testing helpers.

### Install

```bash
composer require hoceineel/filament-quick-action-dock
```

Supports Filament 4 and 5. The code is on [GitHub](https://github.com/HoceineEl/filament-quick-action-dock) and the listing is on the [Filament plugins directory](https://filamentphp.com/plugins/hocein-el-idrissi-quick-action-dock).
