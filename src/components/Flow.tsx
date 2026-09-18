import { useCallback, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  NADIIA_AREA,
  NADIIA_LABEL,
  NADIIA_SHAPE,
  NADIIA_SMALL,
  NADIIA_SURFACE,
  NADIIA_TAG,
} from "./nadiia";
import { Tag } from "./NadiiaParts";

/**
 * Building blocks for Nadiia-style flow diagrams: `Lane`s (a labelled, barely
 * tinted area) holding `FlowNode`s (white boxes), with arrows drawn between
 * nodes by `FlowCanvas`.
 *
 * Lay the nodes out with ordinary grid/flex markup, give each an `id`, and
 * list the arrows as edges — the canvas measures where the boxes actually
 * landed and draws curves between them, so the diagram stays connected at
 * every width. Lines pass behind boxes rather than over them. Below `md` the
 * lanes stack and the measured curves are hidden, since curves between stacked
 * boxes read as noise; each box instead grows a short arrow down from the one
 * above it, so the column still reads as a flow. Mark the box a lane starts
 * with as `start` and it goes without that arrow.
 */

export type Side = "top" | "right" | "bottom" | "left";

export interface FlowEdge {
  from: string;
  to: string;
  /** Which edge of each box the arrow leaves from / arrives at. Guessed from layout when omitted. */
  fromSide?: Side;
  toSide?: Side;
}

const WITH_CONNECTORS = "(min-width: 48rem)";
const NORMAL: Record<Side, [number, number]> = {
  top: [0, -1],
  right: [1, 0],
  bottom: [0, 1],
  left: [-1, 0],
};
// Space between a line and the box it leaves, and between the arrowhead and its target.
const START_GAP = 4;
const END_GAP = 7;

function anchor(rect: DOMRect, side: Side, origin: DOMRect) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const x = side === "left" ? rect.left : side === "right" ? rect.right : cx;
  const y = side === "top" ? rect.top : side === "bottom" ? rect.bottom : cy;
  return { x: x - origin.left, y: y - origin.top };
}

function guessSides(from: DOMRect, to: DOMRect): [Side, Side] {
  const overlapsVertically = to.top < from.bottom && to.bottom > from.top;
  if (overlapsVertically && to.left >= from.right) return ["right", "left"];
  if (overlapsVertically && to.right <= from.left) return ["left", "right"];
  if (to.top >= from.bottom) return ["bottom", "top"];
  if (to.bottom <= from.top) return ["top", "bottom"];
  return to.left >= from.left ? ["right", "left"] : ["left", "right"];
}

export function FlowCanvas({
  edges,
  fade = false,
  children,
}: {
  edges: FlowEdge[];
  /** Fade the bottom of the diagram into the page, for a long flow that trails off. */
  fade?: boolean;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  // useId can contain characters that break an SVG `url(#…)` reference.
  const markerId = `flow-arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container || !window.matchMedia(WITH_CONNECTORS).matches) {
      setPaths([]);
      return;
    }
    const origin = container.getBoundingClientRect();
    const nodes = new Map<string, DOMRect>();
    container.querySelectorAll<HTMLElement>("[data-flow]").forEach((el) => {
      nodes.set(el.dataset.flow!, el.getBoundingClientRect());
    });

    const next: string[] = [];
    for (const edge of edges) {
      const from = nodes.get(edge.from);
      const to = nodes.get(edge.to);
      if (!from || !to) continue;
      const [guessFrom, guessTo] = guessSides(from, to);
      const fromSide = edge.fromSide ?? guessFrom;
      const toSide = edge.toSide ?? guessTo;
      const [fx, fy] = NORMAL[fromSide];
      const [tx, ty] = NORMAL[toSide];
      const a0 = anchor(from, fromSide, origin);
      const b0 = anchor(to, toSide, origin);
      const a = { x: a0.x + fx * START_GAP, y: a0.y + fy * START_GAP };
      const b = { x: b0.x + tx * END_GAP, y: b0.y + ty * END_GAP };
      const pull = Math.min(80, Math.max(20, Math.hypot(b.x - a.x, b.y - a.y) / 2));
      next.push(
        `M${a.x},${a.y} C${a.x + fx * pull},${a.y + fy * pull} ${b.x + tx * pull},${b.y + ty * pull} ${b.x},${b.y}`,
      );
    }
    setPaths(next);
  }, [edges]);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", measure);
    // Geist Mono swapping in changes box heights.
    document.fonts?.ready.then(measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div ref={containerRef} className="relative my-10">
      {children}

      {/* z-[5]: above the lanes' tint, below the boxes (z-10). */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full overflow-visible md:block"
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 6 6"
            refX="5"
            refY="3"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 z" className="fill-neutral-400" />
          </marker>
        </defs>
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            strokeWidth={1}
            className="stroke-[var(--nd-line,#d4d4d4)]"
            markerEnd={`url(#${markerId})`}
          />
        ))}
      </svg>

      {fade && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-48"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0), #fff 85%)" }}
        />
      )}
    </div>
  );
}

export function Lane({
  label,
  tone = "white",
  className = "",
  children,
}: {
  label: string;
  /** Tint of the lane's name tag, to tell user groups apart. */
  tone?: keyof typeof NADIIA_TAG;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl p-4 ring-1 ring-black/5 sm:p-5 ${className}`}
      style={NADIIA_AREA.neutral}
    >
      <Tag tone={tone} className="relative z-10 mb-4">
        {label}
      </Tag>
      {children}
    </section>
  );
}

export function FlowNode({
  id,
  title,
  note,
  bullets,
  tone = "white",
  start = false,
  className = "",
}: {
  id: string;
  title?: string;
  /** Smaller grey detail under the title. */
  note?: string;
  bullets?: string[];
  tone?: keyof typeof NADIIA_SURFACE;
  /** First box in its lane: nothing flows into it, so it gets no arrow above. */
  start?: boolean;
  className?: string;
}) {
  // A hairline with an arrowhead, dropping from the box above. Phones only:
  // wider up, the measured curves in `FlowCanvas` do this properly.
  const inflow = start
    ? ""
    : "before:absolute before:-top-7 before:left-1/2 before:h-7 before:w-px before:-translate-x-1/2 before:bg-[var(--nd-line,#d4d4d4)] before:content-[''] md:before:hidden " +
      "after:absolute after:-top-[7px] after:left-1/2 after:h-0 after:w-0 after:-translate-x-1/2 after:border-x-[3.5px] after:border-t-[5px] after:border-x-transparent after:border-t-[var(--nd-line-head,#a3a3a3)] after:content-[''] md:after:hidden";
  return (
    <div
      data-flow={id}
      className={`${NADIIA_SHAPE} ${NADIIA_SURFACE[tone]} relative z-10 flex min-h-14 flex-col justify-center px-4 py-3 ${inflow} ${className}`}
    >
      {title && <p className={`${NADIIA_LABEL} leading-relaxed`}>{title}</p>}
      {bullets && (
        <ul className={`${NADIIA_LABEL} space-y-1 leading-relaxed`}>
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span aria-hidden className="text-neutral-400">
                ·
              </span>
              {bullet}
            </li>
          ))}
        </ul>
      )}
      {note && <p className={`${NADIIA_SMALL} mt-1 text-neutral-500`}>{note}</p>}
    </div>
  );
}
