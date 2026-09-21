---
title: Eisar Reserve - نظام حجز الغرف
description: تعرّف على ميزات Eisar Reserve وخطوات تثبيته، وهو نظام لحجز الغرف طوّره حسين الإدريسي.
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

# Eisar Reserve - نظام حجز الغرف

## خطوات التثبيت

1. **استنسخ مستودع Git:**

   ```bash
   git clone https://github.com/HoceineEl/EisarReserve.git
   ```

2. **انتقل إلى مجلد المشروع:**

   ```bash
   cd EisarReserve
   ```

3. **انسخ ملف البيئة:**

   ```bash
   cp .env.example .env
   ```

4. **ثبّت اعتماديات PHP:**

   ```bash
   composer install
   ```

5. **ولّد مفتاح التطبيق:**

   ```bash
   php artisan key:generate
   ```

6. **شغّل ملفات الترحيل (migrations) مع البيانات الأولية (seeding):**

   ```bash
   php artisan migrate:fresh --seed
   ```

7. **ثبّت اعتماديات Node.js:**

   ```bash
   npm install
   ```

8. **ابنِ ملفات الواجهة (assets):**

   ```bash
   npm run build
   ```

9. **أنشئ رابطًا رمزيًا لمجلد التخزين:**

   ```bash
   php artisan storage:link
   ```

## الاستخدام

Eisar Reserve نظام متكامل لحجز الغرف، صُمّم لتبسيط إدارة الحجوزات. يستطيع المستخدمون من خلاله إجراء الحجوزات، وإدارتها، واستكشاف ميزات متعددة.

## الميزات

1. **إدارة المباني:**

   - إنشاء المباني وعرضها وتعديلها وحذفها.

2. **إدارة الغرف:**

   - عمليات CRUD لإدارة الغرف داخل المباني.
   - عرض تفاصيل الغرفة، بما فيها الصور.

3. **تسعير الغرف حسب المواسم:**

   - تحديد أسعار الغرف وفق تاريخي بداية الموسم ونهايته.

4. **إدارة الإضافات:**

   - عمليات CRUD لإدارة إضافات الغرف (مثل الفطور والتدليك).
   - تحديد سعر لكل إضافة.

5. **إدارة الحجوزات:**

   - عمليات CRUD للتعامل مع الحجوزات.
   - حساب السعر بناءً على تاريخ الحجز والإضافات المختارة.
   - حالات حجز مختلفة (قيد الانتظار، مدفوع، ملغى).

6. **إدارة المستخدمين:**

   - عمليات CRUD لإدارة المستخدمين.
   - إسناد الأدوار (مدير، موظف حجوزات، ضيف) للتحكم في الصلاحيات.

7. **الوصول حسب الدور:**

   - لكل دور صلاحيات محددة.
   - للمدير وصول كامل، ويدير موظفو الحجوزات الحجوزات، ويستطيع الضيوف طلب حجز الغرف.

8. **نماذج وجداول تفاعلية:**

   - نماذج سهلة لإدخال البيانات تفاعليًا.
   - جداول تسهّل عرض البيانات وإدارتها.

9. **لوحة تحكم بالرسوم البيانية والإحصاءات:**

   - لوحة تحكم تتكيّف مع دور المستخدم.
   - رسوم بيانية وإحصاءات تكشف مؤشرات الحجوزات والأسعار وغيرها من البيانات المهمة.

10. **مسار الحجز:**

    - يطّلع الضيوف على تفاصيل الغرفة ويبدؤون الحجز.
    - يدير موظفو الحجوزات الحجوزات المعلّقة ويحدّثون حالتها بعد الدفع.

11. **تحميل الغرف أثناء التمرير:**

    - تُحمَّل الغرف في صفحة حجز الضيف أثناء التمرير باستخدام Livewire.

    ![Rooms Loading on Scroll](/images/my_projects/eisar-reserve/book.gif)

## لقطات الشاشة

### لوحة التحكم

**المدير**
<MdImage text="/images/my_projects/eisar-reserve/dashboard.png" alt="Dashboard for Manager - Eisar Reserve by Hoceine el Idrissi"></MdImage>

**موظف الحجوزات**
<MdImage text="/images/my_projects/eisar-reserve/res-dash.png" alt="Dashboard for Reservator - Eisar Reserve by Hoceine el Idrissi"></MdImage>

**الضيف**
<MdImage text="/images/my_projects/eisar-reserve/guest-dash.png" alt="Dashboard for Guest - Eisar Reserve by Hoceine el Idrissi"></MdImage>

**لوحة التحكم الداكنة**
<MdImage text="/images/my_projects/eisar-reserve/dark.png" alt="Dark Dashboard - Eisar Reserve by Hoceine el Idrissi"></MdImage>

### إدارة الغرف

<MdImage text="/images/my_projects/eisar-reserve/rooms-list.png" alt="Room Management List - Eisar Reserve by Hoceine el Idrissi"></MdImage>

<MdImage text="/images/my_projects/eisar-reserve/rooms-create-1.png" alt="Room Creation Step 1 - Eisar Reserve by Hoceine el Idrissi"></MdImage>

<MdImage text="/images/my_projects/eisar-reserve/room-create-2.png" alt="Room Creation Step 2 - Eisar Reserve by Hoceine el Idrissi"></MdImage>

### نموذج الحجز

<MdImage text="/images/my_projects/eisar-reserve/res-list.png" alt="Reservation Form List - Eisar Reserve by Hoceine el Idrissi"></MdImage>

<MdImage text="/images/my_projects/eisar-reserve/res-create.png" alt="Reservation Form Creation - Eisar Reserve by Hoceine el Idrissi"></MdImage>

### قاعدة البيانات

<MdImage text="/images/my_projects/eisar-reserve/db.png" alt="Database Screenshot - Eisar Reserve by Hoceine el Idrissi"></MdImage>

### السمات

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

### الحجز مع التمرير اللانهائي

<MdImage text="/images/my_projects/eisar-reserve/book.gif" image-type="gif" alt="Booking Infinite Scrolling - Eisar Reserve by Hoceine el Idrissi"></MdImage>

## الإشادة

طوّر حسين الإدريسي نظام EisarReserve. لمزيد من المعلومات واستكشاف مشاريع أخرى، زر [موقع حسين](https://hoceine.com).
