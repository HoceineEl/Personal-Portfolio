---
title: fsprécompta – Pre-Accounting for Moroccan Firms, Connected to FS COMPTA
description: The web companion of FS COMPTA. Clients send invoices from their accounting firm's own app, each document is read and checked for ICE, VAT and duplicates, and FS COMPTA picks up the prepared entries. Built on my own as a partner of Facile Solution.
tags: [Laravel, PWA, Accounting, Morocco, Multi-tenancy, SaaS, Arabic, RTL]
image: "/images/my_projects/fsprecompta/cover.webp"
createdAt: 2026-10-17T00:00:00.000Z
updatedAt: 2026-10-17T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## fsprécompta – Pre-Accounting for Moroccan Firms, Connected to FS COMPTA

### Overview

At the end of the month, an accounting firm's documents arrive in plastic bags. Blurry photos on WhatsApp, missing pages, the same invoice sent twice, and phone calls to chase what's still missing. Most of the work happens before anyone types an entry.

fsprécompta handles everything that happens before [FS COMPTA](https://fsprecompta.ma?ref=portfolio), the accounting software used by Moroccan firms. The firm's clients send their invoices from an app with the firm's name on it. Each document is read, checked, and prepared as a journal entry, and FS COMPTA picks it up.

I'm a partner of Facile Solution, the company behind FS COMPTA, and I built fsprécompta on my own.

![The fsprécompta landing page, with an invoice going from the client's phone to the FS COMPTA purchase journal](/images/my_projects/fsprecompta/cover.webp)

### The journey of one invoice

1. **The client sends it.** A photo, a PDF or a file, from the firm's app on their phone. They can also forward it on WhatsApp.
2. **It is read.** Supplier, ICE, IF, number, date, amounts before tax, VAT per rate and the total are filled in within seconds, in French or Arabic.
3. **It is checked.** The ICE is validated, the supplier recognized, VAT recalculated rate by rate, and duplicates blocked. Anything that doesn't add up goes back to the firm. Nothing is validated blindly.
4. **The entry is prepared** with the firm's chart of accounts (CGNC) and the entry templates from FS COMPTA. An accountant reviews and validates it.
5. **FS COMPTA picks it up.** Validated entries and their documents go to FS COMPTA and are marked as synced, so they are never imported twice.

![An invoice being read: supplier, ICE, date and amounts extracted, then checked](/images/my_projects/fsprecompta/reading.webp)

### The firm's own app

Clients don't install "a piece of software". They install their firm's app, with the firm's name, logo and address on its own subdomain. It installs from the browser without an app store, receives notifications, and runs fully in Arabic, right to left, when the client prefers it.

Questions stay attached to the document they're about. When a page is missing, the firm marks the invoice as "to resend" with the reason, and the client sees it at the top of their screen. WhatsApp messages respect Casablanca business hours.

![The client app: the firm's branding on the home screen, and what the client sees each month](/images/my_projects/fsprecompta/client-app.webp)

### A bridge with FS COMPTA, both ways

FS COMPTA stays the firm's production software, on the firm's Windows machine. It sends the chart of accounts, clients and suppliers, and entry templates. It gets back validated entries, supporting documents and reconciliations. Validated entries are sealed, and any change leaves a trace. Firms on other software can export entries as CSV or FEC.

![The two-way bridge between fsprécompta and FS COMPTA](/images/my_projects/fsprecompta/bridge.webp)

### Around the entries

- **Sales invoices**: clients invoice from their space, with ICE, the amount in words, sending by email or WhatsApp, and automatic reminders from 7 days before to 30 days after the due date
- **VAT returns**: prepared from validated documents, by the client's regime and rate, with the deductions statement in the SIMPL-TVA XML format
- **Team and portfolios**: each collaborator sees their own files, with the rights the firm gives them and two-factor authentication when required
- **Local backup**: a copy of every document in a folder on the firm's PC, restorable in one click

### Built for Moroccan accounting

ICE and IF checks, multiple VAT rates, the CGNC chart of accounts, cash or accrual basis, FEC and CSV export, and French, Arabic and English interfaces.

### Try it

Pricing is per client file, from 300 MAD per client per year. It's live at [fsprecompta.ma](https://fsprecompta.ma?ref=portfolio).
