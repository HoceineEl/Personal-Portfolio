---
title: What Is the Virtual DOM? A Short Explanation with Vue Examples
description: What the Virtual DOM is, how Vue uses it to render, diff and patch, and where the idea fits next to other frameworks.
tags: [Vue.js, Virtual DOM, Web Development, JavaScript]
image: /images/blog/virtual-dom/cover.jpg
banner: /images/blog/virtual-dom/cover.jpg
createdAt: 2023-11-24T15:15:53.000Z
updatedAt: 2026-10-17T10:00:00.000Z
createdBy: "Hoceine EL IDRISSI"
---

## What Is the Virtual DOM?

Salam Alaikom. If you write Vue, you use the Virtual DOM every day, usually without thinking about
it. Knowing what it does helps when you debug a list that re-renders oddly or wonder why `key`
matters. This post explains the idea and how Vue applies it.

### A lightweight copy of the page

The Virtual DOM (VDOM) is a representation of the page's DOM as plain JavaScript objects. Instead
of touching the real DOM every time state changes, a framework like Vue describes what the UI
should look like as a tree of these objects, called virtual nodes or vnodes:

```js
const vnode = {
  type: 'div',
  props: { id: 'hello' },
  children: [/* more vnodes */],
}
```

Creating and comparing these objects is cheap compared with reading and writing real DOM nodes,
which can trigger style recalculation and layout.

### Diffing and patching

When state changes, the framework builds a new vnode tree and compares it with the previous one.
That comparison is the diff. It then applies only the differences to the real DOM, which is the
patch. If one list item's text changed, only that text node is updated; the rest of the page is
left alone.

This is also why Vue asks for a `key` on `v-for` items: keys let the diff match old and new items
correctly when a list is reordered, instead of rewriting each item in place.

<MdImage text="/images/blog/vdom/vdom1.png"></MdImage>

### How Vue does it

Vue's rendering works in three steps:

1. **Render.** Vue compiles your template into a render function. Running it returns a vnode tree
   that describes the component.
2. **Diff.** When reactive state the component depends on changes, Vue re-runs the render function
   to get a new tree and compares it with the old one.
3. **Patch.** Vue applies the minimal set of changes to the real DOM.

Vue adds something on top. Because it compiles templates, the compiler knows which parts are static
and which can change. It hoists static content and marks dynamic nodes with patch flags, so at
runtime Vue skips the parts that can never change instead of diffing the whole tree. The
[Rendering Mechanism](https://vuejs.org/guide/extras/rendering-mechanism.html) page in the Vue
docs calls this a compiler-informed Virtual DOM.

<MdImage text="/images/blog/vdom/vdom2.jpg"></MdImage>

### Beyond Vue

React uses a Virtual DOM too, with the same render, diff and patch idea. Not every framework does:
Angular updates the DOM through its own change detection, and Svelte and Solid compile components
to code that updates the DOM directly, with no virtual tree. The VDOM is one good answer to "how
do we update the page efficiently", and it is the one Vue and React chose.

Once you see your components as functions that return a description of the UI, a lot of Vue's
behaviour, from `key` to why direct DOM edits get overwritten, starts to make sense. Happy coding.
