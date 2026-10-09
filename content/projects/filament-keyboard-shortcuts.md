---
title: Keyboard Shortcuts – A Filament Plugin
description: A free Filament 4 and 5 plugin that adds a searchable shortcut sheet, g-chord navigation with hint badges, and keyboard keys for table rows.
tags: [Laravel, FilamentPHP, Filament Plugin, Keyboard Shortcuts, Accessibility, Open Source]
image: "/images/my_projects/filament-keyboard-shortcuts/cover.webp"
createdAt: 2026-10-09T00:00:00.000Z
updatedAt: 2026-10-09T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## Keyboard Shortcuts for Filament

### Why I built it

I spend most of my day inside Filament panels, and I kept reaching for the mouse to do things Gmail and GitHub let me do from the keyboard. This plugin brings those habits into any Filament panel.

### What it does

- **Press `?`** (or `mod+/`) to open a searchable sheet of every shortcut on the current page, including the key bindings your own actions already declare
- **Press `g` then a letter** to jump to a page. Hint badges show the letter next to each navigation item, and large menus get two-letter chords
- **Move through tables** with `j` and `k`, select a row with `x`, and change pages with `[` and `]`
- **Press `/`** to focus global search
- **Add your own shortcuts** that open a URL, dispatch an event or run JavaScript

Every feature is on by default and can be switched off on its own. It handles dark mode and RTL, ships with 23 translations, traps focus inside the sheet, and reads well with a screen reader.

### Install

```bash
composer require hoceineel/filament-keyboard-shortcuts
```

Supports Filament 4 and 5. The code is on [GitHub](https://github.com/HoceineEl/filament-keyboard-shortcuts) and the listing is on the [Filament plugins directory](https://filamentphp.com/plugins/hocein-el-idrissi-keyboard-shortcuts).
