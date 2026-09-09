---
title: FilamentCraft – Visual Website Builder for Filament
description: A commercial Shopify-style, drag-and-drop website builder for FilamentPHP v4 and v5, with a no-code section builder, multi-tenancy, themes and full RTL.
tags: [Laravel, Livewire, FilamentPHP, Page Builder, CMS, Multi-tenancy, SaaS, Commercial]
image: "/images/my_projects/filamentcraft/mockup.png"
noImage: true
createdAt: 2026-06-10T00:00:00.000Z
updatedAt: 2026-09-09T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## FilamentCraft – Visual Website Builder for Filament

### Overview

FilamentCraft turns any Filament panel into a Shopify-style website builder. Instead of shipping a page as a migration and a Blade file, your users drag sections onto a canvas, edit them against a live preview, and publish — while you keep building the application.

It is a commercial plugin, sold and maintained by me, and it is the largest thing I have built to date: 32 built-in sections, a no-code section builder, revisioned templates, and one codebase that supports Filament 4 and 5 on Livewire 3 and 4.

### Key Features

- **No-code section builder** – Users compose brand-new section types from a palette of 25 blocks and 24 layouts, and the settings panel is generated from whatever they built
- **32 built-in sections** – Marketing, content and commerce, each with one-click presets in four design families
- **Live iframe preview** – Section-level refresh from draft state, device previews, and an undo/redo ring buffer, with no full page reloads
- **Themes your users can edit** – Colors, typography, buttons, ~1,900 Bunny fonts, 22-token color schemes, and agency brand kits
- **Multi-tenancy without a tenancy package** – Sites belong to any owner model, so it works with stancl/tenancy, spatie/multitenancy, Filament's own tenancy, or a single-site app
- **Multilingual with full RTL** – Every locale is an independent content slice, with hreflang tags and a drop-in visitor language switcher
- **E-commerce sections** – Product grids, carts and checkout driven by your real database through one small `Storefront` contract
- **SEO and AI search** – Server-rendered pages, per-page SEO with a live SERP preview, sitemap, JSON-LD, llms.txt and IndexNow

### Technologies Used

- **Laravel 11–13** – Backend framework
- **FilamentPHP 4 and 5** – Panel and schema layer, dual-supported from one codebase
- **Livewire 3 and 4** – Editor interactivity
- **TypeScript** – Editor canvas, iframe bridge and morph-based preview updates
- **Tailwind CSS** – Token-driven section primitives
- **Pest, PHPStan level 6, Pint** – 1,700+ tests gating every release
- **Paddle** – Merchant of record, feeding a self-hosted private Composer registry

### Live Demo

Try it with no signup at [demo.filamentcraft.dev](https://demo.filamentcraft.dev/launch/admin?ref=portfolio) — one click drops you straight into the editor on a real site.

Documentation, pricing and the changelog live at [filamentcraft.dev](https://filamentcraft.dev?ref=portfolio).
