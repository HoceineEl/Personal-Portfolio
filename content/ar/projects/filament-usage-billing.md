---
title: Usage Billing – اشتراكات حسب الاستهلاك لـ Filament
description: حزمة مجانية لـ Filament 5 لفوترة الاشتراكات حسب الاستهلاك في التطبيقات متعددة المستأجرين. لكل خطة حصة في كل وحدة، وما زاد يُفوتر في فاتورة شهرية، والاستهلاك يُحسب من جداولك أنت.
tags: [Laravel, FilamentPHP, Filament Plugin, Billing, Subscriptions, Multi-tenancy, Open Source]
image: "/images/my_projects/filament-usage-billing/cover.webp"
createdAt: 2026-10-19T00:00:00.000Z
updatedAt: 2026-10-19T00:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## فوترة الاستهلاك لـ Filament

### ما الذي تفعله

يشترك المستأجر في خطة، وتتضمن الخطة حصة لكل وحدة فيها، وما يتجاوز الحصة يُفوتر سطرًا إضافيًا في فاتورة شهرية. ويمكن تقسيم الاستهلاك حسب ما يحتاجه التطبيق، كالعميل أو المشروع أو الموقع، دون أن تعرف الحزمة ما هو.

وتضيف الحزمة إلى لوحتك المركزية شاشات لإدارة الخطط والوحدات والاشتراكات والفواتير والمدفوعات.

### الاستهلاك يأتي من جداولك

كل وحدة تجيب عن سؤال واحد: كم استهلك هذا المستأجر مني بين هذين التاريخين، ولصالح من؟ وهذا الاستعلام هو المرجع في الفوترة. أما العدّاد المخزّن بجانبه فوظيفته تسريع أشرطة الحصة وفحص الحدود فقط، ويُعاد حسابه عند إغلاق الفترة قبل إنشاء الفاتورة.

ولهذا ثلاث نتائج:

- لا يمكن لمهمة أُعيد تشغيلها أن تُفوتر مرتين، إذ لا توجد زيادة تُكرَّر
- العمل الذي فشل يستبعده استعلام الوحدة نفسه، فلا حاجة إلى قيود عكسية
- كل سطر في الفاتورة يمكن إعادة بنائه من السجلات الفعلية حتى بعد أشهر

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

ويمكن أن تكون الوحدة لقطة لحالة لا تدفقًا مستمرًا، كعدد المقاعد الذي يُقاس في نهاية الفترة.

### أشكال التسعير

لكل خطة سطر لكل وحدة، وأشكاله أربعة: غير محدود ولا يُفوتر، أو تجاوز مرن بسعر للوحدة، أو تجاوز حتى سقف ثابت، أو إيقاف عند بلوغ الحصة. والوحدة الغائبة عن الخطة تعني أن الميزة معطلة لمشتركيها.

### التحقق من الصلاحية

```php
$organization->canUse('ocr');
$organization->ensureCanUseQuantity('ocr', 40);
$organization->usageSummary();
```

عند رفض الوصول، يوضح الاستثناء السبب (لا اشتراك، أو الوحدة ليست في الخطة، أو بلوغ السقف، أو الاشتراك غير نشط)، فتعرض الواجهة رسالة مفيدة. وتُنسخ بيانات الفوترة إلى كل فاتورة عند إصدارها، فلا يغيّر أي تصحيح لاحق مستندًا أُرسل من قبل.

### التثبيت

الحزمة ليست على Packagist بعد، لذا أضف مستودع GitHub إلى `composer.json` أولًا:

```json
"repositories": [
    { "type": "vcs", "url": "https://github.com/HoceineEl/filament-usage-billing" }
]
```

```bash
composer require hoceineel/filament-usage-billing
php artisan migrate
```

الاشتراكات مدفوعة مسبقًا، وأوامر مجدولة تصدر التجديدات وتنهي الفترات التجريبية وتنهي الاشتراكات المنتهية وتعلّم الفواتير المتأخرة وتغلق فترات الاستهلاك. تدعم Laravel 12 و 13 مع Filament 5. برخصة MIT، على [GitHub](https://github.com/HoceineEl/filament-usage-billing).
