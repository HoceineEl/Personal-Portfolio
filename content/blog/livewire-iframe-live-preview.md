---
title: "Building a Live Preview in Livewire: Morphing an Iframe Without Breaking Alpine"
description: How to build a page-builder style live preview in Livewire using an iframe, postMessage and morphdom, and how to survive the three things that break it, Livewire roots, Alpine's MutationObserver, and injected script tags.
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

## Building a Live Preview in Livewire

A page builder needs a preview that updates as you type. The naive version is easy: bind the
settings form to a Livewire component, re-render the page below it, done. That works until the
page you are previewing has its own CSS, its own Alpine components, and its own Livewire
components. Then the preview and the editor start fighting over the same document.

I ended up putting the preview in an iframe. This post is about why, and about the three things
that broke once I did.

### Why an iframe

The preview is not a widget. It is the customer's actual page, rendered by the same Blade views
that serve it in production. That means it brings:

- **Its own stylesheet.** The site's CSS is written for the site, not for a panel. Tailwind
  preflight alone will reset your editor's typography if they share a document.
- **Its own viewport.** Device previews are a `width` on the iframe, and media queries answer
  correctly, because the iframe *is* the viewport. Simulating that with a scaled `div` means
  every `@media` rule lies to you.
- **Its own JavaScript.** Sections can be interactive. Two Alpine instances in one document is a
  bad afternoon.

An iframe buys isolation on all three. The price is that you no longer have a function call
between the editor and the page. You have a message bus.

### Section-level refresh, not page reload

The obvious implementation of "the preview updates" is to reload the iframe on every change. Do
not do this. Reloading loses scroll position, loses any interactive state inside the page, and
flashes. On a settings panel where someone is dragging a colour picker, it is unusable.

Instead the parent sends the new HTML for **one section**, and the iframe patches it in:

```ts
on(MessageType.SectionRefresh, (env) => {
  const data = env.data as { sectionId?: unknown; html?: unknown };
  if (typeof data.sectionId !== 'string' || typeof data.html !== 'string') return;
  // ...find the section by id, morph the new HTML into it
});
```

Patching means diffing, and for diffing I use [morphdom](https://github.com/patrick-steele-idem/morphdom).
It walks the old and new trees and applies the minimum set of DOM changes, so nodes that did not
change are never touched. Scroll position survives. Focus survives. An open dropdown in an
untouched section survives.

That is where the trouble starts.

### Problem 1: morphdom must not diff into a Livewire component

Livewire owns the DOM of its components. It keeps a snapshot on the root element and reconciles
against it. If morphdom reaches inside and rewrites nodes, Livewire's next round trip disagrees
with reality and you get stale state, dead click handlers, or an outright error.

So the rule is: when the diff reaches an element with `wire:id`, stop diffing and swap the whole
root.

```ts
if (from.hasAttribute('wire:id')) {
  swapLivewireRoot(from, to);
  return false; // tell morphdom not to descend
}
```

The swap has to be surgical too. Replacing the node unconditionally would destroy a live
component every time any sibling changed. Livewire bookkeeping attributes change on every
response even when the rendered output is identical, so comparing the raw nodes is useless.
Strip those attributes first, and only swap if the *visible* markup actually differs:

```ts
const LIVEWIRE_STATE_ATTRS = ['wire:id', 'wire:snapshot', 'wire:effects'];

function swapLivewireRoot(from: Element, to: Element): void {
  if (stripLivewireState(from).isEqualNode(stripLivewireState(to))) return;
  (window as WindowWithAlpine).Alpine?.destroyTree?.(from);
  from.replaceWith(to);
}
```

`Alpine.destroyTree` on the old root matters. Without it you leak the component's effects and
watchers, and after a few edits you have several invisible copies reacting to the same events.

### Problem 2: Alpine's MutationObserver races the diff

Alpine watches the document and initialises anything with `x-data` that appears. That sounds
convenient and is exactly the problem: while morphdom is mid-diff, the tree is in an
intermediate state, and Alpine may bind directives against a scope that is about to change.

The case that exposed it for me was a section edited from static to interactive. A wrapper that
previously had no `x-data` suddenly gains one. The observer sees the attribute land, initialises
the wrapper, and then the diff continues and rewrites its children. Sometimes the children bound
to the new scope, sometimes not.

The fix is to pause the observer for the duration of the patch, then initialise deliberately:

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

`Alpine.mutateDom` runs the callback with the observer disabled. Subtrees that were *already*
Alpine components still get handled correctly inside the diff, because morphdom hands those to
`Alpine.morph`, which works fine while the observer is paused.

Then you initialise what the diff injected, and only what it injected:

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

Two details worth stealing:

- **Livewire roots are initialised first.** `Alpine.initTree` is also what registers a Livewire
  component, through Livewire's init interceptor. Doing those first means a nested `x-data`
  inside a Livewire component can resolve `$wire`, and is already marked as initialised when the
  second loop runs.
- **Already-initialised roots are skipped** by checking `_x_dataStack` (Alpine) and `__livewire`.
  Nested roots are skipped for free, because an ancestor's `initTree` runs first in document
  order and marks the whole subtree. Nothing gets bound twice.

### Problem 3: injected script tags never run

This one is in the HTML spec rather than in any library. A `<script>` inserted through
`innerHTML` or through a DOM diff is **not** executed. morphdom will happily put your script tag
in the document, and the browser will ignore it.

If your sections can carry inline scripts, you have to re-spawn them by hand, and mark them so
later diffs do not run them again:

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

External scripts get marked but not re-fetched, because re-running a third party embed on every
keystroke is its own kind of bug.

### Bonus: acknowledge, don't assume

One more thing that is obvious in hindsight. When the editor adds a new section and wants to
scroll to it, the scroll message often arrives before the iframe has rendered that section. The
element does not exist yet, so the scroll silently does nothing.

Rather than guessing a delay, have the iframe answer:

```ts
bus.on(MessageType.SectionScrollResult, (data) => {
  const payload = data as { sectionId?: unknown; found?: unknown };
  if (typeof payload.sectionId !== 'string') return;
  if (payload.found === true) completePendingSectionScroll(payload.sectionId);
});
```

The parent retries every 150ms up to a limit, and stops the moment the iframe reports
`found: true`. Any cross-document protocol you build this way ends up needing acknowledgement
somewhere. Better to design for it than to sprinkle `setTimeout` around.

### What I would tell myself at the start

The iframe is the easy decision. The hard part is that you are now running someone else's
JavaScript inside a document you are rewriting underneath it, and the three frameworks involved
all assume they are the only thing mutating the DOM. Livewire assumes it owns its subtree. Alpine
assumes it will see mutations. The browser assumes injected scripts are not meant to run.

Respect each of those assumptions explicitly and the preview becomes boring, which is what you
want from a preview.

I build this into [FilamentCraft](https://filamentcraft.dev), a commercial page builder for
Filament, so the code above is from a real product rather than a sample. If you want to poke at
the result, the [demo](https://demo.filamentcraft.dev/launch/admin) drops you straight into the
editor with no signup.
