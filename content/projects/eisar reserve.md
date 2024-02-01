---
title: Eisar Reserve - Room Reservation System
description: Explore the features and installation steps of Eisar Reserve, a room reservation system developed by Hoceine EL Idrissi.
tags:
  [
    Hoceine el Idrissi,
    Web Development,
    Laravel,
    Tailwind CSS,
    Livewire,
    Filament,
    Room Reservation,
    Full Stack,
  ]
image: "/images/my_projects/eisar-reserve/mockup.jpg"
createdAt: 2024-01-23T00:00:00.000Z
updatedAt: 2024-01-23T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

# Eisar Reserve - Room Reservation System

## Installation Steps

1. **Clone the Git repository:**

   ```bash
   git clone https://github.com/HoceineEl/EisarReserve.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd EisarReserve
   ```

3. **Copy the environment file:**

   ```bash
   cp .env.example .env
   ```

4. **Install PHP dependencies:**

   ```bash
   composer install
   ```

5. **Generate the application key:**

   ```bash
   php artisan key:generate
   ```

6. **Migrate the database with seeding:**

   ```bash
   php artisan migrate:fresh --seed
   ```

7. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

8. **Build the assets:**

   ```bash
   npm run build
   ```

9. **Create a symbolic link to the storage:**

   ```bash
   php artisan storage:link
   ```

## Usage

Eisar Reserve is a comprehensive room reservation system designed to simplify the process of managing bookings. Users can interact with the system to make reservations, manage bookings, and explore various features.

## Features

1. **Building Management:**

   - Create, view, update, and delete buildings.

2. **Room Management:**

   - CRUD operations for managing rooms within buildings.
   - Display room details, including images.

3. **Season-Based Room Pricing:**

   - Define pricing for rooms based on seasonal start and end dates.

4. **Add-On Management:**

   - CRUD operations for managing room add-ons (e.g., breakfast, massage).
   - Set prices for each add-on.

5. **Reservation Management:**

   - CRUD operations for handling reservations.
   - Pricing calculated based on booking date and selected add-ons.
   - Different reservation statuses (Pending, Paid, Canceled).

6. **User Management:**

   - CRUD operations for managing users.
   - Assign roles (Admin, Reservations Staff, Guest) to control permissions.

7. **Role-Based Access:**

   - Different roles have specific permissions.
   - Admins have full access, reservations staff manage reservations, and guests can make room requests.

8. **Interactive Forms and Tables:**

   - User-friendly forms for interactive data entry.
   - Tables for easy data visualization and management.

9. **Dashboard with Charts and Stats:**

   - Dashboard tailored to user roles.
   - Charts and statistics for insights into reservations, pricing, and other relevant data.

10. **Reservation Process:**

    - Guests can view room details and initiate reservations.
    - Reservators manage pending reservations and update status after payment.

11. **Rooms Loading on Scroll:**

    - The rooms in the guest booking are loading on scroll using Livewire.

    ![Rooms Loading on Scroll](/images/my_projects/eisar-reserve/book.gif)

## Screenshots

### Dashboard

**Manager**
<MdImage text="/images/my_projects/eisar-reserve/dashboard.png" alt="Dashboard for Manager - Eisar Reserve by Hoceine el Idrissi"></MdImage>

**Reservator**
<MdImage text="/images/my_projects/eisar-reserve/res-dash.png" alt="Dashboard for Reservator - Eisar Reserve by Hoceine el Idrissi"></MdImage>

**Guest**
<MdImage text="/images/my_projects/eisar-reserve/guest-dash.png" alt="Dashboard for Guest - Eisar Reserve by Hoceine el Idrissi"></MdImage>

**Dark Dashboard**
<MdImage text="/images/my_projects/eisar-reserve/dark.png" alt="Dark Dashboard - Eisar Reserve by Hoceine el Idrissi"></MdImage>

### Room Management

<MdImage text="/images/my_projects/eisar-reserve/rooms-list.png" alt="Room Management List - Eisar Reserve by Hoceine el Idrissi"></MdImage>

<MdImage text="/images/my_projects/eisar-reserve/rooms-create-1.png" alt="Room Creation Step 1 - Eisar Reserve by Hoceine el Idrissi"></MdImage>

<MdImage text="/images/my_projects/eisar-reserve/room-create-2.png" alt="Room Creation Step 2 - Eisar Reserve by Hoceine el Idrissi"></MdImage>

### Reservation Form

<MdImage text="/images/my_projects/eisar-reserve/res-list.png" alt="Reservation Form List - Eisar Reserve by Hoceine el Idrissi"></MdImage>

<MdImage text="/images/my_projects/eisar-reserve/res-create.png" alt="Reservation Form Creation - Eisar Reserve by Hoceine el Idrissi"></MdImage>

### DataBase

<MdImage text="/images/my_projects/eisar-reserve/db.png" alt="Database Screenshot - Eisar Reserve by Hoceine el Idrissi"></MdImage>

### Themes

**Nord**
<MdImage text="/images/my_projects/eisar-reserve/nord-light.png" alt="Nord Theme - Light - Eisar Reserve by Hoceine el Idrissi"></MdImage>

<MdImage text="/images/my_projects/eisar-reserve/nord.png" alt="Nord Theme - Eisar Reserve by Hoceine el Idrissi"></MdImage>

**Default**
<MdImage text="/images/my_projects/eisar-reserve/default.png" alt="Default Theme - Eisar Reserve by Hoceine el Idrissi"></MdImage>

**Drakula**
<MdImage text="/images/my_projects/eisar-reserve/drakula.png" alt="Drakula Theme - Eisar Reserve by Hoceine el Idrissi"></MdImage>

**Sunset**
<MdImage text="/images/my_projects/eisar-reserve/sunset.png" alt="Sunset Theme - Eisar Reserve by Hoceine el Idrissi"></MdImage>

<MdImage text="/images/my_projects/eisar-reserve/sunset-dark.png" alt="Sunset Theme - Dark - Eisar Reserve by Hoceine el Idrissi"></MdImage>

### Booking Infinite Scrolling

<MdImage text="/images/my_projects/eisar-reserve/book.gif" image-type="gif" alt="Booking Infinite Scrolling - Eisar Reserve by Hoceine el Idrissi"></MdImage>

## Credit

This system, EisarReserve, was developed by Hoceine EL Idrissi. For more information and to explore other projects, visit [Hoceine's website](https://hoceine.com).
