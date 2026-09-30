import { useCallback, useEffect, useRef, useState } from "react";
import { FRAME_RADIUS } from "./ScreenshotFrame";

/**
 * A phone-sized walkthrough of logging a memory, played from Figma exports.
 *
 * Most steps are whole screens swapped with the transition iOS would use
 * there — a sheet rising, the keyboard pushing the composer up, a modal
 * dropping away — with a tap marker where the finger lands. Two moments are
 * built from layers instead, so they can move the way the app does:
 *
 * - Sending: the keyboard drops, your message rises into the chat, the
 *   coach's reply streams in line by line, then its cards arrive.
 * - Posting: the composer drops away and your post slides into the top of
 *   the team feed, pushing the older posts down.
 *
 * Every asset is a full 393×852pt screen exported at 2x (layers on a
 * transparent background), so they stack without any offsets. Tap points are
 * in those points, at the centre of the Figma layer they hit.
 *
 * Source: M 2026 — Production UI, "animation" section (node 13481:14461),
 * with copy made consistent across screens before export.
 */

const W = 393;
const H = 852;
/** Top of an iOS sheet: the status bar area the sheet leaves uncovered. */
const SHEET_TOP = 44;
/** Where the chat scrolls under the Coaching header. */
const CHAT_TOP = 180;
/** Coach text that streams in a line at a time, as [top, right edge] in pt.
 *  Every line is 24pt tall and starts at x 24. */
const LINE = 24;
const TEXT_LEFT = 24;
const STREAMS: Record<"coaching" | "sent", [number, number][]> = {
  // "Hey Niia, happy Tuesday.", then the four-line nudge under it
  coaching: [
    [180, 204],
    [216, 339],
    [240, 342],
    [264, 353],
    [288, 319],
  ],
  // The reply to your memory: eight lines, the last one short
  sent: [0, 1, 2, 3, 4, 5, 6, 7].map((n) => [391 + n * LINE, n === 7 ? 165 : 372]),
};
/** How far the chat scrolls once the cards arrive, so they clear the composer. */
const CHAT_SCROLL = 64;
/** The upload spinner on the attached photo (63,657 · 36×36). */
const SPINNER = { x: 63, y: 657, size: 36 };
/** Height of a photo post in the feed — how far older posts get pushed. */
const POST_HEIGHT = 621;

// iOS-style curves: sheets and modals decelerate hard, fades stay neutral.
const EASE_SHEET = "cubic-bezier(0.32, 0.72, 0, 1)";
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

type Enter =
  /** First step only: the drawer is open over the coach. */
  | "drawer-open"
  /** Drawer slides away to the left and the scrim clears. */
  | "drawer-close"
  | "fade"
  /** A keystroke: the next frame replaces this one outright. */
  | "type"
  /** Near-instant swap to a pressed state, while the finger is still down. */
  | "press"
  /** Next frame rises as a sheet over a dimmed screen. */
  | "sheet-up"
  /** Current sheet drops away, revealing the next frame beneath. */
  | "sheet-down"
  /** Keyboard + composer push up from the bottom. */
  | "wipe-up"
  /** Full-screen modal slides up. */
  | "modal-up"
  /** Keyboard drops, message rises, the coach replies. */
  | "send"
  /** Modal drops, the new post slides into the feed. */
  | "publish";

type Step = {
  scene: string;
  enter: Enter;
  /** Where the tap that triggers this step lands, in pt. */
  tap?: [number, number];
  /** How long the screen rests before the next step, in ms. */
  hold: number;
  chapter: number;
};

const CHAPTERS = ["Open", "Pick a photo", "Write", "Coach reply", "Share"];

/** "Had the coziest cinema evening with Maria yesterday — just what I needed.", a few words at a time. */
const TYPING = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  scene: `type-${n}`,
  enter: "type" as const,
  hold: n === 7 ? 900 : 340,
  chapter: 2,
}));

const STEPS: Step[] = [
  { scene: "coaching", enter: "drawer-open", hold: 1400, chapter: 0 },
  // "Coaching" menu row (20,136 · 301×48)
  { scene: "coaching", enter: "drawer-close", tap: [100, 160], hold: 1900, chapter: 0 },
  // "See moment ideas" button (25,418 · 192×42)
  { scene: "moment-ideas", enter: "sheet-up", tap: [121, 439], hold: 1500, chapter: 1 },
  // Third suggested photo (256,138 · 112×114) — the one that gets attached
  { scene: "photo-loading", enter: "sheet-down", tap: [312, 195], hold: 650, chapter: 1 },
  // Upload finishes: the spinner goes and the photo's dimming clears
  { scene: "photo-uploaded", enter: "fade", hold: 700, chapter: 1 },
  // "Message..." field (20,740 · 353×36), which brings up the keyboard
  { scene: "type-0", enter: "wipe-up", tap: [100, 758], hold: 700, chapter: 2 },
  ...TYPING,
  // Send button (333,439 · 36×36)
  { scene: "sent", enter: "send", tap: [351, 457], hold: 2600, chapter: 3 },
  // "Share into team feed" card (226,588 · 194×136, runs off the right
  // edge), 64pt higher once the chat has scrolled
  { scene: "post", enter: "modal-up", tap: [310, 626], hold: 1300, chapter: 4 },
  // "Matter score" pill (24,637 · 128×40): pressed, then on
  { scene: "post-press", enter: "press", tap: [88, 657], hold: 260, chapter: 4 },
  { scene: "post-score", enter: "fade", hold: 1100, chapter: 4 },
  // "POST" button (311,54 · 58×32)
  { scene: "posted", enter: "publish", tap: [340, 70], hold: 2800, chapter: 4 },
];

/** Plain screens: one image each. Layered scenes are listed in the JSX. */
const SIMPLE = [
  "moment-ideas",
  "photo-uploaded",
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((n) => `type-${n}`),
  "post",
  "post-press",
  "post-score",
];

const src = (name: string) => `/projects/ios-app/flow/${name}.webp`;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
/** clip-path for one streamed line starting at `top`, revealed up to `x` pt. */
const lineClip = (top: number, x: number) =>
  `inset(${pct(top, H)} ${pct(W - x, W)} ${pct(H - top - LINE, H)} 0)`;

function Layer({ name, className = "" }: { name: string; className?: string }) {
  return (
    <img
      data-layer={name}
      src={src(name)}
      alt=""
      draggable={false}
      className={`absolute inset-0 h-full w-full select-none ${className}`}
    />
  );
}

/** One copy of a text layer per line, each clipped to its own line so the
 *  lines can be revealed one after another. */
function StreamLines({ scene, layer }: { scene: keyof typeof STREAMS; layer: string }) {
  return STREAMS[scene].map((_, n) => (
    <img
      key={n}
      data-stream-line={n}
      src={src(layer)}
      alt=""
      draggable={false}
      className="absolute inset-0 h-full w-full select-none"
    />
  ));
}

export default function FlowAnimation({
  alt,
  maxWidth = 286,
  caption,
  compact = false,
}: {
  alt: string;
  maxWidth?: number;
  caption?: string;
  /** Just the phone: no step labels, pause button or caption — for the home
   *  page card, which is one big link. */
  compact?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const scenes = useRef<Record<string, HTMLDivElement | null>>({});
  const dim = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const drawer = useRef<HTMLImageElement>(null);
  const finger = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const indexRef = useRef(0);
  /** Bumped to cancel whatever the playback loop is awaiting. */
  const generation = useRef(0);
  /** Bumped by a manual jump so the playback loop restarts from there. */
  const [runKey, setRunKey] = useState(0);
  const cancelPlayback = useCallback(() => {
    generation.current++;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const layerEl = (scene: string, name: string) =>
    scenes.current[scene]?.querySelector<HTMLElement>(`[data-layer="${name}"]`) ?? null;
  const streamLines = useCallback(
    (scene: keyof typeof STREAMS) =>
      Array.from(scenes.current[scene]?.querySelectorAll<HTMLElement>("[data-stream-line]") ?? []),
    [],
  );
  /** Show a scene's streamed text in full, or hide it all. */
  const setStream = useCallback(
    (scene: keyof typeof STREAMS, shown: boolean) =>
      streamLines(scene).forEach((el, n) => {
        const [top, end] = STREAMS[scene][n];
        el.style.clipPath = lineClip(top, shown ? end : TEXT_LEFT);
      }),
    [streamLines],
  );

  /** Every element that ever animates, so a settle or a jump can reset them all. */
  const animated = () => [
    ...Object.values(scenes.current),
    ...Object.values(scenes.current).flatMap((s) =>
      Array.from(s?.querySelectorAll<HTMLElement>("[data-layer], [data-stream-line]") ?? []),
    ),
    drawer.current,
    scrim.current,
    dim.current,
    finger.current,
  ];

  /** Put every scene and layer in the resting state of step `i`. */
  const settle = useCallback((i: number) => {
    const step = STEPS[i];
    for (const el of animated()) el?.getAnimations().forEach((a) => a.cancel());
    for (const [name, el] of Object.entries(scenes.current)) {
      if (!el) continue;
      el.style.opacity = name === step.scene ? "1" : "0";
      el.style.zIndex = "1";
    }
    // Layered scenes rest fully built.
    for (const name of ["sent-user", "sent-card1", "sent-card2", "sent-reactions"]) {
      const el = layerEl("sent", name);
      if (el) el.style.opacity = "1";
    }
    setStream("sent", true);
    // At the very start the coach hasn't said anything yet.
    const greeted = step.enter !== "drawer-open";
    setStream("coaching", greeted);
    for (const name of ["coach-card", "coach-reactions"]) {
      const el = layerEl("coaching", name);
      if (el) el.style.opacity = greeted ? "1" : "0";
    }
    const chat = layerEl("sent", "sent-chat");
    if (chat) chat.style.transform = `translateY(-${pct(CHAT_SCROLL, H)})`;
    const rest = layerEl("posted", "posted-rest");
    if (rest) rest.style.transform = `translateY(${pct(POST_HEIGHT, H)})`;
    const fresh = layerEl("posted", "posted-new");
    if (fresh) fresh.style.opacity = "1";

    const drawerOpen = step.enter === "drawer-open";
    if (drawer.current) drawer.current.style.transform = drawerOpen ? "none" : "translateX(-100%)";
    if (scrim.current) scrim.current.style.opacity = drawerOpen ? "1" : "0";
    if (dim.current) dim.current.style.opacity = "0";
    if (finger.current) finger.current.style.opacity = "0";
    indexRef.current = i;
    setIndex(i);
  }, [setStream]);

  const pressAt = useCallback(async (x: number, y: number) => {
    const f = finger.current;
    if (!f) return;
    f.style.left = pct(x, W);
    f.style.top = pct(y, H);
    await f.animate(
      [
        { opacity: 0, transform: "translate(-50%, -50%) scale(1.5)" },
        { opacity: 1, transform: "translate(-50%, -50%) scale(1)", offset: 0.45 },
        { opacity: 1, transform: "translate(-50%, -50%) scale(0.82)", offset: 0.7 },
        { opacity: 0, transform: "translate(-50%, -50%) scale(1.1)" },
      ],
      { duration: 620, easing: "ease-out", fill: "forwards" },
    ).finished;
  }, []);

  /** Animate from the current step into step `i`. */
  const transition = useCallback(
    async (i: number, gen: number) => {
      const stale = () => gen !== generation.current;
      const step = STEPS[i];
      const prevStep = STEPS[indexRef.current];
      const next = scenes.current[step.scene];
      const prev = scenes.current[prevStep.scene];
      if (!next || !prev) return;
      // Move the step label with the tap, not after the screen settles.
      setIndex(i);

      // A manual jump cancels these mid-flight, which rejects `.finished`.
      if (step.tap) pressAt(...step.tap).catch(() => {});
      // Let the finger land before the screen reacts.
      if (step.tap) await sleep(step.enter === "press" ? 180 : 300);
      if (stale()) return;

      const z = (el: HTMLElement, v: number) => (el.style.zIndex = String(v));
      const play = (el: Element | null, k: Keyframe[], ms: number, easing = EASE_OUT, delay = 0) =>
        el?.animate(k, { duration: ms, easing, delay, fill: "both" }).finished;
      const runs: (Promise<unknown> | undefined)[] = [];
      const go = (...args: Parameters<typeof play>) => runs.push(play(...args));
      const show = (el: HTMLElement, below: HTMLElement) => {
        z(below, 1);
        z(el, 2);
        el.style.opacity = "1";
      };

      const sheetClip = `inset(${pct(SHEET_TOP, H)} 0 0 0 round 20px 20px 0 0)`;

      /** Type the coach's text out a line at a time; false if interrupted. */
      const stream = async (scene: keyof typeof STREAMS) => {
        for (const [n, el] of streamLines(scene).entries()) {
          const [top, end] = STREAMS[scene][n];
          await play(
            el,
            [{ clipPath: lineClip(top, TEXT_LEFT) }, { clipPath: lineClip(top, end) }],
            // Same pace on every line, so a short one finishes sooner.
            Math.max(90, ((end - TEXT_LEFT) / 348) * 240),
            "linear",
          );
          if (stale()) return false;
        }
        return true;
      };
      /** Cards under a message float up one after another. */
      const rise = (els: (HTMLElement | null)[], delay = 200) =>
        els.forEach((el, n) =>
          go(
            el,
            [
              { opacity: 0, transform: `translateY(${pct(14, H)})` },
              { opacity: 1, transform: "translateY(0)" },
            ],
            460,
            EASE_OUT,
            delay + n * 140,
          ),
        );

      switch (step.enter) {
        case "drawer-open":
          // Loop restart: fade the opening state back in over the last screen.
          settle(0);
          prev.style.opacity = "1";
          z(prev, 1);
          z(next, 2);
          for (const el of [next, drawer.current!, scrim.current!]) {
            go(el, [{ opacity: 0 }, { opacity: 1 }], 600);
          }
          break;
        case "drawer-close":
          go(drawer.current!, [{ transform: "none" }, { transform: "translateX(-100%)" }], 460, EASE_SHEET);
          go(scrim.current!, [{ opacity: 1 }, { opacity: 0 }], 460);
          await Promise.all(runs);
          if (stale()) return;
          runs.length = 0;
          // The coach greets you: words first, then its card.
          await sleep(300);
          if (stale() || !(await stream("coaching"))) return;
          rise(["coach-card", "coach-reactions"].map((n) => layerEl("coaching", n)));
          break;
        case "type":
          show(next, prev);
          break;
        case "fade":
          show(next, prev);
          go(next, [{ opacity: 0 }, { opacity: 1 }], 280, "ease-in-out");
          break;
        case "press":
          show(next, prev);
          go(next, [{ opacity: 0 }, { opacity: 1 }], 80, "linear");
          break;
        case "sheet-up":
          show(next, prev);
          z(next, 3);
          go(dim.current!, [{ opacity: 0 }, { opacity: 1 }], 420);
          go(
            next,
            [
              { transform: "translateY(100%)", clipPath: sheetClip },
              { transform: "translateY(0)", clipPath: sheetClip },
            ],
            520,
            EASE_SHEET,
          );
          break;
        case "sheet-down":
          z(next, 1);
          z(prev, 3);
          next.style.opacity = "1";
          go(dim.current!, [{ opacity: 1 }, { opacity: 0 }], 420);
          go(
            prev,
            [
              { transform: "translateY(0)", clipPath: sheetClip },
              { transform: "translateY(100%)", clipPath: sheetClip },
            ],
            440,
            EASE_SHEET,
          );
          break;
        case "wipe-up":
          // Header is identical on both frames, so revealing bottom-up reads
          // as the keyboard pushing the composer into place.
          show(next, prev);
          go(next, [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)" }], 420, EASE_SHEET);
          break;
        case "modal-up":
          show(next, prev);
          z(next, 3);
          go(next, [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], 560, EASE_SHEET);
          break;
        case "send": {
          // The sent screen starts empty: just the header and the composer.
          const user = layerEl("sent", "sent-user");
          const cards = ["sent-card1", "sent-card2", "sent-reactions"].map((n) => layerEl("sent", n));
          for (const el of [user, ...cards]) if (el) el.style.opacity = "0";
          const chat = layerEl("sent", "sent-chat");
          if (chat) chat.style.transform = "none";
          setStream("sent", false);
          z(next, 1);
          z(prev, 3);
          next.style.opacity = "1";

          // Keyboard and composer drop away below the header.
          const below = `inset(${pct(CHAT_TOP, H)} 0 0 0)`;
          go(
            prev,
            [
              { transform: "translateY(0)", clipPath: below, opacity: 1 },
              { transform: "translateY(55%)", clipPath: below, opacity: 1, offset: 0.85 },
              { transform: "translateY(65%)", clipPath: below, opacity: 0 },
            ],
            420,
            EASE_SHEET,
          );
          // Your message rises into the chat.
          go(
            user,
            [
              { opacity: 0, transform: `translateY(${pct(40, H)})` },
              { opacity: 1, transform: "translateY(0)" },
            ],
            420,
            EASE_SHEET,
            160,
          );
          await Promise.all(runs);
          if (stale()) return;
          runs.length = 0;

          // The coach takes a beat, then streams its reply a line at a time.
          await sleep(650);
          if (stale()) return;
          if (!(await stream("sent"))) return;
          // Then its suggestions, one after another…
          rise(cards);
          // …and the chat scrolls up so they sit clear of the composer.
          go(
            chat,
            [{ transform: "translateY(0)" }, { transform: `translateY(-${pct(CHAT_SCROLL, H)})` }],
            700,
            EASE_SHEET,
            260,
          );
          break;
        }
        case "publish": {
          const rest = layerEl("posted", "posted-rest");
          const fresh = layerEl("posted", "posted-new");
          if (rest) rest.style.transform = "none";
          if (fresh) fresh.style.opacity = "0";
          z(next, 1);
          z(prev, 3);
          next.style.opacity = "1";
          // The composer drops away, showing the feed as it was.
          go(prev, [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }], 480, EASE_SHEET);
          await Promise.all(runs);
          if (stale()) return;
          runs.length = 0;
          // Then your post takes the top slot and pushes the rest down.
          go(
            rest,
            [{ transform: "translateY(0)" }, { transform: `translateY(${pct(POST_HEIGHT, H)})` }],
            640,
            EASE_SHEET,
            150,
          );
          go(
            fresh,
            [
              { opacity: 0, transform: "scale(0.96)", transformOrigin: "50% 18%" },
              { opacity: 1, transform: "scale(1)", transformOrigin: "50% 18%" },
            ],
            520,
            EASE_OUT,
            330,
          );
          break;
        }
      }

      await Promise.all(runs);
      if (stale()) return;
      settle(i);
    },
    [pressAt, settle, setStream, streamLines],
  );

  const playing = inView && !paused && !reducedMotion;

  useEffect(() => {
    if (!playing) return;
    const gen = ++generation.current;
    (async () => {
      try {
        while (gen === generation.current) {
          await sleep(STEPS[indexRef.current].hold);
          if (gen !== generation.current) return;
          await transition((indexRef.current + 1) % STEPS.length, gen);
        }
      } catch {
        // Animation cancelled by a jump — the next run picks up from there.
      }
    })();
    return cancelPlayback;
  }, [playing, runKey, transition, cancelPlayback]);

  // Initial state before anything plays.
  useEffect(() => settle(0), [settle]);

  const jumpTo = (chapter: number) => {
    cancelPlayback();
    const first = STEPS.findIndex((s) => s.chapter === chapter);
    // Land on the chapter's first *resting* frame; for chapter 0 that's the
    // coach with the drawer already closed.
    settle(chapter === 0 ? 1 : first);
    setRunKey((k) => k + 1);
  };

  const activeChapter = STEPS[index].chapter;
  const sceneRef = (name: string) => (el: HTMLDivElement | null) => {
    scenes.current[name] = el;
  };
  const sceneClass = "absolute inset-0";

  return (
    // Plain, like the before/after toggles further down: the phone sits
    // straight on the page with a hairline and a soft shadow, no panel.
    <figure className={compact ? "w-full" : "my-8"}>
      <div className="mx-auto" style={{ maxWidth }}>
        <div
          ref={root}
          role="img"
          aria-label={alt}
          className={`relative w-full overflow-hidden ${FRAME_RADIUS} bg-[#121518] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.08)] ring-1 ring-white/10`}
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          {SIMPLE.map((name) => (
            <div key={name} ref={sceneRef(name)} className={sceneClass} style={{ opacity: 0 }}>
              <Layer name={name} />
            </div>
          ))}

          {/* Coaching, empty until the coach greets you. */}
          <div ref={sceneRef("coaching")} className={sceneClass} style={{ opacity: 0 }}>
            <Layer name="coach-base" />
            <StreamLines scene="coaching" layer="coach-text" />
            <Layer name="coach-card" />
            <Layer name="coach-reactions" />
          </div>

          {/* Photo uploading: the spinner turns while the frame holds. */}
          <div ref={sceneRef("photo-loading")} className={sceneClass} style={{ opacity: 0 }}>
            <Layer name="photo-loading" />
            <img
              src={src("spinner")}
              alt=""
              draggable={false}
              className="absolute animate-spin select-none [animation-duration:900ms] motion-reduce:animate-none"
              style={{
                left: pct(SPINNER.x, W),
                top: pct(SPINNER.y, H),
                width: pct(SPINNER.size, W),
              }}
            />
          </div>

          {/* Coach reply, built up in layers. The chat scrolls under the
              header, so its layers sit in a window that starts below it. */}
          <div ref={sceneRef("sent")} className={sceneClass} style={{ opacity: 0 }}>
            <Layer name="sent-base" />
            <div
              className="absolute inset-x-0 bottom-0 overflow-hidden"
              style={{
                top: pct(CHAT_TOP, H),
                // Content fades out under the header rather than being cut.
                maskImage: "linear-gradient(to bottom, transparent, black 4%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 4%)",
              }}
            >
              <div data-layer="sent-chat" className="absolute inset-x-0" style={{ top: `-${(CHAT_TOP / (H - CHAT_TOP)) * 100}%`, height: `${(H / (H - CHAT_TOP)) * 100}%` }}>
                <Layer name="sent-user" />
                <StreamLines scene="sent" layer="sent-reply" />
                <Layer name="sent-card1" />
                <Layer name="sent-card2" />
                <Layer name="sent-reactions" />
              </div>
            </div>
            <Layer name="sent-composer" />
          </div>

          {/* Team feed: your post drops in on top of the older ones. */}
          <div ref={sceneRef("posted")} className={sceneClass} style={{ opacity: 0 }}>
            <Layer name="posted-base" />
            <Layer name="posted-rest" />
            <Layer name="posted-new" />
            <Layer name="posted-button" />
          </div>

          {/* Sheet backdrop: dims whatever sits under a rising sheet. */}
          <div ref={dim} className="pointer-events-none absolute inset-0 z-[2] bg-black/60" style={{ opacity: 0 }} />
          <div ref={scrim} className="pointer-events-none absolute inset-0 z-[4] bg-black/50" style={{ opacity: 0 }} />
          <img
            ref={drawer}
            src={src("drawer")}
            alt=""
            draggable={false}
            className="pointer-events-none absolute top-0 left-0 z-[5] h-full select-none"
            style={{ width: pct(377, W), transform: "translateX(-100%)" }}
          />
          <div
            ref={finger}
            aria-hidden
            className="pointer-events-none absolute z-[6] h-[9%] w-auto rounded-full border border-white/70 bg-white/35 shadow-[0_0_0_6px_rgba(255,255,255,0.12)]"
            style={{ aspectRatio: "1", opacity: 0, transform: "translate(-50%, -50%)" }}
          />
        </div>
      </div>

      {!compact && (
        <>
          {/* Same label treatment as the before/after toggles on this page. */}
          <div className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4">
            {CHAPTERS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => jumpTo(i)}
                aria-current={i === activeChapter ? "step" : undefined}
                className={`text-xs font-medium transition-colors hover:text-[#e65f2e] sm:text-sm ${
                  i === activeChapter ? "text-[var(--nd-ink-strong,#000)]" : "text-gray-400"
                }`}
              >
                {label}
              </button>
            ))}
            {!reducedMotion && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Play animation" : "Pause animation"}
                className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-[#e65f2e]"
              >
                {paused ? (
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
                    <path d="M3 1.5v9l7.5-4.5z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
                    <rect x="2.5" y="1.5" width="2.5" height="9" rx="0.5" />
                    <rect x="7" y="1.5" width="2.5" height="9" rx="0.5" />
                  </svg>
                )}
              </button>
            )}
          </div>
          {caption && (
            <figcaption className="mx-auto mt-5 max-w-[30rem] text-center text-sm italic text-gray-400">
              {caption}
            </figcaption>
          )}
        </>
      )}
    </figure>
  );
}
