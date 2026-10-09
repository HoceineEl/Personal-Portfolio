---
title: Undo Toast – A Filament Plugin
description: A free Filament 4 and 5 plugin that shows an undo toast with a countdown after every delete, restore, edit and detach action.
tags: [Laravel, FilamentPHP, Filament Plugin, Undo, UX, Open Source]
image: "/images/my_projects/filament-undo-toast/cover.webp"
createdAt: 2026-10-09T00:00:00.000Z
updatedAt: 2026-10-09T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## Undo Toast for Filament

### Why I built it

Confirmation modals get clicked through without being read. An undo button that stays for a few seconds after the action protects people better and slows them down less. Gmail figured this out years ago.

### What it does

- **A toast after every delete, restore, edit and detach**, with a countdown and an Undo button. `Ctrl+Z` or `Cmd+Z` works too
- **Soft deletes** are restored the normal way
- **Hard deletes** are put back from a full copy of the row, relations included
- **Edits** roll back only the columns that changed
- **Detach** restores the pivot rows
- **Your own actions** can become undoable with a custom strategy

You can set the duration, position and how many toasts stack, and opt actions in or out one by one. Undo data sits encrypted in your cache store (Redis, database or file), and only the user who did the action can undo it. Dark mode, RTL and 23 languages are included.

### Install

```bash
composer require hoceineel/filament-undo-toast
```

Supports Filament 4 and 5. The code is on [GitHub](https://github.com/HoceineEl/filament-undo-toast) and the listing is on the [Filament plugins directory](https://filamentphp.com/plugins/hocein-el-idrissi-undo-toast).
