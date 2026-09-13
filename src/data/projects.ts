export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  /** Top-level narrative section (Problem framing, Solution, Final design, Results) — anchors the "On this page" TOC. */
  | { type: "section"; id: string; title: string }
  | { type: "list"; items: string[] }
  /** Editorial alternative to a bullet list — large mono numerals, matching About's Values section. */
  | { type: "numbered-list"; items: string[] }
  | { type: "quote"; text: string; attribution: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "gallery"; images: { src: string; alt: string; caption?: string }[] }
  /** Big standalone numbers (page views, MAU, usability score…), no card/border. */
  | { type: "stat-row"; stats: { value: string; label: string }[] }
  /** Numbered short-form callouts (frictions, concepts) — 2-4 items, gray fill. */
  | { type: "callouts"; items: { title: string; description?: string }[] };

export interface ProjectScreenshot {
  src: string;
  alt: string;
  /** Very vertical asset (e.g. a full-page scroll capture) — cap by height instead of width. */
  tall?: boolean;
}

/** One Impact Overview card: a metric, the causal reason it moved, and the result. */
export interface ImpactStat {
  metric: string;
  description: string;
  result: string;
}

/** One avatar in the team credit row next to `team` — placeholder initials, not real photos. */
export interface Credit {
  /** Short text shown inside the circle, e.g. "Me" or "RA". */
  initials: string;
  /** Full name/role shown in the hover tooltip. */
  label: string;
  /** Mark the primary author (Niia) with the accent color instead of black. */
  highlight?: boolean;
}

export interface Project {
  slug: string;
  category: string;
  name: string;
  title: string;
  summary: string;
  client: string;
  role: string;
  /** Who else was involved, by function — omit if solo or not documented. */
  team?: string;
  /** Placeholder avatar row for `team` — omit if there's nothing to show yet. */
  credits?: Credit[];
  duration: string;
  tools: string[];
  screenshots: ProjectScreenshot[];
  lastUpdated: string;
  /** Impact Overview: 2-3 stat cards surfaced at the top of the case study. */
  impact?: ImpactStat[];
  content: ContentBlock[];
}

export const projects: Project[] = [
  {
    // Rewritten against case-study.md (the Ben Shih framework). See PR/commit notes —
    // Problem framing and Solution are intentionally thin: the original content had no
    // documented research process (no named frictions, no interview count, no funnel
    // data), so nothing was invented to fill that gap. Real research notes or a
    // stakeholder/user quote would strengthen this more than any further copy pass.
    slug: "ios-app",
    category: "iOS App, AI",
    name: "Wellness AI Companion",
    title: "Turning six neuroscience systems into one AI coaching experience",
    summary:
      "Redesigned a neuroscience-backed wellness app from a complex, multi-feature product into a single guided AI coach — selected as Apple's App of the Day across multiple countries.",
    client: "Client (NDA)",
    role: "Product design, design systems, UX research, App Store creative",
    team: "Neuroscience research advisors (university partnerships)",
    credits: [
      { initials: "Me", label: "Niia Bieliavtseva", highlight: true },
      { initials: "RA", label: "Research Advisors" },
    ],
    duration: "4 months · 2025",
    tools: ["Figma", "Claude", "Figjam", "Notion"],
    screenshots: [
      { src: "/projects/ios-app/1.png", alt: "Wellness AI app screens" },
      { src: "/projects/ios-app/3.png", alt: "Emotional fitness app progression screen" },
    ],
    lastUpdated: "Feb, 2026",
    impact: [
      {
        metric: "Recognition",
        description: "After the redesign shipped,",
        result: "the app was selected as Apple's App of the Day across multiple countries.",
      },
      {
        metric: "Scientific grounding",
        description: "Every level in the app is validated against",
        result: "real 3T structural MRI, FNIRS brain imaging, and MoCA cognitive testing.",
      },
      {
        metric: "Reach",
        // NOTE: "millions of users" carries over from the original brief/summary copy —
        // verify this figure (and swap in a real before/after lift metric if one is
        // shareable under NDA) before this goes live.
        description: "The simplified system now supports",
        result: "millions of users training across six evidence-based neurotransmitter systems.",
      },
    ],
    content: [
      {
        type: "image",
        src: "/projects/ios-app/1.png",
        alt: "Wellness app home screen showing an AI coach prompt and a single progress bar across six neurotransmitter systems",
        caption:
          "One question from the coach, one progress bar for all six systems — instead of a home screen split six ways.",
      },

      { type: "section", id: "problem-framing", title: "Problem" },
      {
        type: "paragraph",
        text: "The platform is built on real neuroscience: university research partners ran structural MRI, FNIRS brain imaging, and cognitive testing to validate a model of emotional fitness across six neurotransmitter systems — dopamine, serotonin, testosterone, oxytocin, opioids, and cannabinoids. That's rare scientific grounding for a wellness app, and it's core to why the product works.",
      },
      {
        type: "paragraph",
        text: "It's also a lot to hand someone on day one. Before the redesign, each of those six systems had grown its own tracking, its own badges, its own screens — scientifically sound, but a lot of surface area for someone who just wants to know if today was a good day. The job was to fold six validated systems into one experience without flattening the science into vague wellness platitudes, and without losing the specificity that made the app credible in the first place.",
      },

      { type: "section", id: "solution", title: "Solution" },
      {
        type: "paragraph",
        text: "Working with the platform's neuroscience advisors, I collapsed the six systems into one dashboard: a single row of progress dots, one per neurotransmitter, always visible at the top of the app. The depth is still there once you tap in — the default view just isn't split six ways anymore.",
      },
      {
        type: "list",
        items: [
          "A conversational log where every memory a user shares gets tagged to the system(s) it affects, with a plain-language explanation of why — instead of a form asking six separate questions.",
          "A level system — Learner, Apprentice, Practitioner, and beyond — that turns the six-system total into one number climbing toward the next unlock.",
          "A parallel “what you're training” framing (endurance, strength, flexibility, coordination, speed, balance) that gives each neurotransmitter system a fitness analogy people already understand.",
        ],
      },
      {
        type: "paragraph",
        text: "I built interactive prototypes of the coaching flow and the level system to pressure-test the interaction model with the neuroscience advisors before handing anything to engineering.",
      },

      { type: "section", id: "final-design", title: "Final design" },
      { type: "heading", text: "One dashboard for six neurotransmitter systems" },
      {
        type: "paragraph",
        text: "The home screen asks one question at a time and keeps the six-system progress bar visible but out of the way. Share a memory, and the app tags it to the systems it affects and explains the reasoning in plain language instead of a lab printout.",
      },
      {
        type: "gallery",
        images: [
          {
            src: "/projects/ios-app/2.png",
            alt: "AI coaching screen tagging a shared memory to the opioid and cannabinoid systems, with a plain-language explanation",
            caption:
              "Every memory a user logs gets tagged to the systems it affects and explained in plain language, not a lab report.",
          },
          {
            src: "/projects/ios-app/3.png",
            alt: "Level progression screens — Learner, Apprentice, and Practitioner — each showing progress bars and the scientific methods behind them",
            caption:
              "Every level names the real methods behind it — 3T structural MRI, FNIRS brain imaging, MoCA cognitive testing — so the gamification never reads as made up.",
          },
        ],
      },

      { type: "heading", text: "A design system built to hand straight to AI" },
      {
        type: "paragraph",
        text: "I built a lightweight token system — primitive and semantic colors, spacing, radius, typography, one color per level — with names that map directly from Figma variables to code. That was deliberate: the product was moving toward AI-assisted implementation, and a token named levels/level-3 shouldn't need a separate handoff doc to make sense to a model or an engineer.",
      },
      {
        type: "image",
        src: "/projects/ios-app/4.png",
        alt: "Design system token table showing semantic background, text, and per-level color tokens",
        caption:
          "Token names map directly from Figma variables to code, so implementation didn't need a separate handoff document.",
      },

      { type: "heading", text: "Turning the science into App Store creative" },
      {
        type: "paragraph",
        text: "I designed the App Store screenshot set — the pitch, the brain visualization, the social proof — translating the same six-system science into three screens someone scrolls past in five seconds. It's part of what got the app selected as Apple's App of the Day.",
      },
      {
        type: "image",
        src: "/projects/ios-app/5.png",
        alt: "App Store marketing screenshots for the wellness app, including Apple's App of the Day badge",
        caption:
          "The same six-system science, rewritten as marketing screenshots — this set contributed to the app being selected as Apple's App of the Day.",
      },

      { type: "heading", text: "Icons for six ways of training your brain" },
      {
        type: "paragraph",
        text: "Each neurotransmitter system needed an icon that read clearly at nav-bar size and held up next to five others that all needed to feel like they belonged to the same family — endurance, flexibility, strength, coordination, speed, balance.",
      },
      {
        type: "image",
        src: "/projects/ios-app/6.png",
        alt: "Six training-dimension cards — endurance, flexibility, strength, coordination, speed, balance — with their icon set",
        caption:
          "Each neurotransmitter system got a physical-fitness analogy people already understand, and an icon distinct enough to read at a glance in the nav bar.",
      },

      { type: "section", id: "results", title: "Results" },
      {
        type: "numbered-list",
        items: [
          "Selected as Apple's App of the Day across multiple countries.",
          "Featured in a documentary series on the science of happiness.",
          "Now expanding into clinical research applications.",
        ],
      },
      {
        type: "paragraph",
        text: "The redesign didn't just make six systems fit on one screen — it kept the neuroscience credible enough to hold up in a documentary and, now, in clinical research settings.",
      },
      // TODO: a real quote from the client or a user would land better here than
      // anything else in the Results section — don't fabricate one in the meantime.
    ],
  },
  {
    slug: "enterprise-dashboard",
    category: "Dashboard, Web App, AI",
    name: "Enterprise Dashboard",
    title: "Enterprise operations dashboard for digital screen deployment",
    summary:
      "Data-rich dashboard for an enterprise workflow — dense information made legible at a glance.",
    client: "Client (NDA)",
    role: "Product design, information architecture, design systems",
    team: "Founder, Head of Operations",
    duration: "2.5 months",
    tools: ["Figma", "Claude", "Figjam"],
    screenshots: [
      { src: "/projects/enterprise-dashboard.png", alt: "Enterprise dashboard overview" },
    ],
    lastUpdated: "Nov, 2025",
    // Real qualitative story (Airtable replacement, KFC/Apple-store scale, founder+ops
    // collaboration) is documented below. What's still missing before this fully matches
    // case-study.md: hard metrics for a Results stat-row (e.g. time-to-quote, adoption,
    // error/rework rate) and a real attributed quote. Don't invent numbers to fill that gap.
    content: [
      { type: "section", id: "problem", title: "Problem" },
      {
        type: "paragraph",
        text: "The client runs digital signage installations for major retail chains — KFC, Apple stores — across quoting, deployment, maintenance, and inventory. All of it lived in Airtable: one flat, general-purpose tool asked to hold a multi-stage lifecycle it was never built for.",
      },
      {
        type: "paragraph",
        text: "That created real friction for the internal deployment managers who lived in it every day. I spent time with them early on to see exactly where it broke down, before drawing a single screen.",
      },
      {
        type: "callouts",
        items: [
          {
            title: "Scattered state",
            description:
              "A job's status lived across disconnected views instead of one lifecycle, so nothing showed where a deployment actually stood.",
          },
          {
            title: "One view, three audiences",
            description:
              "Internal teams, partner companies, and customers all needed a different slice of the same data — a flat spreadsheet couldn't shape itself for any of them.",
          },
          {
            title: "No structure for multi-step work",
            description:
              "Quoting-to-deployment is a sequence, but Airtable gave every stage the same flat rows, with nothing to signal what came next.",
          },
        ],
      },
      { type: "image", src: "/projects/enterprise-dashboard/1.png", alt: "Dashboard overview" },

      { type: "section", id: "solution", title: "Solution" },
      {
        type: "paragraph",
        text: "I worked directly with the founder and head of operations — the two people who understood the business end of this best — to turn what I'd learned from deployment managers into an information architecture that actually matched how the work moves.",
      },
      {
        type: "list",
        items: [
          "Interactive HTML wireframes first, so the IA could get cheap, fast feedback before a single pixel was styled in Figma.",
          "A modular component library, inspired by Linear's restraint, so every screen in a very information-dense product speaks the same visual language.",
          "Progressive disclosure throughout — surfacing only what a step needs, instead of every field a record could ever hold.",
        ],
      },

      { type: "section", id: "final-design", title: "Final design" },
      { type: "heading", text: "One dashboard for the whole lifecycle" },
      {
        type: "paragraph",
        text: "Quotes, deployment, maintenance, and inventory now live in one workflow-aware system instead of one flat base — each stage has its own view, shaped for what that step needs.",
      },
      {
        type: "gallery",
        images: [
          {
            src: "/projects/enterprise-dashboard/2.png",
            alt: "Dashboard workflow screen",
            caption: "A deployment's stages are structured as a sequence, not a spreadsheet row.",
          },
          {
            src: "/projects/enterprise-dashboard/3.png",
            alt: "Dashboard detail screen",
            caption: "Progressive disclosure keeps a dense record legible at a glance.",
          },
        ],
      },
      {
        type: "image",
        src: "/projects/enterprise-dashboard/4.png",
        alt: "Dashboard inventory screen",
        caption: "Inventory gets its own view, shaped around stock instead of jobs.",
      },
      { type: "heading", text: "A component library built for a dense product" },
      {
        type: "paragraph",
        text: "I built a modular component library — inspired by Linear's minimalist aesthetic — so a genuinely data-heavy product would still read as one coherent system, not a pile of one-off screens.",
      },
      {
        type: "image",
        src: "/projects/enterprise-dashboard/5.png",
        alt: "Dashboard component library",
        caption: "One shared component library carries the whole product's visual language.",
      },

      { type: "section", id: "results", title: "Results" },
      {
        type: "list",
        items: [
          "Replaced a fully manual, Airtable-based process with one system spanning quoting through inventory.",
          "Shipped a workflow-aware component library used consistently across the whole product.",
          "Stayed on through engineering implementation, so the shipped product matched the design intent.",
        ],
      },
      {
        type: "paragraph",
        text: "The redesign didn't just move the same spreadsheet into Figma — it gave a multi-stage operations process a structure that actually matches how the work happens.",
      },
      // TODO: swap the list above for a `stat-row` block once real numbers exist
      // (e.g. time-to-quote, adoption, error/rework rate) — see the comment above
      // this project's `content` array. A real attributed quote would also land
      // well here, per case-study.md's Results section.
    ],
  },
  {
    slug: "digitalscreen",
    category: "Website",
    name: "Digital Screen Co.",
    title: "Corporate website for a digital signage company",
    summary:
      "Narrative corporate website for a digital signage company, built to explain a technical product simply.",
    client: "Client (NDA)",
    role: "UI/UX Designer",
    duration: "1 month",
    tools: ["Figma"],
    screenshots: [
      { src: "/projects/digitalscreen.png", alt: "Digital signage company website" },
      {
        src: "/projects/digitalscreen/1.png",
        alt: "Digital signage company website, full page",
        tall: true,
      },
    ],
    lastUpdated: "Nov, 2025",
    content: [
      {
        type: "paragraph",
        text: "I designed a corporate website for a digital signage company to present its technology, services, and team in a clear and engaging way. The goal was to build a modern and credible online presence that communicates innovation and reliability.",
      },
      {
        type: "paragraph",
        text: "Starting from zero, I worked on information architecture, layout systems, and visual identity. The design focused on modularity and responsive behavior, ensuring consistency across desktop and mobile. Collaboration with the founder and operations team helped refine messaging and user flow.",
      },
      { type: "image", src: "/projects/digitalscreen/1.png", alt: "Digital signage company website" },
    ],
  },
  {
    slug: "hirement",
    category: "AI Tooling, Web App",
    name: "Hirement",
    title: "Collaborative hiring flow platform",
    summary:
      "AI-first hiring tool — interaction design and prototyping across the end-to-end recruiting flow.",
    client: "Hirement",
    role: "UI/UX Designer",
    duration: "2.5 months",
    tools: ["Figma"],
    screenshots: [{ src: "/projects/hirement.png", alt: "Hirement interview flow builder" }],
    lastUpdated: "Nov, 2025",
    content: [
      {
        type: "paragraph",
        text: "Hirement is a web platform that helps employers streamline their hiring process by creating structured, customizable interview flows. Each hiring flow consists of multiple rounds with tailored question types: checklists, ratings, or open-ended responses — allowing different interviewers to evaluate candidates with notes and 1–5 star scores.",
      },
      {
        type: "paragraph",
        text: "As the sole designer, I collaborated directly with the founder to translate an early idea into a functional product vision. I designed the logo, a clean and modern interface, and a lightweight design system that emphasized clarity, spaciousness, and ease of collaboration for hiring teams.",
      },
      {
        type: "gallery",
        images: [
          { src: "/projects/hirement/1.png", alt: "Hirement interview flow builder" },
          { src: "/projects/hirement/2.png", alt: "Hirement candidate evaluation screen" },
          { src: "/projects/hirement/3.png", alt: "Hirement scoring interface" },
          { src: "/projects/hirement/4.png", alt: "Hirement design system" },
        ],
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
