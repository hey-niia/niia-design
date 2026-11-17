import { useRef, useState, type ReactNode } from "react";

export type StackCard = {
  id: string;
  media: ReactNode;
  title: string;
  label: string;
  text: string;
};

// How the cards behind the top one peek out: a little lower, nudged sideways
// and turned, like a loose pile on a desk.
const DEPTH = [
  "translate(0px, 0px) rotate(0deg)",
  "translate(-14px, 12px) rotate(-3deg)",
  "translate(16px, 22px) rotate(2.5deg)",
];
// The top card swings off to the left before it slides in at the back.
const LEAVING = "translate(-70%, -4%) rotate(-12deg)";
const LEAVE_MS = 320;

/**
 * A small pile of cards. Clicking the top one sends it to the bottom of the
 * pile, so you can keep flipping through them forever.
 */
export default function CardStack({ cards }: { cards: StackCard[] }) {
  const [order, setOrder] = useState(() => cards.map((c) => c.id));
  const [leaving, setLeaving] = useState<string | null>(null);

  // A sideways swipe (or drag) of more than 40px also flips to the next card.
  const swipeStart = useRef<number | null>(null);
  const swiped = useRef(false);

  const next = () => {
    if (leaving) return;
    const top = order[0];
    setLeaving(top);
    window.setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setLeaving(null);
    }, LEAVE_MS);
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Every card takes the same grid cell, so the pile is as tall as the tallest card. */}
      <div className="grid pb-16">
        {cards.map((card) => {
          const depth = order.indexOf(card.id);
          const isTop = depth === 0;
          const isLeaving = leaving === card.id;
          return (
            <article
              key={card.id}
              role={isTop ? "button" : undefined}
              tabIndex={isTop ? 0 : -1}
              aria-hidden={!isTop}
              aria-label={isTop ? `${card.title} — click for the next card` : undefined}
              onPointerDown={(e) => {
                swipeStart.current = e.clientX;
                swiped.current = false;
              }}
              onPointerUp={(e) => {
                if (isTop && swipeStart.current !== null && Math.abs(e.clientX - swipeStart.current) > 40) {
                  swiped.current = true;
                  next();
                }
                swipeStart.current = null;
              }}
              onClick={() => {
                if (!isTop) return;
                if (swiped.current) {
                  swiped.current = false;
                  return;
                }
                next();
              }}
              onKeyDown={(e) => {
                if (isTop && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  next();
                }
              }}
              style={{
                gridArea: "1 / 1",
                zIndex: cards.length - depth,
                transform: isLeaving ? LEAVING : (DEPTH[depth] ?? DEPTH[DEPTH.length - 1]),
                transition: `transform ${LEAVE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              }}
              className={`flex touch-pan-y flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgba(60,50,40,0.08),0_10px_30px_rgba(60,50,40,0.10)] select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--site-accent)] ${
                isTop ? "cursor-pointer" : "pointer-events-none"
              }`}
            >
              <div className="h-[352px] overflow-hidden rounded-xl">{card.media}</div>
              {/* Only the top card's words show; the ones behind are just paper edges. */}
              <div
                className={`px-1 pt-3 pb-1 transition-opacity duration-200 ${
                  isTop && !isLeaving ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p>{card.title}</p>
                  <p className="font-mono text-xs tracking-widest text-neutral-400 uppercase">{card.label}</p>
                </div>
                <p className="mt-2 text-sm">{card.text}</p>
              </div>
            </article>
          );
        })}
      </div>
      <p className="text-center font-mono text-xs tracking-widest text-neutral-400 uppercase">
        Tap or swipe ↻
      </p>
    </div>
  );
}
