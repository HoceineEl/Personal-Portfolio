---
title: Nokhbat Alhoffaz – Quran and Book-Reading Circles App
description: A phone-first, installable web app for Quran memorisation and book-reading circles, with voice recitations, Tajweed mushaf pages, streaks and push reminders.
tags: [Laravel, React, Inertia, Filament, PWA, Arabic UI, Quran]
noImage: true
createdAt: 2026-09-04T00:00:00.000Z
updatedAt: 2026-09-19T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## Nokhbat Alhoffaz (نخبة الحفاظ)

### What it is

Quran memorisation circles (حلقات) have always run on paper notebooks and WhatsApp voice notes. Nokhbat Alhoffaz moves the whole daily loop into one app that lives on the phone's home screen: the teacher sets the portion, the student recites, the teacher listens and replies.

It also runs book-reading circles (سرد الكتب), where the daily task is a set of pages to read instead of verses to memorise.

### How a day works

- **The teacher publishes the day's portion** – Verses mapped onto coloured Tajweed mushaf pages (Warsh narration), a hizb or quarter range, or a rest day. The app suggests the next portion automatically.
- **Students recite** – A voice recording for memorisation, or a one-tap "done" for revision and reading days.
- **Teachers reply** – By voice or text, with an emoji reaction and a score only the student can see.
- **Everything else is derived** – Attendance and streaks come from what students actually submitted, no roll call needed.
- **Nobody forgets** – Push reminders before the circle closes, and an alert to the teacher when a student misses three days in a row.

### Details that matter

- Separate men's and women's circles, with admin, circle manager, teacher and student roles
- Arabic first, fully right-to-left, with French as a second language
- Audio is compressed to AAC with FFmpeg so recitations stay small on slow connections
- Works offline for the basics and installs like a native app

### Built with

- **Laravel 13 and PHP 8.4** – Backend and queues
- **Inertia 3, React 19 and TypeScript** – Phone-first interface with shadcn/ui
- **Filament 5** – Administration
- **Web Push and vite-plugin-pwa** – Installable app with notifications
- **Pest and Playwright** – Tests
