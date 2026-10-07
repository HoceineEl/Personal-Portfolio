---
title: Scheduler Pro – Scheduling and Kanban for Filament
description: A commercial Filament v4 and v5 plugin with resource timelines, calendars, Gantt planning, availability-aware booking, recurring events and Kanban boards, all bound to Eloquent.
tags: [Laravel, Livewire, FilamentPHP, Scheduling, Calendar, Gantt, Kanban, Commercial]
image: "/images/my_projects/scheduler-pro/cover.webp"
createdAt: 2026-10-07T00:00:00.000Z
updatedAt: 2026-10-07T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## Scheduler Pro – Scheduling and Kanban for Filament

### Overview

Every booking app I have built ends up needing the same screen: people or rooms down the side, time across the top, and a guarantee that nobody gets booked twice. Scheduler Pro is that screen, packaged as a Filament plugin.

It adds a scheduler widget and Kanban boards to any Filament 4 or 5 panel. Both read and write your existing Eloquent models, and every create, edit and delete goes through native Filament actions, so your forms, policies and validation keep working.

![A front desk schedule: dentists, hygienists and rooms on the left, appointments on a day timeline with the current time marked](/images/my_projects/scheduler-pro/cover.webp)

### Key Features

- **Seven views** – Timeline day, week and month, calendar week and month, agenda, and a Gantt mode with dependency arrows, progress bars and milestones
- **Conflict prevention** – Double bookings are refused, with optional buffers between events and your own validation rules, for drags, keyboard moves and modals alike
- **Availability and time off** – Working hours and leave are drawn on the grid, and bookings outside them can be refused
- **Recurring events** – Daily, weekly, monthly and yearly series, with "this event" or "all events" changes
- **Kanban boards** – Saved views with live counts, user-managed columns like GitHub Projects, swimlanes, WIP limits and allowed transitions
- **Keyboard first** – Navigate, move events, filter and zoom from the keyboard, with screen reader announcements on the board
- **One command to start** – `php artisan make:scheduler` generates a working widget from your tables

![A Kanban board with user-managed columns, rich cards and saved views](/images/my_projects/scheduler-pro/kanban.webp)

### Technologies Used

- **Laravel 11–13** – Backend framework
- **FilamentPHP 4 and 5** – Panel, actions and schema layer, supported from one codebase
- **Livewire** – Widget endpoints are plain Livewire methods, easy to test with Pest
- **Tailwind CSS** – Follows the panel's colors, radius, font and dark mode, and mirrors for RTL
- **Multi-tenancy and time zones** – Queries are scoped to the current Filament tenant, and times show in each user's time zone
- **Translations** – Ships English, French and Arabic

![Clicking an event opens a slide-over with its details, Edit and Delete](/images/my_projects/scheduler-pro/event.webp)

### Get Started

```bash
composer require hoceineel/filament-scheduler-pro
php artisan filament:assets
php artisan make:scheduler FrontDeskSchedule --model=Appointment --resource=Staff
```

Documentation, pricing and the changelog live at [scheduler-pro.hoceine.com](https://scheduler-pro.hoceine.com?ref=portfolio). It is my second commercial Filament plugin, after [FilamentCraft](/projects/filamentcraft).
