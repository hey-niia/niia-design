import { useEffect, useRef, useState } from "react";
import { NADIIA_ACCENT, NADIIA_LABEL, NADIIA_SHAPE, NADIIA_SURFACE } from "./nadiia";

/**
 * Outcome cards in the Nadiia style: a grid of white boxes in Geist Mono
 * capitals on the white page.
 *
 * When the grid scrolls into view, the cards tick off one at a time in a
 * random order — each checkmark turns green and its card warms into the subtle
 * green surface — until the whole grid is done. It plays once. People who've
 * asked for reduced motion see everything already ticked.
 */

export interface Outcome {
  text: string;
  /** Kept for the data's shape; every card turns green once ticked. */
  tone?: "outline" | "light" | "green";
}

const FIRST_DELAY_MS = 200;
const STEP_MS = 350;

export default function Outcomes({ items }: { items: Outcome[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [started, setStarted] = useState(false);
  const [ticked, setTicked] = useState(0);
  // rank[i] = when card i gets ticked. Shuffled once per visit, so the order feels organic.
  const [rank] = useState(() => {
    const order = items.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const positions: number[] = [];
    order.forEach((card, position) => (positions[card] = position));
    return positions;
  });

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTicked(items.length);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => {
    if (!started || ticked >= items.length) return;
    const timer = window.setTimeout(() => setTicked((n) => n + 1), ticked === 0 ? FIRST_DELAY_MS : STEP_MS);
    return () => window.clearTimeout(timer);
  }, [started, ticked, items.length]);

  return (
    <ul ref={listRef} className="my-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => {
        const done = rank[i] < ticked;
        return (
          <li
            key={item.text}
            data-ticked={done}
            className={`${NADIIA_SHAPE} ${
              done ? NADIIA_SURFACE.green : NADIIA_SURFACE.white
            } flex min-h-28 flex-col gap-3 p-5 transition-colors duration-500`}
          >
            <span
              aria-hidden
              className={`flex h-4 w-4 items-center justify-center rounded-[4px] text-[9px] ring-1 transition-all duration-300 ease-out ${
                done ? "scale-100 text-white ring-transparent" : "scale-90 bg-neutral-100 text-transparent ring-black/5"
              }`}
              style={done ? { backgroundColor: NADIIA_ACCENT.green } : undefined}
            >
              ✓
            </span>
            <span className={`${NADIIA_LABEL} leading-relaxed`}>{item.text}</span>
          </li>
        );
      })}
    </ul>
  );
}
