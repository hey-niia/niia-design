import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

type Phase = "burst" | "glow";

type Spot = { left: string; top: string; dx: number; dy: number; rot: number };

type BurstItem = Spot & { emoji: string; delay: number };

const EMOJIS = ["🧪", "🤖", "✨", "💻", "🧠", "⚡️", "🛠️", "🌀"];

// Eight points around the word's perimeter — top/bottom/left/right and the corners.
const SPOTS: Spot[] = [
  { left: "6%", top: "0%", dx: -6, dy: -2, rot: -10 },
  { left: "50%", top: "-1%", dx: 0, dy: -2, rot: 0 },
  { left: "94%", top: "0%", dx: 6, dy: -2, rot: 10 },
  { left: "104%", top: "50%", dx: 8, dy: 0, rot: 8 },
  { left: "90%", top: "108%", dx: 6, dy: 6, rot: -8 },
  { left: "50%", top: "112%", dx: 0, dy: 8, rot: 6 },
  { left: "10%", top: "108%", dx: -6, dy: 6, rot: 8 },
  { left: "-4%", top: "50%", dx: -8, dy: 0, rot: -8 },
];

const EMOJI_ANIM_MS = 900;
const GLOW_MS = 1200;

// True Fisher-Yates shuffle — guarantees every order is equally likely, so
// which emoji lands in which slot (and at which spot) is genuinely random.
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const EMOJI_GAP_MS = 500;

// Pause length between phases is randomized so the rhythm doesn't feel mechanical.
function randomGap() {
  return 500 + Math.random() * 300;
}

// Emojis launch one at a time, each from a different spot around the word, in
// a freshly randomized order, with an even 0.5s gap between them.
function pickBurst(): BurstItem[] {
  const count = Math.random() < 0.5 ? 3 : 4;
  const emojis = shuffle(EMOJIS).slice(0, count);
  const spots = shuffle(SPOTS).slice(0, count);
  const items: BurstItem[] = [];
  let delay = Math.random() * 150;
  for (let i = 0; i < count; i++) {
    items.push({ ...spots[i], emoji: emojis[i], delay });
    delay += EMOJI_GAP_MS;
  }
  return items;
}

/**
 * Continuously looping Easter egg on the "AI Experiments" nav link: emojis
 * pop out one by one from different spots around the word at irregular
 * intervals, a beat of nothing, the text flashes a gradient, another beat of
 * nothing, then it starts again.
 */
export default function AIExperimentsNavLink() {
  const { pathname } = useLocation();
  const isActive = pathname === "/ai-experiments";
  const [phase, setPhase] = useState<Phase>("burst");
  const [burst, setBurst] = useState<BurstItem[]>([]);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const schedule = (fn: () => void, delay: number) => {
      timeouts.current.push(window.setTimeout(fn, delay));
    };

    const runCycle = () => {
      const items = pickBurst();
      const burstDuration = items[items.length - 1].delay + EMOJI_ANIM_MS;
      const gapBeforeGlow = randomGap();
      const gapAfterGlow = randomGap();
      setBurst(items);
      setPhase("burst");
      schedule(() => setPhase("glow"), burstDuration + gapBeforeGlow);
      schedule(runCycle, burstDuration + gapBeforeGlow + GLOW_MS + gapAfterGlow);
    };

    runCycle();

    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
      timeouts.current = [];
    };
  }, []);

  return (
    <Link
      to="/ai-experiments"
      className={`ai-nav-link underline ${isActive ? "nav-active" : ""}`}
    >
      <span className="ai-nav-text-base">AI Experiments</span>
      <span className={`ai-nav-text-glow ${phase === "glow" ? "is-active" : ""}`} aria-hidden="true">
        AI Experiments
      </span>
      {phase === "burst" && burst.length > 0 && (
        <span className="ai-nav-burst" aria-hidden="true">
          {burst.map((b, i) => (
            <span
              key={i}
              className="ai-nav-burst-emoji"
              style={
                {
                  left: b.left,
                  top: b.top,
                  "--dx": `${b.dx}px`,
                  "--dy": `${b.dy}px`,
                  "--rot": `${b.rot}deg`,
                  animationDelay: `${b.delay}ms`,
                } as React.CSSProperties
              }
            >
              {b.emoji}
            </span>
          ))}
        </span>
      )}
    </Link>
  );
}
