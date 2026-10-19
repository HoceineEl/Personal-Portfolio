---
title: Usage Billing – Metered Subscriptions for Filament
description: A free Filament 5 package for metered, modular subscription billing in multi-tenant apps. Plans carry an allowance per module, overage is billed on a monthly invoice, and usage is worked out from your own tables.
tags: [Laravel, FilamentPHP, Filament Plugin, Billing, Subscriptions, Multi-tenancy, Open Source]
image: "/images/my_projects/filament-usage-billing/cover.webp"
createdAt: 2026-10-19T00:00:00.000Z
updatedAt: 2026-10-19T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## Usage Billing for Filament

### What it does

A tenant subscribes to a plan. The plan includes an allowance for each module it carries, and usage past that allowance is billed as an overage line on a monthly invoice. Usage can be broken down by whatever the app needs, such as a client, a project or a site, without the package knowing what that thing is.

The package registers operator screens on your central panel for plans, modules, subscriptions, invoices and payments.

### Usage comes from your own tables

Each module answers one question: how much of me did this tenant use between these two dates, and who was it for? That query is the billing authority. A counter cache sits beside it only to make allowance bars and limit checks cheap, and closing a period recomputes it before an invoice is built.

That has three consequences:

- A retried job cannot bill twice, because there is no increment to replay
- Work that failed is excluded by the module's own query, so there are no reversal rows
- Every invoice line can be rebuilt from real records months later

```php
class OcrModule implements MeteredModule
{
    public static function key(): string { return 'ocr'; }

    public function usage(Model $subscriber, CarbonImmutable $from, CarbonImmutable $to): Collection
    {
        return Document::query()
            ->where('organization_id', $subscriber->getKey())
            ->whereBetween('created_at', [$from, $to])
            ->where('status', '!=', DocumentStatus::Failed)
            ->get()
            ->groupBy('client_id')
            ->map(fn ($rows, $clientId) => UsageBucket::for(Client::find($clientId), $rows->count()))
            ->values();
    }
}
```

Modules can also be snapshots, for things that are a state rather than a stream, like a seat count measured at the end of the period.

### Pricing shapes

Each plan has a row per module, and there are four shapes: unlimited and never billed, soft overage at a unit price, overage up to a hard ceiling, or blocked at the allowance. A module left out of a plan means the feature is off for its subscribers.

### Gating

```php
$organization->canUse('ocr');
$organization->ensureCanUseQuantity('ocr', 40);
$organization->usageSummary();
```

When access is denied, the exception says why (no subscription, module not in the plan, ceiling reached, subscription inactive), so the interface can show something useful. Billing details are snapshotted onto each invoice when it is issued, so a later correction never rewrites a document that was already sent.

### Install

It isn't on Packagist yet, so add the GitHub repository to `composer.json` first:

```json
"repositories": [
    { "type": "vcs", "url": "https://github.com/HoceineEl/filament-usage-billing" }
]
```

```bash
composer require hoceineel/filament-usage-billing
php artisan migrate
```

Terms are prepaid, and scheduled commands issue renewals, end trials, expire subscriptions, mark invoices overdue and close usage periods. It supports Laravel 12 and 13 on Filament 5. MIT licensed, on [GitHub](https://github.com/HoceineEl/filament-usage-billing).
