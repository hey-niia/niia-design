import { useCallback, useEffect, useRef, useState } from "react";
import { FRAME_RADIUS } from "./ScreenshotFrame";

/**
 * A phone-sized walkthrough of one flow, played from static Figma frames.
 *
 * Each step swaps to the next frame with the transition iOS would actually
 * use there — a sheet rising, the keyboard pushing the composer up, a modal
 * dropping away — and a tap marker shows where the finger went. Cheaper and
 * sharper than a screen recording, and it stays editable: re-export a frame
 * and the animation updates with it.
 *
 * Frames are 393×852pt screens exported at 2x; tap coordinates are in
 * those points (straight off the Figma canvas).
 */

const W = 393;
const H = 852;
/** Top of an iOS sheet: the status bar area the sheet leaves uncovered. */
const SHEET_TOP = 44;

// iOS-style curves: sheets and modals decelerate hard, fades stay neutral.
const EASE_SHEET = "cubic-bezier(0.32, 0.72, 0, 1)";
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

type Enter =
  /** First step only: the drawer is open over the coach. */
  | "drawer-open"
  /** Drawer slides away to the left and the scrim clears. */
  | "drawer-close"
  | "fade"
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
  /** Modal slides down, revealing the next frame beneath. */
  | "modal-down";

type Step = {
  frame: string;
  enter: Enter;
  /** Where the tap that triggers this step lands, in pt. */
  tap?: [number, number];
  /** How long the frame rests before the next step, in ms. */
  hold: number;
  chapter: number;
};

export type FlowChapter = { label: string };

const src = (frame: string) => `/projects/ios-app/flow/${frame}.webp`;

const MEMORY_FLOW: { chapters: FlowChapter[]; steps: Step[] } = {
  chapters: [
    { label: "Open" },
    { label: "Pick a photo" },
    { label: "Write" },
    { label: "Coach reply" },
    { label: "Share" },
  ],
  // Taps land on the centre of the real layer, read off the Figma frame.
  steps: [
    { frame: "coaching", enter: "drawer-open", hold: 1400, chapter: 0 },
    // "Coaching" menu row (20,136 · 301×48)
    { frame: "coaching", enter: "drawer-close", tap: [100, 160], hold: 1900, chapter: 0 },
    // "See moment ideas" button (25,418 · 192×42)
    { frame: "moment-ideas", enter: "sheet-up", tap: [121, 439], hold: 1500, chapter: 1 },
    // Third suggested photo (256,138 · 112×114) — the one that gets attached
    { frame: "photo-loading", enter: "sheet-down", tap: [312, 195], hold: 800, chapter: 1 },
    // "Message..." field (20,740 · 353×36), which brings up the keyboard
    { frame: "photo-attached", enter: "wipe-up", tap: [100, 758], hold: 900, chapter: 2 },
    { frame: "typing", enter: "fade", hold: 1100, chapter: 2 },
    { frame: "typing-long", enter: "fade", hold: 1300, chapter: 2 },
    // Send button (333,440 · 36×36)
    { frame: "sent", enter: "fade", tap: [351, 458], hold: 3400, chapter: 3 },
    // "Share into team feed" card (226,588 · 194×136, runs off the right edge)
    { frame: "new-post", enter: "modal-up", tap: [310, 690], hold: 1300, chapter: 4 },
    // "Matter score" pill (24,637 · 128×40): pressed, then on
    { frame: "new-post-press", enter: "press", tap: [88, 657], hold: 260, chapter: 4 },
    { frame: "new-post-score", enter: "fade", hold: 1100, chapter: 4 },
    // "POST" button (311,54 · 58×32)
    { frame: "posted", enter: "modal-down", tap: [340, 70], hold: 2400, chapter: 4 },
  ],
};

const FRAMES = [...new Set(MEMORY_FLOW.steps.map((s) => s.frame))];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function FlowAnimation({
  alt,
  maxWidth = 286,
  caption,
}: {
  alt: string;
  maxWidth?: number;
  caption?: string;
}) {
  const { steps, chapters } = MEMORY_FLOW;
  const root = useRef<HTMLDivElement>(null);
  const frames = useRef<Record<string, HTMLImageElement | null>>({});
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

  /** Snap straight to a step's resting state — no animation. */
  const show = useCallback(
    (i: number) => {
      const step = steps[i];
      for (const [name, img] of Object.entries(frames.current)) {
        if (!img) continue;
        img.getAnimations().forEach((a) => a.cancel());
        img.style.opacity = name === step.frame ? "1" : "0";
        img.style.zIndex = "1";
      }
      const drawerOpen = step.enter === "drawer-open";
      for (const el of [drawer.current, scrim.current, dim.current, finger.current]) {
        el?.getAnimations().forEach((a) => a.cancel());
      }
      if (drawer.current) drawer.current.style.transform = drawerOpen ? "none" : "translateX(-100%)";
      if (scrim.current) scrim.current.style.opacity = drawerOpen ? "1" : "0";
      if (dim.current) dim.current.style.opacity = "0";
      if (finger.current) finger.current.style.opacity = "0";
      indexRef.current = i;
      setIndex(i);
    },
    [steps],
  );

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
      const step = steps[i];
      const prevStep = steps[indexRef.current];
      const next = frames.current[step.frame];
      const prev = frames.current[prevStep.frame];
      if (!next || !prev) return;
      // Move the step label with the tap, not after the screen settles.
      setIndex(i);

      // A manual jump cancels these mid-flight, which rejects `.finished`.
      if (step.tap) pressAt(...step.tap).catch(() => {});
      // Let the finger land before the screen reacts.
      if (step.tap) await sleep(step.enter === "press" ? 180 : 300);
      if (stale()) return;

      const layer = (el: HTMLElement, z: number) => (el.style.zIndex = String(z));
      const runs: Promise<unknown>[] = [];
      const go = (el: Element, k: Keyframe[], ms: number, easing = EASE_OUT) =>
        runs.push(el.animate(k, { duration: ms, easing, fill: "forwards" }).finished);

      const sheetClip = `inset(${pct(SHEET_TOP, H)} 0 0 0 round 20px 20px 0 0)`;

      switch (step.enter) {
        case "drawer-open":
          // Loop restart: fade the opening state back in over the last frame.
          layer(prev, 1);
          layer(next, 2);
          next.style.opacity = "1";
          drawer.current!.style.transform = "none";
          go(next, [{ opacity: 0 }, { opacity: 1 }], 600);
          go(drawer.current!, [{ opacity: 0 }, { opacity: 1 }], 600);
          go(scrim.current!, [{ opacity: 0 }, { opacity: 1 }], 600);
          break;
        case "drawer-close":
          go(drawer.current!, [{ transform: "none" }, { transform: "translateX(-100%)" }], 460, EASE_SHEET);
          go(scrim.current!, [{ opacity: 1 }, { opacity: 0 }], 460);
          break;
        case "fade":
          layer(prev, 1);
          layer(next, 2);
          next.style.opacity = "1";
          go(next, [{ opacity: 0 }, { opacity: 1 }], 280, "ease-in-out");
          break;
        case "press":
          layer(prev, 1);
          layer(next, 2);
          next.style.opacity = "1";
          go(next, [{ opacity: 0 }, { opacity: 1 }], 80, "linear");
          break;
        case "sheet-up":
          layer(prev, 1);
          layer(next, 3);
          next.style.opacity = "1";
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
          layer(next, 1);
          layer(prev, 3);
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
          layer(prev, 1);
          layer(next, 2);
          next.style.opacity = "1";
          go(next, [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)" }], 420, EASE_SHEET);
          break;
        case "modal-up":
          layer(prev, 1);
          layer(next, 3);
          next.style.opacity = "1";
          go(next, [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], 560, EASE_SHEET);
          break;
        case "modal-down":
          layer(next, 1);
          layer(prev, 3);
          next.style.opacity = "1";
          go(prev, [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }], 480, EASE_SHEET);
          break;
      }

      await Promise.all(runs);
      if (stale()) return;
      // Settle: bake the end state into inline styles and drop the animations.
      for (const [name, img] of Object.entries(frames.current)) {
        if (!img) continue;
        img.getAnimations().forEach((a) => a.cancel());
        img.style.opacity = name === step.frame ? "1" : "0";
        img.style.zIndex = "1";
      }
      dim.current?.getAnimations().forEach((a) => a.cancel());
      if (step.enter === "drawer-close") {
        drawer.current!.getAnimations().forEach((a) => a.cancel());
        drawer.current!.style.transform = "translateX(-100%)";
        scrim.current!.getAnimations().forEach((a) => a.cancel());
        scrim.current!.style.opacity = "0";
      }
      if (step.enter === "drawer-open") {
        drawer.current!.getAnimations().forEach((a) => a.cancel());
        scrim.current!.getAnimations().forEach((a) => a.cancel());
        scrim.current!.style.opacity = "1";
      }
      indexRef.current = i;
      setIndex(i);
    },
    [steps, pressAt],
  );

  const playing = inView && !paused && !reducedMotion;

  useEffect(() => {
    if (!playing) return;
    const gen = ++generation.current;
    (async () => {
      try {
        while (gen === generation.current) {
          await sleep(steps[indexRef.current].hold);
          if (gen !== generation.current) return;
          await transition((indexRef.current + 1) % steps.length, gen);
        }
      } catch {
        // Animation cancelled by a jump — the next run picks up from there.
      }
    })();
    return cancelPlayback;
  }, [playing, runKey, steps, transition, cancelPlayback]);

  // Initial state before anything plays.
  useEffect(() => show(0), [show]);

  const jumpTo = (chapter: number) => {
    cancelPlayback();
    const first = steps.findIndex((s) => s.chapter === chapter);
    // Land on the chapter's first *resting* frame; for chapter 0 that's the
    // coach with the drawer already closed.
    show(chapter === 0 ? 1 : first);
    setRunKey((k) => k + 1);
  };

  const activeChapter = steps[index].chapter;

  return (
    // Plain, like the Home screen before/after above it: the phone sits
    // straight on the page with a hairline and a soft shadow, no panel.
    <figure className="my-8">
      <div className="mx-auto" style={{ maxWidth }}>
        <div
          ref={root}
          role="img"
          aria-label={alt}
          className={`relative w-full overflow-hidden ${FRAME_RADIUS} bg-[#121518] shadow-[0_2px_4px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.08)] ring-1 ring-white/10`}
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          {FRAMES.map((name) => (
            <img
              key={name}
              ref={(el) => {
                frames.current[name] = el;
              }}
              src={src(name)}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full select-none"
              style={{ opacity: 0 }}
            />
          ))}
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

      {/* Same label treatment as the before/after toggles on this page. */}
      <div className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4">
        {chapters.map((c, i) => (
          <button
            key={c.label}
            type="button"
            onClick={() => jumpTo(i)}
            aria-current={i === activeChapter ? "step" : undefined}
            className={`text-xs font-medium transition-colors hover:text-[#e65f2e] sm:text-sm ${
              i === activeChapter ? "text-[var(--nd-ink-strong,#000)]" : "text-gray-400"
            }`}
          >
            {c.label}
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
    </figure>
  );
}
