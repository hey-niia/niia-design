export type ContentBlock =
  | { type: "paragraph"; text: string }
  | {
      type: "heading";
      text: string;
      /** Geist Mono capitals in the accent orange — the surface labels on a
       *  dark page, rather than a sentence-case subheading. */
      mono?: boolean;
    }
  /** Top-level narrative section (Problem framing, Solution, Final design, Results) — anchors the "On this page" TOC. */
  | { type: "section"; id: string; title: string }
  | { type: "list"; items: string[] }
  /** Editorial alternative to a bullet list — large mono numerals, matching About's Values section. */
  | { type: "numbered-list"; items: string[] }
  /** Icon, short title and a sentence or two per column, side by side (Retool's feature-row pattern). */
  | { type: "columns"; items: { icon: "screens" | "chart" | "conversation"; title: string; text: string }[] }
  | { type: "quote"; text: string; attribution: string }
  /**
   * `maxWidth` caps the rendered width in px and centers the image. Needed for
   * phone-shaped assets: the column is wider than they are, so without it they
   * upscale past 1:1 (soft) and eat thousands of pixels of scroll.
   */
  | {
      type: "image";
      src: string;
      /** On the white page with a soft shadow, never grouped onto a dark band. */
      plain?: boolean;
      alt: string;
      caption?: string;
      maxWidth?: number;
      /** Sit the image on a panel — for screenshots with no background of
       *  their own. "dark" for light-coloured assets that vanish on white. */
      panel?: boolean | "dark";
      /** Scroll the image inside a fixed-height window instead of running full height. */
      viewportHeight?: number;
    }
  /** Silent, autoplaying, looping screen capture — no controls, no lightbox. */
  | {
      type: "video";
      src: string;
      /** Shown while the video loads, and to browsers/crawlers that don't play it. */
      poster?: string;
      alt: string;
      caption?: string;
      maxWidth?: number;
      /** Caps the rendered height in px instead — for a tall screen recording
       *  that would otherwise run past the bottom of the window. */
      height?: number;
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
        /** More of what they said, each shown as its own message bubble. */
        followUps?: string[];
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
      /** Numbered markers on the before screen, with notes on hover. */
      beforePins?: { x: number; y: number; title: string; body: string }[];
      /** Dark grey (#292929) panel, matching the PDF case study. */
      dark?: boolean;
      /** No panel: the frame sits on the white page with a soft shadow. */
      plain?: boolean;
    }
  /** Outcome cards (Nadiia style); `green` marks a headline result. */
  | {
      type: "cards";
      title?: string;
      columns?: 3 | 4;
      items: { text: string; tone?: "outline" | "light" | "green" }[];
    }
  /** Tools grouped by takeaway: white boxes forking out to one strength (+) and one weakness (−). */
  | { type: "tool-map"; items: { names: string[]; plus: string; minus: string }[] }
  /** One column per user group (Nadiia style): pain points, then what they create or need. */
  | {
      type: "user-groups";
      groups: { name: string; pains: string[]; needsLabel: string; needs: string[] }[];
    }
  /** Separate systems merging into the one system they became (Nadiia style). */
  /** Auto-advancing slideshow of screens with a name tag above each (Nadiia style). */
  | {
      type: "slides";
      label: string;
      /** `figma`: each slide as a Figma section in the app's placeholder colour. Default: Nadiia frames on orange. */
      appearance?: "nadiia" | "figma";
      /** Nadiia look: the field behind the frames — "orange" (default) or the
       *  neutral grey the interview cards sit on. */
      field?: "orange" | "neutral";
      /** Nadiia look: hold one tag (the label) above the track rather than a
       *  moving tag per slide. */
      stickyTitle?: boolean;
      /** Figma look: `light` (pale grid, white cards) or `darkMatter` (dark dotted panel, shadow only). */
      look?: "light" | "darkMatter";
      /** Explore canvas: sections to sit side by side, left to right, as one row (by slide title). */
      canvasRows?: string[][];
      slides: {
        title: string;
        src?: string;
        alt?: string;
        /** Several related components on one screen (figma look). */
        images?: { src: string; alt: string; width?: number; bare?: boolean; backed?: boolean }[];
        columns?: number;
        scroll?: boolean;
        /** Too big to read in the slider: shown only on the explore canvas. */
        gridOnly?: boolean;
      }[];
    }
  /** Screens played back like a recording, with a hand clicking through to each next screen. */
  | {
      type: "click-through";
      label: string;
      steps: { src: string; alt: string; click?: { x: number; y: number }; holdMs?: number }[];
    }
  /** A hand-built diagram component, looked up by name in CaseStudy. */
  | { type: "diagram"; name: "connectiq-user-flow" }
  | { type: "silos"; from: string[]; to: string }
  /** Key product decisions as before → after cards (Nadiia style). */
  | {
      type: "decisions";
      items: { title: string; before: string; after: string; note?: string }[];
    }
  /** Usability test scope next to what came out of it (Nadiia style). */
  | { type: "findings"; tested: string[]; findings: string[] }
  /** Short labels in white mono boxes with a soft shadow, on the white page. */
  | { type: "chips"; items: string[] }
  /** Big standalone numbers (page views, MAU, usability score…), no card/border. */
  | { type: "stat-row"; stats: { value: string; label: string }[] }
  /** An analytics readout, rebuilt as a themed table — see DataTable. */
  | {
      type: "data-table";
      title: string;
      source?: string;
      columns: string[];
      rows: { label: string; qualifier?: string; cells: string[] }[];
    }
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
  /** Show only `name` in the small line above the case study title, without "· client". */
  hideClientInHeader?: boolean;
  role: string;
  /** Who else was involved, by function — omit if solo or not documented. */
  team?: string;
  /** Placeholder avatar row for `team` — omit if there's nothing to show yet. */
  credits?: Credit[];
  duration: string;
  tools: string[];
  screenshots: ProjectScreenshot[];
  /** Looping muted clip shown on the work grid card instead of the static cover
   *  screenshot — `screenshots[0]` stays as its poster frame and alt text. */
  coverVideo?: string;
  /** Replaces the whole meta line under the home-page card, e.g. just "Dashboard". */
  cardMeta?: string;
  /** A coded animation that replaces the cover image on the home page. */
  coverAnimation?: "connectiq-kanban";
  lastUpdated: string;
  /** Impact Overview: 2-3 stat cards surfaced at the top of the case study. */
  impact?: ImpactStat[];
  /** Screenshot shown right under Role / Team / Timeline, before `featured`. */
  hero?: { src: string; alt: string };
  /** Before/after toggle shown right under Role / Team / Timeline. */
  featured?: Extract<ContentBlock, { type: "before-after" }>;
  /** Every visual sits on a full-bleed dark grey band, and sections are numbered — the PDF case study look. */
  darkVisuals?: boolean;
  /** Sections are numbered ("01/"), and everything from Impact down is on
   *  Dark Matter's charcoal — for a case study whose product is dark. */
  darkPage?: boolean;
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
    category: "iOS App",
    name: "Neuroscience App's AI Pivot",
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
    coverVideo: "/projects/ios-app/hero-coaching.mp4",
    darkPage: true,
    screenshots: [
      { src: "/projects/ios-app/hero-coaching.webp", alt: "Three coaching screens" },
      { src: "/projects/ios-app/3.webp", alt: "Emotional fitness app progression screen" },
    ],
    lastUpdated: "2026",
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
        type: "video",
        height: 600,
        src: "/projects/ios-app/hero-coaching.mp4",
        poster: "/projects/ios-app/hero-coaching.webp",
        alt: "Screen recording of the coaching flow: asking a question, logging a memory, naming which neurotransmitters it affected, and the progress sheet",
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
        // Amplitude, pre-redesign trial cohort: 133 starts, 52 first memories.
        // Rebuilt as a table rather than a screenshot so it follows the dark page.
        type: "data-table",
        title: "Trial activation breakdown",
        source: "Amplitude",
        columns: ["Metric / stage", "Users", "% of trial starters", "Status"],
        rows: [
          { label: "Trial starters", qualifier: "(baseline)", cells: ["133", "100.0%", "Total cohort"] },
          { label: "Logged first memory", qualifier: "(activated)", cells: ["52", "39.1%", "Completed core action"] },
          { label: "Dropped off", qualifier: "(never logged a memory)", cells: ["81", "60.9%", "Early drop-off bottleneck"] },
        ],
      },

      { type: "heading", text: "How I tackled it" },
      {
        // The four research steps as three columns, the way Retool lays out a
        // feature row. Cancellation reasons and support tickets sit with the
        // interviews: both are people describing the app in their own words.
        type: "columns",
        items: [
          {
            icon: "screens",
            title: "Walked it as a new user",
            text: "Ran the app as a new user and mapped every screen — what it asked of me, and whether anything on it explained why.",
          },
          {
            icon: "chart",
            title: "Followed the numbers",
            text: "Pulled the activation funnel in Amplitude to find where people stopped, rather than guessing from the screens alone.",
          },
          {
            icon: "conversation",
            title: "Heard it in their words",
            text: "Read the cancellation reasons and support tickets, which is where people say the quiet part out loud. Then interviewed users one-on-one, build by build, to hear how they described the app in their own words.",
          },
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
            followUps: ["If I feel that I'm getting a real transformation in my behavior, I would pay for it."],
            takeaway:
              "She paid £30 for a paper journal without blinking, but wouldn't pay for the app. Knowing the science isn't the same as feeling it work.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "We were selling understanding when people wanted to feel a difference. And you can't feel a difference from a product you never really started using. Which brings us back to that 39%.",
      },
      {
        type: "paragraph",
        text: "What stopped people was never the science — it was the way the app was laid out. Three things got in the way.",
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
        text: "See for yourself below: the old home screen, at full length. Tap any marker to see what went wrong there.",
      },
      {
        // Marker positions are the real Figma layer offsets, expressed as a
        // percentage of frame height — see node 12568:31610 in the iOS (Copy)
        // file. Don't eyeball these if the screenshot is ever re-exported.
        type: "annotated-image",
        src: "/projects/ios-app/before-today.webp",
        alt: "The old home screen at full length: score ring, neurotransmitter suggestions, today's photos, an add-a-past-memory prompt, and a five-item tab bar",
        // 1170px source — keep the render at/below 585 so it stays above 2x.
        // Same phone width as the coaching video at the top of the page.
        maxWidth: 277,
        viewportHeight: 600,
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
        type: "paragraph",
        text: "Each concept traces back to one of the three frictions:",
      },
      {
        // The frictions above, each with what shipped against it: the same
        // before/after table the ConnectIQ page uses for its decisions.
        type: "decisions",
        items: [
          {
            title: "Chat as the home screen",
            before: "Four separate asks on opening, and none of them ranked.",
            after: "One question, one reply, one thing to do. Everything else moves behind it.",
          },
          {
            title: "A coach that explains in context",
            before:
              "Six neurotransmitters, a composite score and a memory prompt, none of them explained.",
            after:
              "Share a memory and it names which systems it affects, and why, in plain language.",
          },
          {
            title: "Four destinations behind a drawer",
            before: "Today, Stats, Memories and You each held a fragment of how you were doing.",
            after:
              "The five-tab bar collapses; the You page becomes the single place progress lives.",
          },
        ],
      },
      {
        // The third friction drawn: four tabs you had to assemble an answer
        // from, replaced by the one surface that answers.
        type: "silos",
        from: ["Today", "Stats", "Memories", "You"],
        to: "One coach",
      },
      {
        // The early concepts, in the same slider the ConnectIQ wireframes use,
        // on the neutral field rather than the orange one.
        type: "slides",
        label: "Some of the early versions",
        field: "neutral",
        stickyTitle: true,
        slides: [
          {
            title: "Opening the conversation",
            images: [
              { src: "/projects/ios-app/concepts/concept-1.webp", alt: "Early concept: the coach opens with a greeting and one question about a good moment" },
              { src: "/projects/ios-app/concepts/concept-2.webp", alt: "Early concept: the same opening with the greeting played down" },
              { src: "/projects/ios-app/concepts/concept-6.webp", alt: "Early concept: the opening question with the answer already being typed" },
            ],
          },
          {
            title: "Answering back",
            images: [
              { src: "/projects/ios-app/concepts/concept-3.webp", alt: "Early concept: the coach's reply naming which systems the memory affected" },
              { src: "/projects/ios-app/concepts/concept-5.webp", alt: "Early concept: the reply with the science kept short" },
              { src: "/projects/ios-app/concepts/concept-4.webp", alt: "Early concept: the reply with follow-up cards under it" },
            ],
          },
        ],
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
        // The same numbered cards the frictions use, so a cut reads as a
        // decision rather than a footnote.
        type: "callouts",
        items: [
          {
            title: "Photo suggestions, but later",
            description:
              "We didn't let the photo-suggestion card open the conversation. It shows up further down instead, so it can't get in the way of the opening we'd just got working. We'll test it as a first message once we have click-through data.",
          },
          {
            title: "Quick access stays in the input",
            description:
              "The quick-access button only lives in the chat input, not all over the app. It can spread once the sheet behind it proves useful.",
          },
          {
            title: "The neuroscience note on workouts",
            description:
              "Dropped. It reads as rigour to us and as more text to everyone else.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "Same with the level system. Level 1 wanted 50 memories, and the top levels wanted brain scans. Now Level 1 takes 10, the scans are optional, and each level explains itself when you reach it. Same science, a first milestone you can actually hit.",
      },

      { type: "section", id: "final-design", title: "Final design" },

      { type: "heading", mono: true, text: "Home screen" },
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
        plain: true,
        before: "/projects/ios-app/before-today.webp",
        after: "/projects/ios-app/final-coach-tagging.webp",
        beforeAlt:
          "The old Today screen: an unexplained composite wellbeing score, neurotransmitter suggestion pills, photos from today, and an add-a-past-memory prompt",
        afterAlt:
          "The new Coaching screen: six neurotransmitter progress dots, the coach confirming a saved memory and naming which systems it affected, with Add memory and Recall memories cards underneath",
        // Narrow enough that the coaching screen fits the window whole — it is a
        // conversation, and scrolling it would hide the shape of the reply. The
        // old home screen is taller, so that state scrolls.
        maxWidth: 286,
        viewportHeight: 620,
      },

      {
        type: "paragraph",
        text: "First-memory creation went from 39% to 60% of trial starters. The screen makes one request now, and answering it means writing a sentence instead of choosing between four modules.",
      },
      {
        type: "paragraph",
        text: "The session also ends. It has a purpose and a natural stopping point, which is unusual for a chat interface and was a deliberate call: the product is trying to send you back into your own life, not keep you in the app.",
      },

      { type: "heading", mono: true, text: "Progress" },
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
        plain: true,
        before: "/projects/ios-app/before-you.webp",
        after: "/projects/ios-app/after-you.webp",
        beforeAlt:
          "The old Stats tab: a composite score chart across a week, with a paragraph explaining the chart underneath it",
        afterAlt:
          "The redesigned You page: profile, level and streaks, molecular balance across six systems, then joyalties",
        maxWidth: 360,
        viewportHeight: 620,
      },

      { type: "heading", mono: true, text: "Levels" },
      {
        type: "paragraph",
        text: "Each level names what you are training, what is left to reach the next one, and the science behind the claim — structural MRI, fNIRS imaging, standardised personality and cognitive tests.",
      },
      {
        type: "image",
        src: "/projects/ios-app/final-level.webp",
        viewportHeight: 620,
        alt: "Level 4 Practitioner screen showing progress toward Level 5 broken into total memories, per-neurotransmitter counts, peak memories, balanced weeks and joyalties sent",
        maxWidth: 380,
      },

      { type: "heading", mono: true, text: "New design system" },
      {
        type: "paragraph",
        text: "Optic is tokenized end to end — every colour, space, radius and text style is a named token, nothing hard-coded. Much of the implementation was going to be AI-assisted, which changed who I was designing the handoff for: not only an engineer reading a spec, but a model reading the design file. So the tokens have one rule — every name survives the trip into code unchanged. `levels/level-2` becomes `Color.level2`, `spacing/32` becomes `CGFloat.spacing32`. An agent reads a token name and already knows the constant to write, so there's no handoff doc and no naming table to keep in sync.",
      },
      {
        // Optic, exported from the Matter design system file at 3x (2x for the
        // widest sets) with Figma's component-set outlines stripped. Shown in
        // Dark Matter, Nadiia's dark sibling: Matter is a dark app, so its
        // components sit on a dark dotted panel with only a shadow under each.
        // Sets wider than the slider live on the explore canvas only.
        type: "slides",
        label: "Optic design system components",
        appearance: "figma",
        look: "darkMatter",
        canvasRows: [
          ["Selection controls", "Indicators & progress", "Neurotransmitter indicator"],
          ["Buttons", "Pills & tags"],
          ["Headers", "Sheets & menu", "Profile pictures"],
          ["Chat cards", "Memory cards", "Banners & notifications"],
        ],
        slides: [
          {
            title: "Icons",
            gridOnly: true,
            images: [
              { src: "/projects/ios-app/ds-icons.webp", alt: "Optic icon set: 22 large feature icons, then 48 small line icons for navigation, sharing, people, notifications and actions", width: 1912, backed: true },
            ],
          },
          {
            title: "Selection controls",
            images: [
              { src: "/projects/ios-app/ds-checkbox.webp", alt: "Checkbox, checked and unchecked", width: 57, backed: true },
              { src: "/projects/ios-app/ds-radio.webp", alt: "Radio button, selected and unselected", width: 56, backed: true },
              { src: "/projects/ios-app/ds-toggle.webp", alt: "Toggle, on and off", width: 55, backed: true },
              { src: "/projects/ios-app/ds-tab-item.webp", alt: "Tab item, active and inactive", width: 96, backed: true },
            ],
          },
          {
            title: "Indicators & progress",
            images: [
              { src: "/projects/ios-app/ds-emotion-indicator.webp", alt: "Emotion indicators: a small coloured mark for each of eighteen emotions", width: 420, backed: true },
              { src: "/projects/ios-app/ds-progress-bars.webp", alt: "Progress bars: segmented and continuous, with labels for basics, average and in-depth", width: 322, backed: true },
              { src: "/projects/ios-app/ds-pips.webp", alt: "Pips, filled and empty", width: 28, backed: true },
            ],
          },
          {
            title: "Neurotransmitter indicator",
            gridOnly: true,
            images: [
              { src: "/projects/ios-app/ds-nt-indicator.webp", alt: "Neurotransmitter indicator: a row of dots showing progress across the six systems", width: 1056, backed: true },
            ],
          },
          {
            title: "Buttons",
            images: [
              { src: "/projects/ios-app/ds-icon-buttons.webp", alt: "Icon buttons: back, forward, share, people, menu, close, add, info, notifications and send, enabled and disabled", width: 665, backed: true },
              { src: "/projects/ios-app/ds-button-group.webp", alt: "Button groups: a primary and secondary action stacked, in three configurations", width: 349, backed: true },
            ],
          },
          {
            title: "Buttons · every style",
            gridOnly: true,
            images: [
              { src: "/projects/ios-app/ds-buttons.webp", alt: "Every button style in Optic: filled, outlined, text, pill and full-width, enabled and disabled", width: 2587, backed: true },
            ],
          },
          {
            title: "Pills & tags",
            images: [
              { src: "/projects/ios-app/ds-pills.webp", alt: "Neurotransmitter and memory pills, in every colour", width: 68, backed: true },
              { src: "/projects/ios-app/ds-pills-small.webp", alt: "Small pills in three states", width: 79, backed: true },
              { src: "/projects/ios-app/ds-tags.webp", alt: "Tags, selected and unselected", width: 200, backed: true },
              { src: "/projects/ios-app/ds-count-chip.webp", alt: "Count chip, two sizes", width: 48, backed: true },
              { src: "/projects/ios-app/ds-multiselect-pill.webp", alt: "Multiselect pills in three states", width: 82, backed: true },
            ],
          },
          {
            title: "Text inputs",
            gridOnly: true,
            images: [
              { src: "/projects/ios-app/ds-inputs.webp", alt: "Text inputs in six states: empty, focused, filled, error, disabled and multiline", width: 1468 },
            ],
          },
          {
            title: "Profile pictures",
            images: [
              { src: "/projects/ios-app/ds-profile-pictures.webp", alt: "Profile pictures in eighteen sizes and states, with and without a status ring", width: 128, backed: true },
            ],
          },
          {
            title: "Headers",
            images: [
              { src: "/projects/ios-app/ds-people-header.webp", alt: "People header: team avatars with a title and action", width: 834 },
              { src: "/projects/ios-app/ds-profile-header.webp", alt: "Profile header: picture, name, level and streak", width: 345, backed: true },
            ],
          },
          {
            title: "Screen headers & settings",
            gridOnly: true,
            images: [
              { src: "/projects/ios-app/ds-headers.webp", alt: "Every screen header in Optic: title, back, close and action variants", width: 3801 },
              { src: "/projects/ios-app/ds-settings-row.webp", alt: "Settings rows: plain, with toggle, with value, with chevron and destructive", width: 2639 },
            ],
          },
          {
            title: "Sheets & menu",
            images: [
              { src: "/projects/ios-app/ds-sheets.webp", alt: "Bottom sheets: the emotional fitness explainer and a sheet with two actions", width: 887 },
              { src: "/projects/ios-app/ds-menu-item.webp", alt: "Menu item, default and destructive", width: 316 },
            ],
          },
          {
            title: "Chat cards",
            images: [
              { src: "/projects/ios-app/ds-chat-cards.webp", alt: "Chat action cards: add a memory, send a text, share as joyalties, recall memories, add to calendar, write an answer and see your progress", width: 686 },
            ],
          },
          {
            title: "Chat & messages",
            gridOnly: true,
            images: [
              { src: "/projects/ios-app/ds-message.webp", alt: "Chat messages from the coach and the user, with and without attachments", width: 1312, backed: true },
              { src: "/projects/ios-app/ds-chat-input.webp", alt: "Chat input: empty, typing, with a photo, with a memory and recording", width: 2061 },
              { src: "/projects/ios-app/ds-system-message.webp", alt: "System messages: neutral, success and error", width: 1059 },
              { src: "/projects/ios-app/ds-photo-message.webp", alt: "Photo message thumbnails in four layouts", width: 533 },
            ],
          },
          {
            title: "Memory cards",
            // These cards are see-through by design, so their own fills were
            // composited onto surface primary (scripts/fill-inside.cjs) — the
            // colour sits inside the card, not on a panel behind it.
            images: [
              { src: "/projects/ios-app/ds-memory-card.webp", alt: "Memory card: a photo, a title and the memory's affect tags", width: 536 },
              { src: "/projects/ios-app/ds-emotion-card.webp", alt: "Emotion card, two states", width: 348 },
              { src: "/projects/ios-app/ds-nt-card.webp", alt: "Neurotransmitter card in three states", width: 528 },
              { src: "/projects/ios-app/ds-places-card.webp", alt: "Places card in three states", width: 536 },
            ],
          },
          {
            title: "Banners & notifications",
            images: [
              { src: "/projects/ios-app/ds-banner.webp", alt: "Banner, two variants", width: 441 },
              { src: "/projects/ios-app/ds-notification.webp", alt: "Notification, two variants", width: 345 },
              { src: "/projects/ios-app/ds-memory-recall-banner.webp", alt: "Memory recall banner", width: 345 },
            ],
          },
          {
            title: "Media cards",
            images: [
              { src: "/projects/ios-app/ds-workout-card.webp", alt: "Workout cards: six exercises, each with an illustration, duration and reward", width: 260 },
              { src: "/projects/ios-app/ds-image-stack.webp", alt: "Image stacks from one to five photos", width: 302 },
              { src: "/projects/ios-app/ds-joyalties-cards.webp", alt: "Joyalties cards in three layouts", width: 631 },
            ],
          },
          {
            title: "Level & progress cards",
            gridOnly: true,
            images: [
              { src: "/projects/ios-app/ds-level-cards.webp", alt: "Level cards for every level, each with its colour, progress and next reward", width: 2610 },
              { src: "/projects/ios-app/ds-progress-card-sections.webp", alt: "Progress card sections: the building blocks of the weekly progress card", width: 1345, backed: true },
            ],
          },
          {
            title: "Posts",
            gridOnly: true,
            images: [
              { src: "/projects/ios-app/ds-post.webp", alt: "Team feed posts: text, photo, memory and joyalty posts, with reactions", width: 2181, backed: true },
              { src: "/projects/ios-app/ds-memory-attached.webp", alt: "A memory attached to a post, three layouts", width: 1293, backed: true },
              { src: "/projects/ios-app/ds-photo-attached.webp", alt: "A photo attached to a post, two layouts", width: 843 },
            ],
          },
          {
            title: "Comments",
            gridOnly: true,
            images: [
              { src: "/projects/ios-app/ds-comment.webp", alt: "Comments: single, threaded and with reactions", width: 1185, backed: true },
              { src: "/projects/ios-app/ds-comment-input.webp", alt: "Comment input in five states", width: 1985 },
              { src: "/projects/ios-app/ds-comment-attachment.webp", alt: "Comment attachments: photo, memory and link", width: 1099, backed: true },
            ],
          },
        ],
      },

      { type: "heading", mono: true, text: "Store listing" },
      {
        type: "paragraph",
        text: "I designed the App Store screenshot set: the pitch, the brain visualisation, the social proof. The same science, rewritten as three screens someone scrolls past in five seconds.",
      },
      {
        type: "image",
        src: "/projects/ios-app/5.webp",
        alt: "App Store marketing screenshots for the wellness app",
      },

      { type: "heading", mono: true, text: "Icons" },
      {
        type: "paragraph",
        text: "Each neurotransmitter system also needed an icon that reads at nav-bar size next to five siblings: endurance, flexibility, strength, coordination, speed, balance. The fitness analogy does the explaining the old screen never did. You already know what training flexibility means.",
      },
      {
        type: "image",
        src: "/projects/ios-app/final-training-cards.webp",
        alt: "Six training-dimension cards — endurance, flexibility, strength, coordination, speed, balance — with their icon set",
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
              "A lapsed user on why she came back. She photographed a hole in the wall her husband had fixed, because “that is love” — the app had stopped being a tracker.",
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
    // Rewritten against case-study.md, replacing the anonymized "Enterprise Dashboard"
    // stub with the real, named engagement — the client agreed to be named and shown.
    // Sourced from real discovery-call transcripts, the Aug 11, 2025 kickoff notes, and
    // a real Airtable job-record export (public/projects/connectiq/airtable-job-record.webp
    // started life as a PDF print of an actual job record) — not reconstructed from memory.
    // No analytics platform existed for this engagement, so Results stays qualitative on
    // purpose — don't add a stat-row without a source.
    // Later merged with Niia's PDF case study (2025): the outcome cards, including
    // "3× fewer screens" and reduced onboarding time, are her own claims from that PDF.
    // The client portal is shown as a concept only. Design system slides are exported
    // straight from the Figma file (dashboard C) at 3×, at their real component size.
    slug: "connectiq",
    category: "Dashboard",
    name: "Giant Pumpkin",
    title: "ConnectIQ",
    hideClientInHeader: true,
    summary:
      "One platform for planning, dispatch, installation, and reporting for a company that installs digital signage and audio hardware across Southeast Asia and Latin America. It replaced four disconnected Airtable bases, Fillout forms, Slack messages, and the phone calls and exported PDFs in between.",
    client: "Platform serving screens across the world",
    role: "Product design, 0→1, information architecture, design systems",
    team: "Founder, project manager, and the internal planning & operations team",
    credits: [
      { initials: "Me", label: "Niia Bieliavtseva — product design", highlight: true },
      { initials: "SS", label: "Sebastian — founder" },
      { initials: "YP", label: "Yves — project manager" },
      { initials: "PN", label: "Priyanuch — dispatch management" },
      { initials: "KR", label: "Krittiyanee — planning & operations" },
    ],
    duration: "Aug – Nov 2025 · 3 months",
    tools: ["Figma", "Figjam", "Claude", "Airtable"],
    screenshots: [
      {
        src: "/projects/connectiq.webp",
        alt: "Partner jobs board: a hand cursor drags a job card from To do into Unassigned",
      },
    ],
    lastUpdated: "2025–2026",
    // Home page: the jobs board, animated, in place of the static cover above.
    coverAnimation: "connectiq-kanban",
    cardMeta: "Dashboard · 2024",
    hero: {
      src: "/projects/connectiq/partner-jobs-board.webp",
      alt: "Partner-facing jobs board, columns for Unassigned, To do, In progress, and Done, with a job card mid-drag showing avatars and job details",
    },
    featured: {
      type: "before-after",
      before: "/projects/connectiq/airtable-job-record.webp",
      after: "/projects/connectiq/job-creation-modal.webp",
      beforeAlt:
        "A real Airtable job record: assignment, quote reference, service and status fields, a separate linked partner panel, and a job-checks checklist, all on one long scrolling page",
      afterAlt:
        "ConnectIQ's Add job modal, step one: customer, job type, scheduled date, and time slot fields, with a progress indicator for the two steps ahead",
      beforeLabel: "Airtable",
      afterLabel: "ConnectIQ",
      maxWidth: 896,
      viewportHeight: 640,
      beforePins: [
        {
          x: 92,
          y: 3,
          title: "A name tag, not a queue",
          body: "Two names sit on this job, but there's no dispatch list either person can open on a phone.",
        },
        {
          x: 92,
          y: 5,
          title: "Even the team wasn't sure what this pointed to",
          body: "\"We are not quite sure about that as well\" — the ops team, when I asked what this reference links to.",
        },
        {
          x: 92,
          y: 6,
          title: "Every field carries equal weight",
          body: "Service, job type, and status look the same. Nothing shows which one gates the others.",
        },
        {
          x: 92,
          y: 8,
          title: "The partner lives in a fourth base",
          body: "Read-only here. Changing the partner means leaving this record for yet another base.",
        },
      ],
      plain: true,
    },
    darkVisuals: true,
    content: [
      { type: "section", id: "problem", title: "Problem" },
      {
        type: "paragraph",
        text: "Giant Pumpkin installs and maintains digital signage and audio hardware for retail chains like KFC, Apple resellers, Starbucks, and Uniqlo. Every install, broken screen, and renewed contract ran through Airtable, Fillout forms, and Slack messages.",
      },
      {
        type: "chips",
        items: ["One job, four bases", "No tool for field installation", "No client view"],
      },

      { type: "section", id: "discovery", title: "Discovery" },
      {
        type: "paragraph",
        text: "Before designing anything, I ran deep-dive sessions with the CEO, CTO, deployment, support, partner dispatch leads, and sales. Internal users walked me through their real process in Airtable, the dispatch system, and Fillout forms, so I could see where data broke between teams.",
      },
      { type: "paragraph", text: "These conversations clarified:" },
      {
        type: "chips",
        items: [
          "Data models and dependencies",
          "How jobs are created, scheduled, and executed",
          "Every bottleneck across internal tools",
          "How partners dispatch and complete tasks",
          "What clients expect to see",
          "How field agents work on-site",
        ],
      },

      { type: "section", id: "research", title: "Research" },
      {
        type: "paragraph",
        text: "I analyzed Jobber, Linear, Monday, Jira Service, Retool, Asana, and Upwork, plus enterprise dispatching systems, to see how each handles complex, multi-role work.",
      },
      {
        type: "tool-map",
        items: [
          {
            names: ["Jobber", "Upwork"],
            plus: "Guided multi-step flow: job → contract → delivery",
            minus: "Too simple for multidimensional data",
          },
          {
            names: ["Linear"],
            plus: "Clear hierarchy; collapsible sections feel light",
            minus: "Bare-bones customization for multi-role teams",
          },
          {
            names: ["Monday", "Retool"],
            plus: "Flexible boards and views for cross-team visibility",
            minus: "Too much flexibility; users get lost in custom boards",
          },
          {
            names: ["Jira Service", "Asana"],
            plus: "Robust ticket lifecycle, automation, and dependencies",
            minus: "Too many fields visible at once",
          },
        ],
      },

      { type: "section", id: "users", title: "Users" },
      {
        type: "paragraph",
        text: "Three groups, each with a very different day.",
      },
      {
        type: "user-groups",
        groups: [
          {
            name: "Internal deployment team",
            pains: [
              "Massive scrolling lists",
              "Repeated data entry",
              "Siloed screens",
              "Hard to trace dependencies",
            ],
            needsLabel: "Creates",
            needs: [
              "Customers, locations, contracts",
              "BOMs and inventory",
              "Jobs, tasks, templates",
              "Post-installation reviews",
            ],
          },
          {
            name: "Partners (external installers)",
            pains: [
              "Work across 2–3 tools",
              "Fragmented workflow",
              "Often on poor mobile devices, so speed matters",
            ],
            needsLabel: "Two roles",
            needs: [
              "Dispatch managers assign jobs to installers",
              "Field agents do the job on mobile and upload serials, photos, videos",
            ],
          },
          {
            name: "Enterprise clients",
            pains: ["Data scattered across Airtable and Freshdesk"],
            needsLabel: "They need",
            needs: [
              "Installations and job statuses",
              "Problem reports",
              "Subscriptions and maintenance",
              "Warranty and lifecycle timelines",
            ],
          },
        ],
      },

      { type: "section", id: "system", title: "System map" },
      {
        type: "paragraph",
        text: "Everything was technically connected, but visually fragmented. Airtable has no conditional fields, so installation jobs and maintenance jobs showed the same irrelevant sections. The goal: one adaptive system.",
      },
      {
        type: "silos",
        from: ["Locations", "Inventory", "Jobs", "Tickets"],
        to: "One adaptive system",
      },
      { type: "paragraph", text: "I created complete flows for each user group:" },
      { type: "diagram", name: "connectiq-user-flow" },

      { type: "section", id: "wireframes", title: "Wireframes & testing" },
      {
        type: "paragraph",
        text: "I worked in mid-fidelity wireframes: not styled, but detailed enough for users to follow the flow instantly. Claude helped me break complex workflows into structured layouts that I then refined by hand.",
      },
      {
        type: "slides",
        label: "Wireframes",
        slides: [
          {
            title: "Job record",
            src: "/projects/connectiq/wireframe-job-record.webp",
            alt: "Wireframe of a job record: status, time slot, type, scheduled date and address, then documentation, bill of materials, checklists, and an activity log with sign-off and an incident report",
            scroll: true,
          },
          {
            title: "Add customer",
            src: "/projects/connectiq/wireframe-add-customer.webp",
            alt: "Wireframe of the Add customer form: brand name, brand owner, service, store, country, status, and an auto-generated customer ID",
          },
          {
            title: "Add location",
            src: "/projects/connectiq/wireframe-add-location.webp",
            alt: "Wireframe of the Add location form, step two of four: contact details and operating hours",
          },
          {
            title: "Activity & incident reports",
            src: "/projects/connectiq/wireframe-activity.webp",
            alt: "Wireframe of a job activity log: inventory created and installed, a comment, an incident report, and the subscription going active, with a comment and incident report input below",
          },
        ],
      },
      {
        type: "paragraph",
        text: "Before moving into UI, we ran usability tests with internal users and partner representatives.",
      },
      {
        type: "findings",
        tested: [
          "Job creation flow",
          "BOM assignment",
          "Partner dispatch flow",
          "Field-agent mobile flow",
          "Moving between tasks, BOM, incidents, and media",
          "Following location → job → inventory without confusion",
        ],
        findings: [
          "Users loved collapsible sections: “Finally I don't have to scroll a kilometer.”",
          "Task templates made sense and cut cognitive load.",
          "Field agents needed clearer micro-copy for serial matching.",
          "Partners wanted a “You have X jobs today” entry point.",
          "Cross-screen referencing was hard, so we added a side panel instead of page changes.",
        ],
      },

      { type: "section", id: "decisions", title: "Key decisions" },
      {
        type: "paragraph",
        text: "The founder wanted ops fixed first; the PM wanted partners and clients. We did both, starting with partners. Their screens overlapped so much with internal ops that designing one mostly designed the other.",
      },
      {
        type: "decisions",
        items: [
          {
            title: "Job creation",
            before: "Hopping across four Airtable bases",
            after: "One guided, stepped form",
          },
          {
            title: "Serial numbers",
            before: "Typed by hand in a form bolted onto Airtable",
            after: "Autocomplete from the last 3 digits, matched live to inventory",
          },
          {
            title: "Statuses",
            before: "Unscheduled, tentative, scheduled, rescheduled, dispatched, and more",
            after: "To do · In progress · Done",
            note: "Completing a task: 2 clicks → 1",
          },
        ],
      },

      { type: "section", id: "design-system", title: "Design system" },
      {
        type: "paragraph",
        text: "One component system for every portal: lists, cards, overlays, tabs, and filters, plus reusable pieces for tasks, BOMs, subscriptions, and incidents.",
      },
      {
        type: "slides",
        label: "Design system components",
        canvasRows: [
          ["Table cells", "Files & media", "Text inputs"],
          ["Comments", "Item details panel"],
        ],
        appearance: "figma",
        slides: [
          {
            title: "Page headers",
            // 1249px wide: it fills the slider frame, so it lives on the canvas only.
            gridOnly: true,
            images: [
              {
                src: "/projects/connectiq/fig-headers.webp",
                alt: "Page header component set: Jobs with search, filter, display and notifications; Customers with an Add customer button; Customers with bulk actions; and a modal header with a step indicator",
                width: 1249,
              },
            ],
          },
          {
            title: "Sidebar \u00b7 3 portals",
            images: [
              {
                src: "/projects/connectiq/fig-sidebar-partner.webp",
                alt: "Partner portal sidebar: ConnectIQ logo with a Partner badge and a single Jobs item, selected",
                width: 220,
              },
              {
                src: "/projects/connectiq/fig-sidebar-internal.webp",
                alt: "Internal portal sidebar: Dashboard, Jobs (selected) and Locations, then an Admin group with Inventory, Customers and Partners",
                width: 220,
              },
              {
                src: "/projects/connectiq/fig-sidebar-client.webp",
                alt: "Client portal sidebar: Dashboard (selected), Installations, Tickets, Subscriptions, Inventory and Locations",
                width: 220,
              },
            ],
          },
          {
            title: "Navigation",
            images: [
              {
                src: "/projects/connectiq/fig-tab-bar.webp",
                alt: "Tab bar component set: Documentation, Checklist, Incident report and Sign off, plus a compact variant",
                width: 729,
              },
              {
                src: "/projects/connectiq/fig-progress.webp",
                alt: "Step progress indicator with completed, current and upcoming steps",
                width: 573,
              },
              {
                src: "/projects/connectiq/fig-tab.webp",
                alt: "Single tab component in default, hover and selected states",
                width: 242,
              },
              {
                src: "/projects/connectiq/fig-sidebar-item.webp",
                alt: "Sidebar item component in default, hover and selected states",
                width: 225,
              },
            ],
          },
          {
            title: "Buttons",
            images: [
              {
                src: "/projects/connectiq/fig-buttons.webp",
                alt: "Button component set: primary, secondary, dark, outline, link, icon and destructive buttons across states",
                width: 904,
              },
            ],
          },
          {
            title: "Icons",
            images: [
              {
                // New file name on purpose: browsers had cached the old one-row strip under fig-icons.webp.
                src: "/projects/connectiq/fig-icons-2rows.webp",
                alt: "Icon set used across the product: 46 icons in two rows, from calendar, clock and trash to chevrons, filters and status markers",
                // The Figma frame's 46 icons shown at 2× (24px) in two rows of 23, exported at 4× so they stay sharp.
                width: 820,
              },
              {
                src: "/projects/connectiq/fig-icons-viewer.webp",
                alt: "Icon viewer component with a selected icon",
                width: 279,
              },
            ],
          },
          {
            title: "Text inputs",
            images: [
              {
                src: "/projects/connectiq/fig-input.webp",
                alt: "Text input and textarea component set: empty, focused, filled and disabled states",
                width: 724,
              },
            ],
          },
          {
            title: "Select & dropdown items",
            images: [
              {
                src: "/projects/connectiq/fig-select.webp",
                alt: "Select component set for service and country: default, open with options, and selected",
                width: 930,
              },
              {
                src: "/projects/connectiq/fig-dropdown-item.webp",
                alt: "Dropdown item component set: default, hover, selected, with icon and with description",
                width: 823,
              },
            ],
          },
          {
            title: "Dropdowns",
            images: [
              {
                src: "/projects/connectiq/fig-dropdowns.webp",
                // A row of menus that each carry their own card: one backing
                // behind the lot would glue them into a single white slab.
                bare: true,
                alt: "Dropdown menus component set: brand autocomplete, display options, job type, and nested status, assignee and customer filters",
                width: 3401,
              },
            ],
          },
          {
            title: "Selection controls",
            images: [
              {
                src: "/projects/connectiq/fig-radio-checkbox.webp",
                alt: "Radio and checkbox group component set: full-width options in default and selected states",
                width: 1048,
              },
              {
                src: "/projects/connectiq/fig-checkbox-item.webp",
                alt: "Checkbox list item component in default, hover, checked and disabled states",
                width: 640,
              },
              {
                src: "/projects/connectiq/fig-toggles.webp",
                alt: "Toggle switches in on, off and disabled states",
                width: 618,
              },
              {
                src: "/projects/connectiq/fig-checkbox-base.webp",
                alt: "Checkbox and radio base component set: every size, state and checked combination",
                width: 329,
              },
            ],
          },
          {
            title: "Date picker",
            images: [
              {
                src: "/projects/connectiq/fig-date-picker.webp",
                alt: "Date picker menu for January 2025 with the selected day in orange",
                width: 350,
                // Already a white rounded card with its own shadow in Figma.
                bare: true,
              },
              {
                src: "/projects/connectiq/fig-calendar-cell.webp",
                alt: "Calendar cell component set: default, hover, selected and today",
                width: 252,
              },
            ],
          },
          {
            title: "Status & feedback",
            images: [
              {
                src: "/projects/connectiq/fig-status.webp",
                alt: "Status component set: coloured dots for unassigned, to do, in progress and done",
                width: 176,
              },
              {
                src: "/projects/connectiq/fig-pills.webp",
                alt: "Pill component set: status pills with coloured dots and outlines",
                width: 192,
              },
              {
                src: "/projects/connectiq/fig-banners.webp",
                alt: "Banner component set: info, success, warning and error messages",
                width: 406,
              },
              {
                src: "/projects/connectiq/fig-tooltips.webp",
                alt: "Dark tooltip component set: installations by country and a bill-of-materials breakdown",
                width: 813,
              },
            ],
          },
          {
            title: "Cards",
            images: [
              {
                src: "/projects/connectiq/fig-cards.webp",
                alt: "Kanban job card component set: default, empty slot, alerts, selected, and compact row variants",
                width: 613,
              },
              {
                src: "/projects/connectiq/fig-checkbox-cards.webp",
                alt: "Task checkbox card component set: default, hover, completed, and overdue incident-report tasks",
                width: 1153,
              },
            ],
          },
          {
            title: "Tables",
            images: [
              {
                src: "/projects/connectiq/fig-table-locations.webp",
                alt: "Locations table component with status pills",
                width: 1172,
              },
              {
                src: "/projects/connectiq/fig-table-bom.webp",
                alt: "Bill of materials table component with serial number inputs",
                width: 652,
              },
              {
                src: "/projects/connectiq/fig-tables.webp",
                alt: "Table component set",
                width: 685,
              },
            ],
          },
          {
            title: "Table cells",
            images: [
              {
                src: "/projects/connectiq/fig-table-cells.webp",
                alt: "Table cell component set: headers, text, links, pills, avatars, inputs and actions in every state",
                width: 729,
              },
            ],
          },
          {
            title: "Files & media",
            images: [
              {
                src: "/projects/connectiq/fig-drag-drop.webp",
                alt: "File upload component set: empty, drag-over, analyzing, and uploaded with replace and remove",
                width: 681,
              },
              {
                src: "/projects/connectiq/fig-files.webp",
                alt: "File type component set: document, spreadsheet, image and video attachments",
                width: 197,
              },
              {
                src: "/projects/connectiq/fig-avatar-user.webp",
                alt: "User avatar component set: initials and photo",
                width: 134,
              },
              {
                src: "/projects/connectiq/fig-avatar-photo.webp",
                alt: "User photo component set: upload, uploaded, and edit states",
                width: 193,
              },
              {
                src: "/projects/connectiq/fig-attachments.webp",
                alt: "Attachment thumbnail component set with remove buttons",
                width: 147,
              },
            ],
          },
          {
            title: "Comments",
            images: [
              {
                src: "/projects/connectiq/fig-comments.webp",
                alt: "Comment component set: threads, mentions, hover actions, replies, and comment and incident-report inputs",
                width: 657,
              },
            ],
          },
          {
            title: "Item details panel",
            images: [
              {
                src: "/projects/connectiq/fig-item-details.webp",
                // Already a white card with its own shadow in Figma.
                bare: true,
                alt: "Inventory item details panel built from the system: status, dates, switches, subscription table, inventory log and activity feed",
                width: 722,
              },
            ],
          },
        ],
      },

      { type: "section", id: "final-design", title: "Final design" },
      { type: "heading", text: "Internal dashboard and job creation" },
      {
        type: "paragraph",
        text: "Sebastian sketched this shape himself: ops thinks brand first, then the jobs underneath. Counts sit up top, with a brand-by-brand breakdown below.",
      },
      {
        type: "image",
        plain: true,
        src: "/projects/connectiq/internal-dashboard.webp",
        alt: "Internal dashboard: KPI tiles for unassigned, dispatched, due soon, overdue, and incident-report counts, a brand-by-brand breakdown of jobs with completion rings, a task checklist, and an incident-report list",
      },
      {
        type: "click-through",
        label: "Creating a job in ConnectIQ, step by step: from the jobs board, basic info, location and partner, loading the bill of materials, supporting documents, uploading installation files, creating the job, and the new job on the board",
        steps: [
          { src: "/projects/connectiq/job-creation-0.webp", alt: "The internal jobs board before creating a job, with the Add job button in the header", click: { x: 95.6, y: 2.7 } },
          { src: "/projects/connectiq/job-creation-1.webp", alt: "Add job, step 1: customer, job type, scheduled date and time slot", click: { x: 64.1, y: 68.9 } },
          { src: "/projects/connectiq/job-creation-2.webp", alt: "Add job, step 2: location, partner and a contract ID ready to load the BOM", click: { x: 66.9, y: 61.7 } },
          { src: "/projects/connectiq/job-creation-3.webp", alt: "Add job, step 2: the bill of materials loaded from the contract", click: { x: 64.3, y: 80.9 } },
          { src: "/projects/connectiq/job-creation-4.webp", alt: "Add job, step 3: supporting documents with the quote attached and an empty installation files drop zone", click: { x: 56.3, y: 65.6 } },
          { src: "/projects/connectiq/job-creation-5.webp", alt: "Add job, step 3: installation files uploading", holdMs: 1000 },
          { src: "/projects/connectiq/job-creation-6.webp", alt: "Add job, step 3: installation files uploaded, ready to create the job", click: { x: 66.6, y: 79.7 }, holdMs: 650 },
          { src: "/projects/connectiq/job-creation-7.webp", alt: "The job created: back on the jobs board with a success banner, and the new job at the top of Unassigned — THA - KFC - CRG - PTT Phanom Phrai, JOB-0003941, Aug 16, 9-11 AM, Installation", holdMs: 2600 },
        ],
      },
      { type: "heading", text: "Partners: board, map, and side panel" },
      {
        type: "paragraph",
        text: "A dozen jobs wants a board; fifty across a city wants a map. Both read the same data, and job details open in a side panel so partners never lose their place.",
      },
      {
        type: "image",
        plain: true,
        src: "/projects/connectiq/dispatch-map.webp",
        alt: "Jobs board next to a live map, with pins colored and counted by field-agent name across a city",
      },
      {
        type: "click-through",
        label: "Changing a job's location in the partner portal, step by step: opening the job's location, typing into the location field, picking Central Plaza Rama 9 from the Google suggestions, saving, and the job showing the new address with a success banner",
        steps: [
          { src: "/projects/connectiq/edit-location-1.webp", alt: "Partner portal: a job open in a side panel, with its current location 123 Sukhumvit Road, Bangkok", click: { x: 79.6, y: 26.1 } },
          { src: "/projects/connectiq/edit-location-2.webp", alt: "The Edit location modal open, showing the job's current address", click: { x: 50.0, y: 50.5 } },
          { src: "/projects/connectiq/edit-location-3.webp", alt: "Typing Cen into the location field, with Google suggestions: Central Plaza Rama 9, CentralWorld, Central Festival EastVille", click: { x: 37.5, y: 54.7 } },
          { src: "/projects/connectiq/edit-location-2.webp", alt: "The chosen address filled into the Edit location modal, ready to save", click: { x: 65.8, y: 56.7 } },
          { src: "/projects/connectiq/edit-location-4.webp", alt: "The job showing its new address, 9/9 Rama IX Rd, Huai Khwang, Bangkok, with a Location successfully updated banner", holdMs: 2600 },
        ],
      },
      { type: "heading", text: "Client portal (concept)" },
      {
        type: "paragraph",
        text: "The client portal was sequenced last and wasn't built before the engagement ended in November 2025. This concept gives clients their own slice of the same data: installations, tickets, subscriptions, and SLA compliance.",
      },
      {
        type: "image",
        plain: true,
        // From Niia's own 3× export (Desktop/Dashboard.png), downsized to 2×; new name so old caches don't linger.
        src: "/projects/connectiq/client-dashboard-figma.webp",
        alt: "Client portal concept: a greeting, tiles for installations done, in progress, tickets open, and subscriptions expiring, a location table with hardware serials and warranty dates, an installations-over-time chart, SLA compliance, and issues by category",
      },

      { type: "section", id: "results", title: "Outcome" },
      {
        type: "paragraph",
        text: "After three months, the team had a platform that feels like a modern SaaS product, and moved day-to-day dispatch and job tracking onto it.",
      },
      {
        type: "cards",
        columns: 4,
        items: [
          { text: "Complete component system ready for dev", tone: "green" },
          { text: "Fully reorganized, scalable information architecture", tone: "outline" },
          { text: "Validated, user-tested wireframe flow", tone: "outline" },
          { text: "One UX model replacing Airtable, Fillout, and Slack", tone: "outline" },
          { text: "Refactored client portal with value-based tiering", tone: "outline" },
          { text: "3× fewer screens, thanks to intelligent reuse", tone: "green" },
          { text: "Merged internal + partner workflows", tone: "outline" },
          { text: "Reduced onboarding time for new internal staff", tone: "green" },
        ],
      },
      {
        type: "image",
        src: "/projects/connectiq/job-modal-dark.webp",
        alt: "ConnectIQ partner portal in dark mode: the job details modal for THA - KFC - CRG - Mega Bangna, with a map header, date, time slot and installation tags, a documentation upload area, a bill of materials with serial number fields, a pre-installation checklist, and a Create job button",
        plain: true,
      },
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
    lastUpdated: "2023",
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

      { type: "heading", text: "Getting there" },
      {
        type: "paragraph",
        text: "The screens that follow didn't start that way. Early passes were grayscale wireframes and competing color directions before purple stuck, and the loops list went through a real structural change — from one flat table to grouped by role — once it was clear a recruiter would realistically have more than one open loop at a time.",
      },
      {
        type: "before-after",
        before: "/projects/hirement/7.webp",
        after: "/projects/hirement/8.webp",
        beforeAlt: "Black-and-white wireframe of an interview question screen",
        afterAlt: "Blue color exploration of the same interview question screen",
        beforeLabel: "Wireframe",
        afterLabel: "Color exploration",
        // Cropped to actual content bounds (both frames had dead space below
        // the UI baked in). Sized to the taller of the two at this width.
        maxWidth: 896,
        viewportHeight: 610,
        caption: "Structure got worked out in grayscale before color entered the conversation.",
      },
      {
        type: "before-after",
        before: "/projects/hirement/9.webp",
        after: "/projects/hirement/10.webp",
        beforeAlt: "Early loops list as a single flat table",
        afterAlt: "Final loops list grouped by role",
        beforeLabel: "Early version",
        afterLabel: "Final",
        maxWidth: 896,
        viewportHeight: 634,
        caption: "The loops list itself changed shape once roles, not just candidates, needed to be scannable.",
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
            src: "/projects/hirement/2.webp",
            alt: "Hirement loop dashboard showing candidates for a role",
            caption:
              "Each role's loop tracks every candidate's status, interviewers, and running average rating in one table.",
          },
          {
            src: "/projects/hirement/3.webp",
            alt: "Hirement edit interview loop modal",
            caption:
              "Editing a loop after interviews are already scheduled — role, candidates, and invite details stay in one place.",
          },
        ],
      },
      {
        type: "image",
        src: "/projects/hirement/4.webp",
        alt: "Hirement interview screen with candidate profile lookup open",
        caption:
          "Mid-interview, an interviewer can pull up the candidate's full profile without losing their place in the question.",
      },

      { type: "heading", text: "The candidate side" },
      {
        type: "paragraph",
        text: "Hirement wasn't one-directional. Candidates got their own guide before their first round — who they'd meet, how scoring worked, what to expect on interview day — and after each round, they rated the interview itself, anonymously, question by question. That reciprocal loop was the founder's idea: a way to catch a bad interview experience before it became a bad review.",
      },
      {
        type: "image",
        src: "/projects/hirement/5.webp",
        alt: "Hirement candidate interview overview guide",
        viewportHeight: 620,
        caption:
          "Before their first round, candidates see who's interviewing them, how scoring works, and what to expect.",
      },
      {
        type: "image",
        src: "/projects/hirement/6.webp",
        alt: "Hirement candidate feedback form",
        viewportHeight: 620,
        caption: "After each round, candidates rate the interview back — anonymously, per question.",
      },

      { type: "section", id: "results", title: "Results" },
      {
        type: "paragraph",
        text: "Working solo with the founder for 2.5 months, I took Hirement from an early idea to a complete product design: a flow builder, scoring system, and design system built to hold together as the product scaled past the first few hiring teams.",
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
    slug: "other-projects",
    category: "Landing pages, Web apps",
    name: "Other Projects",
    title: "Corporate website for a digital signage company",
    summary:
      "A collection of smaller landing pages and web apps — shorter engagements that didn't need a full case study of their own.",
    client: "Landing pages, Web apps",
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
    lastUpdated: "2023–2026",
    content: [
      { type: "section", id: "problem", title: "Problem" },
      {
        type: "paragraph",
        text: "The client needed a site that could explain digital signage technology to potential customers, alongside its services and team. There was nothing to build on: no site, no visual identity yet.",
      },
      {
        type: "paragraph",
        text: "The brief was mostly about credibility: make it read as a real company, not a spec sheet.",
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
        text: "A month of solo work took the client from no web presence to a full, responsive site that explains digital signage in plain language.",
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
