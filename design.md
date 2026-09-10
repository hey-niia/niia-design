# Design System — niia.design

A brutalist, minimal personal-site design system, built with Tailwind CSS.

## Philosophy

Brutalist / anti-design. No decoration for decoration's sake:
- **Zero border-radius anywhere.** Every box is a hard rectangle.
- **One font size scale, almost no hierarchy by size.** Headings (`h1`–`h4`) carry no explicit font-size class — Tailwind's preflight resets them to `font: inherit`, so they render at the exact same size/weight as body text. Hierarchy comes from *position, borders, and spacing*, not from making text bigger or bolder.
- **One font weight.** `font-weight: 400` everywhere. No bold text on the page.
- **Only two type styles as "emphasis":** `underline` (for every link, always — not just on hover) and `italic` (for secondary/caption text).
- **1px solid hairline borders** are the only structural device — under the header, under section titles, and framing each portfolio card.
- **No shadows, no gradients, no transitions/animations.**

## Typography

| Token | Value |
|---|---|
| Font family | `font-serif` → Tailwind's default serif stack: `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif` (system serif, no webfont loaded) |
| Base size (mobile) | `text-base` = 16px / line-height 24px |
| Base size (desktop, `lg:` ≥1024px) | `text-xl` = 20px / line-height 28px |
| Font weight | 400 (regular) only, no bold anywhere on the page |
| Letter spacing | normal (no tracking utilities used) |
| Link style | `underline`, no separate hover/visited color — underline is permanent, not a hover-only affordance |
| Emphasis / captions | `italic` (e.g. project descriptions), always at the same size as surrounding text |
| List style | `list-disc`, indented with `ml-4` |

There is no distinct H1/H2/H3 size scale — every heading level equals body text. Semantic HTML tags (`h1`, `h2`, `h3`, `h4`) are used for structure/accessibility, not for visual size.

## Color

| Token | Hex | Tailwind name | Usage |
|---|---|---|---|
| Background | `#f5f5f5` | `neutral-100` | Global background |
| Text | `#404040` | `neutral-700` | Global text color — same color for headings, body, links |
| Border | `#404040` | `neutral-700` | 1px hairlines everywhere |
| Button fill | `#e5e5e5` | `neutral-200` | Solid buttons only |
| Card background | transparent | — | Bordered cards have no fill, just a border |

No accent color, no brand color, no dark mode. A strictly two-tone (near-black-on-near-white) palette.

## Layout & Spacing

| Token | Value |
|---|---|
| Page container | `mx-auto max-w-4xl` → 896px max width, centered |
| Container padding | `py-16` (64px top/bottom on `<main>`), `p-4` (16px) on `<body>` as outer gutter |
| Section rhythm | Each section is `border-b` (1px hairline) + `py-8` (32px vertical padding); header is `border-b pb-8` |
| Section title spacing | `mb-2` (8px) below a section `h3` before its content |
| Card padding | `p-4` (16px) inside each card |
| Card min-height | `min-h-48` (192px) |
| Grid gap | `gap-4` (16px) between cards |
| Icon-to-label gap | `space-x-1` (4px) between a small glyph/icon and its label |
| Link row gap | `space-x-2` (8px) between header nav links |
| Description spacing | `my-2` (8px) above/below italic caption text |

## Grid / Responsive

- Portfolio grid: `grid grid-cols-1 gap-4 md:grid-cols-2` — single column under 768px, 2 columns at `md:` (≥768px) and up. Each column ≈440px at desktop width.
- Body text itself is responsive: 16px below `lg:` (1024px), jumps to 20px at `lg:` and above — the *entire page* gets one step larger on desktop, nothing more granular.

## Components

**Header block**
- Name (`h1`), role/affiliation (`h2`, multi-line via `<br>`, not separate paragraphs), then a row of underlined text links (contact/socials, all `target="_blank" rel="noopener noreferrer"`), all inside `<header class="border-b pb-8">`.

**Disclosure / expandable section**
- Native `<details>` / `<summary>` (no JS) for expandable content — a plain-text triangle-toggle affordance is free from the browser, in keeping with the "no decoration" ethos.
- A `<ul class="my-4">` of `<li class="ml-4 list-disc">` inside.
- A flat rectangular button: `bg-neutral-200 px-4 py-2 cursor-pointer`, label in literal uppercase text — not `text-transform`, the string itself is typed in caps.

**Portfolio card**
```html
<div class="relative flex min-h-48 flex-col items-start justify-center border p-4">
  <div class="flex items-center space-x-1">
    <div>{icon}</div>
    <p class="text-base">{context label, e.g. category/platform}</p>
  </div>
  <a href="{url}" class="underline"><h4 class="flex">{Project title}</h4></a>
  <p class="my-2 text-base italic">{one–two sentence description}</p>
</div>
```
- Content is vertically centered within the fixed-min-height card (`justify-center`), left-aligned (`items-start`).
- Not every card needs a description — card height stays fixed via `min-h-48` so the grid stays aligned regardless.

## Adaptation for niia.design

Niia is a product designer with real visual work, so the one deliberate departure from the reference system: **portfolio cards become screenshot containers** instead of icon-only text cards — case studies live *inside* those bordered rectangles the same way an identity block sits inside its own bordered section in the reference layout. Everything else — hairline borders, zero radius, one serif size scale, underline-only links, italic captions, neutral-100/neutral-700 two-tone palette, no shadows/gradients/animation — carries over as-is.

Next step (not yet built): map this system onto niia.design's actual content (intro/about, freelance description, projects — wellness AI iOS app, enterprise dashboard, corporate website, Hirement) and scaffold the repo for her GitHub, using Tailwind CSS.
