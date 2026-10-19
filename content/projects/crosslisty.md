---
title: Crosslisty – Crosslisting Extension for Resellers
description: My browser extension that imports a listing from one marketplace and fills in the listing form on eBay, Poshmark, Mercari, Depop, Etsy, Vinted and Facebook, photos included, then removes sold items everywhere else.
tags: [Browser Extension, E-commerce, Resellers, SaaS, Paddle]
image: "/images/my_projects/crosslisty/cover.webp"
createdAt: 2026-10-19T00:00:00.000Z
updatedAt: 2026-10-19T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## Crosslisty – Crosslisting Extension for Resellers

### Overview

Resellers sell the same item on several marketplaces at once, because whichever one finds the buyer first wins. That means typing the same title, description, price, brand and size into seven different forms, uploading the same photos seven times, and then remembering to take the item down everywhere once it sells.

Crosslisty is a browser extension that does the repetitive part. It copies a listing from one marketplace and fills in the listing form on the next, photos included. The reseller checks the details and presses the marketplace's own post button.

I built it alone and run it as my own product. It works with eBay, Poshmark, Mercari, Depop, Etsy, Vinted (including its European sites) and Facebook, in Chrome, Brave and Edge.

![The Crosslisty landing page: one eBay listing filled on six more marketplaces](/images/my_projects/crosslisty/cover.webp)

### How it works

1. **Import.** Open any listing and click *Import to Crosslisty*. Photos, title, description, price, brand, size and condition are saved.
2. **Send.** Press one marketplace, or *Send to all 6*. Crosslisty opens each marketplace's listing form in its own tab.
3. **Check and post.** Each form fills itself in, category and condition included. A checklist shows what was filled and what still needs a look, with a button that jumps to each field.

It runs in the reseller's own browser, with the accounts they are already signed in to. There are no passwords to hand over, and listings are stored in the browser, never sent to a server.

![The inventory and the checklist shown after a form is filled on Poshmark](/images/my_projects/crosslisty/how-it-works.webp)

### What it handles

- **Photos come along**: full-size photos are uploaded to the new listing, up to each marketplace's limit
- **Fits each marketplace**: titles are shortened to each site's limit, and brand, size and condition are added to the description
- **Dropdowns picked**: category, condition, brand and size pickers are filled where the marketplace offers them
- **Sold once, removed everywhere**: while the browser is open, sales are checked every 15 minutes. A sale only counts after the marketplace confirms it twice. The item is then removed from Poshmark, Mercari, Depop and Vinted, and eBay, Etsy and Facebook open in one click to end the listing
- **Price per marketplace**: raise or lower the price by a percentage to cover each marketplace's fees
- **Keyboard first**: search the inventory with `/`, move with the arrow keys, send with Enter, or press 1 to 6 for one marketplace

![The full list of what Crosslisty does for each listing](/images/my_projects/crosslisty/features.webp)

### Never posts on its own

Crosslisty only fills in forms, the same as typing them by hand. The reseller always presses the post button, and a sold item is removed from other marketplaces only after they say yes, unless they turn on automatic removal.

### Try it

The free plan gives 5 fills a day on all seven marketplaces, with no card. Pro is $9 a month or $89 a year for unlimited crosslisting on up to 3 browsers, billed through Paddle. It's at [crosslisty.com](https://crosslisty.com?ref=portfolio).
