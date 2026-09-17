import { useEffect, useRef, useState } from "react";
import HandCursor from "./HandCursor";
import { FRAME_RADIUS } from "./ScreenshotFrame";

/**
 * A flow played back like a screen recording: a hand cursor glides to the
 * button that leads to the next screen, presses it, and the next screen
 * dissolves in. Same frame as the case study's first illustration.
 *
 * The incoming screen fades in *over* the previous one, which stays fully
 * opaque underneath. Crossfading both at once dips through the background and
 * reads as a flash between two near-identical screens.
 *
 * It starts when it scrolls into view, pauses when it leaves (or the tab is in
 * the background), and loops. People who've asked for reduced motion see the
 * first screen, still.
 */

export interface ClickThroughStep {
  src: string;
  alt: string;
  /** Where the hand clicks to move on, in % of the screenshot. Omit for a step that advances on its own. */
  click?: { x: number; y: number };
  /** How long to linger on this screen before acting, in ms. */
  holdMs?: number;
}

/** The shape of the jobs board screenshot at the top of the case study (2880×2048). */
const FRAME_RATIO = "2880 / 2048";
const MOVE_MS = 380;
const PRESS_MS = 160;
const DISSOLVE_MS = 220;
const DEFAULT_HOLD_MS = 450;
/** The app screens are 1440px wide in Figma, so a real cursor scales against that. */
const DESIGN_WIDTH = 1440;
/** A touch larger than a real cursor, so it reads clearly in a scaled-down screenshot. */
const CURSOR_ZOOM = 1.25;

type Phase = "hold" | "move" | "press";

export default function ClickThrough({ steps, label }: { steps: ClickThroughStep[]; label: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  // True for one paint after the screen changes, so the incoming image starts transparent.
  const [entering, setEntering] = useState(false);
  const [phase, setPhase] = useState<Phase>("hold");
  // The hand waits where it last clicked, so it never travels further than the next button.
  const [hand, setHand] = useState(() => steps.find((s) => s.click)?.click ?? { x: 50, y: 50 });
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [frameWidth, setFrameWidth] = useState(DESIGN_WIDTH);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(el);
    // The cursor keeps its real size against the screenshot, whatever the frame's width.
    // Measure once up front: a tab in the background never delivers the observer's first
    // callback, which would leave the cursor at full design size.
    setFrameWidth(el.getBoundingClientRect().width || DESIGN_WIDTH);
    const sizer = new ResizeObserver(([entry]) => setFrameWidth(entry.contentRect.width));
    sizer.observe(el);
    return () => {
      observer.disconnect();
      sizer.disconnect();
    };
  }, []);

  const mounted = useRef(false);

  // Start each dissolve from transparent, then drop the outgoing screen once it's over.
  // The very first screen shows straight away, and a timer backs up the animation
  // frame — a tab in the background never paints, which would leave the frame blank.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    setEntering(true);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setEntering(false)));
    const fallback = window.setTimeout(() => setEntering(false), 60);
    const settled = window.setTimeout(() => setPrevious(null), DISSOLVE_MS + 80);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(fallback);
      window.clearTimeout(settled);
    };
  }, [index]);

  const step = steps[index];
  const running = visible && !reduced;

  useEffect(() => {
    if (!running) return;
    const hold = step.holdMs ?? DEFAULT_HOLD_MS;
    const next = () =>
      setIndex((i) => {
        setPrevious(i);
        return (i + 1) % steps.length;
      });
    let timer: number;
    if (phase === "hold") {
      timer = window.setTimeout(() => (step.click ? setPhase("move") : next()), hold);
    } else if (phase === "move") {
      timer = window.setTimeout(() => setPhase("press"), MOVE_MS);
    } else {
      timer = window.setTimeout(() => {
        setPhase("hold");
        next();
      }, PRESS_MS);
    }
    return () => window.clearTimeout(timer);
  }, [running, phase, step, steps.length]);

  useEffect(() => {
    if (phase === "move" && step.click) setHand(step.click);
  }, [phase, step]);

  const cursor = (frameWidth / DESIGN_WIDTH) * CURSOR_ZOOM;

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={label}
      className={`relative overflow-hidden ${FRAME_RADIUS} shadow-[0_2px_4px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.08)] ring-1 ring-black/10`}
      style={{ aspectRatio: FRAME_RATIO }}
    >
      {steps.map((s, i) => {
        const current = i === index;
        const behind = i === previous;
        return (
          // Keyed by position: a flow can show the same screen twice (edit location does).
          <img
            key={`${i}-${s.src}`}
            src={s.src}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: current ? (entering ? 0 : 1) : behind ? 1 : 0,
              zIndex: current ? 2 : behind ? 1 : 0,
              transition:
                current && !entering ? `opacity ${DISSOLVE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)` : "none",
            }}
          />
        );
      })}

      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-10"
          style={{
            left: `${hand.x}%`,
            top: `${hand.y}%`,
            transition: `left ${MOVE_MS}ms cubic-bezier(0.45, 0, 0.2, 1), top ${MOVE_MS}ms cubic-bezier(0.45, 0, 0.2, 1)`,
          }}
        >
          {/* Click ripple, centred on the fingertip. */}
          <span
            className="absolute rounded-full bg-[#e65f2e]/35"
            style={{
              width: 22 * cursor,
              height: 22 * cursor,
              left: -11 * cursor,
              top: -11 * cursor,
              transform: `scale(${phase === "press" ? 1 : 0.2})`,
              opacity: phase === "press" ? 1 : 0,
              transition: `transform ${PRESS_MS}ms ease-out, opacity ${PRESS_MS}ms ease-out`,
            }}
          />
          {/* The standard macOS pointing hand, at the size a real cursor would be on this screen. */}
          <HandCursor scale={cursor} pressed={phase === "press"} pressMs={PRESS_MS} />
        </div>
      )}
    </div>
  );
}
