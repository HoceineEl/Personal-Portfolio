---
title: Dukanos – Store, Till and WhatsApp Orders for Small Shops
description: My SaaS for shops that sell online and over the counter, with an AI that takes orders on WhatsApp, a POS, multi-warehouse stock, and storefronts built on FilamentCraft.
tags: [Laravel, FilamentPHP, FilamentCraft, E-commerce, POS, WhatsApp, AI, Multi-tenancy, SaaS]
image: "/images/my_projects/dukanos/cover.webp"
createdAt: 2026-10-03T00:00:00.000Z
updatedAt: 2026-10-03T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## Dukanos – Store, Till and WhatsApp Orders for Small Shops

### Overview

Most shops I know around me sell in three places at once: the counter, WhatsApp, and sometimes a website. The orders end up in a notebook, a chat history and an inbox, and the stock count is wrong by Friday.

Dukanos puts all of that on one board. A customer can order on the website, send a WhatsApp voice note, call, or walk in, and the order lands in the same place. Selling at the till takes the item out of the same stock the website reads.

I built it alone and I run it as my own product. It works in Arabic, English and French, and it picks the currency, tax rate and date format from the shop's country.

### Built on FilamentCraft

Every shop gets a storefront on its own domain, and those storefronts are made with [FilamentCraft](https://filamentcraft.dev?ref=portfolio), the Filament page builder I sell. Shop owners pick sections, change the text and colors, and publish without writing code. Dukanos ended up being the biggest real test for FilamentCraft's store sections, and a good part of its commerce features came from needs I hit here first.

### What a shop gets

- **A storefront** on its own domain with SSL, 30 sections to build pages from, order tracking, and delivery or pickup
- **A WhatsApp assistant** that answers questions about products and stock, takes the order, understands voice notes and shared locations, and leaves personal chats for the owner
- **One order board** for website, WhatsApp, phone and counter orders, moving from confirmed to packed to shipped, with a notification on the owner's phone even when the tab is closed
- **A point of sale** with barcode scanning, keyboard shortcuts, parked carts, split payments and receipt printing
- **Stock across warehouses**, with transfers, counts that show the difference, product variants, and purchase orders from suppliers
- **CSV and Excel imports** for products, customers and suppliers, so nobody retypes a catalog

![The order board, with orders from WhatsApp, the website, the phone and the counter](/images/my_projects/dukanos/orders.webp)

![The point of sale and a printed receipt](/images/my_projects/dukanos/pos.webp)

### Stack

- **Laravel** with multi-tenancy, one platform and a separate store per shop
- **FilamentPHP** for the dashboard and the POS
- **FilamentCraft** for the storefronts
- **An AI model on the WhatsApp side** for conversations, voice notes and turning a chat into an order

### Try it

Plans start at $15 a month, and there is a 14-day trial with no card. It's live at [dukanos.com](https://dukanos.com?ref=portfolio).
