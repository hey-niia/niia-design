/** Canned question → answer matching for NiiaLLM. No model is wired up yet —
 * this recognizes keywords in what a visitor types and returns pre-written
 * copy, same as a rule-based FAQ bot. */

export interface CannedAnswer {
  keywords: string[];
  answer: string;
}

export const SUGGESTED_QUESTIONS = [
  "What's your design process?",
  "What size of projects do you take on?",
  "What's your experience with AI tools?",
];

const ANSWERS: CannedAnswer[] = [
  {
    keywords: ["process", "approach", "methodology", "how do you work", "workflow"],
    answer:
      "I'd rather ship a rough prototype than defend a polished deck. Most projects go research → information architecture → a lightweight design system → interactive prototypes I pressure-test with stakeholders before anything reaches engineering. On AI products specifically, the job is making sure the complexity never becomes the user's problem — if a feature needs a tooltip to explain itself, it isn't done yet.",
  },
  {
    keywords: [
      "size",
      "how big",
      "typical project",
      "scope",
      "how long",
      "duration",
      "timeline",
      "how much time",
    ],
    answer:
      "It varies — anywhere from a focused 1-month site (Digital Screen Co.) to a 4-month end-to-end product redesign (the Wellness AI Companion). Most engagements run 1–4 months, usually as the sole designer working directly with a founder or ops lead, from research through to shipped product.",
  },
  {
    keywords: ["ai", "artificial intelligence", "claude", "llm", "machine learning", "gpt"],
    answer:
      "AI shows up two ways in my work: I design AI-first products (a neuroscience-backed wellness coach, AI-native hiring tools), and I build with AI — using Claude for prototyping, design-system documentation, and increasingly for shipping the code itself, not just the spec. Check the AI Experiments page for some of the rawer, in-progress stuff.",
  },
  {
    keywords: ["favorite", "proudest", "best project", "most proud", "which project"],
    answer:
      "The Wellness AI Companion — collapsing six separate neuroscience-validated systems into one guided AI coach. It was selected as Apple's App of the Day across multiple countries, which felt like proof that hiding complexity instead of the effort behind it actually works.",
  },
  {
    keywords: ["hire", "available", "availability", "rate", "cost", "price", "budget", "contract", "freelance"],
    answer:
      "I'm generally in for AI-first products, small studios doing unusually good work, or anything where the interface has to do more explaining than the sales page. Best way in is email — nia.bieliavtseva@gmail.com — Niia reads everything herself.",
  },
  {
    keywords: ["tool", "figma", "stack", "software", "tech stack", "design system"],
    answer:
      "Figma for design, Claude for prototyping and documentation, Figjam for workflow mapping, Notion for research notes — and code (React, Tailwind) when a project needs the design shipped, not just specified. Token systems get named so they map straight from Figma variables to code with no separate handoff doc.",
  },
  {
    keywords: ["value", "believe", "philosophy", "principle"],
    answer:
      "Three, from the About page: build the thing, not the deck. Hide the complexity, not the effort. And trust compounds faster than good ideas — the best outcomes rarely come from being the smartest person in the room.",
  },
  {
    keywords: ["leap", "founder", "founding", "startup story"],
    answer:
      "Leap was Niia's first company (2016–2021) — she started as a founder, not a designer. Packaging, distribution, the Instagram page, working with other designers — all of it, because there was no one else to hand it to. Design was just the tool she reached for most.",
  },
  {
    keywords: ["overspace", "studio", "co-found", "cofound"],
    answer:
      "Overspace is the product design studio Niia co-founded in 2021 — a small team doing the unglamorous parts of product design that make the flashy parts possible: research nobody sees, systems nobody notices until they're missing.",
  },
  {
    keywords: ["experience", "background", "career", "who are you", "who is niia"],
    answer:
      "Senior Product Designer and AI Design Engineer, freelance since 2022 — current work spans an AI-first iOS wellness app, enterprise dashboards, and web platforms. Before that: co-founder of Overspace (2021–present) and founder of Leap (2016–2021). She started as a founder first, designer second.",
  },
  {
    keywords: ["contact", "email", "reach", "linkedin", "get in touch", "say hello"],
    answer:
      "Email is nia.bieliavtseva@gmail.com, or find her on LinkedIn — both linked in the footer. She reads everything herself.",
  },
];

const FALLBACK =
  "I'm just a pre-written FAQ for now, not a live model — so I don't have a scripted answer for that one. Try one of the suggested questions, or email Niia directly at nia.bieliavtseva@gmail.com and ask her yourself.";

export function getCannedAnswer(question: string): string {
  const q = question.toLowerCase();
  for (const entry of ANSWERS) {
    if (entry.keywords.some((k) => q.includes(k))) {
      return entry.answer;
    }
  }
  return FALLBACK;
}
