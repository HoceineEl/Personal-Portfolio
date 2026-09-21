---
title: تبسيط التعلّم - تحسين عرض الفيديو في منصة LMS
description: دمج HLS في نظام لإدارة التعلّم باستخدام ffmpeg و hls.js و Plyr، مع إدارة دورة حياة الفيديو، والعلامة المائية، واقتطاع مقطع تجريبي، والترميز بمعدلات بت مختلفة، والتقسيم إلى مقاطع، والتحويل إلى صيغة HLS، والتخزين في MySQL، والمعاينة بجودات متعددة.
tags:
  [
    Hoceine el Idrissi,
    Web Development,
    Laravel,
    MySQL,
    Bootstrap,
    JavaScript,
    Redis,
    Plyr,
    HLS.js,
    Ajax,
  ]
image: "/images/my_projects/lms/home.jpg"
createdAt: 2023-12-01T15:15:53.000Z
updatedAt: 2023-12-01T15:15:53.000Z
createdBy: "Hoceine EL IDRISSI"
---

# تبسيط التعلّم - تحسين عرض الفيديو في منصة LMS

دمجتُ HLS في نظام لإدارة التعلّم (LMS) بمجموعة تقنيات قوية تشمل Laravel و JavaScript و FFMPEG و Plyr و Redis و MySQL و Bootstrap و HLS.js و Ajax. يركّز المشروع على تغيير طريقة عرض الفيديو داخل المنصة جذريًا، ويضيف ميزات وإمكانات متقدمة.

## نظرة عامة على المشروع

هدف المشروع تحسين عرض الفيديو داخل نظام إدارة التعلّم، بإضافة مجموعة ميزات تدير دورة حياة الفيديو بكفاءة. أهم هذه الميزات:

- **دمج HLS:** اعتماد HLS (HTTP Live Streaming) لبثّ أسرع وأكثر تكيّفًا مع ظروف الاتصال.

  <MdImage text="/images/my_projects/lms/hls.png" alt="HLS Integration - Streamlining Learning by Hoceine el Idrissi"></MdImage>

- **العلامة المائية:** إضافة علامة مائية إلى الفيديو لحماية الملكية الفكرية وإبراز الهوية.

- **اقتطاع مقطع تجريبي:** اقتطاع جزء قصير من الفيديو لصنع مقاطع تجريبية جذابة لأغراض الترويج.

- **الترميز بمعدلات بت مختلفة:** رفع جودة الفيديو بتقنيات ترميز فعّالة لمعدل البت (bitrate).

- **التقسيم إلى مقاطع:** تقطيع الفيديو إلى أجزاء صغيرة، مدة كل منها 10 ثوانٍ عادةً، لتشغيل وبثّ أفضل.

- **التحويل إلى صيغة HLS:** تحويل الفيديوهات إلى معيار HLS لضمان التوافق والتشغيل السلس على مختلف الأجهزة.

- **التخزين في MySQL:** حفظ بيانات الفيديو الأساسية في قاعدة بيانات MySQL لاسترجاعها وإدارتها بسهولة.

- **المعاينة بجودات متعددة:** يختار المستخدم جودة المعاينة التي تناسبه من عدة خيارات.

**_دورة حياة الفيديو:_**

<MdImage text="/images/my_projects/lms/lifecycle.png" alt="Video Lifecycle - Streamlining Learning by Hoceine el Idrissi"></MdImage>

## التقنيات المستخدمة

يعتمد المشروع على تقنيات متنوعة لتحقيق أهدافه:

- **Laravel:** إطار PHP لبناء واجهة خلفية متينة.

- **JavaScript:** لتحسين التفاعل وتجربة المستخدم في الواجهة الأمامية.

- **FFMPEG:** لمعالجة الفيديو، بما في ذلك الترميز والاقتطاع.

- **Plyr:** مشغّل فيديو قابل للتخصيص، دمجتُه لتحسين ميزات التشغيل.

- **Redis:** للتخزين المؤقت (caching) الفعّال وتحسين الأداء.

- **Bootstrap:** لواجهة متجاوبة وجذابة بصريًا.

- **HLS.js:** لتشغيل HLS في المتصفحات الحديثة.

- **Ajax:** للتواصل غير المتزامن وتحميل المحتوى ديناميكيًا.

## تفاصيل التنفيذ

### المهام وطوابير المهام في Laravel

يستفيد المشروع من المهام (Jobs) وطوابير المهام (Queues) في Laravel لتنفيذ أعمال معالجة الفيديو وترميزه بكفاءة. نقلُ العمليات التي تستغرق وقتًا طويلًا إلى طابور يعمل في الخلفية يُبقي تجربة المستخدم سلسة وسريعة الاستجابة.

<MdImage text="/images/my_projects/lms/queue.png" alt="Laravel Jobs and Queues - Streamlining Learning by Hoceine el Idrissi"></MdImage>

### Redis لحفظ حالة ترميز الفيديو

لعرض تقدّم ترميز الفيديو لحظة بلحظة، استخدمتُ Redis للتخزين المؤقت وحفظ البيانات. تُحفظ حالة الترميز الحالية، ومنها نسبة الإنجاز، في Redis، فيُسترجع ذلك بسرعة وتتحدّث الواجهة ديناميكيًا.

<MdImage text="/images/my_projects/lms/terminalFFmpeg.png" alt="Redis for Video Encoding State - Streamlining Learning by Hoceine el Idrissi"></MdImage>

### دمج Ajax

لـ Ajax دور أساسي في ربط الواجهة الأمامية بالخلفية بسلاسة. عبر طلبات Ajax تجلب الواجهة الأمامية حالة الترميز المحفوظة في Redis وتعرض تحديثاتها لحظيًا. هذا الأسلوب غير المتزامن يُغني المستخدم عن تحديث الصفحة يدويًا.

<MdImage text="/images/my_projects/lms/uploadvideo.png" alt="Ajax Integration - Streamlining Learning by Hoceine el Idrissi"></MdImage>

## ملاحظات وتحسينات

أضاف الجمع بين المهام وطوابير المهام في Laravel و Redis و Ajax عدة فوائد للمشروع:

- **معالجة فعّالة:** تنفيذ المهام في الخلفية يمنع الأعمال الثقيلة، مثل ترميز الفيديو، من إبطاء استجابة التطبيق.

- **تحديثات لحظية:** يتابع المستخدم تقدّم الترميز لحظة بلحظة، فتكون التجربة شفافة وأكثر تفاعلًا.

- **قابلية التوسّع:** الطوابير و Redis تسمح للنظام بمعالجة عدة مهام ترميز في الوقت نفسه، فيتوسّع الحل بسهولة.

- **تجربة استخدام أفضل:** دمج Ajax يُغني عن التدخل اليدوي، فتصبح متابعة تقدّم الترميز أسهل على المستخدم.

## لقطات الشاشة

اطّلع على المشروع بصريًا من خلال لقطات الشاشة التالية:

### قبل رفع الفيديو

جهّز الفيديو لتجربة تعلّم أفضل.
<MdImage text="/images/my_projects/lms/beforUploading.png" alt="Preparing Video for Upload - Streamlining Learning by Hoceine el Idrissi"></MdImage>

### إدارة دورة حياة الفيديو

عرض مرئي لمراحل دورة حياة الفيديو داخل النظام.
<MdImage text="/images/my_projects/lms/uploadvideo.png" alt="Video Lifecycle Management - Streamlining Learning by Hoceine el Idrissi"></MdImage>

### اكتمل رفع الفيديو

أصبح المحتوى جاهزًا للعرض بسلاسة.
<MdImage text="/images/my_projects/lms/uploadsuccess.png" alt="Successful Video Upload - Streamlining Learning by Hoceine el Idrissi"></MdImage>

### صفحة الدورة

تصفّح محتوى الدورة لتعميق فهمك.
<MdImage text="/images/my_projects/lms/viewCourse.png" alt="Viewing the Course - Streamlining Learning by Hoceine el Idrissi"></MdImage>

### صفحة الدرس

استكشف كل درس لتستوعب مفاهيمه جيدًا.
<MdImage text="/images/my_projects/lms/showlesson.png" alt="Viewing the Lesson - Streamlining Learning by Hoceine el Idrissi"></MdImage>

### الجودات المتاحة

اختر جودة الفيديو التي تناسبك.
<MdImage text="/images/my_projects/lms/qualities.png" alt="Different Video Qualities Displayed - Streamlining Learning by Hoceine el Idrissi"></MdImage>

### جودة 144p

شاهد الفيديو بدقة منخفضة لأداء أخف.
<MdImage text="/images/my_projects/lms/144.png" alt="144p Video Quality - Streamlining Learning by Hoceine el Idrissi"></MdImage>

### جودة 1080p

شاهد الفيديو بدقة عالية لتجربة تعلّم أوضح تفصيلًا.
<MdImage text="/images/my_projects/lms/1080.png" alt="1080p Video Quality - Streamlining Learning by Hoceine el Idrissi"></MdImage>

### نشاط الشبكة أثناء تقدّم تشغيل الفيديو

راقب نشاط الشبكة مع تقدّم تشغيل الفيديو.
<MdImage text="/images/my_projects/lms/networkprogress.png" alt="Network Progress during Video Playback - Streamlining Learning by Hoceine el Idrissi"></MdImage>

## للاستزادة

شاهد العرض التجريبي وتصفّح الشيفرة المصدرية لترى الحلول والإمكانات المتقدمة في هذا المشروع، وكيف يمكن أن يبدو مستقبل عرض الفيديو في أنظمة إدارة التعلّم.
