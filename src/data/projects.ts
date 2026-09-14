export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  /** Top-level narrative section (Problem framing, Solution, Final design, Results) — anchors the "On this page" TOC. */
  | { type: "section"; id: string; title: string }
  | { type: "list"; items: string[] }
  /** Editorial alternative to a bullet list — large mono numerals, matching About's Values section. */
  | { type: "numbered-list"; items: string[] }
  | { type: "quote"; text: string; attribution: string }
  /**
   * `maxWidth` caps the rendered width in px and centers the image. Needed for
   * phone-shaped assets: the column is wider than they are, so without it they
   * upscale past 1:1 (soft) and eat thousands of pixels of scroll.
   */
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      maxWidth?: number;
      /** Sit the image on a panel — for screenshots with no background of
       *  their own. "dark" for light-coloured assets that vanish on white. */
      panel?: boolean | "dark";
      /** Scroll the image inside a fixed-height window instead of running full height. */
      viewportHeight?: number;
    }
  /** Screenshot with interactive numbered markers — see AnnotatedImage. */
  | {
      type: "annotated-image";
      src: string;
      alt: string;
      maxWidth?: number;
      /** Height of the scroll window, in px. Omit to render full height. */
      viewportHeight?: number;
      caption?: string;
      pins: { x: number; y: number; title: string; body: string }[];
    }
  /** Auto-scrolling strip of card screenshots; pauses on hover. */
  | {
      type: "card-carousel";
      images: string[];
      alt: string;
      height?: number;
      caption?: string;
    }
  /** Interview evidence: hoverable initials avatar, quote, takeaway. */
  | {
      type: "research-quotes";
      items: {
        initials: string;
        name: string;
        context: string;
        quote: string;
        takeaway: string;
      }[];
    }
  | { type: "gallery"; images: { src: string; alt: string; caption?: string }[] }
  /**
   * Toggle between one surface before and after the redesign.
   * Both images must share an aspect ratio — see BeforeAfter.
   */
  | {
      type: "before-after";
      before: string;
      after: string;
      beforeAlt: string;
      afterAlt: string;
      beforeLabel?: string;
      afterLabel?: string;
      /** Cap the rendered width, in px — phone screenshots need this. */
      maxWidth?: number;
      /** Height of the scroll window, in px. Taller screens scroll inside it. */
      viewportHeight?: number;
      caption?: string;
    }
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
    // Written against case-study.md (the Ben Shih framework). Metrics come from the
    // May 2026 internal product review and are cleared for publication; the client
    // stays anonymous, which includes in-product nouns — grep for the product name
    // before shipping copy, and blur it in any screenshot that displays it.
    //
    // Still outstanding:
    //   - problem-activation-funnel.png is a placeholder for a real Amplitude export
    //   - the You page and the level system shipped after the May measurement
    //     window, so neither has per-surface cohort data yet
    //   - the progress-card iteration is argued from design reasoning; if usage
    //     data on those card variants exists, it belongs in the Solution section
    //
    // Two claims here are inherited from the original brief and have never been
    // verified against a source: the documentary coverage and the clinical
    // research expansion. Confirm both before this is used in an application.
    //
    // App of the Day: the app won it several times before this work (the store
    // creative in 5.webp dates one to 2025) and was selected again after the
    // redesign shipped — per Illia, who was there. "Repeat"/"again" is the
    // accurate framing; don't flatten it to a single post-redesign award.
    //
    // Deliberately NOT claimed: the download-to-trial lift. April→May is
    // confounded by an App Store feature that the product review itself credits
    // for the install surge.
    slug: "ios-app",
    category: "iOS App, AI",
    name: "Popular Wellness App's AI Pivot",
    title: "Turning six neuroscience systems into one AI coaching experience",
    summary:
      "Redesigned an Apple App of the Day: a neuroscience-backed wellness app, taken from a complex multi-feature product to a single guided AI coach. First-memory activation went from 39% to 60%.",
    client: "Client (NDA)",
    role: "Product design, design systems, UX research, App Store creative",
    team: "Product manager, three engineers, a co-founder, and neuroscience research advisors from university partnerships",
    credits: [
      { initials: "Me", label: "Niia Bieliavtseva — product design", highlight: true },
      { initials: "PM", label: "Product manager (who also shipped code)" },
      { initials: "iOS", label: "iOS engineer" },
      { initials: "iOS", label: "iOS engineer" },
      { initials: "EN", label: "Platform engineer" },
      { initials: "CF", label: "Co-founder" },
      { initials: "RA", label: "Neuroscience research advisors" },
    ],
    duration: "Dec 2025 – Sep 2026 · 10 months",
    tools: ["Figma", "Claude", "Notion", "Amplitude"],
    screenshots: [
      { src: "/projects/ios-app/hero-coaching.webp", alt: "Three coaching screens" },
      { src: "/projects/ios-app/3.webp", alt: "Emotional fitness app progression screen" },
    ],
    lastUpdated: "Sep, 2026",
    // Figures are from the May 2026 internal product review, cleared for
    // publication. The client itself stays anonymous — see `client` above.
    impact: [
      {
        metric: "Activation",
        description: "After swapping a four-way home screen for one coach,",
        result: "first-memory creation rose from 39% to 60%.",
      },
      {
        metric: "Retention",
        description: "Opening the app gets you a reply, not a dashboard, and",
        result: "week-one retention went from 28% to 49%.",
      },
      {
        metric: "Recognition",
        description: "A repeat Apple App of the Day —",
        result: "selected again, across multiple countries, after the redesign shipped.",
      },
    ],
    content: [
      {
        type: "image",
        src: "/projects/ios-app/hero-coaching.webp",
        alt: "Three coaching screens: the coach asking a question, the coach naming which neurotransmitters a logged memory affected, and the progress sheet",
        caption:
          "Ask, answer, progress. The six systems sit as dots along the top and never take over the screen.",
      },

      { type: "section", id: "problem-framing", title: "Problem" },
      {
        type: "paragraph",
        text: "This product has something most wellness apps don't: a real evidence base. University research partners ran structural MRI, fNIRS brain imaging and cognitive testing to validate a model of emotional fitness across six neurotransmitter systems — dopamine, serotonin, testosterone, oxytocin, opioids and cannabinoids. It had already been Apple's App of the Day. The science was never the problem.",
      },
      {
        type: "paragraph",
        text: "The problem was how little of it survived contact with a new user. In the month before we changed anything, 39% of people who started a trial ever logged a single memory — the one action the entire product is built on. Six in ten paid for a week, did nothing, and left.",
      },
      {
        // PLACEHOLDER — swap for the real Amplitude export at 1460×820.
        // The figure in the caption is from the May 2026 product review.
        type: "image",
        src: "/projects/ios-app/problem-activation-funnel.webp",
        alt: "Funnel showing 133 trial starts against 52 first memories created in the pre-redesign cohort",
        caption:
          "52 of 133 trial starters (39.1%) ever created a first memory. Everything downstream — the six systems, the levels, the weekly report — is computed from memories, so a user who never logs one never sees the product work.",
      },

      { type: "heading", text: "How I tackled it" },
      {
        type: "numbered-list",
        items: [
          "Ran the app as a new user and mapped every screen — what it asked of me, and whether anything on it explained why.",
          "Pulled the activation funnel in Amplitude to find where people stopped, rather than guessing from the screens alone.",
          "Read the cancellation reasons and support tickets, which is where people say the quiet part out loud.",
          "Interviewed users one-on-one, build by build, to hear how they described the app in their own words.",
        ],
      },
      {
        type: "paragraph",
        text: "One interview changed how I saw the problem. The user understood the science better than most of our marketing did. She'd watched our founder's conference talk, taken notes, downloaded the research papers, and written a blog post about it. She could recite the six-neurotransmitter framework word for word. And she still wouldn't pay for the app.",
      },
      {
        type: "research-quotes",
        items: [
          {
            initials: "AS",
            name: "Alena S.",
            context: "London · interviewed on build 2.9.0, May 2026",
            quote:
              "There is nothing tangible, and this is like a very quite weird experience to pay for.",
            takeaway:
              "She happily paid £30 for a paper journal but balked at the subscription. Understanding the science turned out to be no substitute for feeling the product work on you — “If I feel that I'm getting a real transformation in my behavior, I would pay for it.”",
          },
        ],
      },
      {
        type: "paragraph",
        text: "We were selling understanding when people wanted to feel a difference. And you can't feel a difference from a product you never really started using. Which brings us back to that 39%.",
      },
      {
        type: "paragraph",
        text: "So what was stopping people? Not the science. Three problems with how the app was laid out.",
      },
      {
        type: "callouts",
        items: [
          {
            title: "No primary action",
            description:
              "Open the app and nothing tells you what to do first. The home screen made four separate asks and ranked none of them.",
          },
          {
            title: "High cognitive load",
            description:
              "Cognitive load is the mental effort a screen demands before you can act. Here it was a composite score, six neurotransmitters, a photo feed and a memory prompt — all at once, none explained.",
          },
          {
            title: "Progress split four ways",
            description:
              "Today, Stats, Memories and You each held a fragment of how you were doing. Answering “am I getting anywhere?” meant assembling the answer yourself across four tabs.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "Here's the whole home screen at full length. Tap any marker to see what goes wrong there — and yes, the product name is blurred, not missing.",
      },
      {
        // Marker positions are the real Figma layer offsets, expressed as a
        // percentage of frame height — see node 12568:31610 in the iOS (Copy)
        // file. Don't eyeball these if the screenshot is ever re-exported.
        type: "annotated-image",
        src: "/projects/ios-app/before-today.webp",
        alt: "The old home screen at full length: score ring, neurotransmitter suggestions, today's photos, an add-a-past-memory prompt, and a five-item tab bar",
        // 1170px source — keep the render at/below 585 so it stays above 2x.
        maxWidth: 380,
        viewportHeight: 620,
        pins: [
          {
            x: 93,
            y: 25.9,
            title: "Unexplained hero metric",
            body: "A composite score is the biggest thing on the screen, and nothing says what it measures or how to move it.",
          },
          {
            x: 93,
            y: 34.3,
            title: "Undefined jargon",
            body: "Dopamine, oxytocin and serotonin are offered as suggestions and defined nowhere. The science that makes the product credible reads as noise here.",
          },
          {
            x: 93,
            y: 42.1,
            title: "Unclear relevance",
            body: "Today's photos appear with no stated link to wellbeing. Skim the onboarding and the app reads as a photo album.",
          },
          {
            x: 93,
            y: 67.7,
            title: "A fourth competing ask",
            body: "“Add a past memory” — still no reason given, on a screen that has already asked three times.",
          },
          {
            x: 93,
            y: 96,
            title: "Progress split four ways",
            body: "Today, Stats, Memories and You each hold a fragment of the same picture.",
          },
        ],
        caption:
          "One screen, four calls to action, and no stated reason to perform any of them.",
      },

      { type: "section", id: "solution", title: "Solution" },
      {
        type: "paragraph",
        text: "So how do you explain six neurotransmitter systems to someone who has given you about four seconds? You stop trying to explain them on a screen.",
      },
      {
        type: "paragraph",
        text: "We ran a workshop: me, the PM, the iOS engineers, and the co-founder. We decided to make the app answer instead of display. You open it and land in a conversation. The coach asks how your day went, and your answer decides what comes next. The science arrives when it is relevant, instead of all at once on a dashboard.",
      },
      {
        type: "image",
        src: "/projects/ios-app/solution-exploration.webp",
        panel: true,
        alt: "A working canvas of chat-screen explorations in dark UI, with reference screens from other wellbeing apps along the bottom",
        caption:
          "The canvas partway through. Chat directions across the top, apps we looked at along the bottom. Most of this didn't survive.",
      },
      {
        type: "paragraph",
        text: "Each concept traces back to one of the three frictions:",
      },
      {
        type: "list",
        items: [
          "Chat as the home screen, answering “no primary action.” One question, one reply, one thing to do. Everything else moves behind it.",
          "A coach that explains in context, answering “high cognitive load.” Share a memory and it tells you which systems it affects and why, in plain language, instead of the screen defining six terms up front.",
          "Four destinations behind a drawer, answering “progress split four ways.” The five-tab bar collapses; the You page becomes the single place your progress lives.",
        ],
      },
      {
        type: "image",
        src: "/projects/ios-app/solution-drawer.webp",
        panel: true,
        alt: "The new navigation drawer showing Coaching, You, Team and Memories, with Settings at the bottom",
        maxWidth: 360,
        caption:
          "Five tabs of equal weight became one default surface plus three places to go looking. Coaching is where you land; nothing else competes for the opening move.",
      },

      { type: "heading", text: "Iterating on the progress card" },
      {
        type: "paragraph",
        text: "The conversation was the easy part. The hard part was telling someone where they stand without sending them back to a dashboard. Progress had to show up inside the chat, in a card small enough not to interrupt.",
      },
      {
        type: "paragraph",
        text: "The first versions praised you. “Great job!” and “You are making huge progress!” over a percentage bar. Put side by side, the problem was obvious. A percentage of an unnamed total is the same unexplained number we had just spent months taking off the home screen. Nice to read, no help at all.",
      },
      {
        type: "image",
        src: "/projects/ios-app/solution-card-iterations.webp",
        panel: true,
        alt: "Four progress card variants — two praise-led with percentage bars, two naming the Happiness Report with a five-segment counter — next to the expanded progress sheet and its empty state",
        caption:
          "Top row: praise over a percentage. Bottom row: a named destination over a five-segment counter, so “3/5” tells you exactly how many memories are left. The version that shipped is the one that answers “and then what?”",
      },
      {
        type: "paragraph",
        text: "The card that shipped names what you are working toward, your weekly Happiness Report, and counts the memories left in whole numbers. Tap it and a sheet opens with the level bar and the report progress together. Same fix as the home screen, one size down: swap an unexplained number for a named next step.",
      },

      {
        type: "paragraph",
        text: "I prototyped the shortlisted directions as working code rather than static frames, so I could feel an interaction before asking an engineer to build it.",
      },

      { type: "heading", text: "What we cut" },
      {
        type: "paragraph",
        text: "Quite a lot. Going AI-first doesn't mean making everything AI-first at once.",
      },
      {
        type: "list",
        items: [
          "We didn't let the photo-suggestion card open the conversation. It shows up later instead, so it can't get in the way of the opening we'd just got working. We'll test it as a first message once we have click-through data.",
          "The quick-access button only lives in the chat input, not all over the app. It can spread once the sheet behind it proves useful.",
          "We dropped the neuroscience note on workouts. It reads as rigour to us and as more text to everyone else.",
          "We lowered our own target. We wanted half of users to tap the card each session; we settled on 40%, because 50% wasn't realistic.",
        ],
      },
      {
        type: "paragraph",
        text: "We did the same to the level system. The original framework asked for 50 memories before you cleared Level 1, thousands of sent gifts, and brain scans to reach the top levels. We cut Level 1 to 10 memories, made the scans optional, and introduced the rules one level at a time. Same science, but you can actually reach the first milestone.",
      },

      { type: "section", id: "final-design", title: "Final design" },
      {
        type: "paragraph",
        text: "Four surfaces. The coach and the drawer went live on 7 May 2026, and those are what the numbers above measure. The level system and the You page were designed after that window and aren't covered by it.",
      },

      { type: "heading", text: "1. What you see when you open the app" },
      {
        type: "paragraph",
        text: "Four competing asks became one question, and the screen waits for the answer.",
      },
      {
        // Exported via scripts/figma-export.py. Both are 786×1704 — the before
        // is the old Today frame cropped to the top 852pt so it's compared at
        // the same viewport as the after, not as a full page scroll.
        //   before: iOS (Copy) KCR6CITRUDpaBFFnqgYbWG  12568:31610
        //   after:  Production 4cBNswIEFN0tLHhntFYcry  3161:12164
        type: "before-after",
        before: "/projects/ios-app/before-today.webp",
        after: "/projects/ios-app/after-coaching.webp",
        beforeAlt:
          "The old Today screen: an unexplained composite wellbeing score, neurotransmitter suggestion pills, photos from today, and an add-a-past-memory prompt",
        afterAlt:
          "The new Coaching screen: six neurotransmitter progress dots, the coach naming which systems a logged memory affected, and two action cards offering to share it or answer a follow-up",
        maxWidth: 360,
        // Tall enough that the coaching screen — one phone viewport — is fully
        // visible without scrolling. The old home screen still runs past it.
        viewportHeight: 782,
        caption:
          "The same moment in the app — opening it cold. Scroll either screen inside the frame, toggle between them, or click to open one full size. The old one keeps going for a while.",
      },

      {
        type: "paragraph",
        text: "First-memory creation went from 39% to 60% of trial starters. The screen makes one request now, and answering it means writing a sentence instead of choosing between four modules.",
      },
      {
        type: "paragraph",
        text: "The session also ends. It has a purpose and a natural stopping point, which is unusual for a chat interface and was a deliberate call: the product is trying to send you back into your own life, not keep you in the app.",
      },
      {
        type: "image",
        src: "/projects/ios-app/final-coach-tagging.webp",
        panel: true,
        alt: "The coach confirming a saved memory and naming which neurotransmitters it affected, with Add memory and Recall memories cards",
        maxWidth: 380,
        caption:
          "The six systems didn't disappear, they moved behind the conversation. Log a memory and the coach names which systems it affected and why — in a sentence, not a lab report.",
      },

      { type: "heading", text: "2. The progress page, redesigned as one place" },
      {
        type: "paragraph",
        text: "The old Stats tab opened on a chart of a composite score across the week, with a paragraph underneath explaining what you were looking at. Below that came score-versus-neurotransmitter breakdowns. The rest of your progress lived on three other tabs.",
      },
      {
        type: "paragraph",
        text: "The redesigned You page follows what someone actually wants to know: who you are, how far you have come, how your balance looks, and what to read next. The charts are still there, just not first. Anything that isn't obvious has an info icon that explains it in place.",
      },
      {
        type: "before-after",
        before: "/projects/ios-app/before-you.webp",
        after: "/projects/ios-app/after-you.webp",
        beforeAlt:
          "The old Stats tab: a composite score chart across a week, with a paragraph explaining the chart underneath it",
        afterAlt:
          "The redesigned You page: profile, level and streaks, molecular balance across six systems, then joyalties",
        maxWidth: 360,
        viewportHeight: 782,
        caption:
          "The same question — how am I doing? — answered first by a chart you have to interpret, then by a page ordered from identity to detail. Scroll inside either frame to see the full screen.",
      },

      { type: "heading", text: "3. Levels, with the science kept optional" },
      {
        type: "paragraph",
        text: "Each level names what you are training, what is left to reach the next one, and the science behind the claim: structural MRI, fNIRS imaging, standardised personality and cognitive tests. The tests are offered, never required. That keeps the progression honest about what it has actually measured and what it hasn't.",
      },
      {
        type: "image",
        src: "/projects/ios-app/final-level.webp",
        panel: true,
        viewportHeight: 620,
        alt: "Level 4 Practitioner screen showing progress toward Level 5 broken into total memories, per-neurotransmitter counts, peak memories, balanced weeks and joyalties sent",
        maxWidth: 380,
        caption:
          "Progress to the next level is broken into five countable things rather than one percentage — the same move as the progress card, at screen scale.",
      },

      { type: "heading", text: "4. Optic, the design system" },
      {
        type: "paragraph",
        text: "None of this runs on the old design system. That one grew around the four-tab app and carried its assumptions, so rather than bend it I built a new one. Optic holds only what the chat-first product needs — about 64 primitive colours and 34 semantic aliases, nine spacing values, three radii, eight text styles — and ran alongside the old system, so nothing needed a big rewrite.",
      },
      {
        type: "paragraph",
        text: "Much of the implementation was going to be AI-assisted, which changed who I was designing the handoff for: not only an engineer reading a spec, but a model reading the design file. So Optic has one rule — every name survives the trip into code unchanged. `levels/level-2` becomes `Color.level2`, `spacing/32` becomes `CGFloat.spacing32`. An agent reads a token name and already knows the constant to write, so there's no handoff doc and no naming table to keep in sync.",
      },
      {
        type: "paragraph",
        text: "The cards use slots rather than variants. One insight card has two open regions, one above the text and one for the buttons, and whatever you drop in decides what the card is: a photo strip makes it a memory prompt, a progress meter makes it the weekly report, two image tiles make it a science tour.",
      },
      {
        type: "card-carousel",
        images: [
          "/projects/ios-app/cards/card1.webp",
          "/projects/ios-app/cards/card2.webp",
          "/projects/ios-app/cards/card3.webp",
          "/projects/ios-app/cards/card4.webp",
          "/projects/ios-app/cards/card5.webp",
          "/projects/ios-app/cards/card6.webp",
        ],
        alt: "Six instances of the same insight card, each filled differently: a memory-recall prompt with a photo strip, two weekly-report states with progress meters, two report cards with photo strips, and a science tour with image tiles",
        caption:
          "Six cards, one component. Everything that differs is slot content, so a new kind of card costs a fill rather than a build. Hover to stop the strip.",
      },
      {
        type: "image",
        src: "/projects/ios-app/final-token-mapping.webp",
        alt: "A zoomed section of the token sheet: each level colour listed with its hex value and the primitive alias it points at, such as levels/level-2 mapping to colors/purple/100",
        caption:
          "The Figma side of the mapping. Each semantic token points at a primitive, and the name it carries is the name the code uses.",
      },

      { type: "heading", text: "Also shipped: the store listing and the icon set" },
      {
        type: "paragraph",
        text: "I designed the App Store screenshot set: the pitch, the brain visualisation, the social proof. The same science, rewritten as three screens someone scrolls past in five seconds.",
      },
      {
        type: "image",
        src: "/projects/ios-app/5.webp",
        panel: true,
        alt: "App Store marketing screenshots for the wellness app",
        caption:
          "Three screens to carry the same six-system science past someone who is scrolling.",
      },

      {
        type: "paragraph",
        text: "Each neurotransmitter system also needed an icon that reads at nav-bar size next to five siblings: endurance, flexibility, strength, coordination, speed, balance. The fitness analogy does the explaining the old screen never did. You already know what training flexibility means.",
      },
      {
        type: "image",
        src: "/projects/ios-app/final-training-cards.webp",
        alt: "Six training-dimension cards — endurance, flexibility, strength, coordination, speed, balance — with their icon set",
        caption:
          "Each neurotransmitter system got a physical-fitness analogy people already understand, and an icon distinct enough to read at a glance in the nav bar.",
      },

      { type: "section", id: "results", title: "Results" },
      {
        type: "paragraph",
        text: "The AI coach shipped on 7 May 2026. These are the cohorts either side of that date: people who started before it existed, against people who started after. Both are drawn from the same in-app analytics, so they measure the change rather than the month's marketing.",
      },
      {
        // Figures from the May 2026 internal product review. Activation is
        // 52/133 pre vs 202/338 post; retention is the paid-subscriber weekly
        // cohort. Week 6 is deliberately omitted — the post-M cohort hadn't
        // aged into it yet, so its 0% is a cohort artifact, not a decline.
        type: "stat-row",
        stats: [
          { value: "39% → 60%", label: "Trial starters who logged a first memory" },
          { value: "28% → 49%", label: "Week-one retention, paid subscribers" },
        ],
      },
      {
        type: "paragraph",
        text: "Activation is the one that matters. Going from four in ten to six in ten means half again as many people got far enough to see the product work at all.",
      },
      {
        type: "paragraph",
        text: "Retention moved for the same reason: there's now a reason to come back tomorrow that isn't a number you don't understand.",
      },
      {
        type: "paragraph",
        text: "The clearest evidence came from someone who had already quit. She'd lapsed more than a year earlier, got an email about the coaching feature, saved it until she was on holiday and had time to read it properly, and came back.",
      },
      {
        type: "research-quotes",
        items: [
          {
            initials: "LL",
            name: "Laura L.",
            context: "Canada · interviewed on build 3.0.9, June 2026",
            quote: "There's somebody waiting for me.",
            takeaway:
              "A returning lapsed user on why she came back — that, and “there's a plan when I get there.” It had changed how she used her camera, too: she photographed a hole in the wall her husband had fixed, because “that is love.” The app stopped being a tracker and became a reason to notice things.",
          },
        ],
      },

      { type: "heading", text: "What didn't work" },
      {
        type: "paragraph",
        text: "Two things, and they're the same problem from opposite ends.",
      },
      {
        type: "list",
        items: [
          "Long-time users lost features they liked. 42% of May's support inquiries were product issues, questions and comments, and the recurring theme was old functionality deprecated in favour of the coach. One cancellation read: “Became overly complicated. I preferred just adding photos and getting my weekly report.” Simplifying for new users is not free for the people who had already learned the old thing.",
          "New users still missed the explanations. Laura never found the onboarding tooltips at all, didn't know the neurotransmitters train in a fixed sequence, and discovered she could edit a memory's date and duration only by accident. The coach answers questions well; it's still not great at telling you which questions are worth asking.",
        ],
      },
      {
        type: "paragraph",
        text: "Both fed the next round of work: the mood check-in, the level system, and the progress cards that tell you where you are without being asked.",
      },

      {
        type: "paragraph",
        text: "The science underneath went on being taken seriously either way: the product has been covered in a documentary series on happiness, and the same model is moving into clinical research settings.",
      },
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
    // Rewritten against case-study.md. No formal research phase, launch, or metrics
    // exist for this project — the founder's domain expertise stood in for research,
    // and the engagement ended at design completion, not launch. Framed honestly as
    // that rather than inventing interviews, a comparative study, or usage numbers.
    slug: "hirement",
    category: "Web App",
    name: "Hirement",
    title: "Collaborative hiring flow platform",
    summary:
      "Hiring tool — interaction design and prototyping across the end-to-end recruiting flow.",
    client: "Web App",
    role: "Product design, brand identity, design systems",
    team: "Founder",
    duration: "2.5 months",
    tools: ["Figma"],
    screenshots: [{ src: "/projects/hirement.png", alt: "Hirement interview flow builder" }],
    lastUpdated: "Nov, 2025",
    content: [
      { type: "section", id: "problem", title: "Problem" },
      {
        type: "paragraph",
        text: "Hirement's founder came to me with an early idea, not a product: give hiring teams a way to run structured, repeatable interview loops instead of ad hoc rounds with no shared rubric.",
      },
      {
        type: "paragraph",
        text: "Each hiring flow needed multiple rounds, each with its own question types — checklists, ratings, open-ended — so different interviewers could evaluate the same candidate consistently, with notes and a 1–5 star score.",
      },

      { type: "section", id: "approach", title: "Approach" },
      {
        type: "paragraph",
        text: "There was no research budget and no team beyond the two of us. The input instead was the founder's own years working inside recruiting — he already knew where interview loops break down: inconsistent rubrics, notes that live in someone's head instead of the record, no shared signal across rounds. My job was to turn that domain knowledge into a product model, not validate it from scratch.",
      },
      {
        type: "paragraph",
        text: "That meant working in short, direct cycles with the founder as both stakeholder and subject-matter expert — sketch a flow, walk it against a real hiring scenario he'd run before, adjust, repeat — rather than a separate discovery phase ahead of design.",
      },

      { type: "section", id: "solution", title: "Solution" },
      {
        type: "paragraph",
        text: "As the sole designer, I worked directly with the founder to turn that idea into a functional product vision — logo, interface, and the design system underneath it, built together rather than bolted on after.",
      },
      {
        type: "list",
        items: [
          "A lightweight design system built for clarity and spaciousness, so a dense, multi-round flow stayed easy to scan.",
          "Interview rounds structured as a sequence of typed questions — checklist, rating, open-ended — instead of one freeform form.",
          "Scoring built around notes plus a 1–5 star rating, so interviewers could leave both a number and the reasoning behind it.",
        ],
      },

      { type: "section", id: "final-design", title: "Final design" },
      {
        type: "paragraph",
        text: "The flow builder, scoring screens, and design system came together as one coherent product design — built for hiring teams who need consistency across rounds and interviewers, not just a nicer form. It had two sides: the recruiter running the loop, and the candidate going through it.",
      },
      { type: "heading", text: "The recruiter side" },
      {
        type: "gallery",
        images: [
          {
            src: "/projects/hirement/2.png",
            alt: "Hirement loop dashboard showing candidates for a role",
            caption:
              "Each role's loop tracks every candidate's status, interviewers, and running average rating in one table.",
          },
          {
            src: "/projects/hirement/3.png",
            alt: "Hirement edit interview loop modal",
            caption:
              "Editing a loop after interviews are already scheduled — role, candidates, and invite details stay in one place.",
          },
        ],
      },
      {
        type: "image",
        src: "/projects/hirement/4.png",
        alt: "Hirement interview screen with candidate profile lookup open",
        caption:
          "Mid-interview, an interviewer can pull up the candidate's full profile without losing their place in the question.",
      },

      { type: "heading", text: "The candidate side" },
      {
        type: "paragraph",
        text: "Hirement wasn't one-directional. Candidates got their own guide before their first round — who they'd meet, how scoring worked, what to expect on interview day — and after each round, they rated the interview itself, anonymously, question by question. That reciprocal loop was the founder's idea: a way to catch a bad interview experience before it became a bad review, not just a way to score candidates.",
      },
      {
        type: "image",
        src: "/projects/hirement/5.png",
        alt: "Hirement candidate interview overview guide",
        viewportHeight: 620,
        caption:
          "Before their first round, candidates see who's interviewing them, how scoring works, and what to expect.",
      },
      {
        type: "image",
        src: "/projects/hirement/6.png",
        alt: "Hirement candidate feedback form",
        viewportHeight: 620,
        caption: "After each round, candidates rate the interview back — anonymously, per question.",
      },

      { type: "heading", text: "Getting there" },
      {
        type: "paragraph",
        text: "None of the screens above started that way. Early passes were grayscale wireframes and competing color directions before purple stuck, and the loops list went through a real structural change — from one flat table to grouped by role — once it was clear a recruiter would realistically have more than one open loop at a time.",
      },
      {
        type: "before-after",
        before: "/projects/hirement/7.png",
        after: "/projects/hirement/8.png",
        beforeAlt: "Black-and-white wireframe of an interview question screen",
        afterAlt: "Blue color exploration of the same interview question screen",
        beforeLabel: "Wireframe",
        afterLabel: "Color exploration",
        // Desktop screens (1360×960) — wide enough to read, tall enough that
        // one viewport fits with no scroll.
        maxWidth: 896,
        viewportHeight: 634,
        caption: "Structure got worked out in grayscale before color entered the conversation.",
      },
      {
        type: "before-after",
        before: "/projects/hirement/9.png",
        after: "/projects/hirement/10.png",
        beforeAlt: "Early loops list as a single flat table",
        afterAlt: "Final loops list grouped by role",
        beforeLabel: "Early version",
        afterLabel: "Final",
        maxWidth: 896,
        viewportHeight: 634,
        caption: "The loops list itself changed shape once roles, not just candidates, needed to be scannable.",
      },

      { type: "section", id: "results", title: "Results" },
      {
        type: "paragraph",
        text: "In 2.5 months, working solo alongside the founder, this took Hirement from an early idea to a complete product design: a flow builder, scoring system, and design system built to hold together as the product scaled past the first few hiring teams.",
      },
      {
        type: "paragraph",
        text: "The project stopped there — Hirement didn't move into engineering or launch. What's left is the design itself: a hiring flow built end to end, from the recruiter's loop builder to the candidate's own guide and feedback loop.",
      },
    ],
  },
  {
    // Rewritten against case-study.md. Source material here is much thinner than
    // ios-app/enterprise-dashboard: no documented research process, named frictions,
    // launch metrics, or client quote — only the two original descriptive paragraphs.
    // The section structure below is applied honestly on top of that; nothing beyond
    // what was already written is invented. See TODO near Results.
    slug: "digitalscreen",
    category: "Website",
    name: "Digital Screen Co.",
    title: "Corporate website for a digital signage company",
    summary:
      "Narrative corporate website for a digital signage company, built to explain a technical product simply.",
    client: "Client (NDA)",
    role: "UI/UX design, information architecture, visual identity",
    team: "Founder, Operations team",
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
      { type: "section", id: "problem", title: "Problem" },
      {
        type: "paragraph",
        text: "The client needed a website that could explain a technical product — digital signage technology — to potential customers, alongside its services and team. There was nothing to build on: no site, no visual identity yet.",
      },
      {
        type: "paragraph",
        text: "The brief was mostly about credibility: give a technical product a modern, trustworthy web presence that communicates innovation and reliability, not just a spec sheet.",
      },

      { type: "section", id: "solution", title: "Solution" },
      {
        type: "paragraph",
        text: "Starting from zero, I built the information architecture, layout system, and visual identity together, then worked with the founder and operations team to refine the messaging and user flow.",
      },
      {
        type: "list",
        items: [
          "Information architecture and layout system built to hold both marketing and technical content.",
          "A visual identity designed to read as modern and credible without going generic.",
          "Modular, responsive components so desktop and mobile stayed consistent instead of diverging.",
        ],
      },

      { type: "section", id: "final-design", title: "Final design" },
      { type: "heading", text: "One narrative site, from hero to team" },
      {
        type: "paragraph",
        text: "The site walks a visitor from what the product does, through services, to the team behind it — a single narrative page rather than a stack of disconnected sections.",
      },
      {
        type: "image",
        src: "/projects/digitalscreen/1.png",
        alt: "Digital signage company website, full page",
        caption: "One scrolling narrative, not a set of disconnected marketing sections.",
      },

      { type: "section", id: "results", title: "Results" },
      {
        type: "paragraph",
        text: "In about a month, working solo, this took the client from no web presence to a full, responsive site that explains a technical product in plain language.",
      },
      // TODO: no launch metrics (traffic, lead volume) or client quote are documented
      // for this project — add them here if/when available, per case-study.md's
      // Results section. Don't invent numbers to fill the gap.
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
