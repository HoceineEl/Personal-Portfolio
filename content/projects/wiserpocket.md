---
title: WiserPocket – AI Finance Tracker for Web, iOS and Android
description: An AI finance tracker with voice input and receipt scanning, built with Laravel, Inertia and React on the web and NativePHP for native iOS and Android apps.
tags: [Laravel, React, Inertia, NativePHP, Filament, AI, Mobile, Finance]
noImage: true
createdAt: 2025-11-27T00:00:00.000Z
updatedAt: 2026-09-19T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## WiserPocket

### What it is

WiserPocket is a personal finance tracker you can talk to. Say "twelve dirhams for coffee" or photograph a receipt, and the transaction is logged and categorised. Then ask the assistant how your month is going, and it answers from your own data.

It runs on the web as an installable app, and as a native app for iOS and Android built with NativePHP, from the same Laravel codebase.

### What's inside

- **Voice and receipt input** – Log spending by speaking or by scanning a receipt, no forms required
- **An AI assistant with memory** – Ask questions about your spending, powered by Gemini through `laravel/ai`
- **Budgets, goals and debts** – Recurring transactions, savings goals and debt tracking in one place
- **Insights and statistics** – Where the money goes, month over month
- **Four languages** – English, Arabic, French and Spanish, with full right-to-left support
- **Free calculators** – 50/30/20 budget, take-home pay, debt payoff and compound interest, open to everyone
- **Passkeys and social sign-in** – WebAuthn and Google login alongside email

### The mobile app

The iOS and Android app is a NativePHP Mobile project that talks to the web app through a versioned API secured with Sanctum tokens. It uses native plugins for the camera, the microphone, sharing, network status, local notifications and in-app review. Getting the signed Android release from roughly 111 MB down to 34 MB took a careful pass over what actually needs to ship on the device.

### Built with

- **Laravel 12** – Backend, API and queues
- **Inertia and React 19** – Web interface
- **NativePHP Mobile** – Native iOS and Android app
- **Filament 4** – Internal admin
- **Tailwind CSS 4** – Styling
- **Paddle** – Subscriptions

### Try it

Visit [wiserpocket.com](https://wiserpocket.com).
