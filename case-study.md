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

- **Headline rollup**: restate the 2-3 biggest wins as a short bulleted list. It's fine (expected) that these numbers overlap with the Impact Overview at the top — repetition here is intentional, not redundant, since different readers enter at different points.
- **Real quote**: an actual attributed quote from a user/prospect/customer, not a paraphrase. Attribution can be role-based ("Prospect of Lokalise") if anonymized.
- **Further reading** (optional but valuable): a link to external validation — an article, talk, or publication about the same work. Signals the work held up to outside scrutiny, not just internal review.
- **Downloadable artifact** (optional but valuable): a template or tool built during the project that a reader could actually reuse (a Miro board, a framework doc). This converts a reader into someone who got value from the case study, not just someone who read it.
- **Navigation to more case studies**: don't dead-end the page.

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
- **Section headers as narrative beats or questions**, not clinical labels: "Why we started redesigning onboarding?" instead of "Background." "Now, you may ask: Ben, how did you solve the problem then?" instead of "Solution."

---

## 4. Audit checklist

Use this to check a case study against the framework. Mark each row **Present / Weak / Missing**.

### Overview
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
- [ ] Headline rollup of the 2-3 biggest wins
- [ ] Real, attributed user quote
- [ ] Further reading / external validation link (nice-to-have)
- [ ] Downloadable/reusable artifact (nice-to-have)
- [ ] Link onward to more case studies

### Tone
- [ ] Written in first person, casual register, contractions used
- [ ] Paragraphs are short (2-3 sentences)
- [ ] At least one rhetorical-question transition addressed to the reader
- [ ] Jargon is defined in plain language at first use
- [ ] Every image/chart has a one-line takeaway caption, not just a label
- [ ] Every metric is paired with a "because..." clause
- [ ] Section headers read as narrative beats/questions, not clinical labels
- [ ] No overselling — numbers are left to speak for themselves
