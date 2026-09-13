import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const BASE_TEXT = "AI Experiments";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const FRAME_MS = 35;
const REVEAL_STEPS = 14;
const SETTLE_MS = 450;

function randomIdleGap() {
  return 4000 + Math.random() * 5000;
}

function scrambledFrame(frame: number): string {
  let out = "";
  for (let i = 0; i < BASE_TEXT.length; i++) {
    const ch = BASE_TEXT[i];
    if (ch === " ") {
      out += " ";
      continue;
    }
    const revealAt = (i / BASE_TEXT.length) * REVEAL_STEPS + 4;
    out += frame >= revealAt ? ch : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
  }
  return out;
}

/**
 * Intermittent Easter egg on the "AI Experiments" nav link: the text
 * decodes itself, resolving left-to-right out of random characters in the
 * accent color like a terminal locking in a value, then fades back to rest.
 */
export default function AIExperimentsNavLink() {
  const { pathname } = useLocation();
  const isActive = pathname === "/ai-experiments";
  const [isAnimating, setIsAnimating] = useState(false);
  const [overlayText, setOverlayText] = useState(BASE_TEXT);
  const timeouts = useRef<number[]>([]);
  const interval = useRef<number | null>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const schedule = (fn: () => void, delay: number) => {
      timeouts.current.push(window.setTimeout(fn, delay));
    };

    const runCycle = () => {
      setIsAnimating(true);
      let frame = 0;
      const totalFrames = REVEAL_STEPS + 4;
      interval.current = window.setInterval(() => {
        frame++;
        if (frame >= totalFrames) {
          if (interval.current !== null) window.clearInterval(interval.current);
          setOverlayText(BASE_TEXT);
          schedule(() => setIsAnimating(false), SETTLE_MS);
          schedule(runCycle, SETTLE_MS + randomIdleGap());
          return;
        }
        setOverlayText(scrambledFrame(frame));
      }, FRAME_MS);
    };

    schedule(runCycle, randomIdleGap());

    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
      timeouts.current = [];
      if (interval.current !== null) window.clearInterval(interval.current);
    };
  }, []);

  return (
    <Link
      to="/ai-experiments"
      className={`ai-nav-link ${isActive ? "nav-active" : ""}`}
    >
      <span className={`ai-nav-text-base ${isAnimating ? "is-hidden" : ""}`}>{BASE_TEXT}</span>
      <span className={`ai-nav-text-overlay ${isAnimating ? "is-active" : ""}`} aria-hidden="true">
        {overlayText}
      </span>
    </Link>
  );
}
