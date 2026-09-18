# Design System — niia.design (v7)

**v7 supersedes several of v6's specifics below** (Experience layout, Selected Work layout, hover treatment, typeface) while keeping v6's overall header/About shape and brutalist spirit. Read "v7" first — it's the current, live-in-code spec. Treat v6 as the record of how we got here (stefanietam.com reference, the border-bottom hover idea, the Inter typeface call) rather than the current truth; v3–v5 remain historical below that.

## v7 — Rachel Chen–inspired Experience/Work layout, Geist fonts, color hover

Driven by a client-supplied reference, **[rachelchen.tech](https://www.rachelchen.tech/)** (screenshots of her Experience table and Selected Work grid, not live-inspected via tooling), plus two follow-up decisions (typeface, hover color) made independently of that reference. This section documents what's actually built in `Home.tsx` / `Nav.tsx` / `WorkGridCard.tsx` / `index.css` today, superseding the parts of v6 below that don't match.

**Header (`Nav.tsx`) — matches v6's intent, one detail resolved.** Single sticky row (`sticky top-0`, not the "non-sticky" v6 assumed), no bottom border/divider. Left: `Niia Bieliavtseva` (bold, plain sans — Geist Mono was tried for the name and reverted, "revert back to where it was") followed inline by `Senior Product Designer, AI Design Engineer` (plain weight, same line, space-separated, no dash). Right: `About` / `AI Playground` / `Contact` nav links.

**About — unchanged from v6's plan.** Centered `max-w-xl` column, two plain paragraphs, no heading. Only top padding (`pt-6 md:pt-24`) — no bottom padding, so the gap down to Experience is controlled entirely by Experience's own top padding (kept equal to the gap from Experience down to Selected Work; see "spacing" note below).

**Experience — replaced v6's "centered heading + freeform" plan with a compact stacked list, no heading at all.** After three iterations (a rigid 3-col year/company/role grid, then an inline flex row — both rejected as not matching About's column width or not "looking good"), the shipped pattern reuses `WorkGridCard`'s own caption vocabulary instead of inventing a new one:
- Centered `max-w-xl` column — same exact width as About, not a separate `max-w-2xl` (the mismatch that got both earlier attempts rejected).
- The word "Experience" itself is dropped (explicit ask) — the section has no title, just three entries.
- Each entry (Freelance / Overspace / Leap): company name at `text-base` (a plain "title" line, not bold — bold was tried and explicitly rejected: "don't use this bold color"), then a `mt-2 font-mono text-xs tracking-widest text-neutral-400 uppercase` line combining role + years (e.g. `Senior Product Designer, AI Design Engineer · 2022–Present`), then a `mt-2 text-sm` description paragraph — plain weight, not italic, not gray (both tried earlier in the session and reverted).
- Unlike the rachelchen.tech reference (which drops descriptions entirely for a denser table), **descriptions are explicitly kept** per direct instruction — the reference is a *density/format* cue, not a content cue.

**Selected Work — replaced v6's "stacked full-width rows" plan with an off-balance 2-column masonry grid, matching the reference's compactness.** `WorkGridCard.tsx` replaces `WorkGridItem.tsx` (v3's fixed-aspect crop grid) and the never-built `WorkRow.tsx` (v6's planned full-width-row component):
- Section is `columns-1 gap-8 sm:columns-2` — a CSS multi-column masonry, not a CSS grid — so card heights vary naturally with each screenshot's own aspect ratio (the "off-balance" quality of the reference) with zero JS.
- Each card: screenshot first (`w-full`, `break-inside-avoid`), then a caption row below it — `project.title` on the left (a short, ambitious one-line overview, e.g. copy in the spirit of "the future of AI and hardware"), `project.client · project.lastUpdated` right-aligned in the same gray `font-mono text-xs tracking-widest uppercase` treatment used for Experience's role/year line. No per-case description paragraph (matches the reference; unlike Experience, nothing is kept here).
- The whole card is a `<Link to="/work/:slug">` — click-to-case-study behavior carried over unchanged from v3/v6.
- One special case: the `ios-app` project's screenshots render inside a `bg-neutral-100 p-10` frame at reduced width (`w-4/5`) rather than full-bleed — a one-off treatment for that project's dark-UI screenshots, not a general pattern to extend to other cards without asking first.
- Shortcut worth revisiting: the caption's left-side copy currently reuses the existing `project.title` field rather than new Rachel-Chen-style ambitious taglines written per project — fine for now, flagged here so custom copy can replace it later without re-deriving the plan.

**Spacing note.** About/Experience/Work no longer each carry their own symmetric top+bottom padding (which used to compound into uneven gaps). Instead each section contributes padding on only one side, so the visual gap between About↔Experience equals the gap between Experience↔Work — both are exactly Experience's own `py-12`.

**Hover + selection — superseded again, this time to a color change (contradicts v6's border-bottom "no color change" rule).** `src/index.css`'s `a:hover` is `color: #e65f2e` (a burnt orange), `.nav-active` holds the same color statically for the current page, and `::selection` uses the same orange at low opacity — all matching rachelchen.tech's own treatment rather than the border-bottom brutalism v6 specified. This was applied outside an explicit request in this design's own conversation thread and has not been explicitly re-confirmed since, but no request since has asked to revert it, so treat it as the current resolved state until told otherwise — don't silently reintroduce border-bottom hover expecting it's still spec.

**Typeface — superseded again: Geist + Geist Mono, not Inter, not ABC Diatype.** v6's Inter plan was never implemented; the site went straight from ABC Diatype to Geist:
- `ABC Diatype` fully removed — `public/fonts/diatype/` deleted, all 14 `@font-face` declarations gone from `src/index.css`. The unresolved trial-license question that dogged it throughout v1–v6 is now moot.
- **Geist** (sans) and **Geist Mono** are self-hosted via `@font-face` (variable, `font-weight: 100 900`), sourced from the `geist` npm package's `.woff2` files under `public/fonts/geist/`. Both are SIL OFL-licensed — no trial/license flag, unlike Diatype.
- `--font-sans` / `--font-mono` in the `@theme` block point at Geist / Geist Mono respectively. `font-mono` utilities — Experience's role/year captions, `WorkGridCard`'s client/date captions, `Journey.tsx`'s year captions, `About.tsx`'s numbered labels — now render in Geist Mono automatically; this is consistent and desired, not something to "fix."
- The one place Geist Mono was tried and reverted: the header name (`Nav.tsx`). At the tested size it visually ran into the position text on some renders and didn't read better than plain Geist bold — left as plain sans, bold.

### Explicitly unchanged from v6

- Site structure — still Home (`/`), About (`/about`), AI Playground (`/ai-playground`), Contact (`mailto:`), plus per-project case-study pages.
- No section dividers/borders between About/Experience/Work, no "Selected Work" heading — both v6 calls, still true.
- White background, two-tone-in-spirit color system (now with the orange hover accent layered on top, see above).

### Open questions carried forward

- Whether to write real per-project taglines for `WorkGridCard`'s left caption instead of reusing `project.title` (flagged above).
- Whether the orange hover/selection treatment should eventually get an explicit sign-off, or whether it's already considered final by virtue of no revert request.

### Addendum — homepage `DrawingPad` (draw-on-canvas easter egg)

Reference: [floraghnassia.com](https://www.floraghnassia.com/)'s "Now your turn =)" section. The live site's TLS handshake rejected every direct fetch/browser attempt from this session, but a March 2025 Wayback Machine snapshot was reachable and — unusually — its Webflow custom-code JS bundle (`florag-webflow-animation.umd.cjs`, hosted on GitHub Pages) was still fully retrievable, so the actual pen/stroke implementation was inspected from real (minified) source rather than guessed.

- New component `src/components/DrawingPad.tsx`, rendered as the last section of `Home.tsx`, below Selected Work, with its own `mt-20 md:mt-32` gap above it (on top of the section's internal `py-16 md:py-24`) so the colored band doesn't crowd the Work grid above it.
- **Full-bleed layout** (`-mx-4` cancelling `body`'s `p-4` gutter), unlike the rest of the page's `max-w-xl` centered columns — matches the reference's own full-width treatment for this section.
- **No standalone heading — collapsed into the placeholder.** Went through three passes: a big bold `text-4xl`–`text-6xl` display heading, then Experience's `text-base` company-name treatment, then `Nav.tsx`'s plain position-text style — each tried and each rejected in turn as not minimal enough. Final call: drop the separate heading entirely and fold copy into the `Click to start drawing` placeholder itself, as three short stacked lines (`flex-col`, same caption styling as before) building from personal statement to the call to action:
  1. "I love to draw and have been doing it all my life."
  2. "My mission is to inspire other people."
  3. "Click to start drawing."
  (line 2 originally repeated "love" — "I love to inspire other people" — and was rewritten once flagged, reusing the client's own "my mission is to inspire" framing instead.)
  (client's own drafted wording, first-person in Niia's established "I design..."/"I help..." voice — not Flora's "Now your turn =)" copy, which was only ever a tonal reference, never reused verbatim). Once armed, the canvas is blank again except for `Clear`/`Download` — no persistent label.
- **Section background is solid `#f07c57`** (a client-specified, slightly softer/darker orange than the site's own `#e65f2e` accent — deliberately a different hex, not a tint of it) — covering the *entire* section including the canvas itself, not just a wrapper around a white canvas box. Went through several passes: a `0.12` tint, a `0.3` tint, solid `#e65f2e`, then solid `#eb6134` — each rejected in turn (too pale, still too pale, too bright, then — once the three-line placeholder copy landed — hard to read at `text-black/40` against it). Settled on `#f07c57` (a touch lighter/softer than `#eb6134`) **and** bumped the placeholder text to `text-black/70` (from `/40`) — the color alone wasn't enough of a legibility fix on its own. The canvas's own fill (in `redrawAll`, via the `BACKGROUND_COLOR` constant) matches the section background exactly so the drawable area is visually continuous — no boxed-off white rectangle — and downloads inherit the same backdrop. Black ink stays legible on it.
- **No gap before the footer**: the section carries `-mb-24` to cancel out `Home.tsx`'s `<main className="pb-24">` (needed on every other page so the fixed `Footer` doesn't overlap page content, but here it left a visible white strip between the orange section and the footer). Scoped to this section only — `pb-24` is left untouched on `<main>` and on every other page.
- **Deliberate deviation from the reference**: the canvas starts inert behind the placeholder line above instead of drawing on the very first pointer contact like Flora's site (whose canvas tracks the mouse and draws continuously on hover, no click needed). One click/tap arms ours; a press-drag-release gesture then draws a discrete stroke — kept as our own interaction model rather than adopting the hover-draws-immediately behavior.
- **Fixed: strokes were getting cut off mid-gesture — twice.** First pass: `onPointerLeave` was wired to end the stroke, so any fast/wide gesture that grazed just outside the canvas's rectangle fired `pointerleave` and terminated the stroke early. Removed it; `canvas.setPointerCapture()` (already called on `pointerdown`) keeps delivering `pointermove`/`pointerup` to the canvas regardless of where the pointer physically is, so a stroke should only end on an actual `pointerup`/`pointercancel`. That wasn't the whole story — the bug reproduced again ("cut off inside an invisible box"), traced to `SelectionAskTooltip.tsx` (added by a concurrent session's chat-sidebar work): it listens for `document`'s `selectionchange` globally and renders a `fixed z-40` "Ask NiiaLLM" pill wherever text gets selected. The canvas never told the browser not to treat a mouse-drag over it as a native text-selection drag, so drawing a stroke could simultaneously start a page text selection, firing `selectionchange` and popping that fixed pill on top of the canvas mid-gesture — the actual "invisible box." Fixed by calling `e.preventDefault()` in the canvas's `onPointerDown` (stops the browser from starting a selection drag off that pointer) plus `select-none` on the canvas and its container as a backstop. This is a real cross-feature interaction to keep in mind: any future global `selectionchange`/`mousedown` listener added elsewhere on the site (chat sidebar, tooltips, etc.) can silently interfere with the drawing canvas's own pointer handling unless the canvas opts out of native selection.
- **The ink itself is a faithful port of Flora's algorithm**, found in the inspected bundle (function `lb`): a stroke is a solid round-cap/round-join black line, except its last `taperLength` px tapers the width down to a point via `width = maxWidth * (1 - (1 - distFromTip/taperWindow) ** 1.5)` — no bezier smoothing is involved anywhere in her code (despite GSAP elsewhere in the bundle using easing curves); the "soft" look people notice is entirely this length-based taper plus round caps. Our port (`renderTaperedStroke` in `DrawingPad.tsx`) generalizes her live per-frame version into one function reused for both the in-progress stroke and redrawing finished strokes from scratch, so a finished stroke keeps its pointed tip permanently and a window resize can safely re-run the same taper math.
- **Brush picker — up to 5, all shown at once (no dropdown/bottom-sheet).** Explicit call after weighing both: a dropdown needs open/close state plus a distinct mobile bottom-sheet variant to be built and maintained; showing all of them is a single static row with no extra interaction state, so "all at once" was chosen as the simpler build (and the client agreed). Five presets in `BRUSHES` vary `maxWidth`/`taperLength`/`opacity` — Fine (3px, short taper), Pen (10px/100px taper — the original Flora-matched default), Marker (18px, short taper — blunter/less tapered), Brush (26px, long 180px taper — the most expressive/calligraphic), Highlighter (34px, no taper, `opacity: 0.35` — a translucent flat-width marker, darkens where strokes overlap). Row sits `bottom-center` on the canvas, each brush a circular swatch sized to `dotSize` (scaled proxy for its `maxWidth`) with the selected one getting a `bg-black/15` pill behind it; same `pointer-events-none` wrapper / `pointer-events-auto` buttons technique as `Clear`/`Download` so the row floats without stealing canvas space or blocking drawing elsewhere.
- **Strokes now carry their own brush**, not a shared global — `strokesRef` stores `{ points, maxWidth, taperLength, opacity }` per stroke (was a bare `Point[][]`), so switching brushes mid-drawing never changes the appearance of strokes already on the canvas; only the *next* stroke picks up the newly selected brush's parameters (read via a `brushRef` mirror of the `brush` state so the `pointerdown` handler always sees the latest selection without needing to be re-bound).
- **Footer-overlap bug caught before shipping**: the brush row was first placed at `bottom-4`/`bottom-6`, matching `Clear`/`Download`'s corner-anchoring — but since this canvas's own bottom edge *is* the page's bottom edge (via the `-mb-24` full-bleed trick above), that placement put it directly under the sticky `<Footer>` (`fixed inset-x-0 bottom-0 z-10 bg-white`, ~57–90px tall depending on breakpoint), which paints over it. Confirmed via `getBoundingClientRect()` on both elements (footer top at 717px was overlapping the brush row's 705–741px band) before moving it to `bottom-20 md:bottom-24`, re-verified clear of the footer at the same viewport.
- `Clear` and `Download` controls float over the canvas once armed (same ids/behavior as Flora's `#reset-btn`/`#download-btn`: wipe history / `canvas.toBlob` → `<a download>`), styled as plain-text buttons in the site's gray/orange-hover caption treatment. Originally a separate `<div>` row sitting *above* the canvas in normal flow — reserving its own strip of orange that wasn't actually part of the `<canvas>` element, so a stroke drawn into that strip silently didn't register. Reported as "cut off behind Clear and Download" / wanting "the whole orange background to be my canvas." Fixed by moving the button row inside the canvas's own container as `absolute top-4 right-4` with `pointer-events-none` on the wrapper and `pointer-events-auto` on each `<button>`, so drawing works everywhere underneath them except their own small text hit-boxes.
- **Second, deeper version of the same bug: the section's own padding was itself dead (undrawable) orange.** `<section>` carried `px-4 py-16 md:py-24` while the canvas `<div>` inside it had a fixed `h-[420px] md:h-[560px]` — so the section's padding painted extra orange on all four sides that visually looked like part of one continuous canvas but sat *outside* the actual `<canvas>` element's box, undrawable, and the "closer to the top" button request was really asking to close that same gap (buttons were positioned relative to the canvas's own top edge, which sat ~64–96px below the section's visual top because of that padding). Reported as "I cannot draw past this invisible line" with a screenshot showing strokes clustering in a band with blank orange above/below. Fixed by removing the section's `px-4`/`py-16`/`md:py-24` entirely and sizing the canvas container to fill the section's full box directly (`h-[550px] md:h-[750px]`, bg moved conceptually to be 1:1 with the canvas) — verified via `getBoundingClientRect()` that the section and canvas-container rects are now identical, and a corner-to-corner drag now reaches every edge.
- Implementation note: strokes are stored as arrays of *normalized* (0–1) points rather than raw pixels (Flora's version instead does a crude `getImageData`/`putImageData` on resize), so a window resize can re-scale and redraw the full history — taper recomputed per stroke — onto a freshly-sized canvas without losing or distorting the drawing.

### Addendum — AI Playground case studies now match `CaseStudy.tsx`'s typography

Flagged as "not even styled... text goes side to side... hard to skim through" — the four experiment write-ups (`Skim.tsx`, `CatEight.tsx`, `Taski.tsx`, `TaskiV1.tsx`) previously had no reading-column width at all (Tailwind Preflight resets heading font-size/weight to `inherit`, so their `<h3>` section labels rendered at the same size and weight as body text, with paragraphs and lists running full-bleed edge to edge). Rebuilt to reuse `CaseStudy.tsx`'s exact vocabulary rather than inventing a new one:

- Outer wrapper `mx-auto max-w-4xl pt-6 md:pt-24`, header block (back link + `h1` + italic summary) in a `border-b border-gray-200 pb-8` `<header>`, same as `CaseStudy.tsx`'s project header.
- Body copy constrained to `max-w-[46rem]` at `text-[1.125rem] leading-[1.8]` (matches `CaseStudy.tsx`'s `Block` paragraph/list treatment); section labels now `text-[1.375rem] font-semibold` instead of unstyled `<h3>`s.
- Footer restyled to `border-t border-gray-200 py-16` with centered, non-underlined links (previously `border-t py-8` with underlined text) — same footer shape as `CaseStudy.tsx`, different link content (source/back, not email/chat).
- `TaskiV1.tsx`'s live to-do widget (the one piece of actual interactive UI on these pages, not prose) was left functionally untouched — only given the same `max-w-[46rem]` column and `font-medium` on its `Routine`/`Today` labels so it sits inside the same reading column as everything else instead of getting the full prose treatment.

**New: "More AI experiments" cross-linking, mirroring `CaseStudy.tsx`'s "More case studies".** Each experiment page now ends (after its footer, same ordering as `CaseStudy.tsx`) with a `MORE AI EXPERIMENTS` label + card grid listing the other entries from `data/experiments.ts` (current page excluded via its own route, e.g. `exp.link !== "/skim"`). Reuses the `experiments` grid's own card look rather than `WorkGridCard` (built for `Project`, not `Experiment` — different shape, different fields) — the inline `ExperimentCard` that used to live only inside `AIPlayground.tsx` was extracted to `src/components/ExperimentCard.tsx` so both the index grid and every case-study page's cross-link section render identically. With only four experiments total, "more" is simply the other three, shown at `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — same breakpoints as the AI Playground index.

---

### Addendum — design-system slider and explore canvas (`Slides`, reusable)

The component showcase used on ConnectIQ (design system) and Matter (Optic). Reuse it on any
case study by adding a `slides` block with `appearance: "figma"`; everything below comes with
it. Code: `src/components/Slides.tsx`, tokens in `src/components/nadiia.ts`.

**Data** (`src/data/projects.ts`)

```ts
{
  type: "slides",
  label: "Design system components",   // screen-reader name
  appearance: "figma",
  look: "light" | "darkMatter",         // optional, default light
  canvasRows: [["Table cells", "Files & media", "Text inputs"]], // optional
  slides: [
    {
      title: "Buttons",                  // the section chip
      gridOnly: true,                    // optional: too wide for the slider, canvas only
      images: [{ src, alt, width, bare?, backed? }],
    },
  ],
}
```

`width` is the component's real width in CSS px (Figma exports at 3×, or 2× for very wide
sets, with the component-set outline stripped). `bare`: the export brings its own card.
`backed` (Dark Matter only): a see-through or tiny component gets a surface-primary section.

**Looks**
- `light`: Figma's pale square grid (`FIGMA_SECTION_GRID`), each component on a white card
  with a soft shadow.
- `darkMatter`: charcoal panel with a faint square grid (`DARK_MATTER_AREA`), no card, a
  drop-shadow that follows each component's shape; `backed` components sit in a
  `DARK_MATTER_SECTION` on `DARK_MATTER_SURFACE`. No badges in showcases.

**Slider**
- The header (section chip + "Ready for dev") stays put while slides move; only the
  section name changes.
- Size: **100% of real size from 640px up, 75% on phones** (below 640px), via `--ds-scale`.
  Panel padding 24px, 16px on phones (the text's side padding).
- Opening position: a slide taller or wider than the panel opens at its **top-left**; a slide
  that fits is **centred**. Stops re-aligning once the person scrolls the panel.
- Auto-advances, pauses on hover and focus; arrows and dots inside the panel.

**Explore canvas** (every component on one pannable, zoomable plane)
- Enter, desktop (1024px and up, with a mouse): hovering a component shows the cursor label
  "Click to explore"; clicking opens the canvas.
- Enter, below 1024px or on any touch screen: **no hover label**; a **"Tap to explore"**
  button is always visible top-right of the panel (shown by CSS, `lg:hidden`, so a narrowed
  desktop window gets it too).
- Exit: Esc, or the top-right button: "Press Esc to exit" on desktop, "Tap to exit" below
  1024px or on touch. Both floating buttons carry `CANVAS_BUTTON_SHADOW`.
- Size: the canvas **opens at the same size as the slider** — 100% on desktop and tablet,
  75% on phones — and with the clicked component exactly where it was, so nothing jumps.
  From there: drag to pan (the grid moves and scales with it, so it never ends), pinch or
  ctrl-scroll to zoom between 30% and 300%.
- Sections appear one per row in slide order; `canvasRows` puts named sections side by side,
  placed where the first of them would be. `gridOnly` slides appear here but not in the slider.
- Gesture hint: on phones and touch screens the canvas shows a **"Pinch to zoom"** pill at the
  bottom, in `CANVAS_HINT_PILL` + `CANVAS_BUTTON_SHADOW` with the conventional pinch-hand icon.
  It fades away for good the first time two fingers zoom. It is the same pill as a long
  screenshot's "Scroll to see more", so every gesture hint on the site looks the same — reuse
  the token rather than restyling it per page.

# Design System — niia.design (v6, historical — see v7 above for the current direction)

**v6 was the pass that introduced the stefanietam.com-driven brutalist direction** (Cargo-template references before it, v1–v5, are further below). Read this section for the reasoning behind the current header/About shape; its Experience layout, Selected Work layout, hover treatment, and typeface call were each superseded by v7 above.

## v6 — brutalist single-type-size system, driven by stefanietam.com

### Reference analysis — inspected live (computed styles + fetched CSS, not guessed)

Stefanie Tam's site is a Cargo-style portfolio but far more restrained than the earlier Cargo references: **one typeface, one font-size, one weight, everywhere.** Hierarchy comes entirely from layout position, spacing, and a hover-only border, not from a type scale.

**Typography**
- One custom face (`sansNarrow`, actually Helvetica LT Narrow) at a single `22px / 24px line-height`, `400` weight, `0.75px` letter-spacing, `-1px` word-spacing, applied to literally every piece of text on the site — nav, intro paragraphs, project metadata, captions, footer, index numbers. No h1/h2/h3 scale at all.
- `-webkit-text-stroke: 0.35px black` on the root — a hairline stroke added because a narrow/condensed grotesk at body size reads a little too light otherwise; effectively a fake font-weight nudge.
- Color is flat black on white throughout. No opacity-based hierarchy, no gray ramp.

**Spacing — a small set of CSS custom properties drive the entire layout:**

| Token | Value | Used for |
|---|---|---|
| `--horizontalMargin` | 16px | Page gutter, left/right |
| `--verticalMargin` | 14px | Page gutter top/bottom; gap between a project's meta row and its image |
| `--lineHeight` | 24px | Base line-height; also the vertical margin around block text |
| `--projNumWidth` | 45px (35px on mobile, ≤800px) | Width reserved for the leading index number column (e.g. `01`) |
| `--rightsideButtonWidth` | 40px | Width reserved for the trailing "view" link |
| `--centeredTextWidth` | 556px | Fixed width of every centered text column (intro, footer bio) |
| `--maxContentWidth` | `calc(100% - 2 × projNumWidth)` | Caps image/content width so it stays symmetric with the indented project number |

Nothing is guessed/eyeballed on that site — every gap is one of these six numbers. That's the "pay attention to padding" lesson to actually take from it: pick a handful of spacing constants up front (gutter, row gap, label gap) and reuse them everywhere, rather than ad-hoc `mt-4`/`mt-6` per section like today.

**Header pattern** — `#headerContainer { display: flex; justify-content: space-between }`: a single-line flex row, left content vs. right content, nothing centered in the row itself. On stefanietam.com: left = a time-of-day/date sentence, right = an `info` link.

**Hover pattern — the "brutalism" the client called out explicitly:**
```css
a { color: currentColor; text-decoration: none; }
.projectView, #infoButton { border-bottom: 2px solid white; } /* reserved, invisible */
@media (any-hover: hover) {
  .projectView:hover, #infoButton:hover { border-bottom: 2px solid currentColor; }
}
```
Never `text-decoration: underline` — instead a `2px solid` border-bottom that's present-but-transparent (`white`, i.e. matches the page background) by default, so no layout shift, and swaps to `currentColor` on hover. Color never changes on hover or on active/current state. **This directly contradicts our current CSS** (`src/index.css`: `a:hover { color: #fbbaac }`, `.nav-active { color: #fbbaac }`) — both need to be replaced by this border-bottom technique when this ships.

**Case-study row pattern** — each project is one `.project` block:
1. A meta row: `01` (index, fixed 45px column, floated left) — `Inventing ELIZA` (name) — `2026` `MIT Press` `Publication` (year/client/category, hidden below the `desktop` breakpoint) — `01/11` (slide counter) — all as inline `<span class="projectLabel">` with `margin-right: 20px` between them — and `view` floated to the far right of the row, in its own hoverable underline.
2. Directly below, one full-bleed-height-capped image, **centered** (not left/right aligned, not full page width): `width: 1101px` capped by `maxContentWidth`, aspect ratio ~1.5 (landscape) or `.shortened` at 825px/0.75× for taller/portrait assets — margin `14px` top and bottom.
3. A caption/description paragraph is available (shown on hover as an overlay in the reference's interactive carousel — we don't need the hover-reveal mechanic, just the row+image structure).
4. Rows repeat, one under the other, each its own full-width block — exactly the "each case study occupies one row of content" structure requested.

**Footer(s)** — two separate things on the reference, worth keeping distinct:
- A bio/credits block at the very end of the scroll, in the same centered 556px column as the intro (not a spread-out bar).
- A **separate, actually-pinned bottom bar** (`#bottom-nav { position: fixed; bottom: 0; display: flex; justify-content: space-between }`) — this is the "letters spread around the bottom" pattern the client means. On the reference it holds a project-jump index + a "top↑" button; the *idle-screensaver* caption line under it is a `.marquee` (a scrolling ticker) — the one animated/running element on the whole site. Client explicitly wants the pinned-bar structure **without** the marquee's running motion.

### How this maps onto niia.design

**1. Header (`Nav.tsx`) — replaces the current centered `Hero.tsx` block entirely.**
Single-line, `justify-content: space-between`, non-sticky-huge, sitting where the reference's date sentence + `info` link sit:
- **Left:** `Niia Bieliavtseva` — `Senior Product Designer, AI Design Engineer` (the two lines currently centered mid-page move up here, left-aligned, stacked or run in one line — not centered, not huge display type; same 1-size-fits-all treatment as the reference).
- **Right:** our real nav links — `About`, `AI Playground`, `Contact` — in place of the reference's single `info` link. Same hover rule as below.
- This means `Hero.tsx` is retired as a big centered block; its content (name, position, mail/LinkedIn) folds into this header. Mail/LinkedIn can live here too, or move to the footer bar (see below) — leaning toward footer, since the header should stay a single terse line like the reference's.

**2. About — takes the reference's centered intro slot.**
Where the reference centers its three `ST specializes in…` / `ST designs with…` / `ST art directs at…` lines in a fixed `556px` column with generous (`191px` desktop / `48px` mobile) top/bottom padding, we put our own About copy in that exact slot:
> "I help startups and scale-ups turn complex, AI-driven products into interfaces people actually use."
> "I design interfaces and build them into working products with AI — from narrative websites to data-rich dashboards, closing the gap between idea and shipped."

Same treatment: one centered column, generous vertical whitespace, flat text, no card/border. The reference's hanging `"ST"` label-per-line (`li::before { content: "ST" }`) is a nice detail but optional — skip it unless it reads well once built; the two-paragraph copy doesn't obviously need a per-line label the way three parallel "ST ___" bullets do.

**3. Experience — sits directly under About, title centered.**
"Title in the center, right below the About section, and then the description" — open layout call per the client, not derived from the reference 1:1. Simplest version consistent with the rest of the system: a centered `Experience` heading (same weight/size as everything else — no bigger), then the existing Freelance/Overspace/Leap content below it, left-aligned in the same centered column width (or full-width — decide once About is built and this can be judged against it). Not over-engineered — this is the one section where "however you feel like, without going too crazy" applies.

**4. Selected Work → "case studies" — replaces the current 4-col cropped grid (`WorkGridItem.tsx` / the `grid-cols-2 sm:grid-cols-4` grid in `Home.tsx`) with stacked full-width rows, reference-accurate:**
- Drop the "Selected Work" section title entirely (explicit ask).
- Each project = one full-width row:
  - **Name on the left**, **`view` (lowercase) on the right** — same line, matching the reference's name-row/view-link pairing (`.projectView { float: right }` equivalent).
  - Below that row, the **screenshot, centered** (not stretched full-width, not cropped into a grid cell) — sized by its own aspect ratio like the reference's `carouselArea` (~1.5 landscape default, a taller/narrower variant for portrait captures), capped by a max content width so it never runs edge-to-edge.
  - A second meta line using the reference's "labels with padding between strings" idea, built from data already in `projects.ts` — same `margin-right` gap technique (`.projectLabel` = `20px` gap) applied to: **category** (`iOS App, AI`) — **name** (`Wellness AI Companion`) — **summary** (`AI-first iOS wellness app…`). Client's own example ("`01 padding, Inventing Eliza padding, 2026 padding`" → "`Wellness iOS Wellness AI Companion padding, iOS app AI padding, short description`") maps directly to `project.category` / `project.name` / `project.summary` — no new data fields needed, just a new layout for the existing ones. This is explicitly a "let's try it and see" per the client — if the three-strings-in-a-row reads cluttered once built with real content, collapse to two lines instead of fighting the pattern.
  - Rows stack vertically, one under the next, each full width — replacing the current 2-up/4-up grid entirely.
  - Click behavior unchanged from v3: whole row/image navigates to `/work/:slug` (kept — no lightbox, we have real destination pages, that part of v3's reasoning still holds).
- `WorkGridItem.tsx` is retired in favor of a new row-shaped component (name TBD, e.g. `WorkRow.tsx`).

**5. Footer — static "letters spread around the bottom," not a marquee.**
Adopt the reference's `#bottom-nav` structure (`position: fixed; bottom: 0; display: flex; justify-content: space-between`) but with static content instead of a project-jump index, and explicitly **no running/marquee motion**:
- `Email` — `LinkedIn` — `Résumé`, spread across the fixed bottom bar (`space-between`, matching what `Footer.tsx` already does structurally — this mostly validates the existing component's layout, just needs the hover treatment fixed per point 6 below, and Mail/LinkedIn could consolidate here if dropped from the header per point 1).

**6. Hover state — resolved, applies site-wide, replaces the current tint.**
Every link (nav, footer, "view", in-copy links) switches from the current color-tint hover (`a:hover { color: #fbbaac }` in `src/index.css`) to the reference's border-bottom technique:
```css
a {
  color: inherit;
  text-decoration: none;
  border-bottom: 2px solid transparent; /* reserve the space, no shift on hover */
  padding-bottom: 1px;
}
a:hover {
  border-bottom-color: currentColor;
}
```
No color change, ever — on hover or on `.nav-active`/current-page state. `WiggleText.tsx`'s wiggle animation is a separate, unrelated interaction and can stay layered on top of this if still wanted — worth a quick gut-check once this ships, since "brutalism, nothing moves except the underline" is somewhat in tension with a wiggling nav label; flag it rather than silently dropping either.

### Typeface — reopened: Inter, not ABC Diatype

Per explicit direction, drop ABC Diatype (which was also blocked on an unresolved trial-license question, see v1/v2 notes below) and start with **Inter** — one weight, one size, site-wide, matching the reference's single-face philosophy. Inter is open-source (SIL OFL), so the trial-license flag that blocked Diatype doesn't apply. Concretely:
- Load Inter (variable font, self-hosted or `@fontsource/inter`) at one weight (400, maybe 500 for the header/name) — resist the urge to reintroduce the v3-era 300–950 multi-weight scale; the whole point of this direction is one size/weight carrying everything, exactly like the reference.
- Client floated possibly pairing **Courier** (monospace) in later for a Diatype-Mono-style caption/index role, "but let's start with Inter side by side" — i.e. not yet. Revisit once the Inter-only pass is built and there's a real caption/index-number use case (e.g. the `01/11`-style counter) to justify a second face.
- `public/fonts/diatype/` and the 14 `@font-face` declarations in `src/index.css` get removed once Inter is wired in; `--font-sans` in the `@theme` block points at Inter instead.

### Explicitly unchanged

- **Site structure** — still four destinations: Home (`/`), About (`/about`), AI Playground (`/ai-playground`), Contact (`mailto:` link, not a page). Nothing here adds or removes a route.
- **Case-study page internals** (`CaseStudy.tsx`, `Zoomable.tsx`, per-project content in `projects.ts`) — this pass is about the homepage's header/about/work-list/footer, not the project detail pages.
- **White background, two-tone (black/white) color system** — the reference reinforces this again, third reference in a row to do so.

### Open questions / judgment calls left for the build pass

- Exactly how Mail/LinkedIn split between the new header and the footer bar (both currently exist in `Hero.tsx` and `Footer.tsx`) — leaning footer-only to keep the header a single terse line, but not decided.
- Whether the case-study three-label row (category / name / summary) needs the reference's responsive collapse (hide category+summary below a breakpoint, show only name) the way `.desktop`-class labels hide on the reference's mobile — likely yes, same reasoning (a name-only row prevents wrapping chaos on narrow screens).
- Whether Experience's centered title should share the About column's `556px`-equivalent max-width or run full-width — "decide it later" per client.

---

# Design System — niia.design (v3, historical — see v6 above for the current direction)

Direction change, driven by a reference site: **[719301.cargo.site](https://719301.cargo.site/)** (a Cargo "Graphic X808" demo template). This supersedes the brutalist bordered-card system documented previously (see "What changed from v1" at the bottom). The v2 spec below is now built. See "v3 — site structure & footer" at the bottom for what changed since, driven by a second reference: **[830822-a.cargo.site](https://830822-a.cargo.site/)** (Cargo "Template B421").

## Reference analysis — what the Cargo site actually does

Inspected live (computed styles + DOM), not guessed.

**Typography — three roles, not one:**

| Role | Reference font (Cargo-licensed) | Weight | Character | Where it's used |
|---|---|---|---|---|
| UI / nav | `Diatype Variable` | 600 | Clean grotesk sans, small, tight line-height | Top nav row, "Name:/Client:/Year:" labels, project title/ref/year row |
| Display | `Gravity Variable` | 700 | Bold condensed/expanded slab-grotesk, large, tight negative tracking (roughly ‑1.7% of size) | The single giant centered headline only |
| Index / caption | `Diatype Mono Variable` | 600 | Monospace, very small (~7–11px), low opacity | Image captions ("016.01—02"), the numbered index rows (01–16) at the bottom |

Hierarchy is built from **size + opacity**, not color: black text at 0.6 opacity (captions) → 0.8 (nav/body) → 0.9 (hero). No gray tokens, no second hue — still a two-tone system like v1, just modulated by alpha instead of a fixed gray.

The whole type scale is **fluid** — the site sets a `--base-size` custom property off viewport width and everything (including the ~398px-tall headline) is expressed as a multiple of it, so type genuinely scales continuously with window size rather than jumping at breakpoints.

**Layout pattern — the part we're adopting:**

- A persistent, single-line **3-column header**: left = primary nav links inline ("Selected Work   Index"), center = a small secondary line, right = a single secondary link ("Information"). All one baseline, all small type.
- Below the header, a tall block of empty vertical space, then a **centered hero** — in the reference this is one giant word; the whole page is designed around that centered hero as the first thing you see.
- Further down, the **project index**: each entry is a meta row — *Name / Ref / Year / arrow-link* — laid out in columns, directly followed by one or more **full-bleed images with no border/frame**. Image count and aspect ratio vary per entry (some single wide image, some two images side by side) — never forced into one fixed shape. A tiny mono caption sits near each image.
- A closing **numbered index** (01–16) lists every project again as plain text rows (title / ref / year / arrow), for quick scanning/jump-to.
- Clicking a project image is a lightbox-style zoom in the reference (pure image viewer, since it's a template with no real destination pages).

## What we're taking from it, and how it adapts to niia.design

**1. Header — persistent 3-column nav row**
Same pattern as the reference: small text, one line, left links + right link, nothing centered in this row. Replaces the current stacked header block.
- Left: quick in-page nav (candidates: `Work`, `Experience` — TBD, see open questions).
- Right: `About` (per your note) and/or contact.
- No center content in the nav row itself — the centering happens one level down, in the hero.

**2. Hero — centered, but not a giant single word**
The reference centers one huge glyph-cluster ("N. 8U9A") in the middle of the page. We are explicitly **not** doing that. Instead the centered block contains real content, stacked and centered as a unit:
- Name — Niia Bieliavtseva
- Position — Senior Product Designer, AI Design Engineer
- Links — Mail, LinkedIn
- About — short intro text/link

This keeps the reference's "generous whitespace, centered focal block" feeling without borrowing its empty-vanity-headline move.

**3. Experience section**
Sits directly below the hero. Content stays as it is today (Freelance / Overspace / Leap) — this section only needs the new type scale and spacing applied, not a content rewrite.

**4. Selected Work section — below Experience**
This is where most of the reference's visual language actually lands:
- Each project = a **Name / Client / Year** meta row, styled like the reference's Name/Ref/Year row, sitting directly above its image(s).
- **No border around screenshots.** Drop the `border` wrapper class the current `ProjectCard` puts around `cardImage`.
- **Screenshots run bigger** — full container width, not constrained inside a bordered box with padding.
- **Not forced to square.** One project can show one large screenshot; another can show two or three, and aspect ratio is whatever suits that screenshot — square, rectangular, horizontal, or vertical, matching the reference's varied gallery layouts further down its page.
- **Click behavior diverges from the reference on purpose:** the reference opens a lightbox zoom (it has nowhere real to send you). We have real case study pages, so clicking a screenshot should do what `ProjectCard` already does today — navigate straight to `/work/:slug` — just without the border and at the larger size. No lightbox needed.

**5. Borders, generally**
The hairline `border` around every portfolio card is retired. Section-dividing hairlines (`border-b` between sections) can stay if they still read well at the new scale — screenshots specifically are always frameless now.

## Color (carried over from v1, unchanged in spirit)

Still two-tone, still no accent/brand color, still no dark mode — the reference reinforces this rather than contradicting it. Only change: consider expressing hierarchy via opacity steps (0.6 / 0.8 / 0.9 on black) the way the reference does, instead of a single flat text color, if the new type scale needs it to read well.

## Typeface — resolved: ABC Diatype

Decided. `/font/` contains **ABC Diatype** (Dinamo Typefaces) as local `.otf` files — this becomes the UI/body/nav role (and, absent a separate display face, the hero role too, leaning on its heaviest weights):

| Weight | Files present |
|---|---|
| Light (300) | Light, LightItalic |
| Regular (400) | Regular, RegularItalic |
| Medium (500) | Medium, MediumItalic |
| Bold (700) | Bold, BoldItalic |
| Heavy (800) | Heavy, HeavyItalic |
| Black (900) | Black, BlackItalic |
| Ultra (950) | Ultra, UltraItalic |

⚠️ **These are named `*-Trial` — evaluation copies, not a production webfont license.** Dinamo trial fonts are typically restricted to personal/offline evaluation and are not cleared for deployment on a live public site. Before this ships to niia.design in production, confirm a webfont license has been (or will be) purchased from Dinamo for ABC Diatype — otherwise swap in a licensed/free alternative before launch. Fine to build and preview with the trial files in the meantime.

**Hero/display role — resolved:** no separate display face. Diatype Black/Ultra (900/950) carries the hero (Name/Position block), keeping the whole site on one type family.

**Mono/caption role — resolved:** no dedicated mono face sourced. Captions and the numbered project-index treatment use a system mono stack (`ui-monospace, "SF Mono", Menlo, monospace`) rather than a matching `Diatype Mono`.

**Wired up:** font files live in `public/fonts/diatype/` (copied from `/font/`, the two accidental `* 2.otf` duplicates dropped). `@font-face` rules for all 7 weights × normal/italic are declared in [src/index.css](src/index.css), and `--font-sans`/`--font-mono` are set via Tailwind's `@theme` block so the existing `font-sans`/`font-mono` utilities resolve to Diatype/system-mono. `index.html`'s `<body>` switched from `font-serif` to `font-sans`.

- ~~Left-nav link set~~ — **resolved, see v3.** `Experience` / `Selected Work` left, `About` right.
- ~~Does "AI Playground" survive~~ — **resolved, see v3.** Moved off the homepage entirely, now its own page (`/ai-playground`).
- ~~Per-project image sets~~ — **superseded, see v3.** The Selected Work grid now uses one cropped cover image per project (`screenshots[0]`, via `object-fit: cover`) rather than the multi-image/varied-aspect treatment described here.

## What changed from v1

- ~~Zero border-radius / hard rectangles everywhere~~ — not addressed by this pass either way, no reference signal against it, kept implicitly.
- ~~One font weight (400) everywhere, no bold~~ — **retired.** The reference's hierarchy depends on weight contrast (400/600/700 across the three type roles) and opacity, not on uniform weight.
- ~~1px hairline border framing every portfolio card~~ — **retired for screenshots.** Section-level hairlines may still stand.
- ~~Single flat text color (`neutral-700`)~~ — **under reconsideration.** May move to opacity-based hierarchy on black instead of a fixed gray.
- Hero layout — **new.** v1 had no concept of a large centered focal hero; this is introduced now, adapted from the reference (see above — explicitly not the giant-single-word version).

## v3 — site structure & footer

Driven by a second reference, **[830822-a.cargo.site](https://830822-a.cargo.site/)** ("Template B421"): a persistent name+date top bar, a title+paragraph+divider pattern per section ("Proposal A/B/C"), a 4-column image grid where some cells span 2+ columns (`A5 — 2:1`, `A6 — 2:1`), and a pinned-bottom bar (`Email` / `Proposal: A. B. C.`).

**Page split — About reverted back to a homepage section.** An earlier pass tried About as its own page (`/about`); that's been undone per explicit feedback — it belongs inline on the homepage, directly under Hero, as it was originally. Current structure:
- **Home (`/`)** — Nav, Hero (name/position/contact links), **About**, Experience, Selected Work, then the footer watermark.
- **AI Playground (`/ai-playground`)** — still its own page. Reached via the "with AI" link inside the About copy, and via Nav's `About` link chaining through (no dedicated AI Playground nav entry).
- **Experience** stays on the homepage, same as About.

**Nav (`Nav.tsx`).** Top bar mirrors the reference's minimal pattern: `Niia Bieliavtseva` (links home) left, `About` right. Since About is a homepage section again (not a page), its Nav link uses `SectionLink.tsx` — same-page scroll anchor when already on `/`, or `<Link to="/" state={{ scrollTo: "about" }}>` from any other page (AI Playground, case studies), with `Home.tsx` reading `location.state.scrollTo` in a `useEffect` to scroll there once rendered. (This is the second time this mechanism has been built/deleted/rebuilt this session — it's needed exactly when a section lives only on the homepage but must be reachable from other pages.)

**Title-left / content-right pattern (`TitledSection.tsx`).** At wider viewports the reference's "Proposal A" row is actually a two-column layout — a narrow title column on the left, body copy in a column pushed to the right (not stacked, as first assumed) — confirmed by re-inspecting a wider screenshot. New shared component: `md:flex-row` with the title `md:w-40 md:shrink-0` and the content `md:ml-auto md:max-w-xl`, stacking to title-above-content on mobile (`flex-col` below `md:`). Used by both the About and Experience sections. Incidentally fixes the "wide monitors → hard-to-read case-study prose" risk flagged just above, at least for these two sections — content is now naturally capped at `max-w-xl` instead of running edge-to-edge, since it sits in its own right-hand column. Not yet applied to Selected Work's or AI Playground's headings — ask if full site-wide consistency is wanted there too.

**Full-width, site-wide.** Every page's outer `mx-auto max-w-4xl` / `max-w-5xl` wrapper is gone — Nav, Hero, Experience, Selected Work, About, AI Playground, and case study pages all now run edge-to-edge (bounded only by the body's existing `p-4` gutter), matching the reference's near-full-bleed layout. This reverses the earlier "keep Experience/intro narrower for readability" decision — worth watching on very wide monitors where long-form case-study prose in particular may get harder to read at full width; flag it if that turns out to be a problem in practice.

**Selected Work grid.** Replaced the single-column/2-column screenshot stack with a 4-column grid (`grid-cols-2 sm:grid-cols-4`) matching the reference's variable-span pattern: the first row is 2 "wide" cards (`col-span-2`, `aspect-[2/1]`), the second row is 4 "square" cards (`col-span-1`, `aspect-square`). Each cell shows one `object-fit: cover` cover image (`screenshots[0]`) rather than the earlier natural-aspect/no-crop treatment — cropping to a fixed cell shape is inherent to this grid pattern, a deliberate tradeoff from the "never crop" stance in v2. **Only 4 real projects exist today**, so the second row duplicates the last two (`Digital Screen Co.`, `Hirement`) as placeholders — swap in real projects there as they're added. `ProjectCard.tsx` (the old multi-image gallery card) is retired; `WorkGridItem.tsx` replaces it.

**Footer.** Two pieces, both global (mounted once in `App.tsx`, visible on every page):
- A `position: fixed` bottom bar (`Footer.tsx`) — `Email` left, `LinkedIn` right — matching the reference's pinned-bottom `Email` / `Proposal: A. B. C.` bar. Every page's `<main>` needs `pb-24` instead of `py-16` so content doesn't render under it.
- A large, pale (`text-neutral-200`) watermark of her name at the very end of the homepage's content, echoing the reference's "Test Studio Inc." top-bar styling repurposed as a sign-off — homepage only, not repeated on every page.

**Background** — pure white (`bg-white`), carried over unchanged from the earlier white-background request.

## v4 — standalone About page (`/about`)

Adds a full `/about` page alongside (not replacing) the homepage's short About section — both are kept per explicit direction, reversing nothing from v3's "About lives on the homepage" call for the existing blurb. Nav (`Nav.tsx`) gained a second link, `My Story`, a plain `<Link to="/about">` sitting next to the existing `SectionLink id="about"` (which still scrolls to the homepage blurb).

`About.tsx` follows established patterns rather than introducing new ones: `<Nav />` + a `CaseStudy`-style `border-b` header block, a `TitledSection` for the "Story" narrative (title-left/content-right, matches Home's About/Experience), then a run of `Home`-style full-width sections (`<h3 className="mb-6 border-b pb-2">`) for Journey, Values, Outside of Work, and a closing CTA — the same heading treatment "Selected Work" already uses on the homepage.

**`Journey.tsx`** (new component) — a brutalist reinterpretation of a "career timeline with hover states" (the reference point was benshih.design/about's staggered, hover-expanding role list, adapted to this site's two-tone system instead of copying its colored pills). Each milestone is a full-width hairline-bordered row, progressively indented via inline `marginLeft` (staircase effect, capped small enough to survive mobile). On hover the row inverts to solid black/white and a detail panel (description + bullets) expands open using the CSS grid `grid-template-rows: 0fr → 1fr` height-animation technique — no JS state, no color introduced. Milestone copy reuses the same three real chapters as the homepage Experience section (Leap, Overspace, Freelance/AI) but is not literally duplicated text.

Content still uses the established `[bracketed — TK]` convention (e.g. `[Notable client outcome — TK]`, `[Medium — TK]`) for placeholder specifics the same way Home.tsx's Leap blurb already does — swap in real details before shipping.

## v5 — AI Playground polish

- **`Zoomable.tsx`** (new component) — wraps a screenshot so clicking it opens a fullscreen lightbox (click backdrop or Escape to close). Applied to every screenshot inside a case study page (Taski, Skim, 08) — this is separate from the v3 decision not to lightbox the homepage's Selected Work grid, which still navigates straight to the case study instead.
- **AI Playground grid thumbnails** — cards previously showed each screenshot at its natural aspect ratio, which misaligned card heights when screenshots varied in shape. Thumbnails are now a fixed-height (`h-56`/`lg:h-72`) `object-cover` crop so every card lines up.
- **Taski's origin story dropped the ADHD framing** — the "built for my wife, who has ADHD" framing (and the clinical light-sensitivity stat backing the theming decision) was written from her husband's point of view and doesn't fit the portfolio speaking as Niia. Reframed as built for "a few family members and friends," keeping the design reasoning (red-as-learned-convention, real theming over one "correct" palette) without the clinical specifics.
- **Taski — first version (`TaskiV1.tsx`, `/taski-v1`)** — the original in-browser to-do list (routines + a daily list, saved to `localStorage`) that predated the native Mac app, restored as its own live AI Playground entry rather than left to rot in git history. Framed explicitly as "the first version"; the current Taski page links back to it, and it links forward to the Mac app.

### Addendum — Niia AI (select-to-ask chat sidebar)

Reference: [rachelchen.tech](https://www.rachelchen.tech/)'s "RacheLLM" feature (live-inspected via the Browser tool, not guessed from screenshots) — a header link plus a floating "Ask ___LLM" pill that appears on text selection anywhere on the page, both opening a right-hand chat sidebar. No model is wired up yet, matching the client's explicit ask: canned, keyword-matched answers only, same as a rule-based FAQ bot pretending to be a chat. **Renamed from "Niia LLM" to "Niia AI"** after the initial build (component/file names left as-is — `niiaLLM.ts`, `useNiiaChat`, etc. — since those are internal, only user-visible strings changed).

- **New files**: `src/context/chatContext.ts` (the `NiiaChatContext` object + shared types, kept in its own file per `react-refresh/only-export-components`), `src/context/NiiaChatContext.tsx` (the `NiiaChatProvider`, owns `isOpen` / `messages` / `pendingQuote` / `isTyping` / `suggestions` state), `src/context/useNiiaChat.ts` (the consumer hook), `src/lib/niiaLLM.ts` (keyword → canned-answer table, the follow-up question pool, and `pickFollowUps()`), `src/components/NiiaChatSidebar.tsx` (the panel UI), `src/components/SelectionAskTooltip.tsx` (the floating pill).
- **Entry points**: the header (`Nav.tsx`) gets a `✦ Niia AI` button (styled like `AIPlaygroundNavLink`'s siblings, not an `<a>` since it doesn't navigate — hover color added manually since the global `a:hover` CSS rule doesn't reach buttons) that opens the sidebar in its empty "welcome" state. Selecting any text on the page (except inside the sidebar itself, excluded via a `data-niia-chat-sidebar` attribute check) shows a floating orange pill, `✦ Ask Niia AI`, positioned above the selection (`selectionchange` + `getBoundingClientRect`, hidden on scroll); clicking it opens the sidebar with that text staged as a dismissible quote chip above the input, same two-entry-point structure as the reference.
- **Layout — reflow, not overlay.** Matching the reference's own behavior (verified by opening it): the sidebar pushes the page rather than floating over it. `App.tsx` wraps the routed content in a div that gets `sm:mr-[380px]` when `isOpen`, and `Footer.tsx` (which is `fixed`, so a parent margin doesn't reach it) independently reads the same context to swap `right-0` for `sm:right-[380px]`. Full-width overlay below the `sm` breakpoint since there's no room to reflow on mobile. Both transitions animate (`transition-[margin-right]` / `transition-[right]`), and the sidebar itself slides/fades via a `.niia-sidebar` CSS transition rather than mounting/unmounting outright, so open/close reads as motion instead of a hard cut.
- **Canned answers, not a live model** — `getCannedAnswer()` in `niiaLLM.ts` does word-boundary keyword matching (falling back to plain substring only for keywords regex can't bound, e.g. accented words) against real content already on the site: About's values and Outside-of-Work section, Home's intro/Experience section, and a dedicated entry per case study in `projects.ts` (so "have you worked with wellness apps?" lands on the actual Wellness AI Companion case study, not a generic AI blurb). 10 varied fallback lines (randomly chosen) replace a single repeated dead-end, all still routing back to `CONTACT_EMAIL`. The sidebar header's ⓘ icon states the same "pre-written, not live" caveat on hover/title — deliberately not hidden, since the client's own framing was "we will not be wiring up Claude" yet.
- **Tone rewrite** — answers were rewritten against `case-study.md`'s tone-of-voice guide (the same Ben Shih–derived rules used to rewrite the Wellness AI Companion case study copy): first person, contractions, short sentences, self-aware honesty about being a pre-written FAQ rather than pretending otherwise (e.g. the welcome line: "Hey, I'm Niia AI — the pre-written version of her, anyway.").
- **Bullet-list answers** — a `CannedAnswer.answer` string can contain `"- "`-prefixed lines; `renderAnswer()` in the sidebar splits on `\n` and renders consecutive bullet lines as a real `<ul>`, everything else as `<p>` blocks. Used for the "I'd love to hire you" answer (modeled on benshih.design's hire-me answer: reachability bullet, current-work bullet, a closing "happy to refer someone else" bullet).
- **Known-term auto-linking** — `linkifyKnownTerms()` turns bare mentions of the contact email, "LinkedIn", "résumé"/"resume", or any of the four case-study names (`PROJECT_LINKS` in `niiaLLM.ts`) into real links inline in a bot answer's own prose — `mailto:`/external via `<a>`, case-study names via react-router's `<Link>` so navigating to `/work/:slug` doesn't unmount the chat (it lives outside `<Routes>` in `App.tsx`, so the conversation and open/closed state survive the navigation). Restricted to bot messages only — a user's own typed text isn't linkified.
- **Follow-up suggestions** — after the welcome set, every answer is followed by 3 fresh suggested questions from `FOLLOW_UP_QUESTIONS` (`pickFollowUps()`), usually 2 professional + 1 personal, sometimes all 3 professional (never more personal than professional). A `shownSuggestions` ref in the provider tracks every suggestion ever shown so nothing repeats within a session; `reset()` clears it back to the welcome 3.
- **Quote handling**: a staged quote (`pendingQuote` in context) is shown as a chip with its own dismiss `✕`; sending a message attaches it to that one `ChatMessage` (rendered as an italic blockquote above the question) and clears the pending state — a fresh selection stages a new quote rather than accumulating multiple.
- **Reset (`↺`) vs close (`✕`)** in the sidebar header: reset clears `messages`/`pendingQuote`/`suggestions` back to the welcome state without closing the panel; close hides it (`isOpen = false`) but the conversation isn't cleared, so reopening via either entry point resumes where it left off.
