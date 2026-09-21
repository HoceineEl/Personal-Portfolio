---
title: "معاينة حية في Livewire: تحديث iframe بـ morphdom دون أن ينكسر Alpine"
description: كيف تبني معاينة حية على طريقة منشئ الصفحات في Livewire باستخدام iframe و postMessage و morphdom، وكيف تتجاوز الأشياء الثلاثة التي تكسرها، جذور Livewire، و MutationObserver في Alpine، ووسوم script المحقونة.
tags:
  - Livewire
  - Alpine.js
  - Laravel
  - FilamentPHP
  - TALL Stack
noImage: true
createdAt: 2026-09-12T10:00:00.000Z
updatedAt: 2026-09-12T10:00:00.000Z
createdBy: Hoceine EL IDRISSI
---

## بناء معاينة حية في Livewire

يحتاج منشئ الصفحات (page builder) إلى معاينة تتحدث مع كل حرف تكتبه. النسخة الساذجة سهلة: اربط نموذج
الإعدادات بمكوّن (component) في Livewire، وأعد عرض الصفحة تحته، وانتهى الأمر. ينجح هذا إلى أن تكون
الصفحة التي تعاينها تحمل CSS خاصًا بها، ومكوّنات Alpine خاصة بها، ومكوّنات Livewire خاصة بها. عندها
تبدأ المعاينة والمحرر بالتنازع على المستند نفسه.

انتهى بي الأمر إلى وضع المعاينة داخل iframe. هذه التدوينة عن سبب ذلك، وعن الأشياء الثلاثة التي
انكسرت بعده.

### لماذا iframe

المعاينة ليست ودجة (widget). إنها الصفحة الفعلية للعميل، تعرضها قوالب Blade نفسها التي تخدمها في
بيئة الإنتاج. وهذا يعني أنها تأتي معها بـ:

- **ملف أنماطها الخاص.** كُتب CSS الموقع للموقع، لا للوحة التحكم. وقاعدة preflight في Tailwind وحدها
  كفيلة بإعادة ضبط خطوط المحرر إذا تشاركا مستندًا واحدًا.
- **منفذ عرضها (viewport) الخاص.** معاينة الأجهزة مجرد `width` على الـ iframe، واستعلامات الوسائط
  تجيب بدقة، لأن الـ iframe *هو* منفذ العرض. محاكاة ذلك بـ `div` مصغّر تعني أن كل قاعدة `@media`
  تكذب عليك.
- **JavaScript الخاص بها.** يمكن أن تكون الأقسام تفاعلية. ونسختان من Alpine في مستند واحد وصفة
  لظهيرة سيئة.

يمنحك الـ iframe العزل في الثلاثة. والثمن أنك لم تعد تملك استدعاء دالة مباشرًا بين المحرر
والصفحة. صار لديك ناقل رسائل.

### تحديث على مستوى القسم، لا إعادة تحميل الصفحة

التنفيذ البديهي لعبارة "المعاينة تتحدث" هو إعادة تحميل الـ iframe مع كل تغيير. لا تفعل ذلك.
إعادة التحميل تُضيّع موضع التمرير، وتُضيّع أي حالة تفاعلية داخل الصفحة، وتُحدث وميضًا. وفي لوحة
إعدادات يسحب فيها شخص منتقي ألوان، تصبح غير قابلة للاستخدام.

بدلًا من ذلك، ترسل الصفحة الأم HTML الجديد **لقسم واحد**، ويرقّعه الـ iframe في مكانه:

```ts
on(MessageType.SectionRefresh, (env) => {
  const data = env.data as { sectionId?: unknown; html?: unknown };
  if (typeof data.sectionId !== 'string' || typeof data.html !== 'string') return;
  // ...find the section by id, morph the new HTML into it
});
```

الترقيع يعني المقارنة (diffing)، وللمقارنة أستخدم [morphdom](https://github.com/patrick-steele-idem/morphdom).
يمرّ على الشجرتين القديمة والجديدة ويطبّق أقل قدر من تغييرات DOM، فلا يمسّ العقد التي لم
تتغير أبدًا. يبقى موضع التمرير. يبقى التركيز. وتبقى القائمة المنسدلة المفتوحة في قسم لم يتغير
مفتوحة.

وهنا تبدأ المشكلة.

### المشكلة 1: يجب ألا تدخل مقارنة morphdom إلى مكوّن Livewire

يملك Livewire شجرة DOM الخاصة بمكوّناته. يحتفظ بلقطة (snapshot) على العنصر الجذر ويطابق عليها.
إذا دخل morphdom إلى الداخل وأعاد كتابة العقد، تختلف الرحلة التالية لـ Livewire مع الواقع،
فتحصل على حالة قديمة، أو معالجات نقر ميتة، أو خطأ صريح.

لذلك القاعدة: عندما تصل المقارنة إلى عنصر يحمل `wire:id`، أوقف المقارنة واستبدل الجذر
كاملًا.

```ts
if (from.hasAttribute('wire:id')) {
  swapLivewireRoot(from, to);
  return false; // tell morphdom not to descend
}
```

ويجب أن يكون الاستبدال دقيقًا هو الآخر. استبدال العقدة دون شرط سيهدم مكوّنًا حيًا كلما تغيّر
أي عنصر شقيق. سمات التتبع التي يضيفها Livewire تتغير مع كل استجابة حتى لو كان الناتج المعروض
مطابقًا، لذلك مقارنة العقد الخام بلا فائدة. انزع تلك السمات أولًا، ولا تستبدل إلا إذا اختلف
الترميز *الظاهر* فعلًا:

```ts
const LIVEWIRE_STATE_ATTRS = ['wire:id', 'wire:snapshot', 'wire:effects'];

function swapLivewireRoot(from: Element, to: Element): void {
  if (stripLivewireState(from).isEqualNode(stripLivewireState(to))) return;
  (window as WindowWithAlpine).Alpine?.destroyTree?.(from);
  from.replaceWith(to);
}
```

استدعاء `Alpine.destroyTree` على الجذر القديم مهم. بدونه تُسرّب التأثيرات (effects) والمراقِبات
(watchers) الخاصة بالمكوّن، وبعد بضعة تعديلات تجد عدة نسخ خفية تتفاعل مع الأحداث نفسها.

### المشكلة 2: MutationObserver في Alpine يسابق المقارنة

يراقب Alpine المستند ويهيّئ كل عنصر يظهر وهو يحمل `x-data`. يبدو هذا مريحًا، وهو بالضبط
المشكلة: بينما morphdom في منتصف المقارنة، تكون الشجرة في حالة وسيطة، وقد يربط Alpine
التوجيهات (directives) بنطاق على وشك أن يتغير.

الحالة التي كشفت ذلك لي كانت قسمًا عُدّل من ثابت إلى تفاعلي. غلاف لم يكن يحمل `x-data` صار
فجأة يحمله. يرى المراقب السمة تصل، فيهيّئ الغلاف، ثم تكمل المقارنة وتعيد كتابة أبنائه. أحيانًا
ترتبط الأبناء بالنطاق الجديد، وأحيانًا لا.

الحل أن توقف المراقب طوال مدة الترقيع، ثم تهيّئ بنفسك عن قصد:

```ts
function morphPatch(from: Element, to: Element): void {
  const alpine = (window as WindowWithAlpine).Alpine;
  if (alpine?.mutateDom) {
    alpine.mutateDom(() => morphdom(from, to, morphOptions()));
  } else {
    morphdom(from, to, morphOptions());
  }
}
```

تشغّل `Alpine.mutateDom` الدالة المُمرَّرة والمراقب معطّل. الأشجار الفرعية التي كانت *أصلًا*
مكوّنات Alpine تُعالَج كما ينبغي داخل المقارنة، لأن morphdom يسلّمها إلى `Alpine.morph`،
الذي يعمل جيدًا والمراقب متوقف.

بعدها تهيّئ ما حقنته المقارنة، وما حقنته فقط:

```ts
function initInjectedRoots(scope: ParentNode): void {
  const alpine = (window as WindowWithAlpine).Alpine;
  if (!alpine?.initTree) return;

  for (const root of collectRoots(scope, '[wire\\:id]')) {
    if ((root as MaybeLivewireEl).__livewire) continue;
    alpine.initTree(root);
  }

  for (const root of collectRoots(scope, '[x-data]')) {
    if ((root as MaybeAlpineEl)._x_dataStack) continue;
    alpine.initTree(root);
  }
}
```

تفصيلتان تستحقان النقل:

- **تُهيَّأ جذور Livewire أولًا.** الدالة `Alpine.initTree` هي أيضًا ما يسجّل مكوّن Livewire،
  عبر معترض التهيئة في Livewire. تهيئتها أولًا تعني أن `x-data` المتداخل داخل مكوّن Livewire
  يستطيع الوصول إلى `$wire`، ويكون معلَّمًا كمهيّأ حين تعمل الحلقة الثانية.
- **تُتخطّى الجذور المهيّأة سابقًا** بفحص `_x_dataStack` (في Alpine) و `__livewire`.
  والجذور المتداخلة تُتخطّى تلقائيًا، لأن `initTree` الخاصة بالعنصر السلف تعمل أولًا بترتيب
  المستند وتعلّم الشجرة الفرعية كلها. لا شيء يُربط مرتين.

### المشكلة 3: وسوم script المحقونة لا تعمل أبدًا

هذه المشكلة في مواصفة HTML نفسها لا في أي مكتبة. وسم `<script>` المُدرج عبر `innerHTML`
أو عبر مقارنة DOM **لا** يُنفَّذ. سيضع morphdom وسم السكربت في المستند بلا اعتراض، وسيتجاهله
المتصفح.

إذا كانت أقسامك تحمل سكربتات مضمّنة، فعليك إعادة إنشائها يدويًا، ووسمها حتى لا تشغّلها
المقارنات اللاحقة مرة أخرى:

```ts
function patchScripts(root: ParentNode): void {
  const scripts = root.querySelectorAll('script');
  scripts.forEach((oldScript) => {
    if (oldScript.dataset.fcRan === '1') return;
    if (oldScript.src && oldScript.dataset.fcAlwaysRerun !== '1') {
      oldScript.dataset.fcRan = '1';
      return;
    }
    const fresh = document.createElement('script');
    for (const attr of Array.from(oldScript.attributes)) {
      fresh.setAttribute(attr.name, attr.value);
    }
    fresh.textContent = oldScript.textContent;
    fresh.dataset.fcRan = '1';
    oldScript.replaceWith(fresh);
  });
}
```

السكربتات الخارجية تُوسم ولا يُعاد جلبها، لأن إعادة تشغيل تضمين من طرف ثالث مع كل ضغطة مفتاح
خطأ من نوع آخر.

### إضافة: اطلب التأكيد ولا تفترض

شيء أخير يبدو بديهيًا بعد فوات الأوان. عندما يضيف المحرر قسمًا جديدًا ويريد التمرير إليه، تصل
رسالة التمرير غالبًا قبل أن يعرض الـ iframe ذلك القسم. العنصر غير موجود بعد، فلا يفعل التمرير
شيئًا دون أي إشارة.

بدل تخمين مدة انتظار، اجعل الـ iframe يردّ:

```ts
bus.on(MessageType.SectionScrollResult, (data) => {
  const payload = data as { sectionId?: unknown; found?: unknown };
  if (typeof payload.sectionId !== 'string') return;
  if (payload.found === true) completePendingSectionScroll(payload.sectionId);
});
```

تعيد الصفحة الأم المحاولة كل 150ms حتى حدّ معيّن، وتتوقف لحظة أن يبلّغ الـ iframe بـ `found: true`.
أي بروتوكول بين مستندين تبنيه بهذه الطريقة سيحتاج إلى تأكيد استلام في مكان ما.
الأفضل أن تصمّم له من البداية بدل أن تنثر `setTimeout` هنا وهناك.

### ما كنت سأقوله لنفسي في البداية

الـ iframe هو القرار السهل. الجزء الصعب أنك صرت تشغّل JavaScript كتبه غيرك داخل مستند تعيد
كتابته من تحته، والأطر الثلاثة المعنية كلها تفترض أنها الوحيدة التي تعدّل DOM. يفترض Livewire
أنه يملك شجرته الفرعية. ويفترض Alpine أنه سيرى التعديلات. ويفترض المتصفح أن السكربتات المحقونة
ليست معدّة للتشغيل.

احترم كل افتراض من هذه صراحةً، وستصبح المعاينة مملّة، وهذا ما تريده من أي معاينة.

بنيت هذا داخل [FilamentCraft](https://filamentcraft.dev)، منشئ صفحات تجاري لـ Filament،
لذلك الشيفرة أعلاه من منتج حقيقي لا من مثال تجريبي. وإذا أردت تجربة النتيجة،
فإن [العرض التجريبي](https://demo.filamentcraft.dev/launch/admin) يأخذك مباشرة إلى المحرر
دون تسجيل.
