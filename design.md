# Design System — niia.design (v3)

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
- ~~Does "AI Experiments" survive~~ — **resolved, see v3.** Moved off the homepage entirely, now its own page (`/ai-experiments`).
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
- **AI Experiments (`/ai-experiments`)** — still its own page. Reached via the "with AI" link inside the About copy, and via Nav's `About` link chaining through (no dedicated AI Experiments nav entry).
- **Experience** stays on the homepage, same as About.

**Nav (`Nav.tsx`).** Top bar mirrors the reference's minimal pattern: `Niia Bieliavtseva` (links home) left, `About` right. Since About is a homepage section again (not a page), its Nav link uses `SectionLink.tsx` — same-page scroll anchor when already on `/`, or `<Link to="/" state={{ scrollTo: "about" }}>` from any other page (AI Experiments, case studies), with `Home.tsx` reading `location.state.scrollTo` in a `useEffect` to scroll there once rendered. (This is the second time this mechanism has been built/deleted/rebuilt this session — it's needed exactly when a section lives only on the homepage but must be reachable from other pages.)

**Title-left / content-right pattern (`TitledSection.tsx`).** At wider viewports the reference's "Proposal A" row is actually a two-column layout — a narrow title column on the left, body copy in a column pushed to the right (not stacked, as first assumed) — confirmed by re-inspecting a wider screenshot. New shared component: `md:flex-row` with the title `md:w-40 md:shrink-0` and the content `md:ml-auto md:max-w-xl`, stacking to title-above-content on mobile (`flex-col` below `md:`). Used by both the About and Experience sections. Incidentally fixes the "wide monitors → hard-to-read case-study prose" risk flagged just above, at least for these two sections — content is now naturally capped at `max-w-xl` instead of running edge-to-edge, since it sits in its own right-hand column. Not yet applied to Selected Work's or AI Experiments' headings — ask if full site-wide consistency is wanted there too.

**Full-width, site-wide.** Every page's outer `mx-auto max-w-4xl` / `max-w-5xl` wrapper is gone — Nav, Hero, Experience, Selected Work, About, AI Experiments, and case study pages all now run edge-to-edge (bounded only by the body's existing `p-4` gutter), matching the reference's near-full-bleed layout. This reverses the earlier "keep Experience/intro narrower for readability" decision — worth watching on very wide monitors where long-form case-study prose in particular may get harder to read at full width; flag it if that turns out to be a problem in practice.

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
