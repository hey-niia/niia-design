/** Canned question → answer matching for Niia AI. No model is wired up yet —
 * this recognizes keywords in what a visitor types and returns pre-written
 * copy, same as a rule-based FAQ bot. Content is sourced from what's actually
 * on the site (Home, About, and each case study) rather than invented.
 * Voice follows case-study.md's tone guide: first person, contractions,
 * short sentences, honest about being scrappy rather than polished. */

import { projects } from "../data/projects";
import { experiments } from "../data/experiments";

export interface AnswerCard {
  title: string;
  caption: string;
  image: string;
  href: string;
}

export interface CannedAnswer {
  keywords: string[];
  answer: string;
  /** Optional visual cards (case studies, AI playground projects) shown under the text. */
  cards?: AnswerCard[];
  /** Optional picture shown under the text (e.g. a screenshot). */
  image?: { src: string; alt: string };
}

// First-open order, fixed per the client's ask: one about AI tools, one
// about case studies, one about hiring — everything after this comes from
// the follow-up pool instead.
export const SUGGESTED_QUESTIONS = [
  "What's your experience with AI tools?",
  "Which case study should I start with?",
  "I'd love to hire you",
];

export const CONTACT_EMAIL = "nia.bieliavtseva@gmail.com";

export interface ProjectLink {
  name: string;
  slug: string;
}

// Case-study names, derived from projects.ts (not hand-duplicated) — reused
// both to write answers that name real projects and to turn those same
// mentions into real links to /work/:slug (see linkifyKnownTerms in the sidebar).
export const PROJECT_LINKS: ProjectLink[] = projects.map((p) => ({
  name: p.name,
  slug: p.slug,
}));

// Same cover image + caption convention as the homepage's WorkGridCard, so a
// case study mentioned in chat can render as a real thumbnail card.
// A few projects get their own chat preview instead of the first screenshot.
const CHAT_PREVIEW: Record<string, string> = {
  "ios-app": "/chat/neuroscience-app-of-the-day.png",
};

// One-line type shown under each case study's title in chat cards.
const CHAT_TYPE: Record<string, string> = {
  "ios-app": "iOS app",
  connectiq: "Dashboard",
  hirement: "Web app",
  "other-projects": "Landing pages, web apps",
};

export const PROJECT_CARDS: AnswerCard[] = projects.map((p) => ({
  title: p.name,
  caption: CHAT_TYPE[p.slug] ?? p.category,
  image: CHAT_PREVIEW[p.slug] ?? p.screenshots[0].src,
  href: `/work/${p.slug}`,
}));

function projectCard(slug: string): AnswerCard[] {
  const card = PROJECT_CARDS.find((c) => c.href === `/work/${slug}`);
  return card ? [card] : [];
}

// AI Playground cards — only entries with a cover image and an internal
// link render as a card (Taski's first version has neither yet).
// Plain-language type for each playground project in chat cards.
const PLATFORM_LABEL: Record<string, string> = {
  "BROWSER EXTENSION": "Chrome extension",
  MacOS: "macOS app",
  "WEB APP": "Web app",
};

export const PLAYGROUND_CARDS: AnswerCard[] = experiments
  .filter((e): e is typeof e & { image: string; link: string } => Boolean(e.image && e.link))
  .map((e) => ({
    title: e.name,
    caption: PLATFORM_LABEL[e.platform] ?? e.platform,
    image: e.image,
    href: e.link,
  }));

const ANSWERS: CannedAnswer[] = [
  {
    keywords: ["ownership", "taking ownership", "take ownership"],
    answer:
      "For me, taking ownership means caring deeply about the people we're designing for and the impact of what we build. I love collaborating with engineers, designers, and product teams, bringing different perspectives together, challenging assumptions, and finding solutions that genuinely work for users. It's about taking initiative, sharing responsibility, and working together to make the best possible product.",
  },
  {
    keywords: ["turning ideas", "ideas into real products", "ideas into products", "real products"],
    answer:
      "Building with AI feels like being a kid in a sandbox. You can make pretty much anything! And as a designer, I love that I can now take full ownership of my ideas, from figuring out how something should look and work to actually building it. Combining that freedom with years of design experience is just the best feeling ever.",
  },
  // The homepage intro's "Ask Niia AI" pill asks this one.
  {
    keywords: ["business problems", "business problem", "solving business", "what you love", "what do you love"],
    answer:
      "I believe great design solves real business problems.\n\nMaking something intuitive is actually hard work. The best design feels effortless to use. To me, that's the key to a great product, even when a lot of thought and complexity went into making it that simple.\n\nAnd I also believe solutions should be beautiful. Aesthetics, personality, and the joy of using a product aren't just nice extras. They're part of what makes people choose a product, fall in love with it, and keep coming back.",
  },
  // Checked first: specific personal phrasing like "what do you do outside
  // of work" would otherwise get swallowed by the broader "what do you do"
  // entry below, since that's a substring of the question.
  {
    keywords: [
      "hobbies",
      "hobby",
      "outside of work",
      "spare time",
      "free time",
      "for fun",
      "yoga",
      "sketchbook",
      "drawing",
    ],
    answer:
      "I walk, I travel, I meditate, and spend time with my family.",
  },
  {
    keywords: ["what do you do", "what does niia do", "elevator pitch", "what do you help"],
    answer:
      "I help startups and scale-ups turn complex, AI-driven products into interfaces people actually use. I design them, then build them myself — from narrative websites to data-rich dashboards. Increasingly, less handoff, more just... done.",
  },
  {
    keywords: ["process", "approach", "methodology", "how do you work", "workflow"],
    answer:
      "I'd rather ship a rough prototype than defend a polished deck. Most projects go research → information architecture → a lightweight design system → prototypes I pressure-test with stakeholders before engineering ever sees them. On AI products specifically, the real job is making sure the complexity never becomes the user's problem — if a feature needs a tooltip to explain itself, it isn't done yet.",
  },
  {
    keywords: [
      "size",
      "how big",
      "typical project",
      "scope",
      "how long do",
      "how long does",
      "duration",
      "timeline",
      "how much time",
    ],
    answer:
      "It varies. Anywhere from a focused 1-month site (Digital Screen Co.) to a 4-month end-to-end redesign (the Neuroscience App's AI Pivot). Most run 1–4 months, usually as the sole designer working directly with a founder or ops lead, start to shipped.",
  },

  // Case-study-specific answers, checked before the generic "ai" catch-all
  // below so a question naming a project or its domain lands on the actual
  // case study instead of the generic AI blurb.
  {
    keywords: [
      "wellness",
      "neuroscience",
      "neurotransmitter",
      "mental health",
      "mindfulness",
      "coaching app",
    ],
    answer:
      "Yes — the Neuroscience App's AI Pivot is a neuroscience-backed iOS app I redesigned, folding six validated neurotransmitter systems (dopamine, serotonin, testosterone, oxytocin, opioids, cannabinoids) into one guided AI coach. It was picked as Apple's App of the Day across multiple countries and is now expanding into clinical research.",
    cards: projectCard("ios-app"),
  },
  {
    keywords: [
      "dashboard",
      "enterprise dashboard",
      "airtable",
      "workflow tool",
      "operations tool",
      "inventory tracking",
    ],
    answer:
      "Yes — I designed an enterprise operations dashboard that replaced an Airtable-based workflow, for a company managing digital signage installs across chains like KFC and Apple stores. Quotations through deployment, maintenance, inventory — the whole lifecycle. Sole designer, concept through engineering handoff, about 2.5 months.",
    cards: projectCard("enterprise-dashboard"),
  },
  {
    keywords: ["digital screen co", "signage website", "corporate website", "signage company"],
    answer:
      "Digital Screen Co. was a corporate website I built from zero for a digital signage company — information architecture, layout system, and visual identity, all built to explain a technical product simply. About a month, start to finish.",
    cards: projectCard("other-projects"),
  },
  {
    keywords: ["hirement", "hiring tool", "hiring platform", "recruiting", "interview flow", "recruitment"],
    answer:
      "Hirement is an AI-first hiring platform I designed — structured interview flows with checklists, ratings, and open-ended rounds, so different interviewers can score candidates consistently. Sole designer, working directly with the founder from early idea to a working product.",
    cards: projectCard("hirement"),
  },

  {
    keywords: [
      "how did you build this",
      "build this portfolio",
      "how was this site built",
      "how was this website built",
      "how did you make this site",
      "how did you make this portfolio",
      "how is this site built",
    ],
    answer:
      "I built this site with Claude and created my own tweak panel, so I can adjust pretty much anything directly on the site, just like in Figma, but without Figma.",
    image: {
      src: "/chat/tweak-panel.png",
      alt: "The tweak panel: tabs for main color, header, pressed header, drawing pad and fonts",
    },
  },
  {
    keywords: [
      "which case study",
      "where should i start",
      "recommend a case study",
      "favorite case study",
      "what should i read first",
    ],
    answer:
      "Start with the Neuroscience App's AI Pivot — it's the most complete start-to-finish (research, design system, App Store creative), and it's the one I'm proudest of. Enterprise Dashboard and Hirement are good next if you want more dashboard or AI-tooling work, and Digital Screen Co. is the quick one if you're short on time.",
    cards: PROJECT_CARDS,
  },
  {
    keywords: [
      "design and build",
      "design and code",
      "do you code",
      "do you build",
      "hands-on",
      "diy",
    ],
    answer:
      "Yes — I design and build. Less handoff, more just... done. Most of my recent work, this site included, I've taken from Figma through to shipped code myself, usually with Claude alongside me.",
  },
  {
    keywords: ["generalist", "jack of all trades", "wear many hats", "beyond design"],
    answer:
      "Very — before design was ever a job title, I was running Leap solo: product, packaging, distribution, social, all of it. That range still shows up in client work today. I'm as comfortable naming a workflow problem as I am pushing pixels.",
  },

  {
    keywords: ["ai", "artificial intelligence", "claude", "llm", "machine learning", "gpt"],
    answer:
      "AI shows up two ways in my work: I design AI-first products, and I build with AI myself — using Claude for prototyping, documentation, and increasingly for shipping the code itself, not just the spec. Here's the flagship case study, plus some of the rawer, in-progress projects from my AI playground:",
    cards: [...projectCard("ios-app"), ...PLAYGROUND_CARDS],
  },
  {
    keywords: ["favorite project", "proudest", "best project", "most proud", "which project"],
    answer:
      "The Neuroscience App's AI Pivot — folding six neuroscience-validated systems into one guided AI coach. It got picked as Apple's App of the Day across multiple countries, which felt like proof that hiding complexity (not the effort behind it) actually works.",
    cards: projectCard("ios-app"),
  },
  {
    keywords: ["hire", "available", "availability", "rate", "cost", "price", "budget", "contract", "freelance"],
    answer: `I'm glad you're interested!
- The best way to reach me is via LinkedIn or ${CONTACT_EMAIL} — I read everything myself.
- Right now I split my time between freelance product design (AI-first apps, dashboards, web platforms) and co-running Overspace, a small design studio.
- If I'm not the right fit, I'm happy to refer someone else or explore a short collaboration to see if it's a good match.`,
  },
  {
    keywords: ["tool", "tools", "figma", "stack", "software", "tech stack", "design system"],
    answer:
      "Figma for design, Claude for prototyping and documentation, Figjam for workflow mapping, Notion for research notes — and code (React, Tailwind) when a project needs the design shipped, not just specified. Token systems get named so they map straight from Figma variables to code, no separate handoff doc needed.",
  },
  {
    keywords: ["value", "values", "believe", "philosophy", "principle"],
    answer:
      "Three, from the About page: build the thing, not the deck. Hide the complexity, not the effort. And trust compounds faster than good ideas — the best outcomes rarely come from being the smartest person in the room.",
  },
  {
    keywords: ["leap", "founder", "founding", "startup story"],
    answer:
      "Leap was Niia's first company (2016–2022). As founder she was also its head of product and head of design — packaging, distribution, the Instagram page, working with other designers, all of it. She sold the company in 2022.",
  },
  {
    keywords: ["overspace", "studio", "co-found", "cofound"],
    answer:
      "Overspace is the product design studio Niia co-founded in 2022 — a small team doing the unglamorous parts of product design that make the flashy parts possible: research nobody sees, systems nobody notices until they're missing.",
  },
  {
    keywords: ["experience", "background", "career", "who are you", "who is niia"],
    answer:
      "Senior Product Designer and AI Design Engineer, freelance since 2022 — current work spans an AI-first iOS wellness app, enterprise dashboards, and web platforms. Before that: co-founder of Overspace (2022–present) and founder of Leap (2016–2022), which she sold in 2022. She started as a founder first, designer second.",
  },
  {
    keywords: ["resume", "résumé", "cv", "portfolio pdf"],
    answer: `Sure — grab my résumé, connect on LinkedIn, or just email me directly at ${CONTACT_EMAIL}.`,
  },
  {
    keywords: ["contact", "email", "reach", "linkedin", "get in touch", "say hello"],
    answer: `Email is ${CONTACT_EMAIL}, or find her on LinkedIn — both linked in the footer. She reads everything herself.`,
  },
  // Last on purpose: a plain "hey" gets a hello, but "hey, tell me about
  // Leap" still lands on the Leap answer above.
  {
    keywords: ["hey", "hi", "hello", "hiya", "heya", "yo", "howdy", "good morning", "good afternoon", "good evening", "привіт", "вітаю"],
    answer: "Hey! Glad you're here. Let's design something together!",
  },
];

// Varied dead-ends for anything outside the pre-written answers above, so a
// visitor poking at Niia AI's limits doesn't see the same line twice in a
// row. All roads lead back to a real way to reach Niia.
const FALLBACKS = [
  `These details aren't available through Niia AI. Email me directly at ${CONTACT_EMAIL}.`,
  `That one's outside what Niia AI knows — email ${CONTACT_EMAIL} and I'll get back to you myself.`,
  `I don't have a scripted answer for that yet. Try one of the suggested questions, or reach me directly at ${CONTACT_EMAIL}.`,
  `Niia AI is a small set of pre-written answers, not a live model, so this one isn't in there. Email ${CONTACT_EMAIL} instead.`,
  `Good question, but not one I've written an answer for. Best to ask me directly — ${CONTACT_EMAIL}.`,
  `That's a bit beyond Niia AI's script. Email ${CONTACT_EMAIL} and I'll answer in person.`,
  `I don't have that one on file. Email me at ${CONTACT_EMAIL} — I read everything myself.`,
  `Niia AI can't help with that specific one. Email ${CONTACT_EMAIL}, or find me on LinkedIn.`,
  `Not something I have a canned answer for. Email ${CONTACT_EMAIL} directly, or check my résumé for the rest.`,
  `That's outside Niia AI's script for now. Drop a line at ${CONTACT_EMAIL} and I'll reply myself.`,
];

function pickFallback(): string {
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Word-boundary match for plain ascii keywords (so "size" doesn't fire on
// "sizeable", or short ones like "ai" on "explain") — falls back to a plain
// substring check for keywords with accents/punctuation regex can't bound.
function matchesKeyword(question: string, keyword: string): boolean {
  if (/^[a-z0-9 ]+$/i.test(keyword)) {
    return new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i").test(question);
  }
  return question.toLowerCase().includes(keyword.toLowerCase());
}

export interface CannedResponse {
  text: string;
  cards?: AnswerCard[];
  image?: { src: string; alt: string };
}

function findAnswer(text: string): CannedResponse | null {
  for (const entry of ANSWERS) {
    if (entry.keywords.some((k) => matchesKeyword(text, k))) {
      return { text: entry.answer, cards: entry.cards, image: entry.image };
    }
  }
  return null;
}

/** Answers the question; if it matches nothing (say "tell me more"), falls back
 * to the text the visitor selected, so selecting "taking ownership" and asking
 * anything gets the ownership answer. */
export function getCannedAnswer(question: string, quote?: string): CannedResponse {
  return findAnswer(question) ?? (quote ? findAnswer(quote) : null) ?? { text: pickFallback() };
}

/** True if `question` matches a real entry above (not the fallback pool) — used to sanity-check every suggested/follow-up question actually has an answer. */
export function hasCannedAnswer(question: string): boolean {
  return ANSWERS.some((entry) => entry.keywords.some((k) => matchesKeyword(question, k)));
}

// --- Follow-up suggestions -------------------------------------------------
// After every answer we offer 3 more questions — usually 2 professional + 1
// personal, occasionally all 3 professional, mirroring how a real visitor's
// curiosity mixes "can you do the job" with "who are you". Each pool entry
// is worded to land on a real answer above, not a fallback.

export type QuestionCategory = "professional" | "personal";

export interface FollowUpQuestion {
  text: string;
  category: QuestionCategory;
}

export const FOLLOW_UP_QUESTIONS: FollowUpQuestion[] = [
  // professional — "I'd love to hire you" and "Which case study should I
  // start with?" live in SUGGESTED_QUESTIONS instead, not duplicated here.
  { text: "How did you build this portfolio?", category: "professional" },
  { text: "Do you design and build, or just design?", category: "professional" },
  { text: "Do you have generalist experience beyond design?", category: "professional" },
  { text: "Tell me about Overspace", category: "professional" },
  { text: "Tell me about Leap", category: "professional" },
  { text: "Can I see your résumé?", category: "professional" },
  { text: "What tools are in your stack?", category: "professional" },
  { text: "Have you worked with wellness apps?", category: "professional" },
  { text: "What values guide how you work?", category: "professional" },
  { text: "What do you do, exactly?", category: "professional" },
  // personal
  { text: "What are your hobbies?", category: "personal" },
  { text: "How long have you been drawing?", category: "personal" },
  { text: "What do you do outside of work?", category: "personal" },
  { text: "Is yoga a big part of your routine?", category: "personal" },
];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Picks up to 3 follow-up questions not already shown, blending categories. */
export function pickFollowUps(alreadyShown: Iterable<string>): string[] {
  const shownSet = alreadyShown instanceof Set ? alreadyShown : new Set(alreadyShown);
  const available = FOLLOW_UP_QUESTIONS.filter((q) => !shownSet.has(q.text));
  const professional = shuffle(available.filter((q) => q.category === "professional"));
  const personal = shuffle(available.filter((q) => q.category === "personal"));

  // Usually 2 professional + 1 personal; sometimes all 3 professional
  // (never more personal than professional, per the requested mix).
  const wantPersonal = personal.length > 0 && Math.random() >= 0.35 ? 1 : 0;
  const professionalCount = Math.min(3 - wantPersonal, professional.length);
  const personalCount = Math.min(wantPersonal, personal.length);
  const picked: FollowUpQuestion[] = [
    ...professional.slice(0, professionalCount),
    ...personal.slice(0, personalCount),
  ];

  if (picked.length < 3) {
    const leftovers = shuffle([
      ...professional.slice(professionalCount),
      ...personal.slice(personalCount),
    ]);
    picked.push(...leftovers.slice(0, 3 - picked.length));
  }

  return shuffle(picked)
    .slice(0, 3)
    .map((q) => q.text);
}
