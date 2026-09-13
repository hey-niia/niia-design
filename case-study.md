# Case Study Framework

Reference model: [Ben Shih — "Redesigning Lokalise User Onboarding"](https://www.benshih.design/case-study/onboarding)

Use this file as the standard to check existing case studies against, and as the outline for writing new ones. It has three parts: the **structure** (what sections and sub-parts must exist), the **content rules** per section (what makes each part actually good, not just present), and the **tone of voice** guide.

---

## 1. Structure at a glance

```
Overview
  ├─ Title (outcome-phrased)
  ├─ One-line summary
  ├─ My role
  ├─ Team
  ├─ Timeline
  └─ Impact Overview (3 stat cards)
Problem
  ├─ Why we started (business context + the red flag metric)
  ├─ How I tackled it (numbered research steps)
  └─ The frictions found (rule-of-3 synthesis, each with evidence)
Solution
  ├─ Team ideation (workshop / sprint)
  ├─ Concepts generated (bullet list, mapped to frictions)
  ├─ Testing the concepts (what validated, what didn't)
  └─ Iteration (visual proof of refinement)
Final design
  └─ Per shipped surface: before/after + metric(s) + why it moved
Results
  ├─ Headline impact rollup (3 bullets max)
  ├─ Real user quote, attributed
  ├─ Further reading (optional, adds credibility)
  ├─ Downloadable artifact/template (optional, adds practical value)
  └─ Link to more case studies
```

### Choosing the depth

**Not every project earns the full structure, and forcing it is obvious.** The
shape above is for a flagship: months of work, a research process, and numbers
you're allowed to publish. Most projects aren't that. Pick the tier that matches
the evidence you actually have.

| Tier | Use when | Shape |
|---|---|---|
| **Full** | Months of work, documented research, publishable metrics | All five sections, per-surface before/after, metrics with causal clauses |
| **Reduced** | It shipped and you know why it's better, but nobody measured it | Problem / Solution / Final design. No Results section at all — say what changed and stop |
| **Short** | Small, old, or scoped work: a site, a brand, a single flow | One continuous piece, 3–6 paragraphs, images with real captions. No section headers |

Two rules that matter more than the tiers:

- **The structure follows the evidence, never the reverse.** If you find yourself
  writing "we identified several pain points" without being able to name them,
  you're in the wrong tier. Drop down one.
- **An empty heading is worse than a missing one.** A "Results" section
  containing "the client was happy" costs more credibility than having no
  Results section. The reader notices the gap either way; only one version
  looks like you tried to hide it.

An "On This Page" side-nav anchors to exactly 5 sections: **Overview, Problem framing, Solution, Final design, Results**. Don't add more top-level sections than this — subdivide inside them instead.

---

## 2. Section-by-section content rules

### Overview

This is the summary card, skimmable in under 10 seconds.

- **Title**: phrased as the outcome/action taken, not the feature name. "Redesigning Lokalise user onboarding," not "Onboarding Project."
- **One-line summary**: a single sentence naming what was redesigned end-to-end and gesturing at the result (e.g., "...lifting sign-up, activation, and retention"). This is the sentence a recruiter reads if they read nothing else.
- **My role**: specific disciplines, not a job title. "Design strategy, UI, UX, User Research" — not "Product Designer."
- **Team**: who else was involved, by function (PM, EM, Data, Engineers, Researcher) — not names. If it was just you, say so; it's a credibility point, not a weakness (see tone notes).
- **Timeline**: quarter-level precision ("2024 Q1–Q2"), not vague ("a few months").
- **Metadata must agree with the body.** If the case study later describes a
  workshop with a PM, engineers and a founder, the Team field cannot say
  "research advisors." Recruiters read the overview card and stop; a
  collaboration story contradicted by its own metadata reads as solo work.
- **Impact Overview**: 3 stat cards, no more. Each card has:
  1. A metric name (Sign up rate, Activation rate, Trial-to-customer conversion)
  2. One clause explaining the causal mechanism ("Through redesign of homepage and sign-up page...")
  3. The bolded number result ("we increased sign-up conversion by 37%.")

  **This block matters more than any other single element in the case study** — it's what recruiters and AI summarizers extract first. If a case study has metrics buried only in the Results section and nothing surfaced at the top, that's a critical gap.

### Problem

Don't open with the problem. Open with the business context that makes the problem matter.

- **Why we started**: 2-3 sentences of company/product context (growth, funding, scale) *before* naming the metric that dropped. This establishes stakes before the reader is told to care about a chart.
- **The red flag**: name the specific metric and trend, backed by a chart with a plain-English caption underneath it (never a bare screenshot — every chart/image gets one caption sentence saying what it shows).
- **How I tackled it**: numbered steps, in the actual chronological order the work happened, including team-formation context if relevant ("I was the only team member; PM and EM hadn't started yet"). Typical shape:
  1. Dogfooding / mapping the current experience (qualitative, internal, cheap — done first because it's what's available)
  2. Quantitative analysis — name the tool (Amplitude, Mixpanel, etc.) and the specific finding (where in the funnel people drop)
  3. Qualitative interviews — give a real count ("20+ prospects and customers"), not "several users"
- **Synthesis**: land on a small number of named frictions (rule of 3 works well — more than that stops being memorable). Each friction needs:
  - A name (Banner blindness, Interruptive experience, High cognitive load)
  - A one-sentence plain-English definition (don't assume the reader knows the term)
  - Why it's actually a problem, ideally with a stat ("average click rate of a top banner is ~0.004%")
  - Visual evidence (annotated screenshot, heatmap) with a caption naming the specific insight, not just describing the image

### Solution

- **Transition with a rhetorical question** rather than a section header alone — it's a tone device, not a structural requirement, but it's the single most distinctive move in the reference case study (see Tone section).
- **Team ideation**: name who was in the room (PM + Engineers + Data Analyst + User Researcher) — shows cross-functional facilitation, not solo design-in-a-vacuum.
- **Concepts generated**: a bullet list, and each concept should trace back to one of the named frictions from the Problem section. If a concept doesn't map to a stated problem, that's a gap.
- **Testing**: state plainly what testing validated and what it didn't — a case study that only shows "and then we tested it and it worked" without any concept getting cut or changed reads as unreliable.
- **Iteration**: at least one visual showing a "before iteration" vs "after iteration" state — this is different from the final before/after; it's proof of a design process, not just a before/after of the shipped thing.

### Final design

This section is explicitly the subset of the Solution that actually shipped — the case study should say so ("we began polishing the final MVP to prepare it for shipment").

- Organize by **shipped surface** (homepage, sign-up page, in-app checklist), not by friction. Each surface gets its own numbered subsection.
- Each surface needs:
  - A before/after visual (toggle or side-by-side)
  - 1-2 metrics specific to that surface (not just the global rollup numbers — these are more granular than the Impact Overview stats)
  - For each metric, one sentence of **why** it moved, tied to the specific design decision ("Visitors could identify supported content types earlier, reducing friction at the top of the funnel.") — a number with no causal sentence next to it is a gap.

### Results

- **"What didn't work"**: a required sub-section, not an optional one. Name what
  the change cost and who it cost it for — the users who lost a feature, the
  explanations new users still miss. Pair it with a real complaint, then say
  what it fed into next. A results section with no counter-evidence reads as
  marketing; this is the cheapest credibility on the page.
- **Headline rollup**: restate the 2-3 biggest wins as a short bulleted list. It's fine (expected) that these numbers overlap with the Impact Overview at the top — repetition here is intentional, not redundant, since different readers enter at different points.
- **Real quote**: an actual attributed quote from a user/prospect/customer, not a paraphrase. Attribution can be role-based ("Prospect of Lokalise") if anonymized.
- **Further reading** (optional but valuable): a link to external validation — an article, talk, or publication about the same work. Signals the work held up to outside scrutiny, not just internal review.
- **Downloadable artifact** (optional but valuable): a template or tool built during the project that a reader could actually reuse (a Miro board, a framework doc). This converts a reader into someone who got value from the case study, not just someone who read it.
- **Navigation to more case studies**: don't dead-end the page.

---

## 2b. Evidence hygiene

The rules that stop a case study being quietly wrong.

- **Place evidence by its date, not its usefulness.** An interview recorded after
  launch is Results evidence, not Problem evidence, however well it describes
  the old pain. Check the date on every quote before placing it.
- **Never write a test result you don't have.** Showing four design variants and
  explaining which shipped is design reasoning, and should read as design
  reasoning. "It tested badly" without a test is fabrication. Say "reviewing
  them side by side, the problem was obvious" and the argument still lands.
- **Quote verbatim or don't use quotation marks.** Two fragments from the same
  interview joined with "and" inside one set of quotes is a paraphrase wearing
  a quote's clothes. Quote one cleanly, put the rest in the caption.
- **Don't report metrics that are artifacts.** A cohort that hasn't aged into
  week 6 shows 0% at week 6. Omit it and say why, or explain it — never let it
  stand as either a win or a loss.
- **Screenshots must come from the build you're describing.** Design files
  accumulate old versions of the same screen, and the stale one is often the
  tidiest, so it's the one you reach for. Before shipping, check one detail you
  know changed — a nav treatment, a control style — against the current
  production file. Two of the images here showed a superseded component for
  weeks, including the hero.
- **Anonymisation is a craft task, not a find-and-replace.** If the client is
  anonymised, the product name also appears inside the screenshots: in-product
  nouns ("Matter Score"), body copy, and logo marks that no text search will
  find. Audit every asset at full length, not just the crop you're shipping,
  and caption the blurs once so they read as deliberate rather than as damage.

---

## 2c. Presentation

Layout failures read as carelessness about the work itself.

- **Sub-headings must outrank body text.** A heading rendering at or below the
  size of the paragraph under it reads as broken, not as restraint.
- **Cap the body measure** at roughly 45–75 characters. On a page with large
  base type, a full-width column is a long way for the eye to travel back.
- **Contain tall screenshots.** A phone screen rendered at column width becomes
  1,500–2,000px of scrolling, and three of them make a case study feel
  interminable. Put them in a fixed-height window that scrolls, with a visible
  hint that there's more, and let the reader open the full thing.
- **Every screenshot should be at least 2× its rendered width.** Exporting at 2×
  and then scaling down in the layout silently undoes it — check the ratio at
  the size it actually renders, not the size you exported.
- **Identifiers belong in code styling.** `Color.level2` set in running prose
  reads as a typo.
- **One argument, one place.** If two sections make the same point, the reader
  assumes they missed a distinction and re-reads both. Merge them.
- **Name a section for what it contains,** not for the cleverest thing in it.
  "Designing so a model can build it" tells the reader nothing; "Optic, the
  design system" tells them whether to keep reading.

---

## 3. Tone of voice

The reference case study reads like a person talking, not a report being filed. Specific, imitable patterns:

- **First person, contractions, casual register.** "I'm glad that you asked (I hope you did!)." Never stiff third-person ("The designer then proceeded to...").
- **Short sentences, short paragraphs.** Rarely more than 2-3 sentences per paragraph. If a paragraph runs long, it's probably explaining something that should be a bullet list or a caption instead.
- **Rhetorical questions as section transitions**, addressed directly to the reader: "Now, you may ask: Ben, how did you solve the problem then?" / "Can you guess what those frictions were?" These do double duty as headers and as pacing breaks.
- **Playful, self-aware asides.** "No cheating!", "It's boring to continue reading the texts, so let's have some visuals to support you." This tone signals confidence — the writer trusts the work enough to not be precious about it.
- **Humor used deliberately to break up dense sections** (a well-placed reaction gif after a long list of problems found). Use sparingly — it works because it's rare.
- **Numbers stated plainly, never oversold.** "We doubled our revenue year over year" — the fact is dramatic enough on its own; the prose around it stays flat.
- **Jargon is always defined in-line, immediately, in plain language**, before it's used again: "Cognitive load refers to the mental effort needed to complete and understand a task." Never assume the reader already knows the term.
- **Honesty about scrappiness reads as credibility, not weakness.** "I had no one to rely on... I was the only team member in the team." Own the constraint instead of hiding it.
- **Every visual has a one-line plain-English caption** that states the takeaway, not just a description of what's pictured. "The largest drop-offs happened between sign-up and project creation" — not "Funnel chart."
- **Metrics are always paired with a causal clause**, never left to stand alone. Not "37% increase in sign-up conversion" by itself — always "...because [specific design change]."
- **Watch for the AI-voice tells.** These accumulate without any single sentence
  looking wrong. The fix is almost always to split the sentence in two and use
  a plain verb:
  - Em-dash appositives stacking clauses into one long sentence. If a paragraph
    has more than one, rewrite it.
  - The "didn't just X — it Y" construction.
  - Arch sentence fragments as transitions ("A fair amount, and mostly on
    purpose." / "Two pieces of work either side of the app itself.")
  - Passive constructions hiding who decided ("first-message placement was
    deferred") where "we didn't ship it as the first message" is the truth.
  - Self-congratulatory meta ("it's the part I'd defend hardest").
- **Section headers as narrative beats or questions**, not clinical labels: "Why we started redesigning onboarding?" instead of "Background." "Now, you may ask: Ben, how did you solve the problem then?" instead of "Solution."

---

## 4. Audit checklist

Use this to check a case study against the framework. Mark each row **Present /
Weak / Missing** — and check the tier first: rows below the tier you picked
aren't failures, they're out of scope.

### Before anything else
- [ ] The tier matches the evidence available (Full / Reduced / Short)
- [ ] No section exists that the material can't fill

### Overview
- [ ] Team/role metadata matches the collaboration described in the body
- [ ] Title is outcome-phrased, not just a feature/project name
- [ ] One-line summary exists and names the result, not just the scope
- [ ] My role is specific disciplines, not a job title
- [ ] Team is listed by function
- [ ] Timeline has quarter-level precision
- [ ] Impact Overview block exists with exactly 2-3 stat cards
- [ ] Each Impact Overview stat has: metric name + causal clause + bolded number

### Problem
- [ ] Business context/stakes established before the problem is named
- [ ] The trigger metric is named and charted, with a plain-English caption
- [ ] Research methodology is shown as ordered steps, not summarized in one paragraph
- [ ] At least one step names a specific tool (analytics platform) or a specific count (number of interviews)
- [ ] Synthesized down to a small named set of frictions (not a sprawling list)
- [ ] Each friction has: name, plain-language definition, why-it-matters (ideally with a stat), and visual evidence with a captioned insight

### Solution
- [ ] Cross-functional ideation is shown (who was in the room), not solo design
- [ ] Concepts generated are listed explicitly and map back to named frictions
- [ ] Testing results are stated honestly — something was validated, cut, or changed
- [ ] At least one iteration visual (before/after *of the process*, not just the shipped result)

### Final design
- [ ] Organized by shipped surface, explicitly marked as "what we shipped" vs. "what we explored"
- [ ] Each surface has a before/after visual
- [ ] Each surface has its own metric(s), distinct from the global Impact Overview numbers
- [ ] Every metric has a one-sentence causal explanation tied to the specific design decision

### Results
- [ ] A "What didn't work" sub-section exists, with a real complaint in it
- [ ] Headline rollup of the 2-3 biggest wins
- [ ] Real, attributed user quote
- [ ] Further reading / external validation link (nice-to-have)
- [ ] Downloadable/reusable artifact (nice-to-have)
- [ ] Link onward to more case studies

### Evidence
- [ ] Every quote is dated and placed in the right section for that date
- [ ] No test result is claimed that wasn't run
- [ ] Quotes are verbatim, not two fragments spliced together
- [ ] Cohort artifacts are omitted or explained, never reported as results
- [ ] Screenshots audited at full length for the client's name, including
      in-product nouns and logo marks; blurs captioned once as deliberate
- [ ] Every screenshot verified against the current build, not an older
      version sitting in the same design file
- [ ] No placeholder assets left in the published page

### Process evidence
- [ ] Collaboration is *shown* (workshop photo, board, annotated artifact), not
      only asserted in a sentence
- [ ] Research volume is quantified (how many interviews, over what period)
- [ ] At least one synthesis artifact appears, not just its conclusions

### Tone
- [ ] Written in first person, casual register, contractions used
- [ ] Paragraphs are short (2-3 sentences)
- [ ] At least one rhetorical-question transition addressed to the reader
- [ ] Jargon is defined in plain language at first use
- [ ] Every image/chart has a one-line takeaway caption, not just a label
- [ ] Every metric is paired with a "because..." clause
- [ ] Section headers read as narrative beats/questions, not clinical labels
- [ ] No overselling — numbers are left to speak for themselves
- [ ] Checked for AI-voice tells: em-dash appositives, "didn't just X — it Y",
      arch fragments, passive decisions, self-congratulatory meta
- [ ] Sub-headings outrank body text in size and weight (a sub-head rendering
      smaller than the paragraph under it reads as broken)
- [ ] Body measure capped (~45-75 characters); lists use hanging indent
- [ ] Tall screenshots contained in a scrolling window, not rendered at full
      height inline
- [ ] Every image at least 2x its rendered width at the size it actually shows
- [ ] Identifiers and token names set as inline code
- [ ] No argument made in two different sections
