---
title: Sendoff – Email Signatures for People and Teams
description: My SaaS for email signatures. A free generator with 62 inbox-safe templates for Gmail, Outlook and Apple Mail, and a team plan that deploys signatures through Google Workspace and Microsoft 365, in six languages with Arabic right to left.
tags: [Laravel, Inertia, SaaS, Email, Google Workspace, Microsoft 365, Arabic, RTL]
image: "/images/my_projects/sendoff/cover.webp"
createdAt: 2026-10-19T00:00:00.000Z
updatedAt: 2026-10-19T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## Sendoff – Email Signatures for People and Teams

### Overview

An email signature looks simple until it has to look the same in Gmail, in Outlook's Word-based renderer and in Apple Mail, fit Gmail's 10,000-character limit, and stay consistent across a whole company when people change titles or join and leave.

[Sendoff](https://usesendoff.com?ref=portfolio) handles both sides. Anyone can make a professional signature for free in the browser, without an account. Teams get one place to design, lock and deploy everyone's signature. I built it and run it as my own product.

![The Sendoff home page, with a live signature preview](/images/my_projects/sendoff/cover.webp)

### The free generator

The generator is the product itself, open to everyone. Switch templates and your details stay, copy the finished signature in one click or copy its HTML, check it in a dark inbox, preview it as Gmail, Outlook or plain text, and see the size against Gmail's limit as you type.

![The free generator with a Gmail preview](/images/my_projects/sendoff/generator.webp)

Signatures are built from email-safe tables with inline styles, the format Outlook's Word engine understands. Every template mirrors for right-to-left, so the same signature flips to Arabic with one switch.

![The same signature in Arabic, right to left](/images/my_projects/sendoff/arabic.webp)

### 62 templates

There are 62 original templates, filterable by style (minimal, elegant, bold, with headshot, with banner) and by industry, with an Arabic preview for each.

![The template gallery, filtered by style and industry](/images/my_projects/sendoff/templates.webp)

### For teams

- **One click updates everyone**: change the template once, and Sendoff re-renders every signature and pushes it to Gmail through Google Workspace
- **New hires get theirs on day one**: directory sync from Google or Microsoft creates signatures for new people and retires leavers
- **Locked where it matters**: admins own the design and the disclaimer, and people edit only their name, title and phone
- **No mail rerouting**: signatures are written into Gmail settings or added by an Outlook add-in, so email never passes through Sendoff
- **Scheduled banners**: a short notice under everyone's signature for set dates, like a new address or holiday hours, that comes down on its own

![One locked template across a team, in English and Arabic](/images/my_projects/sendoff/team.webp)

### Pricing

Free forever for one signature, with a small "Made with Sendoff" line. Solo is $6 a month billed yearly and removes the line and adds PRO templates. Team is $2 per person per month billed yearly, for teams of five or more, with a 7-day trial. The interface is in English, Arabic, Spanish, French, Portuguese and German.

### Stack

- **Laravel** with **Inertia** for the app
- **Google Workspace** and **Microsoft 365** integrations for deployment and directory sync

It's live at [usesendoff.com](https://usesendoff.com?ref=portfolio).
